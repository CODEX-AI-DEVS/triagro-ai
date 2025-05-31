// import { useState, useRef } from "react";
// import {
//   Camera,
//   Upload,
//   Loader,
//   AlertTriangle,
//   CheckCircle,
//   X,
//   Info,
// } from "lucide-react";

// const CropDiagnosticTool = () => {
//   const [image, setImage] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [diagnosis, setDiagnosis] = useState(null);
//   const [showCamera, setShowCamera] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const streamRef = useRef(null);

//   // Mock disease database - in production, this would be an API call to your backend
//   const diseaseDatabase = {
//     leaf_spot: {
//       name: "Leaf Spot Disease",
//       severity: "moderate",
//       description: "Fungal infection causing brown spots on leaves",
//       causes: ["High humidity", "Poor air circulation", "Overwatering"],
//       remedies: [
//         "Remove affected leaves immediately",
//         "Apply copper-based fungicide",
//         "Improve air circulation around plants",
//         "Water at soil level, not on leaves",
//       ],
//       prevention: [
//         "Ensure proper spacing between plants",
//         "Water early morning to allow leaves to dry",
//         "Use drip irrigation instead of overhead watering",
//       ],
//     },
//     aphid_infestation: {
//       name: "Aphid Infestation",
//       severity: "high",
//       description: "Small insects feeding on plant sap",
//       causes: [
//         "Nitrogen-rich fertilizers",
//         "Warm weather",
//         "Lack of natural predators",
//       ],
//       remedies: [
//         "Spray with insecticidal soap",
//         "Release ladybugs or lacewings",
//         "Use neem oil spray",
//         "Rinse with strong water spray",
//       ],
//       prevention: [
//         "Avoid over-fertilizing with nitrogen",
//         "Plant companion plants like marigolds",
//         "Encourage beneficial insects",
//       ],
//     },
//     powdery_mildew: {
//       name: "Powdery Mildew",
//       severity: "moderate",
//       description: "White powdery coating on leaves and stems",
//       causes: ["High humidity", "Poor air circulation", "Shade conditions"],
//       remedies: [
//         "Apply baking soda solution (1 tsp per quart water)",
//         "Use sulfur-based fungicide",
//         "Remove heavily infected parts",
//         "Improve air circulation",
//       ],
//       prevention: [
//         "Choose resistant varieties",
//         "Provide adequate spacing",
//         "Avoid overhead watering",
//       ],
//     },
//   };

//   // Real API integrations for plant identification and disease analysis
//   const analyzeWithPlantNet = async (imageBlob) => {
//     const formData = new FormData();
//     formData.append("images", imageBlob);
//     formData.append("modifiers", '["crops_fast", "useful"]');
//     formData.append("plant-identification", "true");

//     try {
//       const response = await fetch("https://my-api.plantnet.org/v1/identify", {
//         method: "POST",
//         headers: {
//           "Api-Key": "YOUR_PLANTNET_API_KEY", // Replace with your actual API key
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       return data.results?.[0] || null;
//     } catch (error) {
//       console.error("PlantNet API error:", error);
//       return null;
//     }
//   };

//   const analyzeWithGoogleVision = async (imageBlob) => {
//     const base64Image = await blobToBase64(imageBlob);

//     try {
//       const response = await fetch(
//         `https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_VISION_API_KEY`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             requests: [
//               {
//                 image: {
//                   content: base64Image.split(",")[1],
//                 },
//                 features: [
//                   { type: "LABEL_DETECTION", maxResults: 10 },
//                   { type: "TEXT_DETECTION", maxResults: 5 },
//                 ],
//               },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();
//       return data.responses?.[0] || null;
//     } catch (error) {
//       console.error("Google Vision API error:", error);
//       return null;
//     }
//   };

//   const analyzeWithTensorFlow = async (imageElement) => {
//     try {
//       // Load a pre-trained model for plant disease detection
//       // This is a placeholder - you'll need to load your actual model
//       const model = await window.tf?.loadLayersModel(
//         "/models/plant-disease-model.json"
//       );

//       if (!model) {
//         throw new Error("TensorFlow model not loaded");
//       }

//       // Preprocess image
//       const tensor = window.tf.browser
//         .fromPixels(imageElement)
//         .resizeNearestNeighbor([224, 224])
//         .toFloat()
//         .div(255.0)
//         .expandDims();

//       // Make prediction
//       const prediction = await model.predict(tensor).data();

//       // Cleanup
//       tensor.dispose();

//       return {
//         predictions: Array.from(prediction),
//         confidence: Math.max(...prediction),
//       };
//     } catch (error) {
//       console.error("TensorFlow analysis error:", error);
//       return null;
//     }
//   };

//   const blobToBase64 = (blob) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   // Enhanced analysis function using multiple APIs
//   const analyzeImage = async (imageUrl) => {
//     setIsAnalyzing(true);

//     try {
//       // Convert image URL to blob
//       const response = await fetch(imageUrl);
//       const imageBlob = await response.blob();

//       // Run multiple analyses in parallel
//       const [plantNetResult, googleVisionResult] = await Promise.allSettled([
//         analyzeWithPlantNet(imageBlob),
//         analyzeWithGoogleVision(imageBlob),
//       ]);

//       // Process results and determine disease
//       let detectedDisease = null;
//       let confidence = 0;
//       let plantSpecies = null;
//       let additionalInfo = {};

//       // Process PlantNet results
//       if (plantNetResult.status === "fulfilled" && plantNetResult.value) {
//         plantSpecies =
//           plantNetResult.value.species?.scientificNameWithoutAuthor;
//         confidence = Math.max(confidence, plantNetResult.value.score || 0);
//       }

//       // Process Google Vision results
//       if (
//         googleVisionResult.status === "fulfilled" &&
//         googleVisionResult.value
//       ) {
//         const labels = googleVisionResult.value.labelAnnotations || [];
//         const diseaseKeywords = [
//           "disease",
//           "pest",
//           "fungus",
//           "blight",
//           "spot",
//           "mildew",
//           "aphid",
//         ];

//         for (const label of labels) {
//           const description = label.description.toLowerCase();
//           if (
//             diseaseKeywords.some((keyword) => description.includes(keyword))
//           ) {
//             // Match with our disease database
//             for (const [key, disease] of Object.entries(diseaseDatabase)) {
//               if (
//                 description.includes(key.replace("_", " ")) ||
//                 disease.name.toLowerCase().includes(description)
//               ) {
//                 detectedDisease = key;
//                 confidence = Math.max(confidence, label.score || 0);
//                 break;
//               }
//             }
//           }
//         }

//         additionalInfo.labels = labels.slice(0, 5).map((l) => l.description);
//       }

//       // Fallback to mock analysis if APIs don't detect disease
//       if (!detectedDisease) {
//         const diseases = Object.keys(diseaseDatabase);
//         detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
//         confidence = 0.65; // Lower confidence for fallback
//       }

//       return {
//         disease: detectedDisease,
//         confidence: confidence,
//         plantSpecies: plantSpecies,
//         additionalInfo: additionalInfo,
//       };
//     } catch (error) {
//       console.error("Analysis failed:", error);
//       throw error;
//     }
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "environment", // Use back camera on mobile
//           width: { ideal: 1920, max: 1920 },
//           height: { ideal: 1080, max: 1080 },
//         },
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//         setShowCamera(true);
//       }
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert(
//         "Unable to access camera. Please check permissions or use file upload."
//       );
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setShowCamera(false);
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       // Flash effect
//       const flash = document.getElementById("flash");
//       if (flash) {
//         flash.style.opacity = "0.8";
//         setTimeout(() => (flash.style.opacity = "0"), 100);
//       }

//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       ctx.drawImage(video, 0, 0);

//       canvas.toBlob(
//         (blob) => {
//           const url = URL.createObjectURL(blob);
//           setImage(url);
//           stopCamera();
//         },
//         "image/jpeg",
//         0.9
//       );
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const url = URL.createObjectURL(file);
//       setImage(url);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!image) return;

//     setIsAnalyzing(true);
//     setDiagnosis(null);

//     try {
//       const result = await analyzeImage(image);
//       const diseaseInfo = diseaseDatabase[result.disease];

//       setDiagnosis({
//         ...diseaseInfo,
//         confidence: result.confidence,
//         plantSpecies: result.plantSpecies,
//         additionalInfo: result.additionalInfo,
//       });
//     } catch (error) {
//       console.error("Analysis failed:", error);
//       alert("Analysis failed. Please try again.");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const resetDiagnosis = () => {
//     setImage(null);
//     setDiagnosis(null);
//     setIsAnalyzing(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "low":
//         return "text-green-600 bg-green-100";
//       case "moderate":
//         return "text-yellow-600 bg-yellow-100";
//       case "high":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-20">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-green-800 mb-2">
//           Crop Diagnostic Tool
//         </h1>
//         <p className="text-gray-600">
//           Take a photo of affected crops to identify pests and diseases
//         </p>
//       </div>

//       {!showCamera && !image && (
//         <div className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <button
//               onClick={startCamera}
//               className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
//             >
//               <Camera className="w-8 h-8 text-green-600" />
//               <span className="text-lg font-semibold text-green-700">
//                 Take Photo
//               </span>
//             </button>

//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
//             >
//               <Upload className="w-8 h-8 text-blue-600" />
//               <span className="text-lg font-semibold text-blue-700">
//                 Upload Image
//               </span>
//             </button>
//           </div>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
//         </div>
//       )}

//       {showCamera && (
//         <div className="relative bg-black rounded-lg overflow-hidden">
//           <video
//             ref={videoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full h-96 md:h-[500px] object-cover"
//           />

//           {/* Camera overlay with guidelines */}
//           <div className="absolute inset-0 pointer-events-none">
//             <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-50"></div>
//             <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
//               Position the affected area within the frame
//             </div>
//           </div>

//           {/* Camera controls */}
//           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
//             <button
//               onClick={capturePhoto}
//               className="bg-white text-green-600 p-4 rounded-full shadow-xl hover:bg-green-50 transition-all duration-200 transform hover:scale-105"
//             >
//               <Camera className="w-8 h-8" />
//             </button>
//             <button
//               onClick={stopCamera}
//               className="bg-white text-red-600 p-4 rounded-full shadow-xl hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
//             >
//               <X className="w-8 h-8" />
//             </button>
//           </div>

//           {/* Flash effect for capture */}
//           <div
//             id="flash"
//             className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
//           ></div>
//         </div>
//       )}

//       {image && (
//         <div className="space-y-6">
//           <div className="relative">
//             <img
//               src={image}
//               alt="Crop to analyze"
//               className="w-full max-h-96 object-contain rounded-lg border"
//             />
//             <button
//               onClick={resetDiagnosis}
//               className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="text-center">
//             <button
//               onClick={handleAnalyze}
//               disabled={isAnalyzing}
//               className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
//             >
//               {isAnalyzing ? (
//                 <>
//                   <Loader className="w-5 h-5 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : (
//                 "Analyze Crop"
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       {diagnosis && (
//         <div className="mt-8 space-y-6">
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
//             <div className="flex items-center gap-3 mb-4">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   {diagnosis.name}
//                 </h2>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
//                       diagnosis.severity
//                     )}`}
//                   >
//                     {diagnosis.severity.toUpperCase()} SEVERITY
//                   </span>
//                   <span className="text-sm text-gray-600">
//                     Confidence: {(diagnosis.confidence * 100).toFixed(1)}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <p className="text-gray-700 text-lg">{diagnosis.description}</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
//               <div className="flex items-center gap-2 mb-3">
//                 <AlertTriangle className="w-5 h-5 text-orange-600" />
//                 <h3 className="font-bold text-orange-800">Causes</h3>
//               </div>
//               <ul className="space-y-2">
//                 {diagnosis.causes.map((cause, index) => (
//                   <li key={index} className="text-orange-700 text-sm">
//                     • {cause}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
//               <div className="flex items-center gap-2 mb-3">
//                 <CheckCircle className="w-5 h-5 text-blue-600" />
//                 <h3 className="font-bold text-blue-800">Treatment</h3>
//               </div>
//               <ul className="space-y-2">
//                 {diagnosis.remedies.map((remedy, index) => (
//                   <li key={index} className="text-blue-700 text-sm">
//                     • {remedy}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="bg-green-50 p-5 rounded-lg border border-green-200">
//               <div className="flex items-center gap-2 mb-3">
//                 <Info className="w-5 h-5 text-green-600" />
//                 <h3 className="font-bold text-green-800">Prevention</h3>
//               </div>
//               <ul className="space-y-2">
//                 {diagnosis.prevention.map((tip, index) => (
//                   <li key={index} className="text-green-700 text-sm">
//                     • {tip}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
//             <div className="flex items-start gap-2">
//               <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
//               <div className="text-sm">
//                 <p className="font-semibold text-yellow-800 mb-1">
//                   Important Note:
//                 </p>
//                 <p className="text-yellow-700">
//                   This diagnosis is AI-generated and should be confirmed by an
//                   agricultural expert. For severe infestations or persistent
//                   problems, consult with local agricultural extension services.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default CropDiagnosticTool;

// import { useState, useRef, useCallback } from "react";
// import {
//   Camera,
//   Upload,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
//   X,
//   Info,
//   Users,
// } from "lucide-react";

// const CropDiagnosticTool = () => {
//   const [image, setImage] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [diagnosis, setDiagnosis] = useState(null);
//   const [showCamera, setShowCamera] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const streamRef = useRef(null);

//   // Mock disease database (replace with backend API in production)
//   const diseaseDatabase = {
//     leaf_spot: {
//       name: "Leaf Spot Disease",
//       severity: "moderate",
//       description: "Fungal infection causing brown spots on leaves",
//       causes: ["High humidity", "Poor air circulation", "Overwatering"],
//       remedies: [
//         "Remove affected leaves",
//         "Apply copper-based fungicide",
//         "Improve air circulation",
//         "Water at soil level",
//       ],
//       prevention: [
//         "Ensure proper plant spacing",
//         "Water in the morning",
//         "Use drip irrigation",
//       ],
//       communityInsights: [
//         "Farmer John: 'Pruning regularly helps reduce humidity around plants.'",
//         "AgroExpert: 'Copper fungicide worked well in my fields last season.'",
//       ],
//     },
//     aphid_infestation: {
//       name: "Aphid Infestation",
//       severity: "high",
//       description: "Small insects feeding on plant sap",
//       causes: [
//         "Nitrogen-rich fertilizers",
//         "Warm weather",
//         "Lack of predators",
//       ],
//       remedies: [
//         "Use insecticidal soap",
//         "Introduce ladybugs",
//         "Apply neem oil",
//         "Rinse with water spray",
//       ],
//       prevention: [
//         "Avoid over-fertilizing",
//         "Plant marigolds nearby",
//         "Encourage beneficial insects",
//       ],
//       communityInsights: [
//         "Grower Jane: 'Ladybugs cleared my aphid problem in a week!'",
//         "Farmer Mike: 'Neem oil is my go-to for organic control.'",
//       ],
//     },
//     powdery_mildew: {
//       name: "Powdery Mildew",
//       severity: "moderate",
//       description: "White powdery coating on leaves and stems",
//       causes: ["High humidity", "Poor air circulation", "Shade conditions"],
//       remedies: [
//         "Apply baking soda solution",
//         "Use sulfur-based fungicide",
//         "Remove infected parts",
//         "Improve air circulation",
//       ],
//       prevention: [
//         "Choose resistant varieties",
//         "Provide adequate spacing",
//         "Avoid overhead watering",
//       ],
//       communityInsights: [
//         "Grower Sarah: 'Baking soda spray is cheap and effective.'",
//         "AgroTech: 'Resistant varieties saved my crop last year.'",
//       ],
//     },
//   };

//   // Mock API analysis (replace with real PlantNet/Google Vision APIs)
//   const analyzeImage = useCallback(async (imageUrl) => {
//     setIsAnalyzing(true);
//     setProgress(0);
//     setError(null);

//     try {
//       // Simulate API delay and progress
//       for (let i = 0; i <= 100; i += 10) {
//         setProgress(i);
//         await new Promise((resolve) => setTimeout(resolve, 300));
//       }

//       // Mock analysis logic
//       const diseases = Object.keys(diseaseDatabase);
//       const detectedDisease =
//         diseases[Math.floor(Math.random() * diseases.length)];
//       const confidence = 0.85 + Math.random() * 0.1; // Random confidence for demo
//       const plantSpecies = "Unknown Species"; // Mock species, replace with PlantNet result

//       return {
//         disease: detectedDisease,
//         confidence,
//         plantSpecies,
//         additionalInfo: { labels: ["plant", "leaf", detectedDisease] },
//       };
//     } catch (err) {
//       setError("Failed to analyze image. Please try again.");
//       throw err;
//     } finally {
//       setIsAnalyzing(false);
//     }
//   }, []);

//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//         setShowCamera(true);
//         setError(null);
//       }
//     } catch (err) {
//       setError("Unable to access camera. Please check permissions.");
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setShowCamera(false);
//   }, []);

//   const capturePhoto = useCallback(() => {
//     if (videoRef.current && canvasRef.current) {
//       const flash = document.getElementById("flash");
//       if (flash) {
//         flash.style.opacity = "0.8";
//         setTimeout(() => (flash.style.opacity = "0"), 100);
//       }

//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       ctx.drawImage(video, 0, 0);

//       canvas.toBlob(
//         (blob) => {
//           const url = URL.createObjectURL(blob);
//           setImage(url);
//           stopCamera();
//         },
//         "image/jpeg",
//         0.9
//       );
//     }
//   }, [stopCamera]);

//   const handleFileUpload = useCallback((event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const url = URL.createObjectURL(file);
//       setImage(url);
//       setError(null);
//     } else {
//       setError("Please upload a valid image file.");
//     }
//   }, []);

//   const handleAnalyze = useCallback(async () => {
//     if (!image) return;

//     setIsAnalyzing(true);
//     setDiagnosis(null);

//     try {
//       const result = await analyzeImage(image);
//       const diseaseInfo = diseaseDatabase[result.disease];

//       setDiagnosis({
//         ...diseaseInfo,
//         confidence: result.confidence,
//         plantSpecies: result.plantSpecies,
//         additionalInfo: result.additionalInfo,
//       });
//     } catch (err) {
//       setError("Analysis failed. Please try again.");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   }, [image, analyzeImage]);

//   const resetDiagnosis = useCallback(() => {
//     setImage(null);
//     setDiagnosis(null);
//     setIsAnalyzing(false);
//     setError(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   }, []);

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "low":
//         return "text-green-600 bg-green-100";
//       case "moderate":
//         return "text-yellow-600 bg-yellow-100";
//       case "high":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-6">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-green-700">
//             Crop Health Scanner
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Diagnose crop diseases with a photo
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
//             <AlertTriangle className="w-5 h-5" />
//             {error}
//           </div>
//         )}

//         {!showCamera && !image && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <button
//               onClick={startCamera}
//               className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
//             >
//               <Camera className="w-6 h-6" />
//               <span className="font-semibold">Take Photo</span>
//             </button>
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
//             >
//               <Upload className="w-6 h-6" />
//               <span className="font-semibold">Upload Image</span>
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </div>
//         )}

//         {showCamera && (
//           <div className="relative rounded-lg overflow-hidden">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-80 object-cover"
//             />
//             <div className="absolute inset-0 pointer-events-none">
//               <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg opacity-60"></div>
//               <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
//                 Frame the affected crop
//               </div>
//             </div>
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
//               <button
//                 onClick={capturePhoto}
//                 className="bg-white text-green-600 p-3 rounded-full shadow-lg hover:bg-green-50 transition-transform hover:scale-105"
//               >
//                 <Camera className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={stopCamera}
//                 className="bg-white text-red-600 p-3 rounded-full shadow-lg hover:bg-red-50 transition-transform hover:scale-105"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div
//               id="flash"
//               className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
//             ></div>
//           </div>
//         )}

//         {image && (
//           <div className="space-y-4">
//             <div className="relative">
//               <img
//                 src={image}
//                 alt="Crop preview"
//                 className="w-full h-80 object-contain rounded-lg border border-gray-200"
//               />
//               <button
//                 onClick={resetDiagnosis}
//                 className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <button
//               onClick={handleAnalyze}
//               disabled={isAnalyzing}
//               className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isAnalyzing ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Analyzing ({progress}%)
//                 </>
//               ) : (
//                 "Diagnose Crop"
//               )}
//             </button>
//             {isAnalyzing && (
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         )}

//         {diagnosis && (
//           <div className="mt-6 space-y-6">
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-lg border-l-4 border-green-600">
//               <div className="flex items-center gap-3 mb-3">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {diagnosis.name}
//                   </h2>
//                   <div className="flex items-center gap-2 mt-1 text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full font-semibold ${getSeverityColor(
//                         diagnosis.severity
//                       )}`}
//                     >
//                       {diagnosis.severity.toUpperCase()} SEVERITY
//                     </span>
//                     <span className="text-gray-600">
//                       Confidence: {(diagnosis.confidence * 100).toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-600">{diagnosis.description}</p>
//               {diagnosis.plantSpecies && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   Plant: {diagnosis.plantSpecies}
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="bg-orange-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <AlertTriangle className="w-5 h-5 text-orange-600" />
//                   <h3 className="font-semibold text-orange-800">Causes</h3>
//                 </div>
//                 <ul className="space-y-1 text-sm text-orange-700">
//                   {diagnosis.causes.map((cause, index) => (
//                     <li key={index}>• {cause}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CheckCircle className="w-5 h-5 text-blue-600" />
//                   <h3 className="font-semibold text-blue-800">Treatments</h3>
//                 </div>
//                 <ul className="space-y-1 text-sm text-blue-700">
//                   {diagnosis.remedies.map((remedy, index) => (
//                     <li key={index}>• {remedy}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Info className="w-5 h-5 text-green-600" />
//                   <h3 className="font-semibold text-green-800">Prevention</h3>
//                 </div>
//                 <ul className="space-y-1 text-sm text-green-700">
//                   {diagnosis.prevention.map((tip, index) => (
//                     <li key={index}>• {tip}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="bg-purple-50 p-4 rounded-lg">
//               <div className="flex items-center gap-2 mb-2">
//                 <Users className="w-5 h-5 text-purple-600" />
//                 <h3 className="font-semibold text-purple-800">
//                   Community Insights
//                 </h3>
//               </div>
//               <ul className="space-y-1 text-sm text-purple-700">
//                 {diagnosis.communityInsights.map((insight, index) => (
//                   <li key={index}>• {insight}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="bg-yellow-50 p-4 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                 <div className="text-sm text-yellow-700">
//                   <p className="font-semibold mb-1">Disclaimer</p>
//                   <p>
//                     This is an AI-generated diagnosis. Consult an agricultural
//                     expert for confirmation and professional advice.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <canvas ref={canvasRef} className="hidden" />
//       </div>
//     </div>
//   );
// };

// export default CropDiagnosticTool;

// import { useState, useRef, useCallback } from "react";
// import {
//   Camera,
//   Upload,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
//   X,
//   Info,
//   Users,
// } from "lucide-react";

// const CropDiagnosticTool = () => {
//   const [image, setImage] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [diagnosis, setDiagnosis] = useState(null);
//   const [showCamera, setShowCamera] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const streamRef = useRef(null);

//   // Mock disease database (replace with backend API in production)
//   const diseaseDatabase = {
//     leaf_spot: {
//       name: "Leaf Spot Disease",
//       severity: "moderate",
//       description: "Fungal infection causing brown spots on leaves",
//       causes: ["High humidity", "Poor air circulation", "Overwatering"],
//       remedies: [
//         "Remove affected leaves",
//         "Apply copper-based fungicide",
//         "Improve air circulation",
//         "Water at soil level",
//       ],
//       prevention: [
//         "Ensure proper plant spacing",
//         "Water in the morning",
//         "Use drip irrigation",
//       ],
//       communityInsights: [
//         "Farmer John: 'Pruning regularly helps reduce humidity around plants.'",
//         "AgroExpert: 'Copper fungicide worked well in my fields last season.'",
//       ],
//     },
//     aphid_infestation: {
//       name: "Aphid Infestation",
//       severity: "high",
//       description: "Small insects feeding on plant sap",
//       causes: [
//         "Nitrogen-rich fertilizers",
//         "Warm weather",
//         "Lack of predators",
//       ],
//       remedies: [
//         "Use insecticidal soap",
//         "Introduce ladybugs",
//         "Apply neem oil",
//         "Rinse with water spray",
//       ],
//       prevention: [
//         "Avoid over-fertilizing",
//         "Plant marigolds nearby",
//         "Encourage beneficial insects",
//       ],
//       communityInsights: [
//         "Grower Jane: 'Ladybugs cleared my aphid problem in a week!'",
//         "Farmer Mike: 'Neem oil is my go-to for organic control.'",
//       ],
//     },
//     powdery_mildew: {
//       name: "Powdery Mildew",
//       severity: "moderate",
//       description: "White powdery coating on leaves and stems",
//       causes: ["High humidity", "Poor air circulation", "Shade conditions"],
//       remedies: [
//         "Apply baking soda solution",
//         "Use sulfur-based fungicide",
//         "Remove infected parts",
//         "Improve air circulation",
//       ],
//       prevention: [
//         "Choose resistant varieties",
//         "Provide adequate spacing",
//         "Avoid overhead watering",
//       ],
//       communityInsights: [
//         "Grower Sarah: 'Baking soda spray is cheap and effective.'",
//         "AgroTech: 'Resistant varieties saved my crop last year.'",
//       ],
//     },
//     blight: {
//       name: "Blight",
//       severity: "high",
//       description:
//         "Rapid wilting and browning of leaves, stems, and fruits caused by fungal or bacterial pathogens",
//       causes: [
//         "Warm, wet conditions",
//         "Infected plant debris",
//         "Poor crop rotation",
//       ],
//       remedies: [
//         "Remove and destroy affected plant parts",
//         "Apply fungicides like chlorothalonil",
//         "Improve soil drainage",
//         "Rotate crops annually",
//       ],
//       prevention: [
//         "Use disease-free seeds or transplants",
//         "Practice crop rotation",
//         "Ensure good soil drainage",
//         "Avoid overhead irrigation",
//       ],
//       communityInsights: [
//         "Farmer Lisa: 'Crop rotation was key to preventing blight in my tomatoes.'",
//         "Grower Tom: 'Early fungicide application saved my potato crop.'",
//       ],
//     },
//     rust: {
//       name: "Rust",
//       severity: "moderate",
//       description:
//         "Orange or yellowish pustules on leaves caused by fungal spores",
//       causes: ["High humidity", "Warm temperatures", "Dense plantings"],
//       remedies: [
//         "Remove and destroy affected leaves",
//         "Apply fungicides like sulfur or mancozeb",
//         "Improve air circulation around plants",
//         "Water plants in the morning",
//       ],
//       prevention: [
//         "Plant resistant varieties",
//         "Maintain proper plant spacing",
//         "Avoid overhead watering",
//         "Monitor plants regularly for early signs",
//       ],
//       communityInsights: [
//         "AgroPro: 'Sulfur dust worked wonders for rust on my wheat fields.'",
//         "Farmer Emma: 'Spacing my plants better reduced rust significantly.'",
//       ],
//     },
//   };

//   // Mock API analysis (replace with real PlantNet/Google Vision APIs)
//   const analyzeImage = useCallback(async (imageUrl) => {
//     setIsAnalyzing(true);
//     setProgress(0);
//     setError(null);

//     try {
//       for (let i = 0; i <= 100; i += 10) {
//         setProgress(i);
//         await new Promise((resolve) => setTimeout(resolve, 300));
//       }

//       const diseases = Object.keys(diseaseDatabase);
//       const detectedDisease =
//         diseases[Math.floor(Math.random() * diseases.length)];
//       const confidence = 0.85 + Math.random() * 0.1;
//       const plantSpecies = "Unknown Species";

//       return {
//         disease: detectedDisease,
//         confidence,
//         plantSpecies,
//         additionalInfo: { labels: ["plant", "leaf", detectedDisease] },
//       };
//     } catch (err) {
//       setError("Failed to analyze image. Please try again.");
//       throw err;
//     } finally {
//       setIsAnalyzing(false);
//     }
//   }, []);

//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "environment",
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         streamRef.current = stream;
//         setShowCamera(true);
//         setError(null);
//       }
//     } catch (err) {
//       setError("Unable to access camera. Please check permissions.");
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setShowCamera(false);
//   }, []);

//   const capturePhoto = useCallback(() => {
//     if (videoRef.current && canvasRef.current) {
//       const flash = document.getElementById("flash");
//       if (flash) {
//         flash.style.opacity = "0.8";
//         setTimeout(() => (flash.style.opacity = "0"), 100);
//       }

//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       ctx.drawImage(video, 0, 0);

//       canvas.toBlob(
//         (blob) => {
//           const url = URL.createObjectURL(blob);
//           setImage(url);
//           stopCamera();
//         },
//         "image/jpeg",
//         0.9
//       );
//     }
//   }, [stopCamera]);

//   const handleFileUpload = useCallback((event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const url = URL.createObjectURL(file);
//       setImage(url);
//       setError(null);
//     } else {
//       setError("Please upload a valid image file.");
//     }
//   }, []);

//   const handleAnalyze = useCallback(async () => {
//     if (!image) return;

//     setIsAnalyzing(true);
//     setDiagnosis(null);

//     try {
//       const result = await analyzeImage(image);
//       const diseaseInfo = diseaseDatabase[result.disease];

//       setDiagnosis({
//         ...diseaseInfo,
//         confidence: result.confidence,
//         plantSpecies: result.plantSpecies,
//         additionalInfo: result.additionalInfo,
//       });
//     } catch (err) {
//       setError("Analysis failed. Please try again.");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   }, [image, analyzeImage]);

//   const resetDiagnosis = useCallback(() => {
//     setImage(null);
//     setDiagnosis(null);
//     setIsAnalyzing(false);
//     setError(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   }, []);

//   const getSeverityColor = (severity) => {
//     switch (severity) {
//       case "low":
//         return "text-green-600 bg-green-100";
//       case "moderate":
//         return "text-yellow-600 bg-yellow-100";
//       case "high":
//         return "text-red-600 bg-red-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-6">
//         <div className="text-center mb-6">
//           <h1 className="text-2xl font-bold text-green-700">
//             Crop Health Scanner
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Diagnose crop diseases with a photo
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
//             <AlertTriangle className="w-5 h-5" />
//             {error}
//           </div>
//         )}

//         {!showCamera && !image && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <button
//               onClick={startCamera}
//               className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
//             >
//               <Camera className="w-6 h-6" />
//               <span className="font-semibold">Take Photo</span>
//             </button>
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
//             >
//               <Upload className="w-6 h-6" />
//               <span className="font-semibold">Upload Image</span>
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//           </div>
//         )}

//         {showCamera && (
//           <div className="fixed inset-0 bg-black z-50 flex flex-col">
//             <div className="relative flex-1">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 pointer-events-none">
//                 <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg opacity-60"></div>
//                 <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1.5 rounded">
//                   Frame the affected crop
//                 </div>
//                 <button
//                   onClick={stopCamera}
//                   className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
//                 <button
//                   onClick={capturePhoto}
//                   className="bg-white text-green-600 p-4 rounded-full shadow-lg hover:bg-green-50 transition-transform hover:scale-105"
//                 >
//                   <Camera className="w-8 h-8" />
//                 </button>
//               </div>
//               <div
//                 id="flash"
//                 className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
//               ></div>
//             </div>
//           </div>
//         )}

//         {image && (
//           <div className="space-y-4">
//             <div className="relative">
//               <img
//                 src={image}
//                 alt="Crop preview"
//                 className="w-full h-80 object-contain rounded-lg border border-gray-200"
//               />
//               <button
//                 onClick={resetDiagnosis}
//                 className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <button
//               onClick={handleAnalyze}
//               disabled={isAnalyzing}
//               className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isAnalyzing ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Analyzing ({progress}%)
//                 </>
//               ) : (
//                 "Diagnose Crop"
//               )}
//             </button>
//             {isAnalyzing && (
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         )}

//         {diagnosis && (
//           <div className="mt-6 space-y-6">
//             <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-lg border-l-4 border-green-600">
//               <div className="flex items-center gap-3 mb-3">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {diagnosis.name}
//                   </h2>
//                   <div className="flex items-center gap-2 mt-1 text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full font-semibold ${getSeverityColor(
//                         diagnosis.severity
//                       )}`}
//                     >
//                       {diagnosis.severity.toUpperCase()} SEVERITY
//                     </span>
//                     <span className="text-gray-600">
//                       Confidence: {(diagnosis.confidence * 100).toFixed(1)}%
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-600">{diagnosis.description}</p>
//               {diagnosis.plantSpecies && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   Plant: {diagnosis.plantSpecies}
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="bg-orange-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <AlertTriangle className="w-5 h-5 text-orange-600" />
//                   <h3 className="font-semibold text-orange-800">Causes</h3>
//                 </div>
//                 <ul className="space-y-1 text-sm text-orange-700">
//                   {diagnosis.causes.map((cause, index) => (
//                     <li key={index}>• {cause}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <CheckCircle className="w-5 h-5 text-blue-600" />
//                   <h3 className="font-semibold text-blue-800">Treatments</h3>
//                 </div>
//                 <ul className="space-y-1 text-sm text-blue-700">
//                   {diagnosis.remedies.map((remedy, index) => (
//                     <li key={index}>• {remedy}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Info className="w-5 h-5 text-green-600" />
//                   <h3 className="font-semibold text-green-800">Prevention</h3>
//                 </div>
//                 <ul className="space-y-1 text-sm text-green-700">
//                   {diagnosis.prevention.map((tip, index) => (
//                     <li key={index}>• {tip}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="bg-purple-50 p-4 rounded-lg">
//               <div className="flex items-center gap-2 mb-2">
//                 <Users className="w-5 h-5 text-purple-600" />
//                 <h3 className="font-semibold text-purple-800">
//                   Community Insights
//                 </h3>
//               </div>
//               <ul className="space-y-1 text-sm text-purple-700">
//                 {diagnosis.communityInsights.map((insight, index) => (
//                   <li key={index}>• {insight}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="bg-yellow-50 p-4 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                 <div className="text-sm text-yellow-700">
//                   <p className="font-semibold mb-1">Disclaimer</p>
//                   <p>
//                     This is an AI-generated diagnosis. Consult an agricultural
//                     expert for confirmation and professional advice.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <canvas ref={canvasRef} className="hidden" />
//       </div>
//     </div>
//   );
// };

// export default CropDiagnosticTool;

import { useState, useRef, useCallback } from "react";
import {
  Camera,
  Upload,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
  Users,
} from "lucide-react";

const CropDiagnosticTool = () => {
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Mock disease database (replace with backend API in production)
  const diseaseDatabase = {
    leaf_spot: {
      name: "Leaf Spot Disease",
      severity: "moderate",
      description: "Fungal infection causing brown spots on leaves",
      causes: ["High humidity", "Poor air circulation", "Overwatering"],
      remedies: [
        "Remove affected leaves",
        "Apply copper-based fungicide",
        "Improve air circulation",
        "Water at soil level",
      ],
      prevention: [
        "Ensure proper plant spacing",
        "Water in the morning",
        "Use drip irrigation",
      ],
      communityInsights: [
        "Farmer John: 'Pruning regularly helps reduce humidity around plants.'",
        "AgroExpert: 'Copper fungicide worked well in my fields last season.'",
      ],
    },
    aphid_infestation: {
      name: "Aphid Infestation",
      severity: "high",
      description: "Small insects feeding on plant sap",
      causes: [
        "Nitrogen-rich fertilizers",
        "Warm weather",
        "Lack of predators",
      ],
      remedies: [
        "Use insecticidal soap",
        "Introduce ladybugs",
        "Apply neem oil",
        "Rinse with water spray",
      ],
      prevention: [
        "Avoid over-fertilizing",
        "Plant marigolds nearby",
        "Encourage beneficial insects",
      ],
      communityInsights: [
        "Grower Jane: 'Ladybugs cleared my aphid problem in a week!'",
        "Farmer Mike: 'Neem oil is my go-to for organic control.'",
      ],
    },
    powdery_mildew: {
      name: "Powdery Mildew",
      severity: "moderate",
      description: "White powdery coating on leaves and stems",
      causes: ["High humidity", "Poor air circulation", "Shade conditions"],
      remedies: [
        "Apply baking soda solution",
        "Use sulfur-based fungicide",
        "Remove infected parts",
        "Improve air circulation",
      ],
      prevention: [
        "Choose resistant varieties",
        "Provide adequate spacing",
        "Avoid overhead watering",
      ],
      communityInsights: [
        "Grower Sarah: 'Baking soda spray is cheap and effective.'",
        "AgroTech: 'Resistant varieties saved my crop last year.'",
      ],
    },
    blight: {
      name: "Blight",
      severity: "high",
      description:
        "Rapid wilting and browning of leaves, stems, and fruits caused by fungal or bacterial pathogens",
      causes: [
        "Warm, wet conditions",
        "Infected plant debris",
        "Poor crop rotation",
      ],
      remedies: [
        "Remove and destroy affected plant parts",
        "Apply fungicides like chlorothalonil",
        "Improve soil drainage",
        "Rotate crops annually",
      ],
      prevention: [
        "Use disease-free seeds or transplants",
        "Practice crop rotation",
        "Ensure good soil drainage",
        "Avoid overhead irrigation",
      ],
      communityInsights: [
        "Farmer Lisa: 'Crop rotation was key to preventing blight in my tomatoes.'",
        "Grower Tom: 'Early fungicide application saved my potato crop.'",
      ],
    },
    rust: {
      name: "Rust",
      severity: "moderate",
      description:
        "Orange or yellowish pustules on leaves caused by fungal spores",
      causes: ["High humidity", "Warm temperatures", "Dense plantings"],
      remedies: [
        "Remove and destroy affected leaves",
        "Apply fungicides like sulfur or mancozeb",
        "Improve air circulation around plants",
        "Water plants in the morning",
      ],
      prevention: [
        "Plant resistant varieties",
        "Maintain proper plant spacing",
        "Avoid overhead watering",
        "Monitor plants regularly for early signs",
      ],
      communityInsights: [
        "AgroPro: 'Sulfur dust worked wonders for rust on my wheat fields.'",
        "Farmer Emma: 'Spacing my plants better reduced rust significantly.'",
      ],
    },
  };

  // Mock API analysis (replace with real PlantNet/Google Vision APIs)
  const analyzeImage = useCallback(async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const diseases = Object.keys(diseaseDatabase);
      const detectedDisease =
        diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = 0.85 + Math.random() * 0.1;
      const plantSpecies = "Unknown Species";

      return {
        disease: detectedDisease,
        confidence,
        plantSpecies,
        additionalInfo: { labels: ["plant", "leaf", detectedDisease] },
      };
    } catch (error) {
      console.error("Analysis error:", error);
      setError("Failed to analyze image. Please try again.");
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [diseaseDatabase]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
        setError(null);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const flash = document.getElementById("flash");
      if (flash) {
        flash.style.opacity = "0.8";
        setTimeout(() => (flash.style.opacity = "0"), 100);
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          setImage(url);
          stopCamera();
        },
        "image/jpeg",
        0.9
      );
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setError(null);
    } else {
      setError("Please upload a valid image file.");
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setDiagnosis(null);

    try {
      const result = await analyzeImage();
      const diseaseInfo = diseaseDatabase[result.disease];

      setDiagnosis({
        ...diseaseInfo,
        confidence: result.confidence,
        plantSpecies: result.plantSpecies,
        additionalInfo: result.additionalInfo,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [image, analyzeImage]);

  const resetDiagnosis = useCallback(() => {
    setImage(null);
    setDiagnosis(null);
    setIsAnalyzing(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100";
      case "moderate":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-6 mt-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">
            Crop Health Scanner
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Diagnose crop diseases with a photo
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!showCamera && !image && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Camera className="w-6 h-6" />
              <span className="font-semibold">Take Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Upload className="w-6 h-6" />
              <span className="font-semibold">Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="relative flex-1">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border-2 border-white border-dashed rounded-lg opacity-60"></div>
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1.5 rounded">
                  Frame the affected crop
                </div>
                <button
                  onClick={stopCamera}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  className="bg-white text-green-600 p-4 rounded-full shadow-lg hover:bg-green-50 transition-transform hover:scale-105"
                >
                  <Camera className="w-8 h-8" />
                </button>
              </div>
              <div
                id="flash"
                className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
              ></div>
            </div>
          </div>
        )}

        {image && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={image}
                alt="Crop preview"
                className="w-full h-80 object-contain rounded-lg border border-gray-200"
              />
              <button
                onClick={resetDiagnosis}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing ({progress}%)
                </>
              ) : (
                "Diagnose Crop"
              )}
            </button>
            {isAnalyzing && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {diagnosis && (
          <div className="mt-6 space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {diagnosis.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${getSeverityColor(
                        diagnosis.severity
                      )}`}
                    >
                      {diagnosis.severity.toUpperCase()} SEVERITY
                    </span>
                    <span className="text-gray-600">
                      Confidence: {(diagnosis.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{diagnosis.description}</p>
              {diagnosis.plantSpecies && (
                <p className="text-sm text-gray-500 mt-1">
                  Plant: {diagnosis.plantSpecies}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Causes</h3>
                </div>
                <ul className="space-y-1 text-sm text-orange-700">
                  {diagnosis.causes.map((cause, index) => (
                    <li key={index}>• {cause}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Treatments</h3>
                </div>
                <ul className="space-y-1 text-sm text-blue-700">
                  {diagnosis.remedies.map((remedy, index) => (
                    <li key={index}>• {remedy}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Prevention</h3>
                </div>
                <ul className="space-y-1 text-sm text-green-700">
                  {diagnosis.prevention.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">
                  Community Insights
                </h3>
              </div>
              <ul className="space-y-1 text-sm text-purple-700">
                {diagnosis.communityInsights.map((insight, index) => (
                  <li key={index}>• {insight}</li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-semibold mb-1">Disclaimer</p>
                  <p>
                    This is an AI-generated diagnosis. Consult an agricultural
                    expert for confirmation and professional advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CropDiagnosticTool;
