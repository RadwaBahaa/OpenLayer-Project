import { useContext, useEffect, useRef } from "react";
import { ContextLayer } from "../context/ContextLayer";
import { Overlay } from "ol";

export default function ClusteringTempreture() {
  const { mapObject } = useContext(ContextLayer);
  const badgeRef = useRef(); // Reference to the badge element
  const popupRef = useRef(); // Reference to the popup element

  // Adding click event listener to the map
  useEffect(() => {
    if (mapObject) {
      mapObject.on("click", (event) => {
        let clickFeature = null;
        const props = popupPosition(); // Getting overlay properties based on click event
        mapObject.addOverlay(props); // Adding overlay to the map
        mapObject.forEachFeatureAtPixel(event.pixel, (feature) => {
          clickFeature = feature;
        });
        // Displaying popup content if a feature is clicked
        if (!clickFeature) {
          // Return the last map view if no feature is clicked
          mapObject.getView().animate({ center: [1000000, 2000000], zoom: 2 });
          props.setPosition(null); // Clearing position if no feature is clicked
          popupRef.current.innerHTML = ""; // Clearing popup content
        } else {
          // Setting map view to center and zoom based on clicked feature
          const coordinates = clickFeature.getGeometry().getCoordinates();
          mapObject.getView().animate({ center: coordinates, zoom: 5 });
          // Setting position of popup based on clicked feature
          props.setPosition(coordinates);
          const featureData = clickFeature.get("features")[0];
          const content = createPopupContent(featureData); // Creating popup content based on feature data
          if (popupRef.current) popupRef.current.innerHTML = content; // Setting popup content
        }
      });
    }
  }, [mapObject]);

  // Getting weather icon based on feature data
  const weatherImage = (feature) => {
    const weather = feature.get("weatherMain");
    switch (weather) {
      case "Clouds":
        return "/images/Cloudy.png";
      case "Clear":
        return "/images/Sunny.png";
      case "Rain":
        return "/images/Rainy.png";
      case "Snow":
        return "/images/Snowy.png";
      case "Thunderstorm":
        return "/images/Storm.png";
      case "Haze":
        return "/images/Windy.png";
      case "Mist":
        return "/images/Sand.png";
      case "Dust":
        return "/images/Sand.png";
      case "Sand":
        return "/images/Sand.png";
    }
  };

  // Calculating positioning for popup based on click event
  const popupPosition = () => {
    const props = new Overlay({
      element: popupRef.current,
      position: null,
    });
    return props;
  };

  // Creating popup content based on feature data
  const createPopupContent = (featureData) => {
    const {
      city,
      weatherMain,
      weatherDescription,
      minTemprture,
      maxTemprture,
    } = featureData.getProperties();
    const content = `<div>
          <img src=${weatherImage(
            featureData
          )} className="card-img-top" alt=${weatherMain} style="width:150px;margin:0px 10px"/>
        </div>
        <div style="border-left: 1px solid gray;margin: 10px 10px 10px 0px">
        <div style="margin-left: 10px">
          <h5  style="font-family: cursive;font-weight: 700;">${city}</h5>
          <p style="margin: 0px;font-family: cursive;font-size: 14px;">
          Weather : ${weatherMain}<br/>
          Description : ${weatherDescription}<br/>
          minTemperature : ${minTemprture}<br/>
          maxTemperature : ${maxTemprture}
          </p>
        </div>
        </div>`;
    return content;
  };

  return (
    <>
      <div ref={badgeRef}></div>
      <div
        className={`card mb-3 flex-row align-items-center justify-content-center text-bg-dark`}
        style={{
          position: "absolute",
          width: "400px",
          boxShadow: "2px 2px 10px 0 rgba(0,0,0,0.5)",
        }}
        ref={popupRef}
      ></div>
    </>
  );
}
