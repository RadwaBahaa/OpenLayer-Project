import { useContext, useEffect, useState } from "react";
import { Map, View } from "ol";
import { ContextLayer } from "../context/ContextLayer";
import MapViewer from "../components/MapViewer"; // Assuming this is a component to display the map

export default function MapProviver() {
  // Extracting Context Data
  const { setMapObject } = useContext(ContextLayer);

  // UseEffect for Map Creation
  useEffect(() => {
    const map = new Map({
      controls: [],
    }); // Creating a new map instance
    const view = new View({
      center: [1000000, 2000000],
      zoom: 2,
    });
    map.setView(view); // Setting the view of the map
    setMapObject(map); // Setting the map object in the context
  }, []);

  return (
    <>
      <MapViewer />
    </>
  );
}
