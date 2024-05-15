import { useContext, useEffect, useRef } from "react";
import { ContextLayer } from "../context/ContextLayer";

export default function MapViewer() {
  const { mapObject } = useContext(ContextLayer);
  const mapDiv = useRef(); // Creating a reference to the map container div element using useRef hook
  useEffect(() => {
    if (mapObject) {
      // Checking if the map object exists and the vector layer hasn't been added yet
      mapObject.setTarget(mapDiv.current); // Setting the map's target to the map container div
    }
  }, [mapObject]); // Running this effect whenever any of the dependencies change

  return (
    <>
      {/*  Container for the map */}
      <div
        style={{ width: "100%", height: "100%", position: "absolute" }}
        ref={mapDiv}
      ></div>
    </>
  );
}
