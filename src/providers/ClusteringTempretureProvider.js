import { useContext, useEffect, useState } from "react";
import { ContextLayer } from "../context/ContextLayer";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { transform } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import ClusterSource from "ol/source/Cluster";
import ClusteringTempreture from "../components/ClusteringTempreture";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Text from "ol/style/Text";

export default function ClusteringTempretureProvider() {
  const { mapObject } = useContext(ContextLayer); // Getting mapObject from ContextLayer
  const [clusteredFeatures, setClusteredFeatures] = useState([]); // State for storing clustered features

  // Fetching weather data on component mount
  useEffect(() => {
    fetch("/citiesWeather.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setClusteredFeatures(mapCitiesToFeatures(data.cities))) // Mapping weather data to features
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  // Adding vector layer with clustered features to the map
  useEffect(() => {
    if (clusteredFeatures.length) {
      const vectorSource = new VectorSource({
        features: clusteredFeatures,
      });
      const clusterSource = new ClusterSource({
        source: vectorSource,
        distance: 70,
      });
      const vectorLayer = new VectorLayer({
        source: clusterSource,
        layerName: "clusterLayer",
        style: (feature) => {
          // Style for the point
          return new Style({
            image: new CircleStyle({
              radius: 3,
              width: 20,
              fill: new Fill({
                color: "rgb(92, 113, 121, 0.5)",
              }),
              stroke: new Stroke({
                color: "rgb(72, 89, 95)",
                width: 0.5,
              }),
            }),
            text: new Text({
              text: feature.values_.features[0].values_.city,
              font: "12px cursive",
              overflow: true,
              offsetX: -5,
              offsetY: 5,
              textAlign: "right",
              style: "bolder",
              stroke: new Stroke({
                color: "white",
                width: 1,
              }),
            }),
          });
        },
      });

      mapObject.addLayer(vectorLayer);
    }
  }, [mapObject, clusteredFeatures]);
  // Mapping weather data to features
  const mapCitiesToFeatures = (cities) => {
    const allCities = [];
    Object.values(cities).forEach((eachCity) => {
      const point = [eachCity.city.coord.lon, eachCity.city.coord.lat];
      const city = eachCity.city.name;
      const weatherMain = eachCity.weather[0].main;
      const weatherDescription = eachCity.weather[0].description;
      const minTemprture = eachCity.main.temp_min;
      const maxTemprture = eachCity.main.temp_max;
      const projectedPoint = transform(point, "EPSG:4326", "EPSG:3857");
      const feature = new Feature({
        geometry: new Point(projectedPoint),
        city,
        weatherMain,
        weatherDescription,
        minTemprture,
        maxTemprture,
      });
      allCities.push(feature);
    });
    return allCities;
  };

  return (
    <>
      <ClusteringTempreture />
    </>
  );
}
