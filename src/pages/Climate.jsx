import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  useMap,
} from "react-leaflet";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GHANA_BOUNDS = [
  // [4.0189, -4.7943],
  // [12.1731, -4.7943],
  // [12.1731, 2.5778],
  // [4.0189, 2.5778],
  // [4.0189, -4.7943],
];

const STATIONS = [
  {
    id: 1,
    name: "Abetifi",
    coordinates: [6.6768, -0.7471],
    elevation: 595,
    rainfall: {
      LTM: [80, 100, 120, 170, 200, 240, 210, 190, 207, 140, 160, 80],
      2022: [100, 120, 150, 200, 250, 300, 280, 260, 240, 180, 120, 90],
      2021: [90, 110, 140, 190, 240, 290, 270, 250, 230, 170, 110, 80],
    },
  },
  {
    id: 2,
    name: "Accra",
    coordinates: [5.6037, -0.187],
    elevation: 61,
    rainfall: {
      LTM: [80, 100, 120, 170, 200, 240, 210, 190, 207, 140, 160, 80],
      2022: [80, 100, 130, 180, 230, 280, 260, 240, 220, 160, 100, 70],
      2021: [70, 90, 120, 170, 220, 270, 250, 230, 210, 150, 90, 60],
    },
  },
];

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const MapControls = ({ onReset }) => {
  const map = useMap();

  return (
    <div className="absolute left-2 top-2 flex flex-col gap-2 z-[400]">
      <button
        onClick={() => map.setZoom(map.getZoom() + 1)}
        className="w-8 h-8 bg-white rounded shadow-md hover:bg-gray-100 flex items-center justify-center"
      >
        +
      </button>
      <button
        onClick={() => map.setZoom(map.getZoom() - 1)}
        className="w-8 h-8 bg-white rounded shadow-md hover:bg-gray-100 flex items-center justify-center"
      >
        -
      </button>
      <button
        onClick={onReset}
        className="w-8 h-8 bg-white rounded shadow-md hover:bg-gray-100 flex items-center justify-center text-xs"
      >
        ⟲
      </button>
    </div>
  );
};

MapControls.propTypes = {
  onReset: PropTypes.func.isRequired,
};

const MapLegend = () => (
  <div className="absolute right-2 top-2 bg-white rounded-md shadow-md p-2 z-[400]">
    <div className="flex flex-col gap-1">
      <div className="text-xs font-medium">mm</div>
      <div className="h-40 w-4 bg-gradient-to-b from-purple-800 via-blue-500 to-yellow-300" />
      <div className="text-xs">0</div>
    </div>
  </div>
);

const ClimateReport = () => {
  const [station, setStation] = useState("");
  const [years, setYears] = useState({
    year1: "2022",
    year2: "2021",
    year3: null,
    year4: null,
    year5: null,
    year6: null,
  });
  const [loading, setLoading] = useState(false);
  const [rainfallData, setRainfallData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("percentile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const defaultCenter = [7.9465, -1.0232];
  const defaultZoom = 7;

  const getRainfallData = (stationName, selectedYears) => {
    const selectedStation = STATIONS.find((s) => s.name === stationName);
    if (!selectedStation) return null;

    const datasets = Object.entries(selectedYears)
      .filter(([, year]) => year)
      .map(([key, year]) => ({
        label: year,
        data: selectedStation.rainfall[year],
        borderColor: key === "year1" ? "#3B82F6" : "#10B981",
        tension: 0.1,
      }));

    return {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets,
    };
  };

  const handleLoadData = () => {
    setLoading(true);
    setIsModalOpen(true);
    setTimeout(() => {
      const data = getRainfallData(station, years);
      setRainfallData(data);
      setLoading(false);
    }, 1000);
  };

  const handleResetMap = () => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, defaultZoom);
    }
  };

  const handleStationSelect = (stationName) => {
    setStation(stationName);
    const selectedStation = STATIONS.find((s) => s.name === stationName);
    if (selectedStation && mapRef.current) {
      mapRef.current.setView(selectedStation.coordinates, 9);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-teal-500 hover:text-teal-600 flex items-center gap-2 transition-colors mb-6"
        >
          <span>←</span>
          <span className="text-sm font-medium">BACK TO HOME</span>
        </button>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 relative">
            <div className="w-full h-[50vh] lg:h-[780px] rounded-lg overflow-hidden">
              <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                ref={mapRef}
                className="w-full h-full rounded-lg"
                zoomControl={false}
                style={{ zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">FutureDev</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polygon
                  positions={GHANA_BOUNDS}
                  pathOptions={{
                    color: "purple",
                    fillColor: "purple",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
                {STATIONS.map((s) => (
                  <CircleMarker
                    key={s.id}
                    center={s.coordinates}
                    radius={8}
                    pathOptions={{
                      color: station === s.name ? "#3B82F6" : "#fff",
                      fillColor: station === s.name ? "#3B82F6" : "#fff",
                      fillOpacity: 1,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => handleStationSelect(s.name),
                    }}
                  />
                ))}
                <MapControls onReset={handleResetMap} />
                <MapLegend />
              </MapContainer>
            </div>
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Station Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SELECT STATION
                </label>
                <select
                  value={station}
                  onChange={(e) => handleStationSelect(e.target.value)}
                  className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a station</option>
                  {STATIONS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rain Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SELECT RAIN PRODUCT
                </label>
                <div className="space-y-2">
                  {["Percentile & Year", "Box plot", "Station compare"].map(
                    (option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="rain-product"
                          value={option.toLowerCase()}
                          checked={selectedProduct === option.toLowerCase()}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Years Selection */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(years).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.toUpperCase()}
                      </label>
                      <select
                        value={value || ""}
                        onChange={(e) =>
                          setYears((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">None</option>
                        {[2024, 2023, 2022, 2021, 2020].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* Display Options */}
                <div className="mt-4 space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Show years</span>
                  </label>
                  {["Show wet/dry", "Show percentiles", "No normals"].map(
                    (option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="display-option"
                          className="mr-2"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Load Data Button */}
              <button
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                onClick={handleLoadData}
                disabled={loading || !station}
              >
                {loading ? "Loading..." : "LOAD DATA"}
              </button>

              {/* TAMSAT Product Choice */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TAMSAT PRODUCT CHOICE
                </label>
                <select className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>1/2024 - 12/2024 Accumul.</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !loading && setIsModalOpen(false)}
      >
        <div className="text-center p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          ) : (
            rainfallData && (
              <div>
                <h3 className="text-lg font-medium mb-6">
                  Rainfall Data for {station}
                </h3>
                <div className="w-full max-h-[600px] overflow-y-auto">
                  <div className="aspect-[16/9]">
                    <Line
                      data={rainfallData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: "top",
                            labels: {
                              usePointStyle: true,
                              padding: 20,
                            },
                          },
                          tooltip: {
                            mode: "index",
                            intersect: false,
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            titleColor: "#111827",
                            bodyColor: "#374151",
                            borderColor: "#E5E7EB",
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Rainfall (mm)",
                              font: {
                                size: 12,
                                weight: "medium",
                              },
                            },
                            grid: {
                              color: "#F3F4F6",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                        interaction: {
                          intersect: false,
                          mode: "index",
                        },
                      }}
                    />
                  </div>

                  {/* Additional Statistics */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Station Details
                      </h4>
                      <dl className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">Elevation:</dt>
                          <dd className="text-gray-900 font-medium">
                            {STATIONS.find((s) => s.name === station)
                              ?.elevation || 0}{" "}
                            m
                          </dd>
                        </div>
                        <div className="flex justify-between text-sm">
                          <dt className="text-gray-500">Coordinates:</dt>
                          <dd className="text-gray-900 font-medium">
                            {STATIONS.find((s) => s.name === station)
                              ?.coordinates.map((coord) => coord.toFixed(4))
                              .join(", ")}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Rainfall Summary
                      </h4>
                      <dl className="space-y-1">
                        {rainfallData.datasets.map((dataset, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <dt className="text-gray-500">
                              {dataset.label} Average:
                            </dt>
                            <dd className="text-gray-900 font-medium">
                              {(
                                dataset.data.reduce((a, b) => a + b, 0) /
                                dataset.data.length
                              ).toFixed(1)}{" "}
                              mm
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        /* Add export functionality */
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Export Data
                    </button>
                    <button
                      onClick={() => {
                        /* Add export functionality */
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Export Chart
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ClimateReport;
