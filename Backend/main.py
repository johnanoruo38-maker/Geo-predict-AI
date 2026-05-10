"""
GeoPredict AI — Backend API
FastAPI + Scikit-learn + XGBoost + LightGBM + CatBoost
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import numpy as np
import io
import json
import os
import joblib
import time
from typing import Optional, Dict, Any, List
from pathlib import Path

# ML imports
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

try:
    from xgboost import XGBRegressor
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

try:
    from lightgbm import LGBMRegressor
    LGBM_AVAILABLE = True
except ImportError:
    LGBM_AVAILABLE = False

try:
    from catboost import CatBoostRegressor
    CATBOOST_AVAILABLE = True
except ImportError:
    CATBOOST_AVAILABLE = False

# ─── App Setup ─────────────────────────────

app = FastAPI(
    title="GeoPredict AI API",
    description="AI-Powered Subsurface Geology Prediction Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Storage ──────────────────────────────────

DATA_DIR = Path("./data")
MODEL_DIR = Path("./models")
DATA_DIR.mkdir(exist_ok=True)
MODEL_DIR.mkdir(exist_ok=True)

# In-memory state (use Redis/DB for production)
state: Dict[str, Any] = {
    "train_df": None,
    "test_df": None,
    "trained_model": None,
    "scaler": None,
    "feature_cols": None,
    "predictions": None,
    "metrics": None,
    "training_logs": [],
    "train_filename": None,
    "test_filename": None,
    "model_name": None,
}

TARGET_COL = "tvt"


# ─── Helpers ──────────────────────────────────────

def log(msg: str):
    entry = {"time": time.strftime("%H:%M:%S"), "message": msg}
    state["training_logs"].append(entry)
    print(f"[{entry['time']}] {msg}")


def get_features(df: pd.DataFrame, is_train: bool = True) -> pd.DataFrame:
    """Drop non-feature columns and return clean feature df."""
    drop_cols = ["id"]
    if is_train and TARGET_COL in df.columns:
        drop_cols.append(TARGET_COL)
    return df.drop(columns=[c for c in drop_cols if c in df.columns])


def preprocess(train_df: pd.DataFrame, test_df: Optional[pd.DataFrame] = None):
    """
    Full preprocessing pipeline:
    - Encode categoricals
    - Impute missing values
    - Scale numerics
    Returns (X_train, X_test, scaler, feature_cols)
    """
    X = get_features(train_df, is_train=True)
    feature_cols = list(X.columns)

    # Identify column types
    cat_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
    num_cols = X.select_dtypes(include=[np.number]).columns.tolist()

    log(f"Features: {len(feature_cols)} total ({len(num_cols)} numeric, {len(cat_cols)} categorical)")

    # Encode categoricals with LabelEncoder per column
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        encoders[col] = le

    # Impute + Scale numerics
    imputer = SimpleImputer(strategy="median")
    scaler = StandardScaler()

    X_arr = imputer.fit_transform(X)
    X_scaled = scaler.fit_transform(X_arr)
    X_proc = pd.DataFrame(X_scaled, columns=feature_cols)

    X_test_proc = None
    if test_df is not None:
        X_t = get_features(test_df, is_train=False)
        # Align columns
        for col in feature_cols:
            if col not in X_t.columns:
                X_t[col] = 0
        X_t = X_t[feature_cols]
        for col in cat_cols:
            if col in X_t.columns:
                le = encoders[col]
                X_t[col] = X_t[col].astype(str).map(
                    lambda x: le.transform([x])[0] if x in le.classes_ else -1
                )
        X_t_arr = imputer.transform(X_t)
        X_test_proc = pd.DataFrame(scaler.transform(X_t_arr), columns=feature_cols)

    state["imputer"] = imputer
    state["encoders"] = encoders
    return X_proc, X_test_proc, scaler, feature_cols


def build_model(model_name: str, params: Dict):
    """Factory for ML models."""
    if model_name == "random_forest":
        return RandomForestRegressor(
            n_estimators=params.get("n_estimators", 200),
            max_depth=params.get("max_depth", None),
            min_samples_split=params.get("min_samples_split", 2),
            n_jobs=-1,
            random_state=42
        )
    elif model_name == "xgboost" and XGBOOST_AVAILABLE:
        return XGBRegressor(
            n_estimators=params.get("n_estimators", 300),
            learning_rate=params.get("learning_rate", 0.05),
            max_depth=params.get("max_depth", 6),
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1
        )
    elif model_name == "lightgbm" and LGBM_AVAILABLE:
        return LGBMRegressor(
            n_estimators=params.get("n_estimators", 300),
            learning_rate=params.get("learning_rate", 0.05),
            max_depth=params.get("max_depth", -1),
            num_leaves=params.get("num_leaves", 31),
            random_state=42,
            n_jobs=-1,
            verbose=-1
        )
    elif model_name == "catboost" and CATBOOST_AVAILABLE:
        return CatBoostRegressor(
            iterations=params.get("n_estimators", 300),
            learning_rate=params.get("learning_rate", 0.05),
            depth=params.get("max_depth", 6),
            random_seed=42,
            verbose=0
        )
    elif model_name == "gradient_boosting":
        return GradientBoostingRegressor(
            n_estimators=params.get("n_estimators", 200),
            learning_rate=params.get("learning_rate", 0.05),
            max_depth=params.get("max_depth", 4),
            random_state=42
        )
    else:
        log(f"Model '{model_name}' not available, falling back to Random Forest")
        return RandomForestRegressor(n_estimators=200, n_jobs=-1, random_state=42)


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "GeoPredict AI API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "train_loaded": state["train_df"] is not None,
        "test_loaded": state["test_df"] is not None,
        "model_trained": state["trained_model"] is not None,
        "available_models": {
            "random_forest": True,
            "gradient_boosting": True,
            "xgboost": XGBOOST_AVAILABLE,
            "lightgbm": LGBM_AVAILABLE,
            "catboost": CATBOOST_AVAILABLE,
        }
    }


@app.post("/upload/train")
async def upload_train(file: UploadFile = File(...)):
    """Upload and parse training CSV."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Only CSV files are accepted")
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(400, f"CSV parse error: {e}")

    if TARGET_COL not in df.columns:
        raise HTTPException(400, f"Training CSV must contain '{TARGET_COL}' column")

    state["train_df"] = df
    state["train_filename"] = file.filename
    state["training_logs"] = []
    log(f"Training dataset loaded: {df.shape[0]} rows × {df.shape[1]} cols")

    # Missing value summary
    missing = df.isnull().sum()
    missing_info = {col: int(cnt) for col, cnt in missing[missing > 0].items()}

    return {
        "success": True,
        "filename": file.filename,
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "missing_values": missing_info,
        "preview": df.head(5).to_dict(orient="records"),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "stats": json.loads(df.describe().to_json()),
    }


@app.post("/upload/test")
async def upload_test(file: UploadFile = File(...)):
    """Upload and parse test CSV."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Only CSV files are accepted")
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    except Exception as e:
        raise HTTPException(400, f"CSV parse error: {e}")

    state["test_df"] = df
    state["test_filename"] = file.filename
    log(f"Test dataset loaded: {df.shape[0]} rows × {df.shape[1]} cols")

    missing = df.isnull().sum()
    missing_info = {col: int(cnt) for col, cnt in missing[missing > 0].items()}

    return {
        "success": True,
        "filename": file.filename,
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "missing_values": missing_info,
        "preview": df.head(5).to_dict(orient="records"),
    }


@app.post("/train")
async def train_model(request: Dict[str, Any]):
    """
    Train ML model on uploaded training data.
    Body: { model: str, params: dict, cv_folds: int }
    """
    if state["train_df"] is None:
        raise HTTPException(400, "No training data loaded. Upload a training CSV first.")

    model_name = request.get("model", "random_forest")
    params = request.get("params", {})
    cv_folds = request.get("cv_folds", 5)
    validation_split = request.get("validation_split", 0.2)

    df = state["train_df"].copy()
    state["training_logs"] = []
    log(f"Starting training with model: {model_name}")
    log(f"Dataset shape: {df.shape}")

    # Preprocess
    log("Preprocessing features...")
    X, _, scaler, feature_cols = preprocess(df)
    y = df[TARGET_COL].values

    log(f"Feature matrix: {X.shape}")

    # Train/val split
    X_tr, X_val, y_tr, y_val = train_test_split(
        X, y, test_size=validation_split, random_state=42
    )
    log(f"Train: {len(X_tr)} | Validation: {len(X_val)}")

    # Build & train
    model = build_model(model_name, params)
    log(f"Training {model_name}...")
    t0 = time.time()
    model.fit(X_tr, y_tr)
    elapsed = round(time.time() - t0, 2)
    log(f"Training complete in {elapsed}s")

    # Evaluate
    y_pred = model.predict(X_val)
    rmse = float(np.sqrt(mean_squared_error(y_val, y_pred)))
    mae = float(mean_absolute_error(y_val, y_pred))
    r2 = float(r2_score(y_val, y_pred))
    log(f"Val RMSE: {rmse:.4f} | MAE: {mae:.4f} | R²: {r2:.4f}")

    # Cross-validation
    log(f"Running {cv_folds}-fold cross-validation...")
    cv_scores = cross_val_score(model, X, y, cv=cv_folds, scoring="r2", n_jobs=-1)
    cv_mean = float(cv_scores.mean())
    cv_std = float(cv_scores.std())
    log(f"CV R²: {cv_mean:.4f} ± {cv_std:.4f}")

    # Feature importance
    importance = {}
    if hasattr(model, "feature_importances_"):
        imp = model.feature_importances_
        importance = {
            feat: float(val)
            for feat, val in sorted(
                zip(feature_cols, imp), key=lambda x: x[1], reverse=True
            )[:20]
        }

    # Save
    state["trained_model"] = model
    state["scaler"] = scaler
    state["feature_cols"] = feature_cols
    state["model_name"] = model_name
    state["metrics"] = {
        "rmse": rmse, "mae": mae, "r2": r2,
        "cv_r2_mean": cv_mean, "cv_r2_std": cv_std,
        "training_time": elapsed,
        "train_samples": len(X_tr),
        "val_samples": len(X_val),
    }
    joblib.dump(model, MODEL_DIR / f"{model_name}_model.pkl")
    log("Model saved to disk")

    # Prediction vs actual for chart (sample 100 points)
    sample_idx = np.random.choice(len(y_val), min(100, len(y_val)), replace=False)
    chart_data = [
        {"actual": float(y_val[i]), "predicted": float(y_pred[i])}
        for i in sample_idx
    ]

    return {
        "success": True,
        "model": model_name,
        "metrics": state["metrics"],
        "feature_importance": importance,
        "cv_scores": cv_scores.tolist(),
        "chart_data": chart_data,
        "logs": state["training_logs"],
    }


@app.post("/predict")
async def predict():
    """Generate predictions for loaded test dataset."""
    if state["trained_model"] is None:
        raise HTTPException(400, "No trained model. Train a model first.")
    if state["test_df"] is None:
        raise HTTPException(400, "No test data loaded. Upload a test CSV first.")

    log("Generating predictions...")
    test_df = state["test_df"].copy()

    # Preprocess test using same pipeline
    _, X_test, _, _ = preprocess(state["train_df"], test_df)

    if X_test is None:
        raise HTTPException(500, "Preprocessing failed for test data")

    preds = state["trained_model"].predict(X_test)
    state["predictions"] = preds
    log(f"Predictions generated: {len(preds)} rows")
    log(f"Prediction range: [{preds.min():.4f}, {preds.max():.4f}]")

    # Build result table
    result_df = pd.DataFrame()
    if "id" in test_df.columns:
        result_df["id"] = test_df["id"].values
    else:
        result_df["id"] = [f"row_{i}" for i in range(len(preds))]
    result_df[TARGET_COL] = preds

    preview = result_df.head(20).to_dict(orient="records")

    # Distribution for chart
    hist_values, hist_bins = np.histogram(preds, bins=20)
    hist_data = [
        {"bin": float((hist_bins[i] + hist_bins[i+1]) / 2), "count": int(hist_values[i])}
        for i in range(len(hist_values))
    ]

    return {
        "success": True,
        "count": len(preds),
        "preview": preview,
        "stats": {
            "min": float(preds.min()),
            "max": float(preds.max()),
            "mean": float(preds.mean()),
            "std": float(preds.std()),
            "median": float(np.median(preds)),
        },
        "histogram": hist_data,
    }


@app.get("/metrics")
def get_metrics():
    """Return latest training metrics."""
    if state["metrics"] is None:
        raise HTTPException(404, "No metrics available. Train a model first.")
    return {
        "metrics": state["metrics"],
        "model": state["model_name"],
        "logs": state["training_logs"],
    }


@app.get("/logs")
def get_logs():
    return {"logs": state["training_logs"]}


@app.get("/dataset/info")
def dataset_info():
    result = {}
    if state["train_df"] is not None:
        df = state["train_df"]
        result["train"] = {
            "rows": df.shape[0], "cols": df.shape[1],
            "filename": state["train_filename"],
            "columns": list(df.columns),
            "missing": {col: int(n) for col, n in df.isnull().sum().items() if n > 0},
        }
    if state["test_df"] is not None:
        df = state["test_df"]
        result["test"] = {
            "rows": df.shape[0], "cols": df.shape[1],
            "filename": state["test_filename"],
            "columns": list(df.columns),
        }
    return result


@app.get("/download-submission")
def download_submission():
    """Stream submission CSV in competition format: id,tvt"""
    if state["predictions"] is None:
        raise HTTPException(400, "No predictions generated yet.")
    if state["test_df"] is None:
        raise HTTPException(400, "No test data available.")

    test_df = state["test_df"]
    preds = state["predictions"]

    buf = io.StringIO()
    buf.write("id,tvt\n")
    if "id" in test_df.columns:
        ids = test_df["id"].values
    else:
        ids = [f"row_{i}" for i in range(len(preds))]

    for row_id, pred in zip(ids, preds):
        buf.write(f"{row_id},{pred:.6f}\n")
    buf.seek(0)

    return StreamingResponse(
        io.BytesIO(buf.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=submission.csv"}
    )