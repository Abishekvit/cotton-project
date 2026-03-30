# backend/main.py
import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Recreate Model Architecture (Must match your training script)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18()
# IMPORTANT: Update 'num_classes' to match the number of folders in your dataset
num_classes = 10
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load("cotton_T_model.pth", map_location=device))
model.to(device)
model.eval()

# 2. Define Classes (Update these to match your dataset folder names in order)
CLASS_NAMES = ["Type_1", "Type_2", "Type_3", "Type_4", "Type_5","Type_6", "Type_7", "Type_8", "Type_9", "Type_10"]

# 3. Preprocessing (Must match your training transforms)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Preprocess
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    # Inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, index = torch.max(probabilities, 0)
    
    return {
        "prediction": CLASS_NAMES[index.item()],
        "probability": confidence.item(),
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)