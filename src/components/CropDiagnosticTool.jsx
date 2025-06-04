import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Upload,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Loader,
  X,
  Bell,
  RefreshCw,
  FileImage,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import axios from "axios";
import axiosRetry from "axios-retry";
import useTranslation from "../hooks/useTranslation";
import LanguageSelector from "./LanguageSelector";
import hybridTranslationService from "../services/hybridTranslationService";
import "../utils/translationFlowTracker";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
});

const PlantDiseaseDetector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [translatedResult, setTranslatedResult] = useState(null);
  const [error, setError] = useState("");
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [uiLabels, setUiLabels] = useState({});
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);

  const cache = useRef(new Map());
  
  // Translation hook
  const {
    currentLanguage,
    changeLanguage: originalChangeLanguage,
    translateDiagnosisResult,
    translateLabels,
    isTranslating,
    translationError
  } = useTranslation();

  // Enhanced language change with tracking
  const changeLanguage = useCallback((newLang) => {
    if (window.translationTracker) {
      window.translationTracker.trackLanguageChange(currentLanguage, newLang);
      window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'language_change', {
        from: currentLanguage,
        to: newLang,
        hasResult: !!result,
        hasTranslatedResult: !!translatedResult
      });
    }
    
    console.log(`🌍 Language changing from ${currentLanguage} to ${newLang}`);
    originalChangeLanguage(newLang);
  }, [currentLanguage, originalChangeLanguage, result, translatedResult]);

  // Load and translate UI labels when language changes
  useEffect(() => {
    const loadUILabels = async () => {
      if (window.translationTracker) {
        window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'ui_labels_loading', {
          language: currentLanguage,
          startTime: new Date().toISOString()
        });
      }
      const defaultLabels = {
        plant_identified: "Plant Identified",
        disease_status: "Disease Status", 
        treatment_recommendations: "Treatment Recommendations",
        analysis_results: "Analysis Results",
        upload_image: "Upload Image",
        take_photo: "Take Photo",
        diagnose: "Diagnose",
        ready_for_analysis: "Ready for Analysis",
        alert_nearby_farmers: "Alert Nearby Farmers",
        community_alert: "Community Alert",
        confidence: "Confidence",
        loading: "Loading...",
        error_occurred: "An error occurred",
        try_again: "Try again",
        drag_drop_image: "Drag & drop your plant image",
        click_to_browse: "or click to browse your files",
        capture_image: "Capture image with camera",
        choose_file: "Choose file from device",
        cancel: "Cancel",
        capture: "Capture",
        your_name: "Your Name",
        enter_name: "Enter your name",
        alert_details: "Alert Details",
        send_alert: "Send Alert"
      };
      
      try {
        const translated = await translateLabels(defaultLabels);
        setUiLabels(translated);
        
        if (window.translationTracker) {
          window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'ui_labels_success', {
            language: currentLanguage,
            labelsCount: Object.keys(translated).length,
            endTime: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to load UI labels:', error);
        setUiLabels(defaultLabels);
        
        if (window.translationTracker) {
          window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'ui_labels_error', {
            language: currentLanguage,
            error: error.message,
            endTime: new Date().toISOString()
          });
        }
      }
    };

    loadUILabels();
  }, [currentLanguage, translateLabels]);

  // Translate diagnosis result when language changes or new result is available
  useEffect(() => {
    const translateResult = async () => {
      if (result) {
        if (window.translationTracker) {
          window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'diagnosis_translation_start', {
            language: currentLanguage,
            plant: result.plant,
            disease: result.disease,
            startTime: new Date().toISOString()
          });
        }
        
        try {
          console.time('Hybrid Translation Speed');
          console.log(`🔄 Translating diagnosis result to ${currentLanguage}:`, result);
          
          // Use hybrid translation service for optimal speed and accuracy
          const translated = await hybridTranslationService.translateDiagnosisResult(result, currentLanguage);
          console.timeEnd('Hybrid Translation Speed');
          console.log(`✅ Translation completed:`, translated);
          
          setTranslatedResult(translated);
          
          if (window.translationTracker) {
            window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'diagnosis_translation_success', {
              language: currentLanguage,
              originalResult: result,
              translatedResult: translated,
              endTime: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Failed to translate result:', error);
          
          // Fallback to original translation service
          try {
            console.log('🔄 Trying fallback translation service...');
            const fallback = await translateDiagnosisResult(result);
            setTranslatedResult(fallback);
            
            if (window.translationTracker) {
              window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'diagnosis_translation_fallback_success', {
                language: currentLanguage,
                fallbackResult: fallback,
                originalError: error.message,
                endTime: new Date().toISOString()
              });
            }
          } catch (fallbackError) {
            console.error('Fallback translation also failed:', fallbackError);
            setTranslatedResult(result);
            
            if (window.translationTracker) {
              window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'diagnosis_translation_failure', {
                language: currentLanguage,
                primaryError: error.message,
                fallbackError: fallbackError.message,
                endTime: new Date().toISOString()
              });
            }
          }
        }
      } else {
        setTranslatedResult(null);
        
        if (window.translationTracker) {
          window.translationTracker.trackComponentUpdate('CropDiagnosticTool', 'diagnosis_result_cleared', {
            language: currentLanguage,
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    translateResult();
  }, [result, currentLanguage, translateDiagnosisResult]);

  const convertToBase64 = useCallback(async (file) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(compressedFile);
        fileReader.onload = () => {
          const base64String = fileReader.result.split(",")[1];
          resolve(base64String);
        };
        fileReader.onerror = (error) => reject(error);
      });
    } catch (error) {
      setError("Failed to compress image: " + error.message);
      return null;
    }
  }, []);

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size must be less than 10MB");
          return;
        }
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setResult(null);
        setError("");
      } else {
        setError("Please select a valid image file (PNG, JPG, JPEG)");
      }
    }
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size must be less than 10MB");
          return;
        }
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setResult(null);
        setError("");
      } else {
        setError("Please select a valid image file (PNG, JPG, JPEG)");
      }
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setError("Camera access is not supported in this browser.");
      }
    } catch (error) {
      setError("Failed to access camera: " + error.message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const captureCameraImage = useCallback(() => {
    if (videoRef.current && cameraStream) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setResult(null);
        setError("");
        stopCamera();
      }, "image/jpeg");
    }
  }, [cameraStream, stopCamera]);

  // Detect disease with enhanced API handling
  const detectDisease = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setError("");

    try {
      const base64String = await convertToBase64(selectedImage);
      if (!base64String) return;

      // Check cache
      const cacheKey = base64String.substring(0, 100);
      if (cache.current.has(cacheKey)) {
        setResult(cache.current.get(cacheKey));
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await axios.post(
        "https://susya.onrender.com",
        { image: base64String },
        {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      clearTimeout(timeoutId);

      const data = response.data;

      if (data && (data.plant || data.disease || data.remedy)) {
        const resultData = {
          plant: data.plant || "Unknown",
          disease: data.disease || "Could not detect disease",
          remedy: data.remedy || "No specific remedy available",
          confidence: data.confidence || null, // Add confidence if API provides it
        };
        setResult(resultData);
        cache.current.set(cacheKey, resultData); // Cache result
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Please check your internet connection.");
      } else if (err.response) {
        const status = err.response.status;
        if (status === 413) {
          setError("Image file is too large. Please try a smaller image.");
        } else if (status === 429) {
          setError("Too many requests. Please wait and try again.");
        } else if (status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(`Detection failed: ${err.message}`);
        }
      } else if (!navigator.onLine) {
        setError("No internet connection. Please try again when online.");
      } else {
        setError(`Detection failed: ${err.message}`);
      }
      console.error("Detection error:", err);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Send notification with offline queuing
  const sendNotification = async () => {
    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    const notificationData = {
      plant: result.plant,
      disease: result.disease,
      user: userName,
    };

    if (!navigator.onLine) {
      // Queue notification in local storage
      const queuedNotifications = JSON.parse(
        localStorage.getItem("queuedNotifications") || "[]"
      );
      queuedNotifications.push(notificationData);
      localStorage.setItem(
        "queuedNotifications",
        JSON.stringify(queuedNotifications)
      );
      alert("Offline: Notification queued and will be sent when online.");
      setShowNotificationForm(false);
      setUserName("");
      return;
    }

    try {
      const response = await axios.post(
        "https://susya.onrender.com/notify",
        notificationData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        alert("✅ Notification sent successfully!");
        setShowNotificationForm(false);
        setUserName("");
      }
    } catch (err) {
      setError(`Failed to send notification: ${err.message}`);
    }
  };

  // Reset application
  const resetApp = useCallback(() => {
    setSelectedImage(null);
    setImagePreview("");
    setResult(null);
    setError("");
    setShowNotificationForm(false);
    setUserName("");
    setUploadProgress(0);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }, [stopCamera]);

  // Handle camera capture with live preview
  const handleCameraCapture = useCallback(async () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    } else {
      await startCamera();
    }
  }, [startCamera]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Handle keyboard accessibility
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative"
        >
          {/* Language Selector */}
          <div className="absolute top-0 right-0 z-10">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={changeLanguage}
              size="medium"
            />
          </div>
          {/* <div className="flex items-center justify-center mb-6">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full shadow-lg mt-20">
                <Leaf className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div> */}
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 mt-20">
            Health Check
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            AI-powered plant disease detection for healthier crops
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>99.2% Accuracy</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Expert Recommendations</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mr-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {uiLabels.upload_image || "Upload Plant Image"}
            </h2>

            {!imagePreview && !cameraStream ? (
              <div className="space-y-6">
                <motion.div
                  className={`border-3 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer group ${
                    dragOver
                      ? "border-green-400 bg-green-50/50 scale-105"
                      : "border-green-300"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  aria-label="Drag and drop or click to upload an image"
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => fileInputRef.current?.click())
                  }
                >
                  <Upload className="w-12 h-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {dragOver
                      ? "Drop your image here!"
                      : (uiLabels.drag_drop_image || "Drag & drop your plant image")}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {uiLabels.click_to_browse || "or click to browse your files"}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <FileImage className="w-4 h-4" />
                    <span>PNG, JPG, JPEG • Max 10MB</span>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCameraCapture}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                    aria-label="Capture image with camera"
                    onKeyDown={(e) => handleKeyDown(e, handleCameraCapture)}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">{uiLabels.take_photo || "Take Photo"}</span>
                    <span className="sm:hidden">{uiLabels.camera || "Camera"}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                    aria-label="Choose file from device"
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => fileInputRef.current?.click())
                    }
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose File
                  </motion.button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-hidden="true"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
            ) : cameraStream ? (
              <div className="space-y-6">
                <motion.video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-64 rounded-xl border-2 border-white shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={captureCameraImage}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                    aria-label="Capture camera image"
                    onKeyDown={(e) => handleKeyDown(e, captureCameraImage)}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopCamera}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                    aria-label="Cancel camera"
                    onKeyDown={(e) => handleKeyDown(e, stopCamera)}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative group"
                >
                  <img
                    src={imagePreview}
                    alt="Selected plant"
                    className="w-full h-64 sm:h-80 object-cover rounded-3xl border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetApp}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
                    aria-label="Clear selected image"
                    onKeyDown={(e) => handleKeyDown(e, resetApp)}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full bg-gray-200 rounded-full h-2.5"
                  >
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={detectDisease}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                    aria-label="Analyze plant image"
                    onKeyDown={(e) => handleKeyDown(e, detectDisease)}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        {uiLabels.loading || "Analyzing..."}
                      </>
                    ) : (
                      <>
                        <Leaf className="w-5 h-5 mr-2" />
                        {uiLabels.diagnose || "Analyze Plant"}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                    aria-label="Change image"
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => fileInputRef.current?.click())
                    }
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {uiLabels.change || "Change"}
                  </motion.button>
                </div>
              </div>
            )}

            {(error || translationError) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 flex items-center shadow-lg"
              >
                <div className="bg-red-500 p-2 rounded-full mr-4">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">
                    {error ? (uiLabels.error_occurred || "Detection Error") : "Translation Error"}
                  </h4>
                  <p className="text-red-700">{error || translationError}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              {uiLabels.analysis_results || "Analysis Results"}
            </h2>

            {!result ? (
              <div className="text-center py-12 sm:py-16">
                <motion.div
                  className="relative mb-8"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Leaf className="w-20 h-20 text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-500 mb-3">
                  {uiLabels.ready_for_analysis || "Ready for Analysis"}
                </h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                  Upload a plant image to get instant AI-powered disease
                  detection and treatment recommendations
                </p>
                {isTranslating && (
                  <div className="mt-4 flex items-center justify-center text-blue-600">
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span className="text-sm">{uiLabels.loading || "Translating..."}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {isTranslating && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Loader className="w-4 h-4 mr-2 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-700">{uiLabels.loading || "Translating results..."}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-green-500 p-2 rounded-lg mr-3">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-green-800 text-lg">
                        {uiLabels.plant_identified || "Plant Identified"}
                      </h3>
                    </div>
                    <p className="text-green-700 text-lg sm:text-xl font-semibold">
                      {translatedResult?.plant || result.plant}
                    </p>
                    {result.confidence && (
                      <p className="text-green-600 text-sm mt-2">
                        {uiLabels.confidence || "Confidence"}: {(result.confidence * 100).toFixed(2)}%
                      </p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-red-500 p-2 rounded-lg mr-3">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-red-800 text-lg">
                        {uiLabels.disease_status || "Disease Status"}
                      </h3>
                    </div>
                    <p className="text-red-700 text-lg sm:text-xl font-semibold">
                      {translatedResult?.disease || result.disease}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-1 sm:p-2 border-2 border-blue-200 shadow-lg"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-500 p-3 rounded-xl mr-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg sm:text-xl">
                      {uiLabels.treatment_recommendations || "Treatment Recommendations"}
                    </h3>
                  </div>
                  <div className="bg-white/60 rounded-xl p-1 border border-blue-200">
                    <p className="text-blue-800 leading-relaxed text-justify sm:text-lg font-medium">
                      {translatedResult?.remedy || result.remedy}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotificationForm(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center"
                  aria-label="Alert nearby farmers"
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => setShowNotificationForm(true))
                  }
                >
                  <div className="bg-white/20 p-2 rounded-lg mr-4">
                    <Bell className="w-6 h-6" />
                  </div>
                  {uiLabels.alert_nearby_farmers || "Alert Nearby Farmers"}
                  <div className="ml-4 bg-white/20 px-3 py-1 rounded-full text-sm">
                    {uiLabels.community_alert || "Community Alert"}
                  </div>
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Notification Modal */}
        <AnimatePresence>
          {showNotificationForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border-4 border-orange-200"
              >
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full inline-block mb-4">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {uiLabels.community_alert || "Community Disease Alert"}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Help protect your farming community by sharing this disease
                    detection
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-bold text-gray-700 mb-3"
                      htmlFor="user-name"
                    >
                      {uiLabels.your_name || "Your Name"}
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg"
                      placeholder={uiLabels.enter_name || "Enter your name"}
                      aria-required="true"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-3">
                      {uiLabels.alert_details || "Alert Details"}
                    </h4>
                    <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                      <p>
                        <span className="font-semibold">{uiLabels.plant_identified || "Plant"}:</span>{" "}
                        {translatedResult?.plant || result?.plant}
                      </p>
                      <p>
                        <span className="font-semibold">{uiLabels.disease_status || "Disease"}:</span>{" "}
                        {translatedResult?.disease || result?.disease}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotificationForm(false)}
                      className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold"
                      aria-label="Cancel notification"
                      onKeyDown={(e) =>
                        handleKeyDown(e, () => setShowNotificationForm(false))
                      }
                    >
                      {uiLabels.cancel || "Cancel"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendNotification}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center"
                      aria-label="Send notification"
                      onKeyDown={(e) => handleKeyDown(e, sendNotification)}
                    >
                      <Bell className="w-5 h-5 mr-2" />
                      {uiLabels.send_alert || "Send Alert"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 sm:mt-16 py-8 border-t border-green-200"
        >
          {/* <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-700">
              TriAgrio AI
            </span>
          </div>
          <p className="text-gray-600 mb-2">
            Powered by advanced machine learning and computer vision
          </p> */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500">
            <span>🌱 Protecting crops nationwide</span>
            <span>🤖 AI-driven insights</span>
            <span>🌍 Sustainable farming</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlantDiseaseDetector;
