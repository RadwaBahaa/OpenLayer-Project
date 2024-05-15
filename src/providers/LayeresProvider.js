import TileLayer from "ol/layer/Tile";
import { OSM, XYZ } from "ol/source";
import { useContext, useEffect } from "react";
import Layers from "../components/Layers/JavaScript/Layers";
import { ContextLayer } from "../context/ContextLayer";

export default function LayeresProvider() {
  const {
    mapObject,
    osmLayerObject,
    setOsmLayerObject,
    darkLayerObject,
    setDarkLayerObject,
  } = useContext(ContextLayer); // Destructuring props to extract required objects

  // UseEffect for Layeres Creation
  useEffect(() => {
    //   OSM Layer Creation
    const osmLayer = new TileLayer({
      source: new OSM({}), // Using OpenStreetMap as the source
      visible: true,
      layerName: "osmLayer",
    });
    setOsmLayerObject(osmLayer); // Setting the OSM layer object in the context

    //   Dark Layer Creation
    const darkLayer = new TileLayer({
      source: new XYZ({
        url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png", // Dark tile layer source URL
      }),
      visible: false,
      layerName: "darkLayer",
    });
    setDarkLayerObject(darkLayer); // Setting the dark layer object in the context
  }, []);

  // UseEffect for Map Creation
  useEffect(() => {
    if (mapObject) {
      // Checking if the map object exists and the vector layer hasn't been added yet
      if (osmLayerObject) mapObject.addLayer(osmLayerObject); // Adding OpenStreetMap layer if available
      if (darkLayerObject) mapObject.addLayer(darkLayerObject); // Adding dark layer if available
    }
  }, [mapObject]); // Running this effect whenever the map object changes

  return (
    <>
      {/*  Layers Viewers */}
      <Layers />
    </>
  );
}
