import { useContext, useEffect, useRef, useState } from "react";
import { ContextLayer } from "../../../context/ContextLayer";
import { transform } from "ol/proj";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";
import "../CSS/Searching.css";

export default function Searching() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPlaces, setSearchPlaces] = useState([]);
  const { mapObject, setWeatherDataObject } = useContext(ContextLayer);

  useEffect(() => {
    var getData = setTimeout(() => {
      // Define an asynchronous function named getPlaceCoordinate
      const getPlaceCoordinate = async () => {
        // Use the fetch function to make a GET request to the OpenStreetMap Nominatim API
        fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
        )
          .then((responseObject) => responseObject.json()) // Parse the response body as JSON
          .then((data) => setSearchPlaces(data)); // Log the data to the console
      };
      // Call the getPlaceCoordinate function to initiate the process of fetching place coordinates
      getPlaceCoordinate();
    }, 500);
    return () => clearTimeout(getData);
  }, [searchQuery]);

  // Move the map to the clicked place
  const moveMap = (lon, lat) => {
    const prejectedCoord = transform([lon, lat], "EPSG:4326", "EPSG:3857");
    mapObject.getView().animate({ zoom: 10, center: prejectedCoord });
  };

  // Reset the search query
  const handleResetSearch = () => {
    setSearchQuery("");
    setSearchPlaces([]);
    setWeatherDataObject(null);
    mapObject.getView().animate({ center: [1000000, 2000000], zoom: 2 });
  };

  const getCityWeather = async (lat, lon) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => setWeatherDataObject(data));
  };

  useEffect(() => {
    if (mapObject) {
      mapObject.on("click", () => {
        setWeatherDataObject(null);
      });
    }
  }, [mapObject]);

  return (
    <>
      <div className="search-bar-main-container">
        <div className="search-bar-container">
          <input
            className="search-bar"
            id="SearchPlace"
            type="text"
            placeholder="Search Place"
            value={searchQuery}
            onInput={(e) => setSearchQuery(e.target.value)}
          />
          <div>
            <button
              className="button"
              onClick={() => {
                setSearchQuery(document.getElementById("SearchPlace").value);
                moveMap(searchPlaces[0].lon, searchPlaces[0].lat);
                getCityWeather(searchPlaces[0].lat, searchPlaces[0].lon);
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            <button className="button" onClick={handleResetSearch}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
        {searchPlaces.map((place) => {
          return (
            <div
              className="search-result"
              onClick={() => {
                moveMap(place.lon, place.lat);
                getCityWeather(place.lat, place.lon);
              }}
            >
              {place.display_name}
            </div>
          );
        })}
      </div>
    </>
  );
}
