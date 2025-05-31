// import {
//   FaCloudSun,
//   FaCloudRain,
//   FaSnowflake,
//   FaSun,
//   FaCloud,
//   FaThermometerHalf,
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import { useNavigate } from "react-router-dom";

// const weatherIcons = {
//   "Partly Cloudy": <FaCloudSun className="text-yellow-500 text-3xl" />,
//   Rainy: <FaCloudRain className="text-blue-500 text-3xl" />,
//   Snowy: <FaSnowflake className="text-blue-300 text-3xl" />,
//   Sunny: <FaSun className="text-yellow-400 text-3xl" />,
//   Cloudy: <FaCloud className="text-gray-600 text-3xl" />,
// };

// const FiveDaysForecast = () => {
//   const forecastData = [
//     {
//       day: "Day 1",
//       condition: "Partly Cloudy",
//       temp: "28°C",
//       precipitation: "10%",
//       wind: "15 km/h",
//     },
//     {
//       day: "Day 2",
//       condition: "Rainy",
//       temp: "22°C",
//       precipitation: "60%",
//       wind: "10 km/h",
//     },
//     {
//       day: "Day 3",
//       condition: "Sunny",
//       temp: "30°C",
//       precipitation: "5%",
//       wind: "12 km/h",
//     },
//     {
//       day: "Day 4",
//       condition: "Cloudy",
//       temp: "25°C",
//       precipitation: "20%",
//       wind: "18 km/h",
//     },
//     {
//       day: "Day 5",
//       condition: "Rainy",
//       temp: "-30°C",
//       precipitation: "80%",
//       wind: "8 km/h",
//     },
//   ];
//   const navigate = useNavigate();
//   const handleDownload = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("5-Day Weather Forecast", 20, 20);

//     forecastData.forEach((data, index) => {
//       const yPosition = 40 + index * 30;
//       doc.setFontSize(14);
//       doc.text(`${data.day}: ${data.condition}`, 20, yPosition);
//       doc.setFontSize(12);
//       doc.text(`Temperature: ${data.temp}`, 20, yPosition + 10);
//       doc.text(`Precipitation: ${data.precipitation}`, 20, yPosition + 20);
//       doc.text(`Wind: ${data.wind}`, 20, yPosition + 30);
//     });

//     doc.save("5-day-weather-forecast.pdf");
//   };

//   return (
//     <div className="main-content bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex flex-col items-center p-6 sm:p-10 relative">
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate("/")}
//           className="text-teal-500 hover:text-teal-600 flex items-center gap-2 transition-colors mb-6"
//         >
//           <span>←</span>
//           <span className="text-sm font-medium">GO BACK</span>
//         </button>
//         <h1 className="text-blue-900 text-3xl sm:text-4xl font-bold mb-8 text-center">
//           5-Day Weather Forecast
//         </h1>
//         {/* Description Section */}
//         <p className="text-md sm:text-lg text-gray-700 text-center max-w-2xl mb-6">
//           Stay informed about the weather for the next five days, including
//           temperature trends, precipitation chances, and wind forecasts tailored
//           for your region.
//         </p>
//         {/* Download Button */}
//         <button
//           onClick={handleDownload}
//           className="bg-blue-900 text-white px-4 py-2 mb-4 rounded-lg shadow-lg transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           Download
//         </button>
//         {/* Forecast Container */}
//         <div className="forecast-grid grid grid-cols-2 gap-6 w-80% sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
//           {/* Forecast Card for each day */}
//           {forecastData.map((data, index) => (
//             <div
//               key={index}
//               className="forecast-card bg-white shadow-lg rounded-lg p-6 text-center transition-transform transform hover:scale-105"
//             >
//               <h2 className="text-xl font-semibold text-blue-900 mb-1">
//                 {data.day}
//               </h2>

//               <div className="flex items-center justify-center mb-2">
//                 {weatherIcons[data.condition]}
//                 <p className="text-gray-600 ml-2">{data.condition}</p>
//               </div>

//               <div className="flex items-center justify-center mb-1">
//                 <FaThermometerHalf className="text-red-500 text-lg mr-1" />
//                 <p className="text-3xl font-bold text-gray-900">{data.temp}</p>
//               </div>

//               <p className="text-sm text-gray-500">
//                 Precipitation: {data.precipitation}
//               </p>
//               <p className="text-sm text-gray-500">Wind: {data.wind}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FiveDaysForecast;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ghanaGeoJSON from "../assets/ghana-regions.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AgriculturalDistrict = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districtData, setDistrictData] = useState(null);

  const ghanaDistrictsData = {
    "Kumasi Metropolitan": {
      soil: {
        moisture: 70,
        ph: 6.5,
        nutrients: {
          nitrogen: "High",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 5 },
          { day: "Wed", temp: 27, rain: 10 },
        ],
      },
      crops: ["Cocoa", "Plantain", "Maize"],
      recommendations: [
        "Apply organic fertilizer",
        "Monitor black pod disease",
      ],
    },
    "Obuasi Municipal": {
      soil: {
        moisture: 68,
        ph: 6.4,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 27, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 26, rain: 8 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Fertilize soil", "Check pests"],
    },
    "Bekwai Municipal": {
      soil: {
        moisture: 65,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 29, rain: 1 },
          { day: "Tue", temp: 30, rain: 2 },
          { day: "Wed", temp: 28, rain: 5 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Monitor disease"],
    },
    "Mampong Municipal": {
      soil: {
        moisture: 60,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 26, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 25, rain: 10 },
          { day: "Tue", temp: 26, rain: 8 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Tamale Metropolitan": {
      soil: {
        moisture: 55,
        ph: 7.0,
        nutrients: { nitrogen: "Low", phosphorus: "High", potassium: "Medium" },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 34, rain: 0 },
          { day: "Tue", temp: 35, rain: 0 },
          { day: "Wed", temp: 33, rain: 2 },
        ],
      },
      crops: ["Sorghum", "Millet", "Groundnuts"],
      recommendations: ["Conserve water", "Use drought-resistant seeds"],
    },
    "Yendi Municipal": {
      soil: {
        moisture: 50,
        ph: 7.1,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 33, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 1 },
          { day: "Wed", temp: 32, rain: 3 },
        ],
      },
      crops: ["Yam", "Millet"],
      recommendations: ["Irrigate sparingly", "Monitor soil"],
    },
    "Savelugu Municipal": {
      soil: {
        moisture: 52,
        ph: 6.9,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 32, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Groundnuts", "Sorghum"],
      recommendations: ["Water conservation", "Fertilize"],
    },
    "Ho Municipal": {
      soil: {
        moisture: 65,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "Low",
        },
      },
      weather: {
        current: { temp: 26, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 25, rain: 15 },
          { day: "Tue", temp: 26, rain: 10 },
          { day: "Wed", temp: 27, rain: 5 },
        ],
      },
      crops: ["Yam", "Cassava", "Rice"],
      recommendations: ["Improve drainage", "Monitor pests"],
    },
    "Keta Municipal": {
      soil: {
        moisture: 75,
        ph: 6.3,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "Medium" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 12 },
          { day: "Tue", temp: 27, rain: 8 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Coconut", "Fish"],
      recommendations: ["Drainage", "Monitor salinity"],
    },
    "Accra Metropolitan": {
      soil: {
        moisture: 60,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 30, condition: "Humid" },
        forecast: [
          { day: "Mon", temp: 29, rain: 5 },
          { day: "Tue", temp: 30, rain: 3 },
          { day: "Wed", temp: 31, rain: 2 },
        ],
      },
      crops: ["Vegetables", "Maize"],
      recommendations: ["Irrigate", "Pest control"],
    },
    "Tema Metropolitan": {
      soil: {
        moisture: 58,
        ph: 7.0,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 30, rain: 0 },
        ],
      },
      crops: ["Fish", "Vegetables"],
      recommendations: ["Monitor soil", "Fertilize"],
    },
    "Ga West Municipal": {
      soil: {
        moisture: 62,
        ph: 6.8,
        nutrients: { nitrogen: "Medium", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Pineapple", "Maize"],
      recommendations: ["Irrigate", "Check pests"],
    },
    "Cape Coast Metropolitan": {
      soil: {
        moisture: 70,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 10 },
          { day: "Tue", temp: 27, rain: 7 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Fish", "Cassava"],
      recommendations: ["Drainage", "Fertilize"],
    },
    "Winneba (Effutu Municipal)": {
      soil: {
        moisture: 68,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Humid" },
        forecast: [
          { day: "Mon", temp: 27, rain: 6 },
          { day: "Tue", temp: 28, rain: 5 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Fish", "Yam"],
      recommendations: ["Monitor moisture", "Pest control"],
    },
    "Sekondi-Takoradi Metropolitan": {
      soil: {
        moisture: 72,
        ph: 6.4,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "Medium" },
      },
      weather: {
        current: { temp: 29, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 28, rain: 8 },
          { day: "Tue", temp: 29, rain: 6 },
          { day: "Wed", temp: 30, rain: 3 },
        ],
      },
      crops: ["Coconut", "Oil Palm"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Tarkwa Nsuaem Municipal": {
      soil: {
        moisture: 66,
        ph: 6.7,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Rubber"],
      recommendations: ["Monitor soil", "Fertilize"],
    },
    "Bolgatanga Municipal": {
      soil: {
        moisture: 50,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 35, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 34, rain: 0 },
          { day: "Tue", temp: 35, rain: 0 },
          { day: "Wed", temp: 33, rain: 1 },
        ],
      },
      crops: ["Millet", "Shea"],
      recommendations: ["Conserve water", "Monitor drought"],
    },
    "Bawku Municipal": {
      soil: {
        moisture: 48,
        ph: 7.3,
        nutrients: { nitrogen: "Low", phosphorus: "High", potassium: "Medium" },
      },
      weather: {
        current: { temp: 36, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 35, rain: 0 },
          { day: "Tue", temp: 36, rain: 0 },
          { day: "Wed", temp: 34, rain: 2 },
        ],
      },
      crops: ["Sorghum", "Groundnuts"],
      recommendations: ["Irrigate sparingly", "Fertilize"],
    },
    "Wa Municipal": {
      soil: {
        moisture: 53,
        ph: 7.1,
        nutrients: { nitrogen: "Medium", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 33, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Millet"],
      recommendations: ["Conserve water", "Monitor soil"],
    },
    "Nandom Municipal": {
      soil: {
        moisture: 51,
        ph: 7.0,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 32, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 31, rain: 0 },
          { day: "Tue", temp: 32, rain: 0 },
          { day: "Wed", temp: 30, rain: 2 },
        ],
      },
      crops: ["Maize", "Shea"],
      recommendations: ["Irrigate", "Fertilize"],
    },
    "Adansi North": {
      soil: {
        moisture: 67,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Monitor pests"],
    },
    "Adansi South": {
      soil: {
        moisture: 66,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Check disease"],
    },
    "Afigya Kwabre North": {
      soil: {
        moisture: 64,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Monitor soil"],
    },
    "Afigya Kwabre South": {
      soil: {
        moisture: 63,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Ahafo Ano North": {
      soil: {
        moisture: 69,
        ph: 6.4,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Ahafo Ano South East": {
      soil: {
        moisture: 68,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Ahafo Ano South West": {
      soil: {
        moisture: 67,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    "Asante Akim Central": {
      soil: {
        moisture: 66,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Asante Akim North": {
      soil: {
        moisture: 65,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Asante Akim South": {
      soil: {
        moisture: 64,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Atwima Kwanwoma": {
      soil: {
        moisture: 63,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Atwima Mponua": {
      soil: {
        moisture: 62,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Atwima Nwabiagya North": {
      soil: {
        moisture: 61,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },

      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Atwima Nwabiagya South": {
      soil: {
        moisture: 60,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    Bosomtwe: {
      soil: {
        moisture: 59,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    "Ejisu Municipal": {
      soil: {
        moisture: 58,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Ejura Sekyedumase": {
      soil: {
        moisture: 57,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Juaben Municipal": {
      soil: {
        moisture: 56,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Kwabre East": {
      soil: {
        moisture: 55,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Offinso Municipal": {
      soil: {
        moisture: 54,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Offinso North": {
      soil: {
        moisture: 53,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Sekyere Afram Plains": {
      soil: {
        moisture: 52,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Sekyere Central": {
      soil: {
        moisture: 51,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    "Sekyere East": {
      soil: {
        moisture: 50,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Sekyere Kumawu": {
      soil: {
        moisture: 49,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Sekyere South": {
      soil: {
        moisture: 48,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    Banda: {
      soil: {
        moisture: 47,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Berekum East": {
      soil: {
        moisture: 46,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Berekum West": {
      soil: {
        moisture: 45,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Dormaa Central": {
      soil: {
        moisture: 44,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Dormaa East": {
      soil: {
        moisture: 43,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    "Dormaa West": {
      soil: {
        moisture: 42,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Jaman North": {
      soil: {
        moisture: 41,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Jaman South": {
      soil: {
        moisture: 40,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Sunyani Municipal": {
      soil: {
        moisture: 39,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Sunyani West": {
      soil: {
        moisture: 38,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    Tain: {
      soil: {
        moisture: 37,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Wenchi Municipal": {
      soil: {
        moisture: 36,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Techiman Municipal": {
      soil: {
        moisture: 35,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    "Techiman North": {
      soil: {
        moisture: 34,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Asunafo North": {
      soil: {
        moisture: 33,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Asunafo South": {
      soil: {
        moisture: 32,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Asutifi North": {
      soil: {
        moisture: 31,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Asutifi South": {
      soil: {
        moisture: 30,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Tano North": {
      soil: {
        moisture: 29,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Tano South": {
      soil: {
        moisture: 28,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Atebubu-Amantin": {
      soil: {
        moisture: 27,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    "Kintampo North": {
      soil: {
        moisture: 26,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Kintampo South": {
      soil: {
        moisture: 25,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Nkoranza North": {
      soil: {
        moisture: 24,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Nkoranza South": {
      soil: {
        moisture: 23,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Pru East": {
      soil: {
        moisture: 22,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Pru West": {
      soil: {
        moisture: 21,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Sene East": {
      soil: {
        moisture: 20,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Sene West": {
      soil: {
        moisture: 19,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    Biakoye: {
      soil: {
        moisture: 18,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    Jasikan: {
      soil: {
        moisture: 17,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    Kadjebi: {
      soil: {
        moisture: 16,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Krachi East": {
      soil: {
        moisture: 15,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Krachi Nchumuru": {
      soil: {
        moisture: 14,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Krachi West": {
      soil: {
        moisture: 13,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Nkwanta North": {
      soil: {
        moisture: 12,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Nkwanta South": {
      soil: {
        moisture: 11,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check pests"],
    },
    Adaklu: {
      soil: {
        moisture: 10,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Afadzato South": {
      soil: {
        moisture: 9,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Agotime Ziope": {
      soil: {
        moisture: 8,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Akatsi North": {
      soil: {
        moisture: 7,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Akatsi South": {
      soil: {
        moisture: 6,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    Anloga: {
      soil: {
        moisture: 5,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Coconut", "Fish"],
      recommendations: ["Drain excess water", "Monitor salinity"],
    },
    "Central Tongu": {
      soil: {
        moisture: 4,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Rice", "Cassava"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Hohoe Municipal": {
      soil: {
        moisture: 3,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Ketu North": {
      soil: {
        moisture: 2,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Ketu South": {
      soil: {
        moisture: 1,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Coconut", "Fish"],
      recommendations: ["Drain excess water", "Monitor salinity"],
    },
    "Kpando Municipal": {
      soil: {
        moisture: 70,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Rice", "Cassava"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "North Dayi": {
      soil: {
        moisture: 69,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "North Tongu": {
      soil: {
        moisture: 68,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "South Dayi": {
      soil: {
        moisture: 67,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "South Tongu": {
      soil: {
        moisture: 66,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Rice", "Cassava"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Abura Asebu Kwamankese": {
      soil: {
        moisture: 65,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Agona East": {
      soil: {
        moisture: 64,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Agona West": {
      soil: {
        moisture: 63,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Ajumako Enyan Essiam": {
      soil: {
        moisture: 62,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Rice", "Cassava"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Asikuma Odoben Brakwa": {
      soil: {
        moisture: 61,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Awutu Senya East": {
      soil: {
        moisture: 60,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Plantain", "Rice"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Awutu Senya West": {
      soil: {
        moisture: 59,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Komenda Edina Eguafo Abirem": {
      soil: {
        moisture: 58,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Fish", "Cassava"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    Mfantseman: {
      soil: {
        moisture: 57,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Fish", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Upper Denkyira East": {
      soil: {
        moisture: 56,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Upper Denkyira West": {
      soil: {
        moisture: 55,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Twifo Atti Morkwa": {
      soil: {
        moisture: 54,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Twifo Hemang Lower Denkyira": {
      soil: {
        moisture: 53,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    Akyemansa: {
      soil: {
        moisture: 52,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    Asuogyaman: {
      soil: {
        moisture: 51,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Atiwa East": {
      soil: {
        moisture: 50,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Atiwa West": {
      soil: {
        moisture: 49,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Yam"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Birim Central": {
      soil: {
        moisture: 48,
        ph: 6.5,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 5 },
          { day: "Tue", temp: 28, rain: 4 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Oil Palm"],
      recommendations: ["Fertilize with potassium", "Monitor pests"],
    },
    "Birim North": {
      soil: {
        moisture: 47,
        ph: 6.6,
        nutrients: {
          nitrogen: "High",
          phosphorus: "Medium",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Apply fertilizer"],
    },
    "Birim South": {
      soil: {
        moisture: 46,
        ph: 6.7,
        nutrients: { nitrogen: "Medium", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Plantain"],
      recommendations: ["Irrigate lightly", "Check soil nutrients"],
    },
    Denkyembour: {
      soil: {
        moisture: 45,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Cocoa", "Yam"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "East Akim": {
      soil: {
        moisture: 44,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Pest control"],
    },
    "Fanteakwa North": {
      soil: {
        moisture: 43,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Plantain"],
      recommendations: ["Irrigate lightly", "Monitor soil"],
    },
    "Fanteakwa South": {
      soil: {
        moisture: 42,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Yam"],
      recommendations: ["Fertilize", "Check pests"],
    },
    Kwaebibirem: {
      soil: {
        moisture: 41,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Oil Palm"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Kwahu Afram Plains North": {
      soil: {
        moisture: 40,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Yam", "Maize"],
      recommendations: ["Irrigate lightly", "Monitor disease"],
    },
    "Kwahu Afram Plains South": {
      soil: {
        moisture: 39,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Cassava", "Rice"],
      recommendations: ["Fertilize", "Check soil"],
    },
    "Kwahu East": {
      soil: {
        moisture: 38,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Yam", "Plantain"],
      recommendations: ["Drain excess water", "Pest control"],
    },
    "Kwahu South": {
      soil: {
        moisture: 37,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Maize", "Cassava"],
      recommendations: ["Irrigate lightly", "Fertilize"],
    },
    "Kwahu West": {
      soil: {
        moisture: 36,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    "Lower Manya Krobo": {
      soil: {
        moisture: 35,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Mango", "Cassava"],
      recommendations: ["Drain excess water", "Check disease"],
    },
    "New Juaben North": {
      soil: {
        moisture: 34,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Maize", "Plantain"],
      recommendations: ["Irrigate lightly", "Fertilize"],
    },
    "New Juaben South": {
      soil: {
        moisture: 33,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Cocoa", "Yam"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    Suhum: {
      soil: {
        moisture: 32,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cassava", "Plantain"],
      recommendations: ["Drain excess water", "Pest control"],
    },
    "Upper Manya Krobo": {
      soil: {
        moisture: 31,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 4 },
        ],
      },
      crops: ["Mango", "Maize"],
      recommendations: ["Irrigate lightly", "Fertilize"],
    },
    "West Akim": {
      soil: {
        moisture: 30,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Fertilize", "Monitor disease"],
    },
    "Yilo Krobo": {
      soil: {
        moisture: 29,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 8 },
          { day: "Tue", temp: 27, rain: 6 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Mango", "Yam"],
      recommendations: ["Drain excess water", "Check pests"],
    },
    "Ada East": {
      soil: {
        moisture: 28,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Fish", "Vegetables"],
      recommendations: ["Monitor salinity", "Fertilize"],
    },
    "Ada West": {
      soil: {
        moisture: 27,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Fish", "Cassava"],
      recommendations: ["Irrigate lightly", "Check soil"],
    },
    Ashaiman: {
      soil: {
        moisture: 26,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 30, condition: "Humid" },
        forecast: [
          { day: "Mon", temp: 29, rain: 4 },
          { day: "Tue", temp: 30, rain: 3 },
          { day: "Wed", temp: 28, rain: 2 },
        ],
      },
      crops: ["Vegetables", "Maize"],
      recommendations: ["Fertilize", "Pest control"],
    },
    "Ga Central": {
      soil: {
        moisture: 25,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Pineapple", "Vegetables"],
      recommendations: ["Irrigate lightly", "Monitor disease"],
    },
    "Ga East": {
      soil: {
        moisture: 24,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Maize", "Cassava"],
      recommendations: ["Fertilize", "Check pests"],
    },
    "Ga South": {
      soil: {
        moisture: 23,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Fish", "Vegetables"],
      recommendations: ["Drain excess water", "Monitor salinity"],
    },
    "Kpone Katamanso": {
      soil: {
        moisture: 22,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Fish", "Maize"],
      recommendations: ["Irrigate lightly", "Fertilize"],
    },
    "La Dade Kotopon": {
      soil: {
        moisture: 21,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 30, condition: "Humid" },
        forecast: [
          { day: "Mon", temp: 29, rain: 3 },
          { day: "Tue", temp: 30, rain: 2 },
          { day: "Wed", temp: 28, rain: 1 },
        ],
      },
      crops: ["Vegetables", "Fish"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "La Nkwantanang Madina": {
      soil: {
        moisture: 20,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 4 },
          { day: "Tue", temp: 28, rain: 3 },
          { day: "Wed", temp: 29, rain: 2 },
        ],
      },
      crops: ["Pineapple", "Maize"],
      recommendations: ["Fertilize", "Pest control"],
    },
    Ledzokuku: {
      soil: {
        moisture: 19,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Fish", "Vegetables"],
      recommendations: ["Irrigate lightly", "Check salinity"],
    },
    "Ningo Prampram": {
      soil: {
        moisture: 18,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Partly Cloudy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 3 },
          { day: "Tue", temp: 28, rain: 2 },
          { day: "Wed", temp: 29, rain: 1 },
        ],
      },
      crops: ["Fish", "Cassava"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    "Shai Osudoku": {
      soil: {
        moisture: 17,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 27, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 7 },
          { day: "Tue", temp: 27, rain: 5 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Mango", "Vegetables"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Ahanta West": {
      soil: {
        moisture: 16,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Coconut", "Oil Palm"],
      recommendations: ["Irrigate lightly", "Monitor pests"],
    },
    "Amenfi Central": {
      soil: {
        moisture: 15,
        ph: 6.8,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 28, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 8 },
          { day: "Tue", temp: 28, rain: 6 },
          { day: "Wed", temp: 29, rain: 4 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Amenfi East": {
      soil: {
        moisture: 14,
        ph: 6.9,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 27, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 5 },
          { day: "Tue", temp: 27, rain: 4 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Check disease"],
    },
    "Amenfi West": {
      soil: {
        moisture: 13,
        ph: 6.5,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Yam"],
      recommendations: ["Irrigate lightly", "Monitor soil"],
    },
    Ellembelle: {
      soil: {
        moisture: 12,
        ph: 6.6,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 28, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 7 },
          { day: "Tue", temp: 28, rain: 5 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Coconut", "Rubber"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    Jomoro: {
      soil: {
        moisture: 11,
        ph: 6.7,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 27, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 6 },
          { day: "Tue", temp: 27, rain: 4 },
          { day: "Wed", temp: 28, rain: 2 },
        ],
      },
      crops: ["Coconut", "Oil Palm"],
      recommendations: ["Fertilize", "Monitor pests"],
    },
    Mpohor: {
      soil: {
        moisture: 10,
        ph: 6.8,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 1 },
          { day: "Tue", temp: 29, rain: 2 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Irrigate lightly", "Check disease"],
    },
    "Nzema East": {
      soil: {
        moisture: 9,
        ph: 6.9,
        nutrients: { nitrogen: "High", phosphorus: "Medium", potassium: "Low" },
      },
      weather: {
        current: { temp: 28, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 8 },
          { day: "Tue", temp: 28, rain: 6 },
          { day: "Wed", temp: 29, rain: 4 },
        ],
      },
      crops: ["Coconut", "Rubber"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    "Prestea-Huni Valley": {
      soil: {
        moisture: 8,
        ph: 6.5,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "High",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 27, condition: "Cloudy" },
        forecast: [
          { day: "Mon", temp: 26, rain: 5 },
          { day: "Tue", temp: 27, rain: 4 },
          { day: "Wed", temp: 28, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Plantain"],
      recommendations: ["Fertilize", "Monitor soil"],
    },
    Shama: {
      soil: {
        moisture: 7,
        ph: 6.6,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 29, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 28, rain: 2 },
          { day: "Tue", temp: 29, rain: 1 },
          { day: "Wed", temp: 27, rain: 3 },
        ],
      },
      crops: ["Fish", "Coconut"],
      recommendations: ["Irrigate lightly", "Check salinity"],
    },
    "Wassa East": {
      soil: {
        moisture: 6,
        ph: 6.7,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 28, condition: "Rainy" },
        forecast: [
          { day: "Mon", temp: 27, rain: 7 },
          { day: "Tue", temp: 28, rain: 5 },
          { day: "Wed", temp: 29, rain: 3 },
        ],
      },
      crops: ["Cocoa", "Cassava"],
      recommendations: ["Drain excess water", "Fertilize"],
    },
    Bongo: {
      soil: {
        moisture: 5,
        ph: 7.0,
        nutrients: { nitrogen: "Low", phosphorus: "High", potassium: "Medium" },
      },
      weather: {
        current: { temp: 34, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 1 },
        ],
      },
      crops: ["Millet", "Groundnuts"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Builsa North": {
      soil: {
        moisture: 4,
        ph: 7.1,
        nutrients: { nitrogen: "Medium", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 35, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 34, rain: 0 },
          { day: "Tue", temp: 35, rain: 0 },
          { day: "Wed", temp: 33, rain: 2 },
        ],
      },
      crops: ["Sorghum", "Shea"],
      recommendations: ["Irrigate sparingly", "Monitor drought"],
    },
    "Builsa South": {
      soil: {
        moisture: 3,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 34, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 1 },
        ],
      },
      crops: ["Millet", "Groundnuts"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Garui Tempane": {
      soil: {
        moisture: 2,
        ph: 7.3,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 35, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 34, rain: 0 },
          { day: "Tue", temp: 35, rain: 0 },
          { day: "Wed", temp: 33, rain: 2 },
        ],
      },
      crops: ["Sorghum", "Yam"],
      recommendations: ["Irrigate sparingly", "Check soil"],
    },
    "Kassena Nankana East": {
      soil: {
        moisture: 1,
        ph: 7.0,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 34, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 1 },
        ],
      },
      crops: ["Millet", "Shea"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Kassena Nankana West": {
      soil: {
        moisture: 50,
        ph: 7.1,
        nutrients: { nitrogen: "Medium", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 35, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 34, rain: 0 },
          { day: "Tue", temp: 35, rain: 0 },
          { day: "Wed", temp: 33, rain: 2 },
        ],
      },
      crops: ["Groundnuts", "Sorghum"],
      recommendations: ["Irrigate sparingly", "Monitor drought"],
    },
    "Daffiama Bussie Issa": {
      soil: {
        moisture: 49,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "High", potassium: "Medium" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Millet"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    Jirapa: {
      soil: {
        moisture: 48,
        ph: 7.0,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Maize", "Shea"],
      recommendations: ["Irrigate sparingly", "Check soil"],
    },
    "Lambussie Karni": {
      soil: {
        moisture: 47,
        ph: 7.1,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "Medium" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Groundnuts", "Sorghum"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    Lawra: {
      soil: {
        moisture: 46,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Yam", "Millet"],
      recommendations: ["Irrigate sparingly", "Monitor drought"],
    },
    "Sissala East": {
      soil: {
        moisture: 45,
        ph: 7.0,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 35, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 34, rain: 0 },
          { day: "Tue", temp: 35, rain: 0 },
          { day: "Wed", temp: 33, rain: 1 },
        ],
      },
      crops: ["Maize", "Shea"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Sissala West": {
      soil: {
        moisture: 44,
        ph: 7.1,
        nutrients: {
          nitrogen: "High",
          phosphorus: "Medium",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Groundnuts", "Sorghum"],
      recommendations: ["Irrigate sparingly", "Check soil"],
    },
    "Wa East": {
      soil: {
        moisture: 43,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Millet"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Wa West": {
      soil: {
        moisture: 42,
        ph: 7.0,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Maize", "Shea"],
      recommendations: ["Irrigate sparingly", "Monitor drought"],
    },
    Gushegu: {
      soil: {
        moisture: 41,
        ph: 7.1,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "Medium" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Groundnuts"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    Karaga: {
      soil: {
        moisture: 40,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Millet", "Sorghum"],
      recommendations: ["Irrigate sparingly", "Check soil"],
    },
    Kpandai: {
      soil: {
        moisture: 39,
        ph: 7.0,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Maize"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    Mion: {
      soil: {
        moisture: 38,
        ph: 7.1,
        nutrients: {
          nitrogen: "High",
          phosphorus: "Medium",
          potassium: "Medium",
        },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Groundnuts", "Sorghum"],
      recommendations: ["Irrigate sparingly", "Monitor drought"],
    },
    "Nanumba North": {
      soil: {
        moisture: 37,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Low", potassium: "High" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Millet"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Nanumba South": {
      soil: {
        moisture: 36,
        ph: 7.0,
        nutrients: {
          nitrogen: "Medium",
          phosphorus: "Medium",
          potassium: "High",
        },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Maize", "Groundnuts"],
      recommendations: ["Irrigate sparingly", "Check soil"],
    },
    Saboba: {
      soil: {
        moisture: 35,
        ph: 7.1,
        nutrients: { nitrogen: "High", phosphorus: "Low", potassium: "Medium" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Sorghum"],
      recommendations: ["Conserve water", "Fertilize"],
    },
    "Tatale Sanguli": {
      soil: {
        moisture: 34,
        ph: 7.2,
        nutrients: { nitrogen: "Low", phosphorus: "Medium", potassium: "High" },
      },
      weather: {
        current: { temp: 34, condition: "Sunny" },
        forecast: [
          { day: "Mon", temp: 33, rain: 0 },
          { day: "Tue", temp: 34, rain: 0 },
          { day: "Wed", temp: 32, rain: 2 },
        ],
      },
      crops: ["Millet", "Groundnuts"],
      recommendations: ["Irrigate sparingly", "Monitor drought"],
    },
    Zabzugu: {
      soil: {
        moisture: 33,
        ph: 7.0,
        nutrients: { nitrogen: "Medium", phosphorus: "High", potassium: "Low" },
      },
      weather: {
        current: { temp: 33, condition: "Dry" },
        forecast: [
          { day: "Mon", temp: 32, rain: 0 },
          { day: "Tue", temp: 33, rain: 0 },
          { day: "Wed", temp: 31, rain: 1 },
        ],
      },
      crops: ["Yam", "Maize"],
      recommendations: ["Conserve water", "Fertilize"],
    },
  };

  useEffect(() => {
    setDistrictData(ghanaDistrictsData[selectedDistrict]);
  }, [selectedDistrict, ghanaDistrictsData]);

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: feature.properties.radius / 1000,
      fillColor:
        feature.properties.name === selectedDistrict ? "#10B981" : "#D1D5DB",
      color: "#374151",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    });
  };

  const onDistrictClick = (feature, layer) => {
    const districtName = feature.properties.name;
    setSelectedDistrict(districtName);
    const districtData = ghanaDistrictsData[districtName] || {
      weather: { current: { temp: "N/A", condition: "Unknown" } },
      soil: { moisture: "N/A" },
      recommendations: ["No data available"],
    };

    layer
      .bindPopup(
        `<div>
        <h3>${districtName} Agromet Advisory</h3>
        <p><strong>Current Weather:</strong> ${
          districtData.weather.current.temp
        }°C, ${districtData.weather.current.condition}</p>
        <p><strong>Soil Moisture:</strong> ${districtData.soil.moisture}%</p>
        <p><strong>Recommendations:</strong> ${districtData.recommendations.join(
          ", "
        )}</p>
      </div>`
      )
      .openPopup();

    layer.setStyle({ fillColor: "#10B981", weight: 2 });
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => onDistrictClick(feature, layer),
      mouseover: () => layer.setStyle({ fillColor: "#3B82F6" }),
      mouseout: () =>
        layer.setStyle({
          fillColor:
            feature.properties.name === selectedDistrict
              ? "#10B981"
              : "#D1D5DB",
        }),
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Ghana Agricultural District Analysis
      </h2>
      <div className="rounded-lg p-4 mb-6 bg-white shadow w-full max-w-full">
        <MapContainer
          center={[7.9465, -1.0232]}
          zoom={7.4}
          style={{ height: "calc(100vh - 200px)", width: "100%" }}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={ghanaGeoJSON}
            pointToLayer={pointToLayer}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
        <p className="text-sm text-gray-600 text-center mt-2">
          Click a district for agromet advisory
        </p>
      </div>
      {districtData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-lg border border-green-200">
              <h3 className="font-semibold text-xl text-green-700 mb-2">
                🌱 Soil Analysis
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Moisture:</span>
                <div className="w-28 h-3 bg-gray-300 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${districtData.soil.moisture}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-800 mt-2">
                pH Level:{" "}
                <span className="font-semibold">{districtData.soil.ph}</span>
              </p>
              <h4 className="font-medium mt-3 text-gray-700">Nutrients:</h4>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(districtData.soil.nutrients).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="text-center p-3 bg-green-100 rounded-md"
                    >
                      <div className="text-sm font-medium">{key}</div>
                      <div className="font-bold">{value}</div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-lg border border-blue-200">
              <h3 className="font-semibold text-xl text-blue-700 mb-2">
                🌤️ Weather Overview
              </h3>
              <p className="text-3xl font-bold">
                {districtData.weather.current.temp}°C
              </p>
              <p className="text-gray-600">
                {districtData.weather.current.condition}
              </p>
              <div className="h-36 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={districtData.weather.forecast}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="rain"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-yellow-100 p-5 rounded-lg shadow">
              <h3 className="font-semibold text-xl text-yellow-800">
                🌾 Recommended Crops
              </h3>
              {districtData.crops.map((crop, index) => (
                <p
                  key={index}
                  className="flex items-center bg-white p-2 rounded mt-2 shadow-sm"
                >
                  ✅ {crop}
                </p>
              ))}
            </div>
            <div className="bg-blue-100 p-5 rounded-lg shadow">
              <h3 className="font-semibold text-xl text-blue-800">
                📌 Farming Advisory
              </h3>
              {districtData.recommendations.map((action, index) => (
                <p
                  key={index}
                  className="flex items-center bg-white p-2 rounded mt-2 shadow-sm"
                >
                  🏷 {action}
                </p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p className="text-center py-8 text-gray-500">
          Loading {selectedDistrict} District data...
        </p>
      )}
    </div>
  );
};

export default AgriculturalDistrict;
