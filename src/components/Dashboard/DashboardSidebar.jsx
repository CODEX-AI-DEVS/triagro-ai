// import React, { useState } from "react";
// import {
//   FaTachometerAlt,
//   FaBell,
//   FaCloudSun,
//   FaNewspaper,
//   FaChevronDown,
//   FaChevronRight,
//   FaWater,
//   FaCalendarAlt,
//   FaChartLine,
// } from "react-icons/fa";
// import PropTypes from "prop-types";

// const Sidebar = ({ activePage, onNavigate }) => {
//   const [weatherExpanded, setWeatherExpanded] = useState(false);

//   const toggleWeather = () => {
//     setWeatherExpanded(!weatherExpanded);
//   };

//   return (
//     <div className="h-screen w-64 bg-green-800 text-white flex flex-col fixed left-0 top-0 shadow-lg">
//       <div className="p-4 border-b border-green-700">
//         <h1 className="text-xl font-bold">AgroPulse</h1>
//       </div>

//       <nav className="flex-1 overflow-y-auto py-4">
//         <ul className="space-y-2 px-2">
//           {/* Dashboard */}
//           <li>
//             <button
//               onClick={() => onNavigate("dashboard")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "dashboard"
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <FaTachometerAlt className="mr-3" />
//               <span>Dashboard</span>
//             </button>
//           </li>

//           {/* Emergency Alert */}
//           <li>
//             <button
//               onClick={() => onNavigate("emergency")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "emergency"
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <FaBell className="mr-3" />
//               <span>Emergency Alert</span>
//             </button>
//           </li>

//           {/* Weather with Subcategories */}
//           <li>
//             <button
//               onClick={toggleWeather}
//               className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
//                 activePage.startsWith("weather")
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <div className="flex items-center">
//                 <FaCloudSun className="mr-3" />
//                 <span>Weather</span>
//               </div>
//               {weatherExpanded ? (
//                 <FaChevronDown className="ml-2" />
//               ) : (
//                 <FaChevronRight className="ml-2" />
//               )}
//             </button>

//             {weatherExpanded && (
//               <ul className="ml-4 mt-2 space-y-1">
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-general")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-general"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>General Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-agro")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-agro"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Agromet Bulletins</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-flood")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-flood"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Flood & Drought Bulletins</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-subseasonal")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-subseasonal"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>S2S Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-monthly")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-monthly"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Monthly Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-seasonal")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-seasonal"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Seasonal Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-climate")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-climate"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>State of the Climate Report</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-audio")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-audio"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Audio Visual Forecast</span>
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* News */}
//           <li>
//             <button
//               onClick={() => onNavigate("news")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "news" ? "bg-green-700" : "hover:bg-green-700"
//               }`}
//             >
//               <FaNewspaper className="mr-3" />
//               <span>News</span>
//             </button>
//           </li>
//         </ul>
//       </nav>

//       <div className="p-4 border-t border-green-700 text-xs text-center">
//         <p>© 2025 AgroClimate</p>
//         <p>DeepDive Team</p>
//       </div>
//     </div>
//   );
// };

// Sidebar.propTypes = {
//   activePage: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// export default Sidebar;

// import React, { useState } from "react";
// import {
//   FaTachometerAlt,
//   FaBell,
//   FaCloudSun,
//   FaNewspaper,
//   FaChevronDown,
//   FaChevronRight,
//   FaWater,
//   FaCalendarAlt,
//   FaChartLine,
// } from "react-icons/fa";
// import PropTypes from "prop-types";

// const Sidebar = ({ activePage, onNavigate }) => {
//   const [weatherExpanded, setWeatherExpanded] = useState(false);
//   const [productionExpanded, setProductionExpanded] = useState(false);

//   const toggleWeather = () => {
//     setWeatherExpanded(!weatherExpanded);
//   };

//   const toggleProduction = () => {
//     setProductionExpanded(!productionExpanded);
//   };

//   return (
//     <div className="h-screen w-64 bg-green-800 text-white flex flex-col fixed left-0 top-0 shadow-lg">
//       <div className="p-4 border-b border-green-700">
//         <h1 className="text-xl font-bold">AgroPulse</h1>
//       </div>

//       <nav className="flex-1 overflow-y-auto py-4">
//         <ul className="space-y-2 px-2">
//           {/* Dashboard */}
//           <li>
//             <button
//               onClick={() => onNavigate("dashboard")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "dashboard"
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <FaTachometerAlt className="mr-3" />
//               <span>Dashboard</span>
//             </button>
//           </li>

//           {/* Emergency Alert */}
//           <li>
//             <button
//               onClick={() => onNavigate("emergency")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "emergency"
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <FaBell className="mr-3" />
//               <span>Emergency Alert</span>
//             </button>
//           </li>

//           {/* Weather with Subcategories */}
//           <li>
//             <button
//               onClick={toggleWeather}
//               className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
//                 activePage.startsWith("weather")
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <div className="flex items-center">
//                 <FaCloudSun className="mr-3" />
//                 <span>Weather</span>
//               </div>
//               {weatherExpanded ? (
//                 <FaChevronDown className="ml-2" />
//               ) : (
//                 <FaChevronRight className="ml-2" />
//               )}
//             </button>

//             {weatherExpanded && (
//               <ul className="ml-4 mt-2 space-y-1">
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-general")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-general"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>General Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-agro")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-agro"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Agromet Bulletins</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-flood")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-flood"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Flood & Drought Bulletins</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-subseasonal")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-subseasonal"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>S2S Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-monthly")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-monthly"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Monthly Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-seasonal")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-seasonal"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Seasonal Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-climate")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-climate"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>State of the Climate Report</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("weather-audio")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-audio"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Audio Visual Forecast</span>
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Production Calendars with Subcategories */}
//           <li>
//             <button
//               onClick={toggleProduction}
//               className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
//                 activePage.startsWith("production")
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <div className="flex items-center">
//                 <FaCalendarAlt className="mr-3" />
//                 <span>Production Calendars</span>
//               </div>
//               {productionExpanded ? (
//                 <FaChevronDown className="ml-2" />
//               ) : (
//                 <FaChevronRight className="ml-2" />
//               )}
//             </button>

//             {productionExpanded && (
//               <ul className="ml-4 mt-2 space-y-1">
//                 <li>
//                   <button
//                     onClick={() => onNavigate("production-provisional")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-provisional"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Provisional</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("production-2024-minor")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-2024-minor"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>2024 Minor Season</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("production-2025-major")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-2025-major"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>2025 Major Season</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("production-2024-minor")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-2024-minor"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>2024 Minor Season</span>
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* News */}
//           <li>
//             <button
//               onClick={() => onNavigate("news")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "news" ? "bg-green-700" : "hover:bg-green-700"
//               }`}
//             >
//               <FaNewspaper className="mr-3" />
//               <span>News</span>
//             </button>
//           </li>
//         </ul>
//       </nav>

//       <div className="p-4 border-t border-green-700 text-xs text-center">
//         <p>© 2025 AgroClimate</p>
//         <p>DeepDive Team</p>
//       </div>
//     </div>
//   );
// };

// Sidebar.propTypes = {
//   activePage: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// export default Sidebar;

// import { useState } from "react";
// import {
//   FaTachometerAlt,
//   FaBell,
//   FaCloudSun,
//   FaNewspaper,
//   FaChevronDown,
//   FaChevronRight,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import PropTypes from "prop-types";
// import { districtOfGhana } from "../districts";

// const Sidebar = ({ activePage, onNavigate }) => {
//   const [weatherExpanded, setWeatherExpanded] = useState(false);
//   const [productionExpanded, setProductionExpanded] = useState(false);
//   const navigate = useNavigate(); // Use navigate hook

//   const toggleWeather = () => {
//     setWeatherExpanded(!weatherExpanded);
//   };

//   const toggleProduction = () => {
//     setProductionExpanded(!productionExpanded);
//   };

//   return (
//     <div className="h-screen w-64 bg-green-800 text-white flex flex-col fixed left-0 top-0 shadow-lg">
//       <div className="p-4 border-b border-green-700">
//         <h1 className="text-xl font-bold">AgroPulse</h1>
//       </div>

//       <nav className="flex-1 overflow-y-auto py-4">
//         <ul className="space-y-2 px-2">
//           {/* Dashboard */}
//           <li>
//             <button
//               onClick={() => onNavigate("/dashboard")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "dashboard"
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <FaTachometerAlt className="mr-3" />
//               <span>Dashboard</span>
//             </button>
//           </li>

//           {/* Emergency Alert */}
//           <li>
//             <button
//               onClick={() => onNavigate("/emergency")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "emergency"
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <FaBell className="mr-3" />
//               <span>Emergency Alert</span>
//             </button>
//           </li>

//           {/* Weather with Subcategories */}
//           <li>
//             <button
//               onClick={toggleWeather}
//               className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
//                 activePage.startsWith("weather")
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <div className="flex items-center">
//                 <FaCloudSun className="mr-3" />
//                 <span>Weather</span>
//               </div>
//               {weatherExpanded ? (
//                 <FaChevronDown className="ml-2" />
//               ) : (
//                 <FaChevronRight className="ml-2" />
//               )}
//             </button>

//             {weatherExpanded && (
//               <ul className="ml-4 mt-2 space-y-1">
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-general")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-general"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>General Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-agro")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-agro"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Agromet Bulletins</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-flood")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-flood"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Flood & Drought Bulletins</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-subseasonal")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-subseasonal"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>S2S Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-monthly")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-monthly"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Monthly Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-seasonal")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-seasonal"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Seasonal Forecast</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-climate")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-climate"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>State of the Climate Report</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => onNavigate("/weather-audio")}
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "weather-audio"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Audio Visual Forecast</span>
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* Production Calendars with Subcategories */}
//           <li>
//             <button
//               onClick={toggleProduction}
//               className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
//                 activePage.startsWith("production")
//                   ? "bg-green-700"
//                   : "hover:bg-green-700"
//               }`}
//             >
//               <div className="flex items-center">
//                 <FaCalendarAlt className="mr-3" />
//                 <span>Production Calendars</span>
//               </div>
//               {productionExpanded ? (
//                 <FaChevronDown className="ml-2" />
//               ) : (
//                 <FaChevronRight className="ml-2" />
//               )}
//             </button>

//             {productionExpanded && (
//               <ul className="ml-4 mt-2 space-y-1">
//                 <li>
//                   <button
//                     onClick={() => navigate("/production/provisional")} // Navigate to CreateCropCalendar
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-provisional"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>Provisional</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => navigate("/production/2024-minor")} // Navigate to CreateCropCalendar
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-2024-minor"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>2024 Minor Season</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => navigate("/production/2025-major")} // Navigate to CreateCropCalendar
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-2025-major"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>2025 Major Season</span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => navigate("/production/2024-minor")} // Navigate to CreateCropCalendar
//                     className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
//                       activePage === "production-2024-minor"
//                         ? "bg-green-700"
//                         : "hover:bg-green-700"
//                     }`}
//                   >
//                     <span>2024 Minor Season</span>
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </li>

//           {/* News */}
//           <li>
//             <button
//               onClick={() => navigate("/news")}
//               className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
//                 activePage === "news" ? "bg-green-700" : "hover:bg-green-700"
//               }`}
//             >
//               <FaNewspaper className="mr-3" />
//               <span>News</span>
//             </button>
//           </li>
//         </ul>
//       </nav>

//       <div className="p-4 border-t border-green-700 text-xs text-center">
//         <p>© 2025 AgroClimate</p>
//         <p>DeepDive Team</p>
//       </div>
//     </div>
//   );
// };

// Sidebar.propTypes = {
//   activePage: PropTypes.string.isRequired,
//   onNavigate: PropTypes.func.isRequired,
// };

// export default Sidebar;

import { useState } from "react";
import {
  FaTachometerAlt,
  FaBell,
  FaCloudSun,
  FaNewspaper,
  FaChevronDown,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";
import PropTypes from "prop-types";
import CreateCropCalendar from "../../components/Dashboard/CreateCalendar";
// import { Navigate } from "react-router-dom";

const Sidebar = ({ activePage, onNavigate }) => {
  const [weatherExpanded, setWeatherExpanded] = useState(false);
  const [productionExpanded, setProductionExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleWeather = () => {
    setWeatherExpanded(!weatherExpanded);
  };

  const toggleProduction = () => {
    setProductionExpanded(!productionExpanded);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onNavigate("/dashboard"); // Navigate back to dashboard when modal closes
  };

  return (
    <>
      <div className="h-screen w-64 bg-green-800 text-white flex flex-col fixed left-0 top-0 shadow-lg">
        <div className="p-4 border-b border-green-700">
          <h1 className="text-xl font-bold">Deep Dive Team</h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {/* Dashboard */}
            <li>
              <button
                onClick={() => onNavigate("dashboard")}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
                  activePage === "dashboard"
                    ? "bg-green-700"
                    : "hover:bg-green-700"
                }`}
              >
                <FaTachometerAlt className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>

            {/* Emergency Alert */}
            <li>
              <button
                onClick={() => onNavigate("/emergency")}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
                  activePage === "emergency"
                    ? "bg-green-700"
                    : "hover:bg-green-700"
                }`}
              >
                <FaBell className="mr-3" />
                <span>Emergency Alert</span>
              </button>
            </li>

            {/* Weather with Subcategories */}
            <li>
              <button
                onClick={toggleWeather}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
                  activePage.startsWith("weather")
                    ? "bg-green-700"
                    : "hover:bg-green-700"
                }`}
              >
                <div className="flex items-center">
                  <FaCloudSun className="mr-3" />
                  <span>Weather</span>
                </div>
                {weatherExpanded ? (
                  <FaChevronDown className="ml-2" />
                ) : (
                  <FaChevronRight className="ml-2" />
                )}
              </button>

              {weatherExpanded && (
                <ul className="ml-4 mt-2 space-y-1">
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-general")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-general"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>General Forecast</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-agro")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-agro"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>Agromet Bulletins</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-flood")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-flood"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>Flood & Drought Bulletins</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-subseasonal")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-subseasonal"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>S2S Forecast</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-monthly")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-monthly"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>Monthly Forecast</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-seasonal")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-seasonal"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>Seasonal Forecast</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-climate")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-climate"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>State of the Climate Report</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("/weather-audio")}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "weather-audio"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>Audio Visual Forecast</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Production Calendars with Subcategories */}
            <li>
              <button
                onClick={toggleProduction}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${
                  activePage.startsWith("production")
                    ? "bg-green-700"
                    : "hover:bg-green-700"
                }`}
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3" />
                  <span>Production Calendars</span>
                </div>
                {productionExpanded ? (
                  <FaChevronDown className="ml-2" />
                ) : (
                  <FaChevronRight className="ml-2" />
                )}
              </button>

              {productionExpanded && (
                <ul className="ml-4 mt-2 space-y-1">
                  <li>
                    <button
                      onClick={openModal} // Open modal instead of navigating
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "production-provisional"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>Provisional</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={openModal} // Open modal instead of navigating
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "production-2024-minor"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>2024 Minor Season</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={openModal} // Open modal instead of navigating
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                        activePage === "production-2025-major"
                          ? "bg-green-700"
                          : "hover:bg-green-700"
                      }`}
                    >
                      <span>2025 Major Season</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* News */}
            <li>
              <button
                onClick={() => onNavigate("/news")} // Use onNavigate instead of navigate
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg ${
                  activePage === "news" ? "bg-green-700" : "hover:bg-green-700"
                }`}
              >
                <FaNewspaper className="mr-3" />
                <span>News</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-green-700 text-xs text-center">
          <p>© 2025 AgroClimate</p>
          <p>DeepDive Team</p>
        </div>
      </div>

      {/* Modal */}
      <CreateCropCalendar isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

Sidebar.propTypes = {
  activePage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default Sidebar;
