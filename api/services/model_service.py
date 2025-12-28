import os
import joblib
from typing import Any, List, Dict

class ModelService:
    _instance = None
    
    def __init__(self):
        self.model = None
        self.explainer = None
        self.feature_names = None
        self._is_loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_artifacts(self, artifacts_dir: str):
        """Loads model artifacts from the specified directory."""
        if self._is_loaded:
            return

        try:
            print(f"Loading artifacts from {artifacts_dir}...")
            self.model = joblib.load(os.path.join(artifacts_dir, "model.pkl"))
            self.explainer = joblib.load(os.path.join(artifacts_dir, "explainer.pkl"))
            self.feature_names = joblib.load(os.path.join(artifacts_dir, "feature_names.pkl"))
            self._is_loaded = True
            print("Model artifacts loaded successfully.")
        except Exception as e:
            print(f"Failed to load artifacts: {e}")
            raise RuntimeError(f"Could not load model artifacts: {e}")

    def get_model(self) -> Any:
        if not self._is_loaded:
            raise RuntimeError("Model not loaded. Call load_artifacts() first.")
        return self.model

    def get_explainer(self) -> Any:
        if not self._is_loaded:
            raise RuntimeError("Explainer not loaded.")
        return self.explainer

    def get_feature_names(self) -> List[str]:
        if not self._is_loaded:
            raise RuntimeError("Feature names not loaded.")
        return self.feature_names

    def is_loaded(self) -> bool:
        return self._is_loaded
