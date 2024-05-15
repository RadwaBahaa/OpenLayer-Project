import { useContext, useEffect, useRef } from "react";
import { ContextLayer } from "../context/ContextLayer";
import { Overlay } from "ol";
import { transform } from "ol/proj";

export default function Popup() {
  const { mapObject, weatherDataObject } = useContext(ContextLayer);
  const popupRef = useRef(); // Reference to the popup element

  useEffect(() => {
    const props = popupPosition();
    if (weatherDataObject && mapObject) {
      const lon = weatherDataObject.coord.lon;
      const lat = weatherDataObject.coord.lat;
      const transformedCoord = transform([lon, lat], "EPSG:4326", "EPSG:3857");
      mapObject.addOverlay(props);
      if (popupRef.current) {
        const content = createPopupContent(weatherDataObject);
        props.setPosition(transformedCoord);
        popupRef.current.innerHTML = content;
      }
    } else {
      if (popupRef.current) {
        popupRef.current.innerHTML = ""; // Clear popup content if data is missing
        props.setPosition(null);
      }
    }
  }, [weatherDataObject, mapObject]);

  // Getting weather icon based on feature data
  const weatherImage = (weather) => {
    // const weather = feature.get("weatherMain");
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
      default:
        return "/images/Unknown.png"; // Return a default image if weather condition is not recognized
    }
  };

  const createPopupContent = (weatherDataObject) => {
    const name = weatherDataObject.name;
    const weather = weatherDataObject.weather[0].main;
    const temp_max = weatherDataObject.main.temp_max;
    const temp_min = weatherDataObject.main.temp_min;
    const content = `<div>
         <img src=${weatherImage(
           weather
         )} className="card-img-top" alt=${weather} style="width:150px;margin:0px 10px"/>
        </div>
        <div style="border-left: 1px solid gray;margin: 10px 10px 10px 0px">
        <div style="margin-left: 10px">
          <h5  style="font-family: cursive;font-weight: 700;">${name}</h5>
          <p style="margin: 0px;font-family: cursive;font-size: 14px;">
          minTemperature : ${temp_min}<br/>
          maxTemperature : ${temp_max}
          </p>
        </div>
        </div>`;
    return content;
  };

  const popupPosition = () => {
    const props = new Overlay({
      element: popupRef.current,
      positioning: "bottom-left",
      position: null,
    });
    return props;
  };

  return (
    <>
      <div
        className={`card mb-3 flex-row align-items-center justify-content-center text-bg-dark`}
        style={{
          position: "absolute",
          width: "370px",
          boxShadow: "2px 2px 10px 0 rgba(0,0,0,0.5)",
        }}
        ref={popupRef}
      ></div>
    </>
  );
}
