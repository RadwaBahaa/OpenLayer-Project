import { useContext, useEffect, useState } from "react";
import { ContextLayer } from "../../../context/ContextLayer";
import { FullScreen, Rotate, Zoom } from "ol/control";
import "../CSS/Controlers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faArrowUp,
  faInfo,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { createRoot } from "react-dom/client";

export default function Controlers(props) {
  const { osmVisiblity, darkVisiblity } = props;
  const [attributionCollapse, setAttributionCollapse] = useState(false);
  const { mapObject } = useContext(ContextLayer);

  // Effect for adding OpenLayers controls to the mapObject
  useEffect(() => {
    if (mapObject) {
      mapObject.addControl(new Zoom());
      zoomControlChange();
      mapObject.addControl(new Rotate());
      rotateControlChange();
      mapObject.addControl(new FullScreen());
    }
  }, [mapObject]);

  // Effect for handling attribution display based on visibility toggles
  useEffect(() => {
    if (mapObject) {
      const attributionContainer = document.getElementsByClassName(
        "ol-attribution-data"
      )[0];
      // Display appropriate attribution based on collapse state and visibility toggles
      if (attributionCollapse && darkVisiblity) {
        attributionContainer.innerHTML = `<a href="https://stadiamaps.com/" target="_blank" class="ol-attribution-anchor">&copy; Stadia Maps</a>`;
      } else if (attributionCollapse && osmVisiblity) {
        attributionContainer.innerHTML = `<a href="https://www.openstreetmap.org" target="_blank" class="ol-attribution-anchor">&copy; OpenStreetMap contributors</a>`;
      } else {
        attributionContainer.innerHTML = ""; // Clear attribution container if collapse is false or visibility toggles are false
      }
    }
  }, [osmVisiblity, darkVisiblity, attributionCollapse]);

  // Function to customize zoom control icons
  function zoomControlChange() {
    const zoomControl = mapObject.controls.array_.find(
      (control) => control instanceof Zoom
    );
    const zoomInElement = document.createElement("div");
    const zoomOutElement = document.createElement("div");
    zoomControl.element.querySelector(".ol-zoom-in").innerHTML = "";
    zoomControl.element.querySelector(".ol-zoom-in").appendChild(zoomInElement);
    createRoot(zoomInElement).render(<FontAwesomeIcon icon={faPlus} />);
    zoomControl.element.querySelector(".ol-zoom-out").innerHTML = "";
    zoomControl.element
      .querySelector(".ol-zoom-out")
      .appendChild(zoomOutElement);
    createRoot(zoomOutElement).render(<FontAwesomeIcon icon={faMinus} />);
  }

  // Function to customize rotate control icons
  function rotateControlChange() {
    const rotateControl = mapObject.controls.array_.find(
      (control) => control instanceof Rotate
    );
    const rotateElement = document.createElement("div");
    rotateControl.element.querySelector(".ol-rotate-reset").innerHTML = "";
    rotateControl.element
      .querySelector(".ol-rotate-reset")
      .appendChild(rotateElement);
    createRoot(rotateElement).render(<FontAwesomeIcon icon={faArrowUp} />);
  }

  return (
    <>
      {/* Container for attribution control */}
      <div className="attribution-container dark">
        {/* Button for toggling attribution collapse */}
        <button
          className="ol-attribution"
          onClick={() => setAttributionCollapse(!attributionCollapse)} // Function to handle attribution collapse
          style={{ color: !attributionCollapse ? "gray" : "lightgray" }}
        >
          {/* Icon for collapse/expand */}
          <span className="ol-attribution-data"></span>
          {!attributionCollapse ? (
            <FontAwesomeIcon icon={faInfo} />
          ) : (
            <FontAwesomeIcon icon={faAngleLeft} />
          )}
        </button>
      </div>
    </>
  );
}
