import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
// import "./custom.css";
import styles from "./Custom.module.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("Rajamundary");
  const [cityDetails, setCityDetails] = useState([]);
  const [cord, setCord] = useState([17.004393, 81.783325]);
  const [text, setText] = useState(" ");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    // leafElement.locate({
    //   setView : true,
    // });

    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}`);
      setCities(res.data);
    })();
  }, [cityDetails, text, cord]);

  const handleChange = (text) => {
    let matches = [];
    if (text.length > 3) {
      matches = cities.filter((city) => {
        const regex = new RegExp(`${text}`, "gi");
        return city.city_ascii.match(regex);
      });
    }

    console.log(cities, matches, text);

    setSuggestions(matches);
    setText(text);
  };

  const onSuggestHandler = (text) => {
    setText(text);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.key == "Enter") {
      setText(text);
      let res = cities.filter((c) => text === c.city_ascii);
      setCityDetails(res);
      setCity(res[0].city);
      console.log(res[0].lat);
      setCord([res[0].lat, res[0].lng]);
      setText("");
    }
  };

  if (cityDetails) {
    const { current } = mapRef;
    if (current) {
      current.setView(cord);
    }
  }

  return (
    <div>
      <MapContainer
        center={cord}
        zoom={13}
        scrollWheelZoom={false}
        className={styles.map_contaner}
        style={{ overflow: "visible" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={cord}>
          <Tooltip>{city}</Tooltip>
        </Marker>
      </MapContainer>

      <div className={styles.body_container}>
        <input
          style={{ width: "20rem", height: "3rem" }}
          type="text"
          placeholder="Enter the city name"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyUp={handleSubmit}
          onBlur={() => {
            setTimeout(() => {
              setSuggestions([]);
            }, 100);
          }}
        />
        {suggestions && (
          <div style={{ background: "white" }}>
            {suggestions.slice(0, 7).map((suggestion, i) => (
              <p
                key={i}
                className="suggestion"
                onClick={() => onSuggestHandler(suggestion.city)}
              >
                {suggestion.city}
              </p>
            ))}
          </div>
        )}
      </div>

      {cityDetails
        ? cityDetails.map((c) => {
            return (
              <div className={styles.card}>
                <Card sx={{ maxWidth: 500 }}>
                  <CardContent>
                    <span className={styles.heading}>City : </span>
                    <span className={styles.value}>{c.city}</span>
                  </CardContent>
                  <CardContent>
                    <span className={styles.heading}>Country : </span>
                    <span className={styles.value}>{c.country}</span>
                  </CardContent>
                  <CardContent>
                    <span className={styles.heading}>Latitude : </span>
                    <span className={styles.value}>{c.lat}</span>
                  </CardContent>
                  <CardContent>
                    <span className={styles.heading}>Longitude : </span>
                    <span className={styles.value}>{c.lng}</span>
                  </CardContent>
                  <CardContent>
                    <span className={styles.heading}>Population : </span>
                    <span className={styles.value}>{c.population}</span>
                  </CardContent>
                </Card>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default App;
