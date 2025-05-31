import { useState, useEffect } from "react";
import {
  FaThermometerHalf,
  FaBell,
  FaCloud,
  FaFileUpload,
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
  FaCloudRain,
  FaCloudSun,
  FaSun,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaFileAlt,
  FaSyncAlt,
  FaDownload,
  FaFileExcel,
  FaFileAlt as FaFileText,
} from "react-icons/fa";
import PropTypes from "prop-types";
import Sidebar from "./DashboardSidebar";
import FileUploadForm from "./FileUploadForm";

const Dashboard = ({ username = "User" }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([
    {
      location: "Accra",
      maxTemp: 33,
      minTemp: 24,
      icon: "thunderstorm",
      humidity: 78,
      precipitation: 25,
    },
    {
      location: "Kumasi",
      maxTemp: 34,
      minTemp: 25,
      icon: "sunny",
      humidity: 65,
      precipitation: 5,
    },
    {
      location: "Tamale",
      maxTemp: 35,
      minTemp: 24,
      icon: "cloudy",
      humidity: 60,
      precipitation: 0,
    },
    {
      location: "Cape Coast",
      maxTemp: 32,
      minTemp: 23,
      icon: "rain",
      humidity: 82,
      precipitation: 40,
    },
    {
      location: "Koforidua",
      maxTemp: 31,
      minTemp: 22,
      icon: "sunny",
      humidity: 68,
      precipitation: 10,
    },
    {
      location: "Takoradi",
      maxTemp: 30,
      minTemp: 24,
      icon: "cloudy-sun",
      humidity: 75,
      precipitation: 15,
    },
  ]);

  const [reports, setReports] = useState([
    {
      id: 1,
      type: "Flood and Drought Bulletins",
      date: "12-03-2025 19:01:37",
      days: 0,
      status: "new",
    },
    {
      id: 2,
      type: "Weekly",
      date: "06-02-2025 20:35:16",
      days: 34,
      status: "published",
    },
    {
      id: 3,
      type: "Mid Week",
      date: "06-02-2025 20:28:54",
      days: 34,
      status: "published",
    },
    {
      id: 4,
      type: "Daily afternoon",
      date: "06-02-2025 12:48:46",
      days: 34,
      status: "published",
    },
    {
      id: 5,
      type: "Weekend",
      date: "17-01-2025 17:39:39",
      days: 54,
      status: "archived",
    },
    {
      id: 6,
      type: "Subseasonal to Seasonal Forecast",
      date: "04-01-2025 16:09:06",
      days: 67,
      status: "archived",
    },
    {
      id: 7,
      type: "Audio Forecast - Video",
      date: "20-12-2024 05:22:50",
      days: 82,
      status: "archived",
    },
    {
      id: 8,
      type: "Agrometeorological Bulletins",
      date: "22-11-2024 15:51:21",
      days: 110,
      status: "archived",
    },
  ]);

  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Heavy Rainfall Warning",
      description: "Expected heavy rainfall in coastal areas",
      severity: "high",
      date: "13-03-2025",
    },
    {
      id: 2,
      title: "Drought Alert",
      description: "Potential drought conditions in northern regions",
      severity: "medium",
      date: "11-03-2025",
    },
    {
      id: 3,
      title: "Seasonal Forecast Updated",
      description: "New seasonal forecast available",
      severity: "low",
      date: "10-03-2025",
    },
  ]);

  const [currentDate, setCurrentDate] = useState("");

  const handleNavigate = (page) => {
    setIsLoading(true);
    setActivePage(page);
    // Show upload form for specific pages that need file uploads
    if (
      page === "weather-agro" ||
      page === "weather-flood" ||
      page === "weather-subseasonal" ||
      page === "weather-monthly" ||
      page === "weather-seasonal" ||
      page === "weather-climate" ||
      page === "weather-audio"
    ) {
      setShowUploadForm(false); // Don't immediately show upload form
    } else {
      setShowUploadForm(false);
    }

    // Simulate page loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleUploadSuccess = (fileData) => {
    setUploadedFiles([...uploadedFiles, fileData]);
    // Add the file to reports with current date
    const now = new Date();
    const dateStr =
      now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    const newReport = {
      id: reports.length + 1,
      type: getPageTitle(),
      date: dateStr,
      days: 0,
      status: "new",
    };

    setReports([newReport, ...reports]);

    // Show success message and hide form after a delay
    setTimeout(() => {
      setShowUploadForm(false);
    }, 2000);
  };

  const closeUploadForm = () => {
    setShowUploadForm(false);
  };

  // Function to handle template download
  const handleDownloadTemplate = () => {
    // Create template based on page type
    let templateContent = "";
    let filename = "";
    let fileType = "";

    switch (activePage) {
      case "weather-agro":
        templateContent =
          "Date,Region,Rainfall,Temperature,Humidity,CropType,GrowthStage,Recommendations\n2025-03-13,Accra,25,32,75,Maize,Flowering,Water weekly";
        filename = "agromet_template";
        fileType = "csv";
        break;
      case "weather-flood":
        templateContent =
          "Date,Region,RainfallAmount,FloodRisk,DroughtIndex,WarningLevel,RecommendedActions\n2025-03-13,Coastal,120,High,Low,Warning,Evacuate low-lying areas";
        filename = "flood_drought_template";
        fileType = "csv";
        break;
      case "weather-subseasonal":
        templateContent =
          "WeekStarting,WeekEnding,Region,ExpectedRainfall,TemperatureRange,ForecastConfidence,Notes\n2025-03-15,2025-03-21,Northern,20-30mm,24-35°C,Medium,Delayed onset of rains likely";
        filename = "subseasonal_template";
        fileType = "csv";
        break;
      case "weather-monthly":
        templateContent =
          "Month,Year,Region,ExpectedRainfall,AverageTemperature,AnomalyFromNormal,KeyMessages\n03,2025,Ashanti,150mm,28°C,+1.2°C,Higher than average rainfall expected";
        filename = "monthly_forecast_template";
        fileType = "csv";
        break;
      case "weather-seasonal":
        templateContent =
          "Season,Year,Region,RainfallOutlook,TemperatureOutlook,SeasonStart,SeasonEnd,Implications\nRainy,2025,Western,Above Normal,Normal,April,July,Good for crop production";
        filename = "seasonal_forecast_template";
        fileType = "csv";
        break;
      case "weather-climate":
        templateContent =
          "# State of the Climate Report Template\n\n## Executive Summary\n\n## Key Climate Indicators\n\n## Regional Breakdown\n\n## Climate Anomalies\n\n## Recommendations";
        filename = "climate_report_template";
        fileType = "txt";
        break;
      case "weather-audio":
        templateContent =
          "# Audio-Visual Weather Forecast Script Template\n\nDate: [DATE]\nForecaster: [NAME]\n\n## Introduction\n\n## Today's Weather Summary\n\n## Regional Forecasts\n\n## Special Warnings\n\n## Agricultural Advice\n\n## Closing";
        filename = "audio_visual_template";
        fileType = "txt";
        break;
      default:
        templateContent =
          "Date,Region,Parameter1,Parameter2,Parameter3,Notes\n2025-03-13,Central,Value1,Value2,Value3,Additional information";
        filename = "general_template";
        fileType = "csv";
    }

    // Create and download the file
    const blob = new Blob([templateContent], {
      type:
        fileType === "csv"
          ? "text/csv;charset=utf-8"
          : "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case "thunderstorm":
        return <FaCloudRain className="text-gray-700 text-3xl" />;
      case "sunny":
        return <FaSun className="text-yellow-500 text-3xl" />;
      case "rain":
        return <FaCloudRain className="text-blue-500 text-3xl" />;
      case "cloudy":
        return <FaCloud className="text-gray-500 text-3xl" />;
      case "cloudy-sun":
        return <FaCloudSun className="text-orange-400 text-3xl" />;
      default:
        return <FaCloud className="text-blue-500 text-3xl" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            New
          </span>
        );
      case "published":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Published
          </span>
        );
      case "archived":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Archived
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Get template file icon based on page
  const getTemplateIcon = () => {
    if (activePage === "weather-climate" || activePage === "weather-audio") {
      return <FaFileText className="mr-2" />;
    } else {
      return <FaFileExcel className="mr-2" />;
    }
  };

  // Get page title based on active page
  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard":
        return "Dashboard";
      case "emergency":
        return "Emergency Alert";
      case "weather-general":
        return "General Weather Forecast";
      case "weather-agro":
        return "Agromet Bulletins";
      case "weather-flood":
        return "Flood & Drought Bulletins";
      case "weather-subseasonal":
        return "S2S Forecast";
      case "weather-monthly":
        return "Monthly Forecast";
      case "weather-seasonal":
        return "Seasonal Forecast";
      case "weather-climate":
        return "State of the Climate Report";
      case "weather-audio":
        return "Audio Visual Forecast";
      case "news":
        return "News";
      default:
        return "Dashboard";
    }
  };

  useEffect(() => {
    // Set current date
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    );

    // Fetch weather data
    const fetchWeatherData = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("your-weather-api-endpoint");
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    // Fetch reports data
    const fetchReports = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("your-reports-api-endpoint");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchWeatherData();
    fetchReports();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-green-800">
                    Agro Climate
                  </h1>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 flex items-center md:ml-6">
                  <div className="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative cursor-pointer">
                    <FaBell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  </div>
                  <div className="ml-3 relative flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-2">
                      {username.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Admin
                      </div>
                      <div className="text-xs text-gray-500">{currentDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <FaSyncAlt className="animate-spin h-8 w-8 text-green-500" />
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200 pb-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Hello {username}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Welcome back to Admin! Your agricultural weather
                      monitoring platform.
                    </p>
                  </div>
                  {/* <div> create a search and pagination buttons here */}
                </div>

                {/* File Upload Modal */}
                {showUploadForm && (
                  <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all ease-in-out duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Upload {getPageTitle()} File
                        </h3>
                        <button
                          onClick={closeUploadForm}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <FileUploadForm
                        reportType={getPageTitle()}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </div>
                  </div>
                )}

                {activePage === "dashboard" && (
                  <>
                    {/* Alerts Section */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FaExclamationTriangle className="text-yellow-500 mr-2" />
                        Important Notices
                      </h3>
                      <div className="bg-white rounded-lg shadow overflow-hidden">
                        {notices.length > 0 ? (
                          <div className="divide-y divide-gray-200">
                            {notices.map((notice) => (
                              <div
                                key={notice.id}
                                className={`p-4 border-l-4 ${getSeverityColor(
                                  notice.severity
                                )}`}
                              >
                                <div className="flex justify-between">
                                  <h4 className="text-sm font-semibold">
                                    {notice.title}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {notice.date}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notice.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="p-4 text-sm text-gray-500">
                            No important notices at this time.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Weather Cards */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FaCloudSun className="text-blue-500 mr-2" />
                        Current Weather Conditions
                      </h3>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {weatherData.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white overflow-hidden shadow rounded-lg transition-transform duration-200 hover:shadow-md hover:transform hover:-translate-y-1"
                          >
                            <div className="px-4 py-5 sm:p-6">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                  <FaMapMarkerAlt className="text-red-500 mr-1 h-4 w-4" />
                                  {item.location}
                                </h3>
                                {getWeatherIcon(item.icon)}
                              </div>
                              <div className="border-t border-gray-100 pt-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="flex items-center">
                                      <FaThermometerHalf className="text-blue-500 mr-2" />
                                      <span className="text-sm text-gray-700 font-medium">
                                        Min: {item.minTemp}°C
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-1">
                                      <FaThermometerHalf className="text-red-500 mr-2" />
                                      <span className="text-sm text-gray-700 font-medium">
                                        Max: {item.maxTemp}°C
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-700">
                                      <span className="font-medium">
                                        Humidity:
                                      </span>{" "}
                                      {item.humidity}%
                                    </div>
                                    <div className="text-sm text-gray-700 mt-1">
                                      <span className="font-medium">
                                        Precip:
                                      </span>{" "}
                                      {item.precipitation}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 text-xs text-center text-gray-500">
                              Updated today at 06:00 AM
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reports Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FaFileAlt className="text-green-600 mr-2" />
                        Recent Reports
                      </h3>
                      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Report Type
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Captured Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Running Days
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {reports.map((report) => (
                                <tr
                                  key={report.id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {report.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <FaFileAlt className="text-gray-400 mr-2" />
                                      <span className="text-sm font-medium text-gray-900">
                                        {report.type}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {report.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {report.days}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(report.status)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                              Showing <span className="font-medium">8</span>{" "}
                              reports
                            </div>
                            <div className="flex-1 flex justify-end">
                              <button className="px-3 py-1 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                View All Reports
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Display page title when not on dashboard */}
                {activePage !== "dashboard" && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {getPageTitle()}
                      </h2>
                    </div>

                    {/* Content specific to the selected page */}
                    <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <p className="text-gray-700 mb-4">
                        {getPageTitle()} content will be displayed here.
                      </p>

                      {/* Placeholder content for the page */}
                      <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        <FaFileAlt className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500 text-center">
                          No {getPageTitle()} data available yet. Use the
                          template to prepare your data and upload a file.
                        </p>
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={handleDownloadTemplate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center shadow-sm hover:bg-blue-700 transition-colors duration-200"
                          >
                            {getTemplateIcon()}
                            Download Template
                          </button>
                          <button
                            onClick={() => setShowUploadForm(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center shadow-sm hover:bg-green-700 transition-colors duration-200"
                          >
                            <FaFileUpload className="mr-2" />
                            Upload {getPageTitle()}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  username: PropTypes.string,
};

export default Dashboard;
