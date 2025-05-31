// import React, { useState } from "react";
// import { FaCalendarAlt, FaFileExcel } from "react-icons/fa";

// const CreateCropCalendar = () => {
//   const [formData, setFormData] = useState({
//     region: "",
//     district: "",
//     crop: "",
//     majorExcel: null,
//     majorStartMonth: "",
//     majorStartWeek: "",
//     majorType: "",
//     minorExcel: null,
//     minorStartMonth: "",
//     minorStartWeek: "",
//     minorType: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e, field) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, [field]: file });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Create Calendar
//           </h2>
//           <button className="text-gray-500 hover:text-gray-700">
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Region <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="region"
//                 value={formData.region}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">Select Region...</option>
//                 <option value="region1">Region 1</option>
//                 <option value="region2">Region 2</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 District <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="district"
//                 value={formData.district}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">Enter the district</option>
//                 <option value="district1">District 1</option>
//                 <option value="district2">District 2</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Crop <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="crop"
//                 value={formData.crop}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 <option value="">Select Crop...</option>
//                 <option value="crop1">Crop 1</option>
//                 <option value="crop2">Crop 2</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 MAJOR SEASON
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Excel <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex items-center space-x-2">
//                     <label className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200">
//                       <input
//                         type="file"
//                         accept=".xlsx, .xls"
//                         onChange={(e) => handleFileChange(e, "majorExcel")}
//                         className="hidden"
//                       />
//                       Choose File
//                     </label>
//                     <span className="text-sm text-gray-500">
//                       {formData.majorExcel
//                         ? formData.majorExcel.name
//                         : "No file chosen"}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Upload Excel</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Week <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       name="majorStartWeek"
//                       value={formData.majorStartWeek}
//                       onChange={handleInputChange}
//                       placeholder="dd/mm/yyyy"
//                       className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                     <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Major Season Start Month{" "}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="majorStartMonth"
//                     value={formData.majorStartMonth}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">Select Month...</option>
//                     <option value="January">January</option>
//                     <option value="February">February</option>
//                     <option value="March">March</option>
//                     <option value="April">April</option>
//                     <option value="May">May</option>
//                     <option value="June">June</option>
//                     <option value="July">July</option>
//                     <option value="August">August</option>
//                     <option value="September">September</option>
//                     <option value="October">October</option>
//                     <option value="November">November</option>
//                     <option value="December">December</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="majorType"
//                     value={formData.majorType}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">Select...</option>
//                     <option value="type1">Type 1</option>
//                     <option value="type2">Type 2</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 MINOR SEASON
//               </h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Excel
//                   </label>
//                   <div className="flex items-center space-x-2">
//                     <label className="w-1/2 p-2 border rounded-md bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200">
//                       <input
//                         type="file"
//                         accept=".xlsx, .xls"
//                         onChange={(e) => handleFileChange(e, "minorExcel")}
//                         className="hidden"
//                       />
//                       Choose File
//                     </label>
//                     <span className="text-sm text-gray-500">
//                       {formData.minorExcel
//                         ? formData.minorExcel.name
//                         : "No file chosen"}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">Upload Excel2</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Week <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       name="minorStartWeek"
//                       value={formData.minorStartWeek}
//                       onChange={handleInputChange}
//                       placeholder="dd/mm/yyyy"
//                       className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                     <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Minor Season Start Month{" "}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="minorStartMonth"
//                     value={formData.minorStartMonth}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">Select Month...</option>
//                     <option value="January">January</option>
//                     <option value="February">February</option>
//                     <option value="March">March</option>
//                     <option value="April">April</option>
//                     <option value="May">May</option>
//                     <option value="June">June</option>
//                     <option value="July">July</option>
//                     <option value="August">August</option>
//                     <option value="September">September</option>
//                     <option value="October">October</option>
//                     <option value="November">November</option>
//                     <option value="December">December</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="minorType"
//                     value={formData.minorType}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">Select...</option>
//                     <option value="type1">Type 1</option>
//                     <option value="type2">Type 2</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end mt-6">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
//             >
//               <FaFileExcel className="mr-2" />
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateCropCalendar;

import React, { useState } from "react";
import { FaCalendarAlt, FaFileExcel, FaTimes } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import { districtOfGhana } from "../../districts"; // Import the districts data

const CreateCropCalendar = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    region: "",
    district: "",
    crop: "",
    majorExcel: null,
    majorStartMonth: "",
    majorStartWeek: "",
    majorType: "",
    minorExcel: null,
    minorStartMonth: "",
    minorStartWeek: "",
    minorType: "",
  });

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(-50px)",
    config: { tension: 300, friction: 30 },
  });

  const backdropAnimation = useSpring({
    opacity: isOpen ? 0.5 : 0,
    config: { tension: 300, friction: 30 },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "region") {
      // Reset district when region changes
      setFormData({ ...formData, region: value, district: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your form submission logic here (e.g., API call)
    onClose(); // Close the modal after submission
  };

  const handleClose = () => {
    onClose(); // Call the onClose prop to close the modal and navigate back
  };

  // Get the districts for the selected region
  const selectedRegion = districtOfGhana.find(
    (regionData) => regionData.region === formData.region
  );
  const districts = selectedRegion ? selectedRegion.districts : [];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <animated.div
        style={backdropAnimation}
        className="fixed inset-0 bg-black z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <animated.div
        style={modalAnimation}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Crop Calendar
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Region, District, Crop */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  >
                    <option value="">Select Region...</option>
                    {districtOfGhana.map((regionData) => (
                      <option key={regionData.region} value={regionData.region}>
                        {regionData.region}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                    disabled={!formData.region} // Disable if no region is selected
                  >
                    <option value="">Select District...</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    required
                  >
                    <option value="">Select Crop...</option>
                    <option value="crop1">Crop 1</option>
                    <option value="crop2">Crop 2</option>
                    {/* Add more crops as needed */}
                  </select>
                </div>
              </div>

              {/* Major and Minor Season */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Major Season */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Major Season
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excel File <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-3">
                        <label className="w-1/2 p-3 border border-gray-300 rounded-lg bg-white text-gray-600 cursor-pointer hover:bg-gray-100 transition-all text-center">
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e, "majorExcel")}
                            className="hidden"
                            required
                          />
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500 truncate">
                          {formData.majorExcel
                            ? formData.majorExcel.name
                            : "No file chosen"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload Excel file for Major Season
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Week <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="majorStartWeek"
                          value={formData.majorStartWeek}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                          required
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Month <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="majorStartMonth"
                        value={formData.majorStartMonth}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        required
                      >
                        <option value="">Select Month...</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="majorType"
                        value={formData.majorType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Minor Season */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Minor Season
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excel File
                      </label>
                      <div className="flex items-center space-x-3">
                        <label className="w-1/2 p-3 border border-gray-300 rounded-lg bg-white text-gray-600 cursor-pointer hover:bg-gray-100 transition-all text-center">
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e, "minorExcel")}
                            className="hidden"
                          />
                          Choose File
                        </label>
                        <span className="text-sm text-gray-500 truncate">
                          {formData.minorExcel
                            ? formData.minorExcel.name
                            : "No file chosen"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Upload Excel file for Minor Season
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Week <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="minorStartWeek"
                          value={formData.minorStartWeek}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                          required
                        />
                        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Month <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="minorStartMonth"
                        value={formData.minorStartMonth}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        required
                      >
                        <option value="">Select Month...</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="minorType"
                        value={formData.minorType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="type1">Type 1</option>
                        <option value="type2">Type 2</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center"
                >
                  <FaFileExcel className="mr-2" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </animated.div>
    </>
  );
};

export default CreateCropCalendar;
