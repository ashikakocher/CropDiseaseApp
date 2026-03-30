import numpy as np
from PIL import Image
import io

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


def clean_prediction(class_name):
    parts = class_name.split("___")
    crop = parts[0]
    disease = parts[1].replace("_", " ")
    return crop, disease


def get_severity(confidence):
    if confidence >= 90:
        return "High"
    elif confidence >= 70:
        return "Medium"
    else:
        return "Low"