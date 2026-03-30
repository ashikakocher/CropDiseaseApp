import tensorflow as tf
import json
import os

MODEL_PATH = "model/crop_model.keras"
CLASS_INDEX_PATH = "model/class_indices.json"

if not os.path.exists(MODEL_PATH):
    raise RuntimeError("Model file not found!")

model = tf.keras.models.load_model(MODEL_PATH)

if not os.path.exists(CLASS_INDEX_PATH):
    raise RuntimeError("class_indices.json not found!")

with open(CLASS_INDEX_PATH, "r") as f:
    class_indices = json.load(f)

class_names = {v: k for k, v in class_indices.items()}