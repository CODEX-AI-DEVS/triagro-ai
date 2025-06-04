# 🔧 Manual Setup Guide for WSL/Ubuntu

If the automated scripts don't work, follow this manual setup:

## 1. Install System Dependencies

```bash
# Update package list
sudo apt update

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install system ML packages (faster than pip)
sudo apt install python3-torch python3-transformers python3-flask python3-pil -y
```

## 2. Create Virtual Environment

```bash
cd /mnt/c/Users/babyn/OneDrive/Desktop/triagro/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip
```

## 3. Install Python Dependencies

```bash
# Install remaining packages
pip install flask-cors==4.0.0 requests==2.31.0

# If torch/transformers aren't working, install via pip
pip install torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu
pip install transformers==4.35.0
```

## 4. Test Installation

```bash
# Test imports
python3 -c "
import torch
import transformers
from flask import Flask
from flask_cors import CORS
from PIL import Image
print('✅ All imports successful!')
"
```

## 5. Download Model (First Time Only)

```bash
# Download the HuggingFace model
python3 -c "
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
model_name = 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification'
print('📥 Downloading model...')
feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
model = AutoModelForImageClassification.from_pretrained(model_name)
print('✅ Model downloaded successfully!')
"
```

## 6. Start Backend

```bash
# Make sure you're in the backend directory with venv activated
cd /mnt/c/Users/babyn/OneDrive/Desktop/triagro/backend
source venv/bin/activate

# Start the server
python app.py
```

## 7. Start Frontend (New Terminal)

```bash
# In a new terminal window
cd /mnt/c/Users/babyn/OneDrive/Desktop/triagro

# Start frontend
npm run dev
```

## 8. Test the Integration

1. Go to: http://localhost:5173/crop-diagnose
2. Upload a plant image
3. Check that you get AI-powered disease detection

## 🐛 Troubleshooting

### Issue: ModuleNotFoundError

**Solution:**
```bash
# Activate virtual environment first
source backend/venv/bin/activate

# Then install missing modules
pip install [missing-module-name]
```

### Issue: torch not found

**Solution:**
```bash
# Install CPU-only version
pip install torch==2.1.0 --index-url https://download.pytorch.org/whl/cpu
```

### Issue: transformers download fails

**Solution:**
```bash
# Set HuggingFace cache directory
export HF_HOME="/tmp/huggingface"
mkdir -p /tmp/huggingface

# Try download again
python3 -c "from transformers import AutoModelForImageClassification; AutoModelForImageClassification.from_pretrained('linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification')"
```

### Issue: Permission denied

**Solution:**
```bash
# Make script executable
chmod +x start-backend.sh

# Or run with bash directly
bash start-backend.sh
```

### Issue: Port 5001 already in use

**Solution:**
```bash
# Check what's using the port
netstat -an | grep 5001

# Kill the process if needed
sudo kill -9 $(lsof -t -i:5001)
```

## 🎯 Expected Output

When everything works correctly, you should see:

### Backend Terminal:
```
🌱 Starting TriAgro Plant Disease Detection Backend...
📚 Loading HuggingFace model...
✅ Model loaded successfully!
🚀 Starting Flask server...
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5001
 * Running on http://localhost:5001
```

### Frontend (Browser Console):
```
Disease detection attempt: {
  imageSize: 125678,
  apiStatus: "online", 
  endpoints: ["Local HuggingFace API", "External API"]
}
Local HuggingFace API successful: 200
```

### Disease Detection Result:
- Plant: "Tomato"
- Disease: "Early Blight" 
- Remedy: "Apply fungicide preventively..."
- Confidence: 89%
- Source: "HuggingFace AI Model"

## 📞 Still Having Issues?

If manual setup still doesn't work:

1. **Check Python version:** `python3 --version` (need 3.8+)
2. **Check available space:** `df -h` (need ~2GB for models)
3. **Check internet connection:** `ping huggingface.co`
4. **Check firewall:** Make sure ports 5001 and 5173 are open

The system should work with these manual steps even if the automated scripts have issues with your specific WSL environment.