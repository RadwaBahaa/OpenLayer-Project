import "./App.css";
import { useState } from "react";
import { ContextLayer } from "./context/ContextLayer";
import Searching from "./components/Searching/JavaScript/Searching";
import MapProviver from "./providers/MapProvider";
import LayeresProvider from "./providers/LayeresProvider";
import ClusteringTempretureProvider from "./providers/ClusteringTempretureProvider";
import Popup from "./components/Popup";

function App() {
  const [mapObject, setMapObject] = useState();
  const [osmLayerObject, setOsmLayerObject] = useState();
  const [darkLayerObject, setDarkLayerObject] = useState();
  const [weatherDataObject, setWeatherDataObject] = useState();

  return (
    <div>
      <ContextLayer.Provider
        value={{
          mapObject,
          setMapObject,
          osmLayerObject,
          setOsmLayerObject,
          darkLayerObject,
          setDarkLayerObject,
          weatherDataObject,
          setWeatherDataObject,
        }}
      >
        <Searching />
        <LayeresProvider />
        <MapProviver />
        <Popup />
        <ClusteringTempretureProvider />
      </ContextLayer.Provider>
    </div>
  );
}

export default App;
