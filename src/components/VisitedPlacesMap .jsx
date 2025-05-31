import React, { useEffect, useRef } from "react";

const VisitedPlacesMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Create script elements
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.text = `
      var visitedplaces_config = {
        "map": "ghana",
        "projection": "geoMercator",
        "theme": "dark-green",
        "water": 0,
        "graticule": 0,
        "names": 1,
        "duration": 2000,
        "slider": 0,
        "autoplay": 0,
        "autozoom": "none",
        "data": [
          {
            "places": [
              "GH-CP"
            ]
          }
        ],
        "home": "GH"
      };
    `;

    const commonScript = document.createElement("script");
    commonScript.src = "https://www.visitedplaces.com/js/common.js";

    const viewerScript = document.createElement("script");
    viewerScript.src = "https://www.visitedplaces.com/js/viewer.js";

    // Append scripts to the div
    mapRef.current.appendChild(configScript);
    mapRef.current.appendChild(commonScript);
    mapRef.current.appendChild(viewerScript);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      id="chartdiv"
      ref={mapRef}
      style={{ width: "100%", height: "600px" }}
    ></div>
  );
};

export default VisitedPlacesMap;
