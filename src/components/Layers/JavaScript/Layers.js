import { useContext, useEffect, useState } from "react";
import "../CSS/Layers.css";
import Controlers from "../../Controlers/JavaScript/Controlers";
import { ContextLayer } from "../../../context/ContextLayer";

export default function Layers() {
  const { osmLayerObject, darkLayerObject } = useContext(ContextLayer);
  const [osmVisiblity, setOsmVisibility] = useState(true);
  const [darkVisiblity, setDarkVisibility] = useState(false);
  const [switchLayer, setSwitchLayer] = useState(false);
  const { mapObject } = useContext(ContextLayer);

  // Effect for switching between OSM and dark layers
  useEffect(() => {
    if (mapObject) {
      setOsmVisibility(!osmVisiblity);
      setDarkVisibility(!darkVisiblity);
    }
  }, [switchLayer]);

  // Function to switch between map layers
  const handleSwitchLayer = (nameOfLayer) => {
    [osmLayerObject, darkLayerObject].forEach((layer) => {
      layer.setVisible(false); // Hiding all layers initially
      const name = layer.get("layerName"); // Getting the layer name
      if (name === nameOfLayer) {
        layer.setVisible(true); // Making the selected layer visible
      }
      if (switchLayer) setSwitchLayer(false);
      else setSwitchLayer(true);
    });
  };

  return (
    <>
      <div className="layers-container">
        {/* Label for OSM layer radio button */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="radio"
            role="switch"
            name="layers"
            id="osmLayer"
            defaultChecked={true}
            onChange={(e) => {
              // Handling switch to OSM layer
              handleSwitchLayer(e.target.id);
            }}
          />
          <label className="form-check-label label" htmlFor="osmLayer">
            {osmLayerObject ? "OSM Layer" : null}
          </label>
        </div>
        {/*  Label for dark layer radio button */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="radio"
            role="switch"
            id="darkLayer"
            name="layers"
            defaultChecked={false}
            onChange={(e) => {
              // Handling switch to dark layer
              handleSwitchLayer(e.target.id);
            }}
          />
          <label
            className="form-check-label label"
            htmlFor="darkLayer"
            style={{ fontFamily: "cursive" }}
          >
            {darkLayerObject ? "Dark Layer" : null}
          </label>
        </div>
      </div>
      <Controlers osmVisiblity={osmVisiblity} darkVisiblity={darkVisiblity} />
    </>
  );
}
