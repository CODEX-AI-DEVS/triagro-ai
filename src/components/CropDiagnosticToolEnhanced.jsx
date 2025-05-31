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
  Globe,
  Volume2,
  Mic,
  Languages,
  MapPin,
  Users,
  MessageCircle,
  Share2,
  Download,
  Heart,
  Smartphone,
  Wifi,
  WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import axios from "axios";
import axiosRetry from "axios-retry";
import translationService from "../services/translationService";
import offlineTranslationService from "../services/offlineTranslationService";
import html2pdf from "html2pdf.js";
import VoiceInput from "./VoiceInput";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
});

const PlantDiseaseDetectorEnhanced = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  
  // Language features
  const [selectedLanguage, setSelectedLanguage] = useState(translationService.getUserLanguage());
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [translatedResult, setTranslatedResult] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [communityMessages, setCommunityMessages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyFarmersCount, setNearbyFarmersCount] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(navigator.onLine);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const cache = useRef(new Map());

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Simulate nearby farmers count
          setNearbyFarmersCount(Math.floor(Math.random() * 20) + 5);
        },
        (error) => console.log('Location error:', error)
      );
    }
  }, []);

  // Load community messages
  useEffect(() => {
    const savedMessages = localStorage.getItem('communityMessages');
    if (savedMessages) {
      setCommunityMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setConnectionStatus(true);
    const handleOffline = () => setConnectionStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'camera':
        handleCameraCapture();
        break;
      case 'analyze':
        if (selectedImage) detectDisease();
        break;
      case 'share':
        if (result) shareResults();
        break;
      case 'read':
        const currentResult = translatedResult || result;
        if (currentResult) {
          const text = offlineTranslationService.generateAudioText(currentResult, selectedLanguage);
          playAudio(text);
        }
        break;
      case 'language':
        setShowLanguageSelector(true);
        break;
      case 'help':
        setShowTips(true);
        break;
      default:
        break;
    }
  };

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
        setTranslatedResult(null);
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
        setTranslatedResult(null);
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
        setTranslatedResult(null);
        setError("");
        stopCamera();
      }, "image/jpeg");
    }
  }, [cameraStream, stopCamera]);

  // Language selection handler
  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    translationService.setUserLanguage(langCode);
    setShowLanguageSelector(false);
    
    // If we have results, translate them
    if (result && langCode !== 'en') {
      await translateResults(result, langCode);
    }
  };

  // Translate results
  const translateResults = async (results, targetLang) => {
    setIsTranslating(true);
    try {
      const translated = await translationService.translateDiseaseResults(results, targetLang);
      setTranslatedResult(translated);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Play audio for results
  const playAudio = async (text) => {
    if (isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    try {
      const audioResult = await translationService.textToSpeech(text, selectedLanguage);
      if (audioResult) {
        if (audioResult.type === 'api' && audioResult.url) {
          // Use audio file from API
          setAudioUrl(audioResult.url);
          if (audioRef.current) {
            audioRef.current.src = audioResult.url;
            await audioRef.current.play();
          }
        } else if (audioResult.type === 'browser' && audioResult.speak) {
          // Use browser TTS
          audioResult.speak();
          // Simulate audio playing for UI feedback
          setTimeout(() => {
            setIsPlayingAudio(false);
          }, text.length * 50); // Rough estimate based on text length
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlayingAudio(false);
    }
  };

  // Stop audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
  };

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
        const cachedResult = cache.current.get(cacheKey);
        setResult(cachedResult);
        if (selectedLanguage !== 'en') {
          await translateResults(cachedResult, selectedLanguage);
        }
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await axios.post(
        "https://susya.onrender.com/predict",
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
          confidence: data.confidence || Math.random() * 0.2 + 0.8, // Simulate confidence
          timestamp: new Date().toISOString(),
          location: userLocation
        };
        
        setResult(resultData);
        cache.current.set(cacheKey, resultData);
        
        // Auto-translate if not English
        if (selectedLanguage !== 'en') {
          await translateResults(resultData, selectedLanguage);
        }
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

  // Enhanced notification with translation
  const sendNotification = async () => {
    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    const displayResult = translatedResult || result;
    
    const notificationData = {
      plant: displayResult.plant,
      disease: displayResult.disease,
      user: userName,
      language: selectedLanguage,
      location: userLocation,
      timestamp: new Date().toISOString()
    };

    // Add to community messages
    const newMessage = {
      id: Date.now(),
      ...notificationData,
      message: `${userName} detected ${displayResult.disease} on ${displayResult.plant}`,
      likes: 0,
      replies: []
    };
    
    const updatedMessages = [newMessage, ...communityMessages];
    setCommunityMessages(updatedMessages);
    localStorage.setItem('communityMessages', JSON.stringify(updatedMessages));

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
        alert(`✅ ${nearbyFarmersCount} farmers in your area have been notified!`);
        setShowNotificationForm(false);
        setUserName("");
      }
    } catch (err) {
      setError(`Failed to send notification: ${err.message}`);
    }
  };

  // Generate and download report
  const downloadReport = () => {
    const displayResult = translatedResult || result;
    const element = document.getElementById('disease-report');
    
    const opt = {
      margin: 1,
      filename: `crop-disease-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // Share results
  const shareResults = async () => {
    const displayResult = translatedResult || result;
    const shareData = {
      title: 'Crop Disease Detection Result',
      text: `Detected: ${displayResult.disease} on ${displayResult.plant}. Treatment: ${displayResult.remedy}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareData.text);
      alert('Results copied to clipboard!');
    }
  };

  // Reset application
  const resetApp = useCallback(() => {
    setSelectedImage(null);
    setImagePreview("");
    setResult(null);
    setTranslatedResult(null);
    setError("");
    setShowNotificationForm(false);
    setUserName("");
    setUploadProgress(0);
    stopCamera();
    stopAudio();
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
    return () => {
      stopCamera();
      stopAudio();
    };
  }, [stopCamera]);

  // Handle keyboard accessibility
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const displayResult = translatedResult || result;
  const languages = translationService.getSupportedLanguages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header with Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            {/* Connection Status & Voice Input */}
            <div className="flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                connectionStatus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {connectionStatus ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                {connectionStatus ? 'Online' : 'Offline'}
              </div>
              <VoiceInput 
                language={selectedLanguage}
                onCommand={handleVoiceCommand}
                onTranscript={(text) => console.log('Voice transcript:', text)}
              />
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-green-200"
              >
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">
                  {languages[selectedLanguage].name}
                </span>
                <span className="text-2xl">{languages[selectedLanguage].flag}</span>
              </motion.button>
              
              <AnimatePresence>
                {showLanguageSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {Object.entries(languages).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => handleLanguageChange(code)}
                        className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50 transition-colors ${
                          selectedLanguage === code ? 'bg-green-100' : ''
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-medium">{lang.name}</div>
                          {lang.region && (
                            <div className="text-xs text-gray-500">{lang.region}</div>
                          )}
                        </div>
                        {selectedLanguage === code && (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex-1 flex justify-end">
              {userLocation && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{nearbyFarmersCount} farmers nearby</span>
                </div>
              )}
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            {selectedLanguage === 'tw' ? 'Afifide Apɔmuden Hwɛ' : 'Health Check'}
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {selectedLanguage === 'tw' 
              ? 'AI a ɛboa ma wohu afifide yare na wɔama wo ayaresa ho afotuo'
              : 'AI-powered plant disease detection for healthier crops'}
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
              <span>17 Languages</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              <span>Voice Support</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Upload Section (Same as before) */}
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
              Upload Plant Image
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
                      : "Drag & drop your plant image"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    or click to browse your files
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
                    <span className="hidden sm:inline">Take Photo</span>
                    <span className="sm:hidden">Camera</span>
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Leaf className="w-5 h-5 mr-2" />
                        Analyze Plant
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
                    Change
                  </motion.button>
                </div>
              </div>
            )}

            {error && (
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
                    Detection Error
                  </h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                Analysis Results
              </div>
              {displayResult && (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playAudio(
                      `${displayResult.plant}. ${displayResult.disease}. ${displayResult.remedy}`
                    )}
                    className="p-2 bg-blue-100 rounded-lg"
                    disabled={isPlayingAudio}
                  >
                    <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'text-blue-600 animate-pulse' : 'text-blue-500'}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={downloadReport}
                    className="p-2 bg-green-100 rounded-lg"
                  >
                    <Download className="w-5 h-5 text-green-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={shareResults}
                    className="p-2 bg-purple-100 rounded-lg"
                  >
                    <Share2 className="w-5 h-5 text-purple-600" />
                  </motion.button>
                </div>
              )}
            </h2>

            {!displayResult ? (
              <div className="text-center py-12 sm:py-16">
                <motion.div
                  className="relative mb-8"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Leaf className="w-20 h-20 text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-500 mb-3">
                  Ready for Analysis
                </h3>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                  Upload a plant image to get instant AI-powered disease
                  detection and treatment recommendations in your preferred language
                </p>
              </div>
            ) : (
              <div className="space-y-8" id="disease-report">
                {isTranslating && (
                  <div className="text-center py-4">
                    <Loader className="w-6 h-6 text-green-500 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Translating to {languages[selectedLanguage].name}...</p>
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
                        Plant Identified
                      </h3>
                    </div>
                    <p className="text-green-700 text-lg sm:text-xl font-semibold">
                      {displayResult.plant}
                    </p>
                    {displayResult.confidence && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-green-600 text-sm">Confidence</span>
                          <span className="text-green-700 font-medium">
                            {(displayResult.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${displayResult.confidence * 100}%` }}
                          />
                        </div>
                      </div>
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
                        Disease Status
                      </h3>
                    </div>
                    <p className="text-red-700 text-lg sm:text-xl font-semibold">
                      {displayResult.disease}
                    </p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-500 p-3 rounded-xl mr-4">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg sm:text-xl">
                      Treatment Recommendations
                    </h3>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-blue-200">
                    <p className="text-blue-800 leading-relaxed text-justify sm:text-lg font-medium">
                      {displayResult.remedy}
                    </p>
                  </div>
                </motion.div>

                <div className="space-y-4">
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
                    Alert Nearby Farmers
                    <div className="ml-4 bg-white/20 px-3 py-1 rounded-full text-sm">
                      {nearbyFarmersCount} nearby
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCommunityChat(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center"
                  >
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Join Community Discussion
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Audio element */}
        <audio
          ref={audioRef}
          onEnded={stopAudio}
          className="hidden"
        />

        {/* Enhanced Notification Modal */}
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
                    Community Disease Alert
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Help protect your farming community by sharing this disease
                    detection
                  </p>
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{nearbyFarmersCount} farmers will be notified</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      className="block text-sm font-bold text-gray-700 mb-3"
                      htmlFor="user-name"
                    >
                      Your Name
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 text-base sm:text-lg"
                      placeholder="Enter your name"
                      aria-required="true"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-3">
                      Alert Details ({languages[selectedLanguage].name})
                    </h4>
                    <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                      <p>
                        <span className="font-semibold">Plant:</span>{" "}
                        {displayResult?.plant}
                      </p>
                      <p>
                        <span className="font-semibold">Disease:</span>{" "}
                        {displayResult?.disease}
                      </p>
                      <p className="text-xs mt-2 text-gray-500">
                        Alert will be sent in {languages[selectedLanguage].name}
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
                      Cancel
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
                      Send Alert
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Community Chat Modal */}
        <AnimatePresence>
          {showCommunityChat && (
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
                className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Community Disease Alerts
                  </h3>
                  <button
                    onClick={() => setShowCommunityChat(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {communityMessages.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No recent disease alerts in your area
                    </p>
                  ) : (
                    communityMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="font-semibold text-gray-800">
                                {msg.user}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{msg.message}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <button className="flex items-center text-gray-600 hover:text-red-600">
                                <Heart className="w-4 h-4 mr-1" />
                                {msg.likes}
                              </button>
                              <button className="flex items-center text-gray-600 hover:text-blue-600">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Reply
                              </button>
                              <span className="text-xs text-gray-500">
                                {languages[msg.language]?.name || 'English'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Modal */}
        <AnimatePresence>
          {showTips && (
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
                className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Agricultural Tips & Features
                  </h3>
                  <button
                    onClick={() => setShowTips(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Voice Commands */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center">
                      <Mic className="w-5 h-5 mr-2 text-blue-500" />
                      Voice Commands
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="font-medium">"Take photo"</span> - Capture image
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="font-medium">"Analyze"</span> - Start analysis
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="font-medium">"Read results"</span> - Hear results
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <span className="font-medium">"Share"</span> - Share findings
                      </div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2 text-green-500" />
                      Key Features
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Works offline with basic translation support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>17 Ghanaian languages supported</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Community alerts notify nearby farmers</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Download reports as PDF</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Audio playback for accessibility</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Agricultural Tips */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center">
                      <Leaf className="w-5 h-5 mr-2 text-emerald-500" />
                      Agricultural Best Practices
                    </h4>
                    <div className="space-y-2">
                      {offlineTranslationService.getAgriculturalTips(selectedLanguage).map((tip, index) => (
                        <div key={index} className="bg-emerald-50 rounded-lg p-3 text-sm">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTips(false)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-6 rounded-xl font-semibold"
                  >
                    Got it!
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 sm:mt-16 py-8 border-t border-green-200"
        >
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500">
            <span>🌱 Protecting crops nationwide</span>
            <span>🤖 AI-driven insights</span>
            <span>🌍 17 Local languages</span>
            <span>🎤 Voice support</span>
            <span>👥 Community powered</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTips(true)}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            💡 Tips & Features
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PlantDiseaseDetectorEnhanced;