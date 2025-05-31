import { FaDownload } from "react-icons/fa"; // For download icon
import { useNavigate } from "react-router-dom";

const MonthlyForecast = () => {
  const issuedDate = "September 1, 2024";
  const validPeriod = "September 2024";
  const navigate = useNavigate();
  const forecastData = [
    {
      month: "September",
      description: "Above-average rainfall expected throughout the month.",
      temperature: "25-30°C",
    },
    {
      month: "October",
      description: "Cooler temperatures with increased chances of rainfall.",
      temperature: "20-28°C",
    },
    {
      month: "November",
      description: "Expected transition to dry conditions with warmer days.",
      temperature: "22-31°C",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen p-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-teal-500 hover:text-teal-600 flex items-center gap-2 transition-colors mb-6"
        >
          <span>←</span>
          <span className="text-sm font-medium">GO BACK</span>
        </button>
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-10 pt-20">
          <h1 className="text-blue-900 text-4xl font-bold mb-4 text-center">
            Monthly Weather Forecast
          </h1>
          <p className="text-md text-gray-700 text-center mb-8">
            Issued Date: {issuedDate} | Valid Period: {validPeriod}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {forecastData.map((forecast, index) => (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold text-blue-900 mb-6">
                  {forecast.month}
                </h2>
                <p className="text-gray-600 mb-6">{forecast.description}</p>
                <p className="text-lg font-bold text-gray-800">
                  Temperature: {forecast.temperature}
                </p>
              </div>
            ))}
          </div>

          {/* Download Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-blue-900 mb-6">
              Download Full Forecast
            </h2>
            <p className="text-gray-600 mb-6">
              Access the detailed monthly forecast report.
            </p>
            <a
              href="/path/to/monthly-forecast.pdf"
              download
              className="bg-blue-900 text-white text-sm px-3 py-2 rounded inline-flex items-center justify-center hover:bg-blue-700 transition duration-200"
            >
              <FaDownload className="mr-2" />
              Download Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyForecast;
