// import { useState, useEffect, useRef } from "react";
// import {
//   PDFDownloadLink,
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";
// import PropTypes from "prop-types"; // Import PropTypes for validation

// // PDF styles for the download
// const pdfStyles = StyleSheet.create({
//   page: { padding: 30, fontFamily: "Helvetica" },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     textAlign: "center",
//     color: "#1a4731",
//   },
//   subtitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 8,
//     marginTop: 15,
//     color: "#2d6a4f",
//   },
//   text: { fontSize: 10, marginBottom: 5, color: "#333" },
//   advisoryItem: { fontSize: 10, marginBottom: 3, marginLeft: 10 },
//   footer: { fontSize: 8, marginTop: 30, textAlign: "center", color: "#666" },
//   header: {
//     flexDirection: "row",
//     marginBottom: 20,
//     justifyContent: "space-between",
//   },
//   headerText: { fontSize: 12, color: "#333" },
//   activityBox: {
//     marginBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#e5e5e5",
//     borderRadius: 5,
//     backgroundColor: "#f9fafb",
//   },
//   activityTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
//   activityPeriod: { fontSize: 10, marginBottom: 5, color: "#4b5563" },
// });

// // Weekly Advisory PDF Document component
// const WeeklyAdvisoryPDF = ({
//   selectedCrop,
//   region,
//   district,
//   currentMonth,
//   currentWeek,
//   activities,
// }) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       <View style={pdfStyles.header}>
//         <Text style={pdfStyles.headerText}>Farm Advisory Calendar</Text>
//         <Text style={pdfStyles.headerText}>
//           Week {currentWeek}, {currentMonth} 2025
//         </Text>
//       </View>

//       <Text style={pdfStyles.title}>
//         {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Farming
//         Advisory
//       </Text>

//       {region && district && (
//         <Text style={pdfStyles.text}>
//           Location: {region} Region, {district} District
//         </Text>
//       )}

//       <Text style={pdfStyles.subtitle}>Current Activities:</Text>

//       {activities.length > 0 ? (
//         activities.map((activity, index) => (
//           <View key={index} style={pdfStyles.activityBox}>
//             <Text style={pdfStyles.activityTitle}>
//               {activity.activity.charAt(0).toUpperCase() +
//                 activity.activity.slice(1)}
//             </Text>
//             <Text style={pdfStyles.activityPeriod}>
//               {activity.start === activity.end
//                 ? activity.start
//                 : `${activity.start} - ${activity.end}`}
//             </Text>
//             <Text style={pdfStyles.text}>Advisory:</Text>
//             {activity.advisory.split("\n").map((item, idx) => (
//               <Text key={idx} style={pdfStyles.advisoryItem}>
//                 • {item}
//               </Text>
//             ))}
//           </View>
//         ))
//       ) : (
//         <Text style={pdfStyles.text}>
//           No active farming activities for this period.
//         </Text>
//       )}

//       <Text style={pdfStyles.footer}>
//         Generated on {new Date().toLocaleDateString()} • Farm Advisory Calendar
//         System
//       </Text>
//     </Page>
//   </Document>
// );

// // Add PropTypes validation for WeeklyAdvisoryPDF
// WeeklyAdvisoryPDF.propTypes = {
//   selectedCrop: PropTypes.string.isRequired,
//   region: PropTypes.string,
//   district: PropTypes.string,
//   currentMonth: PropTypes.string.isRequired,
//   currentWeek: PropTypes.number.isRequired,
//   activities: PropTypes.arrayOf(
//     PropTypes.shape({
//       activity: PropTypes.string.isRequired,
//       start: PropTypes.string.isRequired,
//       end: PropTypes.string.isRequired,
//       advisory: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

// const MediaPage = () => {
//   const [selectedCrop, setSelectedCrop] = useState("rice");
//   const [currentMonth, setCurrentMonth] = useState("");
//   const [currentWeek, setCurrentWeek] = useState(1);
//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [availableDistricts, setAvailableDistricts] = useState([]);
//   const pdfRef = useRef();

//   // Ghana's regions and districts
//   const regions = [
//     {
//       name: "Greater Accra",
//       districts: [
//         "Accra Metropolitan",
//         "Tema",
//         "Ga East",
//         "Ga West",
//         "La-Nkwantanang-Madina",
//       ],
//       crops: ["tomato", "rice", "maize", "soybean"],
//     },
//     {
//       name: "Ashanti",
//       districts: [
//         "Kumasi Metropolitan",
//         "Obuasi",
//         "Asokore Mampong",
//         "Ejisu-Juaben",
//         "Atwima Nwabiagya",
//       ],
//       crops: ["maize", "rice", "tomato", "soybean", "sorghum"],
//     },
//     {
//       name: "Northern",
//       districts: [
//         "Tamale Metropolitan",
//         "Sagnarigu",
//         "Savelugu",
//         "Kumbungu",
//         "Tolon",
//       ],
//       crops: ["rice", "maize", "soybean", "sorghum"],
//     },
//     {
//       name: "Upper East",
//       districts: [
//         "Bolgatanga",
//         "Bawku",
//         "Kassena Nankana",
//         "Builsa",
//         "Garu-Tempane",
//       ],
//       crops: ["rice", "sorghum", "soybean"],
//     },
//     {
//       name: "Upper West",
//       districts: ["Wa Municipal", "Nadowli", "Jirapa", "Lawra", "Sissala East"],
//       crops: ["sorghum", "maize", "soybean"],
//     },
//     {
//       name: "Volta",
//       districts: ["Ho Municipal", "Keta", "Hohoe", "Ketu", "Akatsi"],
//       crops: ["rice", "maize", "tomato"],
//     },
//   ];

//   // Get current month and week on component mount
//   useEffect(() => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     const currentDate = new Date("2025-04-09"); // Fixed date for consistency
//     const monthIndex = currentDate.getMonth();
//     setCurrentMonth(months[monthIndex]); // "April"

//     // Calculate the current week of the month (1-4)
//     const day = currentDate.getDate();
//     setCurrentWeek(Math.ceil(day / 7)); // Week 2 for April 9
//   }, []);

//   // Update available districts when region changes
//   useEffect(() => {
//     if (selectedRegion) {
//       const region = regions.find((r) => r.name === selectedRegion);
//       if (region) {
//         setAvailableDistricts(region.districts);

//         // Filter available crops for this region
//         const regionCrops = region.crops;
//         if (!regionCrops.includes(selectedCrop)) {
//           setSelectedCrop(regionCrops[0]);
//         }
//       }
//     } else {
//       setAvailableDistricts([]);
//     }
//   }, [selectedRegion, selectedCrop]);

//   // Clear district when region changes
//   useEffect(() => {
//     setSelectedDistrict("");
//   }, [selectedRegion]);

//   // Rice farming activities
//   const riceActivities = [
//     {
//       activity: "Site Selection",
//       start: "February",
//       end: "February",
//       color: "bg-blue-500",
//       advisory:
//         "Choose a well-drained site with access to irrigation or rainfall. \nSelect certified rice varieties such as Jasmine or Nerica for optimal yield. \nEnsure the land is suitable for paddy cultivation.",
//       icon: "🔍",
//     },
//     {
//       activity: "Land Preparation",
//       start: "March",
//       end: "March",
//       color: "bg-amber-700",
//       advisory:
//         "Plow and level the land to create a smooth seedbed. \nFlood the field with water for puddling if practicing lowland rice farming. \nRemove weeds and debris before planting.",
//       icon: "🚜",
//     },
//     {
//       activity: "Seed selection and treatment",
//       start: "March",
//       end: "March",
//       color: "bg-gray-500",
//       advisory:
//         "Select high-quality seeds with good germination rates. \nTreat seeds with fungicides to prevent seed-borne diseases. \nSoak seeds in water for 24 hours before sowing.",
//       icon: "🌱",
//     },
//     {
//       activity: "Nursery Sowing",
//       start: "April",
//       end: "April",
//       color: "bg-purple-700",
//       advisory:
//         "Sow seeds in a prepared nursery bed. \nMaintain adequate moisture and protect from pests. \nEnsure proper spacing to avoid overcrowding.",
//       icon: "🌾",
//     },
//     {
//       activity: "Transplanting",
//       start: "April",
//       end: "April",
//       color: "bg-black",
//       advisory:
//         "Transplant seedlings 21-30 days old into the prepared field. \nMaintain a spacing of 20x20 cm for optimal growth. \nEnsure adequate water levels during planting.",
//       icon: "🌿",
//     },
//     {
//       activity: "1st Weed management",
//       start: "May",
//       end: "May",
//       color: "bg-red-600",
//       advisory:
//         "Control weeds manually or with selective herbicides like Nominee Gold. \nWeed within 3 weeks of transplanting to reduce competition. \nMaintain water levels to suppress weed growth.",
//       icon: "🌱",
//     },
//     {
//       activity: "2nd Weed management",
//       start: "June",
//       end: "June",
//       color: "bg-red-600",
//       advisory:
//         "Perform a second weeding to reduce competition. \nApply herbicides if necessary. \nMaintain water levels to minimize weed growth.",
//       icon: "🌱",
//     },
//     {
//       activity: "1st Fertilizer Application",
//       start: "May",
//       end: "May",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply NPK 15:15:15 at the rate of 2 bags per acre, 10-14 days after transplanting. \nApply in a broadcast method over the flooded field. \nEnsure water is present to aid nutrient uptake.",
//       icon: "💦",
//     },
//     {
//       activity: "2nd Fertilizer Application",
//       start: "June",
//       end: "June",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply urea at the rate of 1 bag per acre, 30-35 days after transplanting. \nSpread evenly over the flooded field. \nEnsure water management to prevent nutrient loss.",
//       icon: "💦",
//     },
//     {
//       activity: "3rd Fertilizer Application",
//       start: "July",
//       end: "July",
//       color: "bg-fuchsia-500",
//       advisory:
//         "Apply a top dressing of urea at the rate of 1 bag per acre. \nApply during the panicle initiation stage. \nEnsure even distribution for uniform growth.",
//       icon: "💦",
//     },
//     {
//       activity: "Booting",
//       start: "July",
//       end: "July",
//       color: "bg-fuchsia-500",
//       advisory:
//         "Monitor the crop for the booting stage. \nEnsure adequate water supply to support grain development. \nProtect the crop from pests and diseases.",
//       icon: "🌾",
//     },
//     {
//       activity: "Ripening",
//       start: "August",
//       end: "August",
//       color: "bg-fuchsia-500",
//       advisory:
//         "Reduce water levels as the crop reaches the ripening stage. \nMonitor for pests like birds that may damage the grains. \nPrepare for harvest as grains mature.",
//       icon: "🌾",
//     },
//     {
//       activity: "Harvesting",
//       start: "September",
//       end: "September",
//       color: "bg-green-700",
//       advisory:
//         "Harvest when 80-85% of grains are straw-colored. \nUse a sickle or combine harvester. \nDry the paddy to 12-14% moisture content before storage.",
//       icon: "🌾",
//     },
//     {
//       activity: "Post-harvest Handling",
//       start: "October",
//       end: "October",
//       color: "bg-purple-800",
//       advisory:
//         "Thresh and clean the rice promptly to avoid quality loss. \nStore in airtight containers or silos to protect from pests. \nConsider milling within a week of drying.",
//       icon: "📦",
//     },
//   ];

//   // Sorghum farming activities
//   const sorghumActivities = [
//     {
//       activity: "Site Selection",
//       start: "February",
//       end: "February",
//       color: "bg-blue-500",
//       advisory:
//         "Select a site with well-drained sandy loam soil. \nChoose drought-tolerant sorghum varieties like Kapaala or Dorado. \nEnsure the site has good sunlight exposure.",
//       icon: "🔍",
//     },
//     {
//       activity: "Land Preparation",
//       start: "March",
//       end: "March",
//       color: "bg-amber-700",
//       advisory:
//         "Plow and harrow the land to create a fine seedbed. \nRemove weeds and debris. \nIncorporate organic matter to improve soil fertility.",
//       icon: "🚜",
//     },
//     {
//       activity: "Planting / Sowing",
//       start: "April",
//       end: "April",
//       color: "bg-black",
//       advisory:
//         "Sow seeds at a depth of 2-3 cm with a spacing of 60x20 cm. \nPlant at the onset of rains for rainfed systems. \nEnsure good seed-to-soil contact.",
//       icon: "🌱",
//     },
//     {
//       activity: "1st Fertilizer Application",
//       start: "May",
//       end: "May",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply NPK 15:15:15 at the rate of 2 bags per acre, 2-3 weeks after planting. \nUse a side placement method near the plant base. \nEnsure the soil is moist for better uptake.",
//       icon: "💦",
//     },
//     {
//       activity: "1st Weeding & Pest Control",
//       start: "May",
//       end: "May",
//       color: "bg-red-600",
//       advisory:
//         "Weed manually or use selective herbicides. \nMonitor for pests like shoot fly and apply insecticides if needed. \nWeed within 3 weeks of planting to reduce competition.",
//       icon: "🐛",
//     },
//     {
//       activity: "2nd Fertilizer Application (Urea)",
//       start: "June",
//       end: "June",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply urea at the rate of 1 bag per acre, 5-6 weeks after planting. \nBroadcast evenly around the plants. \nEnsure adequate moisture for nutrient absorption.",
//       icon: "💦",
//     },
//     {
//       activity: "2nd Weeding & Disease Control",
//       start: "June",
//       end: "June",
//       color: "bg-red-600",
//       advisory:
//         "Perform a second weeding to control late-emerging weeds. \nMonitor for diseases like anthracnose and apply fungicides if necessary. \nMaintain crop health through proper spacing.",
//       icon: "🌿",
//     },
//     {
//       activity: "Harvesting",
//       start: "August",
//       end: "August",
//       color: "bg-green-700",
//       advisory:
//         "Harvest when grains are hard and dry (about 20% moisture). \nCut the heads with a sickle and dry them under shade. \nThresh and clean the grains before storage.",
//       icon: "🌾",
//     },
//     {
//       activity: "Post-harvest Handling",
//       start: "September",
//       end: "September",
//       color: "bg-purple-800",
//       advisory:
//         "Dry the grains to 12-14% moisture content to prevent mold. \nStore in airtight containers to protect from pests. \nUse treated storage bags to reduce insect damage.",
//       icon: "📦",
//     },
//   ];

//   // Tomato farming activities
//   const tomatoActivities = [
//     {
//       activity: "Site selection",
//       start: "April",
//       end: "April",
//       color: "bg-blue-500",
//       advisory:
//         "Choose a sunny, well-drained site with loamy soil. \nTest soil pH (ideal 6.0-6.8). \nAvoid fields with a history of tomato diseases.",
//       icon: "🔍",
//     },
//     {
//       activity: "land preparation",
//       start: "April",
//       end: "April",
//       color: "bg-amber-700",
//       advisory:
//         "Plow and harrow the land to a fine tilth. \nIncorporate organic manure or compost. \nPrepare raised beds for better drainage.",
//       icon: "🚜",
//     },
//     {
//       activity: "germination test",
//       start: "April",
//       end: "April",
//       color: "bg-orange-500",
//       advisory:
//         "Test seed germination by placing 100 seeds in a moist cloth. \nCheck germination rate after 5-7 days. \nUse seeds with at least 80% germination rate.",
//       icon: "🌱",
//     },
//     {
//       activity: "nursery",
//       start: "April",
//       end: "April",
//       color: "bg-gray-500",
//       advisory:
//         "Prepare a nursery bed with fine soil. \nSow seeds thinly and cover lightly with soil. \nWater regularly and protect from direct sunlight.",
//       icon: "🌿",
//     },
//     {
//       activity: "transplanting",
//       start: "May",
//       end: "May",
//       color: "bg-black",
//       advisory:
//         "Transplant seedlings 4-6 weeks old to the main field. \nSpace plants 60x45 cm apart. \nWater immediately after transplanting.",
//       icon: "🌱",
//     },
//     {
//       activity: "addition of starter solution",
//       start: "May",
//       end: "May",
//       color: "bg-sky-300",
//       advisory:
//         "Apply a starter solution of NPK 10:20:10 to boost early growth. \nMix with water and apply around the plant base. \nAvoid over-application to prevent root burn.",
//       icon: "💦",
//     },
//     {
//       activity: "pest and disease management",
//       start: "May",
//       end: "July",
//       color: "bg-red-600",
//       advisory:
//         "Monitor for pests like aphids and diseases like blight. \nApply insecticides and fungicides as needed. \nUse integrated pest management practices.",
//       icon: "🐛",
//     },
//     {
//       activity: "1st fertilizer application (NPK)",
//       start: "May",
//       end: "May",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply NPK 15:15:15 at the rate of 1 bag per acre, 2 weeks after transplanting. \nApply in a ring around the plant. \nWater after application to aid uptake.",
//       icon: "💦",
//     },
//     {
//       activity: "earthing-up/staking/trellising/pruning",
//       start: "June",
//       end: "June",
//       color: "bg-sky-300",
//       advisory:
//         "Earth up soil around the plant base to support roots. \nStake or trellis plants to prevent lodging. \nPrune suckers to improve air circulation.",
//       icon: "🌿",
//     },
//     {
//       activity: "2nd fertilizer application (NPK)",
//       start: "June",
//       end: "June",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply NPK 15:15:15 at the rate of 1 bag per acre during flowering. \nApply in a ring around the plant. \nWater after application to aid uptake.",
//       icon: "💦",
//     },
//     {
//       activity: "harvesting",
//       start: "August",
//       end: "August",
//       color: "bg-green-700",
//       advisory:
//         "Harvest when fruits are firm and fully colored. \nPick fruits early in the morning to maintain freshness. \nHandle gently to avoid bruising.",
//       icon: "🍅",
//     },
//     {
//       activity: "post-harvest",
//       start: "August",
//       end: "August",
//       color: "bg-purple-800",
//       advisory:
//         "Sort and grade tomatoes for market. \nStore in a cool, shaded place to extend shelf life. \nPack in ventilated crates for transport.",
//       icon: "📦",
//     },
//   ];

//   // Soybean farming activities
//   const soybeanActivities = [
//     {
//       activity: "Site Selection",
//       start: "February",
//       end: "February",
//       color: "bg-blue-500",
//       advisory:
//         "Select a site with well-drained loam or sandy loam soil. \nChoose soybean varieties like Jenguma or Anidaso suited to your region. \nEnsure good sunlight and avoid waterlogged areas.",
//       icon: "🔍",
//     },
//     {
//       activity: "Land Preparation",
//       start: "March",
//       end: "March",
//       color: "bg-amber-700",
//       advisory:
//         "Plow and harrow the land to a fine tilth. \nIncorporate organic matter or lime if soil is acidic. \nRemove weeds and ensure proper drainage.",
//       icon: "🚜",
//     },
//     {
//       activity: "Planting / Sowing",
//       start: "April",
//       end: "April",
//       color: "bg-black",
//       advisory:
//         "Sow seeds at a depth of 3-5 cm with a spacing of 50x10 cm. \nInoculate seeds with Rhizobium bacteria for nitrogen fixation. \nPlant at the onset of the rainy season.",
//       icon: "🌱",
//     },
//     {
//       activity: "1st Fertilizer Application",
//       start: "May",
//       end: "May",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply phosphorus-based fertilizer (e.g., SSP) at 50 kg/ha, 2-3 weeks after planting. \nAvoid excess nitrogen to encourage nodulation. \nApply near the plant base and water lightly.",
//       icon: "💦",
//     },
//     {
//       activity: "1st Weeding & Pest Control",
//       start: "May",
//       end: "May",
//       color: "bg-red-600",
//       advisory:
//         "Weed manually or use pre-emergence herbicides like Pendimethalin. \nMonitor for pests like pod borers and apply insecticides if needed. \nWeed within 3 weeks of planting.",
//       icon: "🐛",
//     },
//     {
//       activity: "2nd Weeding & Disease Control",
//       start: "June",
//       end: "June",
//       color: "bg-red-600",
//       advisory:
//         "Perform a second weeding to control late weeds. \nWatch for diseases like soybean rust and apply fungicides if detected. \nMaintain plant health with proper spacing.",
//       icon: "🌿",
//     },
//     {
//       activity: "Harvesting",
//       start: "August",
//       end: "August",
//       color: "bg-green-700",
//       advisory:
//         "Harvest when pods turn yellow-brown and seeds are hard (about 14% moisture). \nCut plants and dry them in the field. \nThresh and clean seeds promptly.",
//       icon: "🌾",
//     },
//     {
//       activity: "Post-harvest Handling",
//       start: "September",
//       end: "September",
//       color: "bg-purple-800",
//       advisory:
//         "Dry seeds to 12% moisture content to prevent mold. \nStore in airtight containers or silos to protect from pests. \nUse fumigation if storing for long periods.",
//       icon: "📦",
//     },
//   ];

//   // Maize farming activities
//   const maizeActivities = [
//     {
//       activity: "Site Selection",
//       start: "February",
//       end: "February",
//       color: "bg-blue-500",
//       advisory:
//         "Choose a site with well-drained loamy soil. \nSelect maize varieties suitable for your region like Obatanpa or Mamaba. \nEnsure adequate sunlight and avoid waterlogged areas.",
//       icon: "🔍",
//     },
//     {
//       activity: "Land Preparation",
//       start: "March",
//       end: "March",
//       color: "bg-amber-700",
//       advisory:
//         "Plow and harrow the land to create a fine seedbed. \nClear all weeds and debris. \nIncorporate organic matter to improve soil structure.",
//       icon: "🚜",
//     },
//     {
//       activity: "Planting / Sowing",
//       start: "April",
//       end: "April",
//       color: "bg-black",
//       advisory:
//         "Plant seeds at a depth of 3-5 cm with a spacing of 75x40 cm. \nUse certified seeds for better yield. \nPlant at the onset of the rainy season.",
//       icon: "🌱",
//     },
//     {
//       activity: "1st Fertilizer Application",
//       start: "April",
//       end: "April",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply NPK 15:15:15 at the rate of 2 bags per acre, 2 weeks after planting. \nApply in bands along plant rows. \nEnsure soil is moist for better nutrient uptake.",
//       icon: "💦",
//     },
//     {
//       activity: "1st Weeding",
//       start: "May",
//       end: "May",
//       color: "bg-red-600",
//       advisory:
//         "Weed manually or use selective herbicides like Atrazine. \nKeep the field weed-free during the first 6 weeks. \nWeed before applying top dressing fertilizer.",
//       icon: "🌿",
//     },
//     {
//       activity: "2nd Fertilizer Application",
//       start: "May",
//       end: "May",
//       color: "bg-yellow-300",
//       advisory:
//         "Apply urea or sulfate of ammonia at the rate of 1 bag per acre. \nApply when plants are knee-high (4-5 weeks after planting). \nPlace fertilizer 5-10 cm away from plant stems.",
//       icon: "💦",
//     },
//     {
//       activity: "2nd Weeding & Pest Control",
//       start: "June",
//       end: "June",
//       color: "bg-red-600",
//       advisory:
//         "Perform second weeding to control late weeds. \nMonitor for pests like fall armyworm and stem borers. \nApply appropriate insecticides if needed.",
//       icon: "🐛",
//     },
//     {
//       activity: "Tasseling & Silking",
//       start: "July",
//       end: "July",
//       color: "bg-fuchsia-500",
//       advisory:
//         "Monitor tasseling and silking stages. \nEnsure adequate soil moisture during this critical period. \nProtect from birds and other pests.",
//       icon: "🌽",
//     },
//     {
//       activity: "Harvesting",
//       start: "August",
//       end: "August",
//       color: "bg-green-700",
//       advisory:
//         "Harvest when grains are hard and moisture content is about 15-20%. \nHarvest when husks turn brown. \nRemove husks and dry cobs properly.",
//       icon: "🌽",
//     },
//     {
//       activity: "Post-harvest Handling",
//       start: "September",
//       end: "September",
//       color: "bg-purple-800",
//       advisory:
//         "Dry maize to 13% moisture content. \nShell maize and store in clean, dry silos or bags. \nTreat with appropriate storage chemicals to prevent weevil infestation.",
//       icon: "📦",
//     },
//   ];

//   // Function to get activities for selected crop
//   const getCropActivities = () => {
//     switch (selectedCrop) {
//       case "rice":
//         return riceActivities;
//       case "sorghum":
//         return sorghumActivities;
//       case "tomato":
//         return tomatoActivities;
//       case "soybean":
//         return soybeanActivities;
//       case "maize":
//         return maizeActivities;
//       default:
//         return riceActivities;
//     }
//   };

//   // Function to check if an activity is current (happening in the current month)
//   const isCurrentActivity = (activity) => {
//     return (
//       activity.start === currentMonth ||
//       activity.end === currentMonth ||
//       (activity.start !== activity.end &&
//         getMonthIndex(activity.start) <= getMonthIndex(currentMonth) &&
//         getMonthIndex(activity.end) >= getMonthIndex(currentMonth))
//     );
//   };

//   // Helper function to get month index
//   const getMonthIndex = (monthName) => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     return months.indexOf(monthName);
//   };

//   // Function to get next upcoming activity
//   const getUpcomingActivity = () => {
//     const activities = getCropActivities();
//     const currentMonthIndex = getMonthIndex(currentMonth);

//     for (let i = 0; i < activities.length; i++) {
//       const startMonthIndex = getMonthIndex(activities[i].start);
//       if (startMonthIndex > currentMonthIndex) {
//         return activities[i];
//       }
//     }

//     // If no upcoming activity in current year, return the first activity of next year
//     return activities[0];
//   };

//   // Function to format advisory text with bullet points
//   const formatAdvisory = (advisory) => {
//     return advisory.split("\n").map((item, index) => (
//       <li key={index} className="ml-4 list-disc text-gray-700">
//         {item}
//       </li>
//     ));
//   };

//   // Get available crops based on selected region
//   const getAvailableCrops = () => {
//     if (!selectedRegion) {
//       return ["rice", "maize", "tomato", "soybean", "sorghum"];
//     }

//     const region = regions.find((r) => r.name === selectedRegion);
//     return region
//       ? region.crops
//       : ["rice", "maize", "tomato", "soybean", "sorghum"];
//   };

//   // Function to get current week's activities
//   const getCurrentWeekActivities = () => {
//     const currentActivities = getCropActivities().filter(isCurrentActivity);
//     return currentActivities;
//   };

//   // Function to generate regional advisory modifications
//   const getRegionalAdvisoryModification = (activity) => {
//     const regionalModifications = {
//       "Greater Accra": {
//         "Land Preparation":
//           "Use drought-resistant methods as rainfall is usually lower in this region.",
//         "1st Fertilizer Application":
//           "Consider adding more organic matter due to higher soil degradation in this area.",
//       },
//       Northern: {
//         "Planting / Sowing":
//           "Plant early due to the shorter rainy season in the Northern region.",
//         "Site Selection":
//           "Choose sites with better water retention capacity due to longer dry spells.",
//       },
//       "Upper East": {
//         "Planting / Sowing":
//           "Consider early maturing varieties due to shorter rainy season.",
//         Harvesting:
//           "Ensure quick harvesting to avoid grain losses during the harmattan season.",
//       },
//     };

//     if (
//       selectedRegion &&
//       regionalModifications[selectedRegion] &&
//       regionalModifications[selectedRegion][activity.activity]
//     ) {
//       return regionalModifications[selectedRegion][activity.activity];
//     }

//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       {/* Hero Banner */}
//       <div className="relative bg-gradient-to-r from-green-500 to-blue-600 text-white py-12 px-6 pt-20">
//         <div className="absolute inset-0 bg-opacity-10 bg-green-900" />
//         <div className="relative max-w-7xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
//             🌾 Farming Activities Calendar
//           </h1>
//           <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
//             Stay on top of your farming schedule with our interactive calendar,
//             tailored for your region and crop.
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-10">
//         {/* Filters Section */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 transform hover:shadow-xl transition-shadow duration-300">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Filter Options
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Region Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Region
//               </label>
//               <select
//                 value={selectedRegion}
//                 onChange={(e) => setSelectedRegion(e.target.value)}
//                 className="block w-full border border-gray-200 rounded-lg bg-gray-50 text-gray-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
//               >
//                 <option value="">All Regions</option>
//                 {regions.map((region) => (
//                   <option key={region.name} value={region.name}>
//                     {region.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* District Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 District
//               </label>
//               <select
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//                 disabled={!selectedRegion}
//                 className="block w-full border border-gray-200 rounded-lg bg-gray-50 text-gray-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400 disabled:bg-gray-100"
//               >
//                 <option value="">All Districts</option>
//                 {availableDistricts.map((district) => (
//                   <option key={district} value={district}>
//                     {district}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Crop Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Crop
//               </label>
//               <select
//                 value={selectedCrop}
//                 onChange={(e) => setSelectedCrop(e.target.value)}
//                 className="block w-full border border-gray-200 rounded-lg bg-gray-50 text-gray-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 hover:border-green-400"
//               >
//                 {getAvailableCrops().map((crop) => (
//                   <option key={crop} value={crop}>
//                     {crop.charAt(0).toUpperCase() + crop.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Download PDF Button */}
//             <div className="flex items-end">
//               <PDFDownloadLink
//                 document={
//                   <WeeklyAdvisoryPDF
//                     selectedCrop={selectedCrop}
//                     region={selectedRegion}
//                     district={selectedDistrict}
//                     currentMonth={currentMonth}
//                     currentWeek={currentWeek}
//                     activities={getCurrentWeekActivities()}
//                   />
//                 }
//                 fileName={`${selectedCrop}-advisory-week-${currentWeek}-${currentMonth}.pdf`}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center justify-center shadow-md"
//               >
//                 {({ loading }) =>
//                   loading ? (
//                     "Generating PDF..."
//                   ) : (
//                     <>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mr-2"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                         />
//                       </svg>
//                       Download Advisory
//                     </>
//                   )
//                 }
//               </PDFDownloadLink>
//             </div>
//           </div>
//         </div>

//         {/* Current Month Display */}
//         <div className="bg-blue-50 p-6 rounded-2xl mb-10 text-center shadow-md">
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Current Month: <span className="text-blue-600">{currentMonth}</span>
//             <span className="ml-4 bg-blue-100 px-3 py-1 rounded-full text-blue-800">
//               Week {currentWeek}
//             </span>
//           </h2>
//           {selectedRegion && (
//             <p className="mt-2 text-gray-600">
//               Location: {selectedRegion}{" "}
//               {selectedDistrict ? `- ${selectedDistrict} District` : ""}
//             </p>
//           )}
//         </div>

//         {/* Current Activities */}
//         <div className="mb-10">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6">
//             Current Activities
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {getCropActivities()
//               .filter(isCurrentActivity)
//               .map((activity, index) => (
//                 <div
//                   key={index}
//                   className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 transform hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <div className={`${activity.color} h-2`}></div>
//                   <div className="p-6">
//                     <div className="flex items-center mb-3">
//                       <span className="text-2xl mr-3">{activity.icon}</span>
//                       <h3 className="text-xl font-semibold text-gray-800 capitalize">
//                         {activity.activity}
//                       </h3>
//                     </div>
//                     <p className="text-gray-600 mb-4">
//                       {activity.start === activity.end
//                         ? activity.start
//                         : `${activity.start} - ${activity.end}`}
//                     </p>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="font-medium text-gray-800 mb-2">
//                         Advisory:
//                       </h4>
//                       <ul className="text-gray-700">
//                         {formatAdvisory(activity.advisory)}
//                         {getRegionalAdvisoryModification(activity) && (
//                           <li className="ml-4 list-disc font-medium text-green-700 mt-2">
//                             {getRegionalAdvisoryModification(activity)}
//                             <span className="text-xs text-gray-500 block mt-1">
//                               [Regional recommendation for {selectedRegion}]
//                             </span>
//                           </li>
//                         )}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//             {getCropActivities().filter(isCurrentActivity).length === 0 && (
//               <div className="col-span-1 md:col-span-2 bg-yellow-50 p-6 rounded-2xl shadow-md">
//                 <p className="text-center text-yellow-700 text-lg">
//                   No active farming activities for{" "}
//                   <span className="font-semibold">{selectedCrop}</span> in{" "}
//                   <span className="font-semibold">{currentMonth}</span>.
//                 </p>
//                 {getUpcomingActivity() && (
//                   <p className="text-center mt-3 text-gray-700">
//                     Next activity:{" "}
//                     <span className="font-semibold">
//                       {getUpcomingActivity().activity}
//                     </span>{" "}
//                     in{" "}
//                     <span className="font-semibold">
//                       {getUpcomingActivity().start}
//                     </span>
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Timeline View */}
//         <div className="mb-10">
//           <h2 className="text-3xl font-bold text-gray-800 mb-6">
//             Yearly Timeline
//           </h2>
//           <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
//             <div className="min-w-max p-6">
//               {/* Month Headers */}
//               <div className="flex border-b border-gray-200">
//                 <div className="w-48 flex-shrink-0 px-4 py-3 font-semibold text-gray-700">
//                   Activity
//                 </div>
//                 {[
//                   "Jan",
//                   "Feb",
//                   "Mar",
//                   "Apr",
//                   "May",
//                   "Jun",
//                   "Jul",
//                   "Aug",
//                   "Sep",
//                   "Oct",
//                   "Nov",
//                   "Dec",
//                 ].map((month, idx) => (
//                   <div
//                     key={month}
//                     className={`w-16 text-center py-3 font-semibold text-gray-700 ${
//                       [
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ][idx] === currentMonth
//                         ? "bg-blue-100"
//                         : ""
//                     }`}
//                   >
//                     {month}
//                   </div>
//                 ))}
//               </div>

//               {/* Activity Rows */}
//               {getCropActivities().map((activity, index) => {
//                 const startMonthIndex = getMonthIndex(activity.start);
//                 const endMonthIndex = getMonthIndex(activity.end);

//                 return (
//                   <div
//                     key={index}
//                     className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <div className="w-48 flex-shrink-0 px-4 py-3 font-medium text-gray-700 capitalize flex items-center">
//                       <span className="text-lg mr-2">{activity.icon}</span>
//                       {activity.activity}
//                     </div>
//                     {Array.from({ length: 12 }, (_, idx) => (
//                       <div key={idx} className="w-16 py-3">
//                         {idx >= startMonthIndex && idx <= endMonthIndex && (
//                           <div
//                             className={`${activity.color} h-6 rounded-sm mx-1 transform hover:scale-105 transition-transform duration-200`}
//                             title={`${activity.activity}: ${
//                               activity.advisory.split("\n")[0]
//                             }`}
//                           ></div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Full Advisory Section */}
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-3xl font-bold text-gray-800">
//               Full Advisory Calendar
//             </h2>
//             <button
//               onClick={() => window.print()}
//               className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition duration-200 ease-in-out flex items-center shadow-md"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 mr-2"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
//                 />
//               </svg>
//               Print Full Calendar
//             </button>
//           </div>
//           <div className="space-y-6">
//             {getCropActivities().map((activity, index) => (
//               <div
//                 key={index}
//                 className="bg-white shadow-lg rounded-2xl overflow-hidden transform hover:shadow-xl transition-shadow duration-300"
//               >
//                 <div className="flex items-center border-b border-gray-200 p-6">
//                   <div
//                     className={`${activity.color} w-5 h-5 rounded-full mr-3`}
//                   ></div>
//                   <h3 className="text-lg font-semibold text-gray-800 capitalize">
//                     {activity.activity}
//                   </h3>
//                   <div className="ml-auto text-gray-600">
//                     {activity.start === activity.end
//                       ? activity.start
//                       : `${activity.start} - ${activity.end}`}
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <ul className="space-y-1 text-gray-700">
//                     {formatAdvisory(activity.advisory)}
//                     {getRegionalAdvisoryModification(activity) &&
//                       selectedRegion && (
//                         <li className="ml-4 list-disc font-medium text-green-700 mt-2">
//                           {getRegionalAdvisoryModification(activity)}
//                           <span className="text-xs text-gray-500 block mt-1">
//                             [Regional recommendation for {selectedRegion}]
//                           </span>
//                         </li>
//                       )}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediaPage;

import { useMemo, useState, useEffect, useRef } from "react";
import prismaImage from "../assets/images/prisma.png";
import { districtOfGhana } from "../district";
import { FaEye, FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const MediaPage = () => {
  // Get current date information automatically
  const [currentDate, setCurrentDate] = useState({
    month: "",
    year: "",
    week: "",
    weekRange: "",
  });

  // Filter data - only crop and region/district needed since dates are automatic
  const filterData = {
    region: [
      "OTI",
      "VOLTA",
      "NORTHERN",
      "ASHANTI",
      "WESTERN",
      "WESTERN NORTH",
      "GREATER ACCRA",
      "EASTERN",
      "UPPER WEST",
      "UPPER EAST",
      "NORTH EAST",
      "SAVANNAH",
      "AHAFO",
      "BONO",
      "BONO EAST",
      "CENTRAL",
    ],
    crop: ["Maize", "Rice", "Sorghum", "Soyabean", "Tomato"],
  };

  // User selections
  const [selected, setSelected] = useState({
    region: "",
    district: "",
    crop: "",
  });

  // Display states
  const [showAdvisory, setShowAdvisory] = useState(false);
  const pdfContentRef = useRef(null);

  // Mock data similar to original component
  const [data] = useState({
    productionCalendar: {
      Maize: {
        January: ["Land preparation", "Gathering inputs"],
        February: ["Soil treatment", "Early planting for early varieties"],
        March: ["Main planting season", "Apply basal fertilizer"],
        April: ["Weed control", "First top-dressing of fertilizer"],
        May: ["Pest monitoring", "Second fertilizer application"],
        June: ["Disease monitoring", "Prepare for possible drought"],
        July: ["Tasseling stage care", "Prepare for harvest (early varieties)"],
        August: ["Early harvest", "Post-harvest handling"],
        September: ["Main harvest season", "Storage preparation"],
        October: ["Marketing", "Land preparation for second season"],
        November: ["Second season planting", "Input preparation"],
        December: ["Crop maintenance", "End of year evaluation"],
      },
      Rice: {
        January: ["Nursery preparation", "Irrigation system check"],
        February: ["Land preparation (lowland)", "Seed selection"],
        March: ["Transplanting", "Water management"],
        April: ["Weed control", "First fertilizer application"],
        May: ["Pest monitoring", "Second fertilizer application"],
        June: ["Disease control", "Water level management"],
        July: ["Heading stage care", "Bird control"],
        August: ["Prepare for harvest", "Drainage planning"],
        September: ["Main harvest season", "Drying activities"],
        October: ["Post-harvest handling", "Marketing"],
        November: ["Land preparation (second season)", "Input gathering"],
        December: ["Irrigation maintenance", "Planning for next season"],
      },
      Sorghum: {
        January: ["Seed selection", "Input sourcing"],
        February: ["Land preparation", "Soil testing"],
        March: ["Early planting", "Soil amendment application"],
        April: ["Main planting season", "Weed control"],
        May: ["Thinning", "First fertilizer application"],
        June: ["Pest monitoring", "Stalk borer control"],
        July: ["Bird scaring", "Disease management"],
        August: ["Prepare for harvest", "Labor organization"],
        September: ["Main harvest", "Threshing"],
        October: ["Storage", "Marketing"],
        November: ["Land preparation (dry areas)", "Input gathering"],
        December: ["Planning for next season", "Tool maintenance"],
      },
      Soyabean: {
        January: ["Seed selection", "Inoculant sourcing"],
        February: ["Land preparation", "Input gathering"],
        March: ["Early planting", "Soil amendment"],
        April: ["Main planting season", "Weed control"],
        May: ["Pest monitoring", "Fertilizer application"],
        June: ["Disease control", "Canopy management"],
        July: ["Pod development phase", "Pest control"],
        August: ["Prepare for harvest", "Maturity checking"],
        September: ["Main harvest", "Threshing and cleaning"],
        October: ["Storage", "Marketing"],
        November: ["Land preparation (southern zones)", "Input gathering"],
        December: ["Planning for next season", "Equipment maintenance"],
      },
      Tomato: {
        January: ["Nursery preparation", "Input sourcing"],
        February: ["Transplanting (dry season)", "Irrigation setup"],
        March: ["Field maintenance", "Staking"],
        April: ["Flowering stage care", "Pest control"],
        May: ["Harvesting (dry season crop)", "Marketing"],
        June: ["Land preparation (wet season)", "Nursery setup"],
        July: ["Transplanting (wet season)", "Disease prevention"],
        August: ["Trellising", "Pest and disease management"],
        September: ["Fruiting stage care", "Irrigation management"],
        October: ["Main harvest (wet season)", "Post-harvest handling"],
        November: ["Late season maintenance", "Marketing"],
        December: ["Field clearing", "Planning for next season"],
      },
    },
    advisoryTable: {
      parameters: [
        "RAINFALL",
        "TEMPERATURE",
        "EVAPO-TRANSPIRATION",
        "SOIL MOISTURE",
        "HUMIDITY",
        "SOIL TEMPERATURE",
        "DAY LENGTH",
        "WIND DXN",
        "WIND SPEED",
        "PRESSURE",
      ],
      forecast: [
        "50% Prob. of occurrence",
        "35°C (Day) / 24°C (Night)",
        "4 mm/day",
        "Moderate",
        "75%",
        "22°C",
        "12 hours",
        "North-East",
        "15 km/h",
        "1015 hPa",
      ],
      implication: [
        "Affects herbicide efficacy and timing of weed control operations.",
        "Accelerates weed growth; influences fertilizer uptake rates.",
        "Increases rate of fertilizer dissolution in soil.",
        "Determines nutrient mobility and weed competition intensity.",
        "High humidity may reduce herbicide effectiveness.",
        "Influences microbial activity affecting fertilizer breakdown.",
        "Longer days intensify weed-crop competition for light.",
        "May cause herbicide drift during application.",
        "Can affect spray pattern distribution during application.",
        "Minimal impact on weed management activities.",
      ],
      advisory: [
        "Schedule herbicide application 24-48 hours after rainfall for optimal absorption.",
        "Apply fertilizer in early morning; manage weeds before they set seed.",
        "Use appropriate fertilizer formulations based on water availability.",
        "Prioritize weed control in areas with optimal moisture for maximum effectiveness.",
        "Apply contact herbicides during lower humidity periods for better efficacy.",
        "Time fertilizer application to coincide with optimal soil temperature.",
        "Use selective herbicides targeting problem weeds in the crop's critical period.",
        "Apply herbicides when wind direction minimizes drift to sensitive areas.",
        "Avoid herbicide application during windy conditions; use drift reduction nozzles.",
        "Continue normal weed management operations.",
      ],
    },
  });

  // Calculate current month, year, and week on component mount
  useEffect(() => {
    const now = new Date();

    // Get month name
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = monthNames[now.getMonth()];

    // Get year
    const currentYear = now.getFullYear().toString();

    // Calculate week of month
    const date = now.getDate();
    let weekNumber;
    let weekRange;

    if (date <= 7) {
      weekNumber = 1;
      weekRange = "1st – 7th";
    } else if (date <= 14) {
      weekNumber = 2;
      weekRange = "8th – 14th";
    } else if (date <= 21) {
      weekNumber = 3;
      weekRange = "15th – 21st";
    } else if (date <= 28) {
      weekNumber = 4;
      weekRange = "22nd – 28th";
    } else {
      weekNumber = 5;
      weekRange = "29th – 31st";
    }

    setCurrentDate({
      month: currentMonth,
      year: currentYear,
      week: weekNumber,
      weekRange: weekRange,
    });
  }, []);

  const handleFilterChange = (e, field) => {
    setSelected((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Generate activities based on crop and current month
  const activities = useMemo(() => {
    if (!selected.crop || !currentDate.month) return [];

    return data.productionCalendar[selected.crop]?.[currentDate.month] || [];
  }, [selected.crop, currentDate.month, data.productionCalendar]);

  // Generate comprehensive summary based on selected criteria, activities and weather data
  const comprehensiveSummary = useMemo(() => {
    if (
      !selected.crop ||
      !selected.district ||
      !selected.region ||
      !currentDate.month
    ) {
      return "";
    }

    // Extract key weather information
    const rainfall = data.advisoryTable.forecast[0];
    const temperature = data.advisoryTable.forecast[1];
    const humidity = data.advisoryTable.forecast[4];
    const soilMoisture = data.advisoryTable.forecast[3];

    // Combine implications and advisories into relevant sections
    const rainfallImplication = data.advisoryTable.implication[0];
    const rainfallAdvisory = data.advisoryTable.advisory[0];

    const temperatureImplication = data.advisoryTable.implication[1];
    const temperatureAdvisory = data.advisoryTable.advisory[1];

    const humidityImplication = data.advisoryTable.implication[4];
    const humidityAdvisory = data.advisoryTable.advisory[4];

    const soilMoistureImplication = data.advisoryTable.implication[3];
    const soilMoistureAdvisory = data.advisoryTable.advisory[3];

    // Format activities
    const activityText =
      activities.length > 0
        ? `Key activities for this period include: ${activities.join(" and ")}.`
        : "";

    // Customize summary to focus on weed management and fertilizer application
    return `FARM ADVISORY CALENDAR: ${currentDate.month} ${
      currentDate.year
    }, Week ${currentDate.weekRange}

SUMMARY WEATHER OUTLOOK & ADVISORY FOR ${selected.crop.toUpperCase()} FARMERS IN THE ${selected.district.toUpperCase()} DISTRICT OF THE ${
      selected.region
    } REGION

${activityText}

WEED MANAGEMENT & FERTILIZER APPLICATION RECOMMENDATIONS:

1. RAINFALL: Expected at ${rainfall}. ${rainfallImplication} Recommendation: ${rainfallAdvisory}

2. TEMPERATURE: Forecast at ${temperature}. ${temperatureImplication} Recommendation: ${temperatureAdvisory}

3. HUMIDITY: Expected at ${humidity}. ${humidityImplication} Recommendation: ${humidityAdvisory}

4. SOIL MOISTURE: ${soilMoisture}. ${soilMoistureImplication} Recommendation: ${soilMoistureAdvisory}

Overall assessment: Current weather conditions are particularly important for weed management and fertilizer application operations. Farmers should optimize the timing of herbicide application and fertilizer placement based on these weather parameters to maximize effectiveness and minimize waste. Monitor weed pressure closely and implement integrated weed management strategies for best results.`;
  }, [
    selected.crop,
    selected.district,
    selected.region,
    currentDate,
    activities,
    data.advisoryTable.forecast,
    data.advisoryTable.implication,
    data.advisoryTable.advisory,
  ]);

  // Simple summary for display in the UI (shorter version)
  const simpleSummary = useMemo(() => {
    if (
      !selected.crop ||
      !selected.district ||
      !selected.region ||
      !currentDate.month
    ) {
      return "";
    }

    const activityText =
      activities.length > 0
        ? `Key activities for this period include: ${activities.join(" and ")}.`
        : "";

    return `This week's weather outlook for ${selected.crop} farmers in the ${selected.district} district of the ${selected.region} region during ${currentDate.weekRange} ${currentDate.month} ${currentDate.year} indicates conditions that require specific attention to weed management and fertilizer application. ${activityText} Current rainfall patterns will affect herbicide effectiveness - schedule applications carefully. Temperature conditions will influence both weed growth rates and fertilizer uptake. Apply fertilizers during early morning hours when temperature and humidity are optimal for absorption and minimized volatilization losses.`;
  }, [
    selected.crop,
    selected.district,
    selected.region,
    currentDate,
    activities,
  ]);

  const handleViewAdvisories = () => {
    if (!selected.crop || !selected.region || !selected.district) {
      alert("Please select crop, region, and district.");
      return;
    }
    setShowAdvisory(true);
  };

  const downloadPDF = () => {
    // Create a PDF-specific element to ensure proper formatting
    const pdfContent = document.createElement("div");
    pdfContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #1e7e34; margin-bottom: 5px; font-size: 24px;">West Africa Food System Resilience Programme</h1>
          <h2 style="color: #2b5797; font-size: 20px;">Media Advisory</h2>
        </div>
        
        <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.5;">
          ${comprehensiveSummary}
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>Issued on: ${new Date().toLocaleDateString()}</p>
          <p>For more information, contact the District Agriculture Office</p>
        </div>
      </div>
    `;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `farm_advisory_${selected.crop}_${selected.district}_${currentDate.month}_${currentDate.year}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(pdfContent).set(opt).save();
  };

  return (
    <div
      className="min-h-screen bg-gray-950 mx-auto px-4 py-2 md:px-8 lg:px-12"
      style={{
        backgroundImage: `url(${prismaImage})`,
        backgroundSize: "1400px 1200px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        WebkitBackgroundSize: "1200px 800px",
        MozBackgroundSize: "1200px 800px",
      }}
    >
      <div className="container mx-auto p-3 md:p-5 shadow-xl rounded-lg mt-20 md:mt-28 mb-12 bg-white/90 backdrop-blur-md">
        <div className="relative text-center mb-5 bg-gradient-to-r from-green-500 to-blue-600 py-5 rounded-t-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold uppercase text-white">
            West Africa Food System Resilience Programme
          </h1>
          <h2 className="text-md md:text-xl font-semibold text-gray-100">
            Media Advisory - {currentDate.month} {currentDate.year}, Week{" "}
            {currentDate.weekRange}
          </h2>
        </div>

        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg shadow-lg mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 capitalize text-gray-800">
                Region
              </label>
              <select
                value={selected.region || ""}
                onChange={(e) => handleFilterChange(e, "region")}
                className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-300"
              >
                <option value="">Select Region</option>
                {filterData.region.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 capitalize text-gray-800">
                District
              </label>
              <select
                value={selected.district || ""}
                onChange={(e) => handleFilterChange(e, "district")}
                className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-300"
                disabled={!selected.region}
              >
                <option value="">Select District</option>
                {districtOfGhana
                  .filter(
                    (d) =>
                      d.region.toLowerCase() === selected.region.toLowerCase()
                  )
                  .map((district) => (
                    <option key={district.name} value={district.name}>
                      {district.name}
                    </option>
                  ))}
              </select>
            </div>
            {/* Only show crop and location filters */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1 capitalize text-gray-800">
                Commodity
              </label>
              <select
                value={selected.crop || ""}
                onChange={(e) => handleFilterChange(e, "crop")}
                className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-green-500 transition-all duration-300"
              >
                <option value="">Select Crop</option>
                {filterData.crop.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="flex justify-center mt-3">
            <button
              onClick={handleViewAdvisories}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              <FaEye className="text-lg" />
              View Advisories
            </button>
          </div> */}

          <div className="flex justify-center mt-3">
            <button
              onClick={handleViewAdvisories}
              disabled={
                !selected.crop || !selected.region || !selected.district
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 shadow-md ${
                !selected.crop || !selected.region || !selected.district
                  ? "bg-gray-400 cursor-not-allowed text-gray-100"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              <FaEye className="text-lg" />
              View Advisories
            </button>
          </div>
        </div>

        {showAdvisory && (
          <div ref={pdfContentRef}>
            {/* Production Calendar Activities */}
            <div className="mb-5 p-4 bg-white rounded-lg shadow-lg border-2 border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                SEASONAL ACTIVITIES FOR {selected.crop.toUpperCase()} IN{" "}
                {currentDate.month.toUpperCase()}
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {activities.map((activity, index) => (
                  <li key={index} className="text-gray-800">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weather Advisory Table - Updated header to reflect focus */}
            <div className="mb-5 overflow-x-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                WEED MANAGEMENT & FERTILIZER APPLICATION ADVISORY
              </h3>
              <table className="min-w-max mx-auto border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                    <th className="border border-gray-200 p-2.5"></th>
                    {data.advisoryTable.parameters.map((param, index) => (
                      <th
                        key={index}
                        className="border border-gray-200 p-2.5 text-center"
                      >
                        {param}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["forecast", "implication", "advisory"].map((type) => (
                    <tr
                      key={type}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="border border-gray-200 p-3 bg-gray-100 font-semibold text-gray-800">
                        {type.toUpperCase()}
                      </td>
                      {data.advisoryTable[type].map((item, index) => (
                        <td
                          key={index}
                          className="border border-gray-200 p-3 text-left"
                        >
                          <p className="text-sm text-gray-800 whitespace-normal break-words leading-relaxed">
                            {item}
                          </p>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Section - Updated to focus on weed management and fertilizer application */}
            <div className="mt-5 p-4 bg-white rounded-lg shadow-lg border-2 border-gradient-to-br from-green-500 to-blue-600">
              <p className="text-center text-base md:text-lg font-semibold text-gray-800 mb-2">
                WEED MANAGEMENT & FERTILIZER APPLICATION ADVISORY FOR{" "}
                <span className="text-green-600">
                  {selected.crop.toUpperCase()}
                </span>{" "}
                FARMERS IN THE{" "}
                <span className="text-green-600">
                  {selected.district.toUpperCase()}
                </span>{" "}
                DISTRICT OF THE{" "}
                <span className="text-green-600">{selected.region}</span> REGION
                FOR THE WEEK OF{" "}
                <span className="text-green-600">{currentDate.weekRange}</span>{" "}
                <span className="text-green-600">
                  {currentDate.month.toUpperCase()} {currentDate.year}
                </span>
              </p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {simpleSummary}
              </p>
            </div>

            {/* Download Button - Only visible in UI, not in PDF */}
            <div className="flex justify-center mt-4">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md"
              >
                <FaDownload className="text-lg" />
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
