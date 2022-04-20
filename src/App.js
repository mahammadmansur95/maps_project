import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import "./custom.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";

function App() {
  const [cities, setCities] = useState([]);
  const [cityDetails, setCityDetails] = useState([]);
  const [city, setCity] = useState("");
  const [text, setText] = useState(" ");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_API}`);
      setCities(res.data);
    })();
  }, []);

  const onSuggestHandler = (text) => {
    setText(text);
    setSuggestions([]);
  };

  const handleChange = (text) => {
    let matches = [];
    if (text.length > 0 > 0) {
      matches = cities.filter((city) => {
        const regex = new RegExp(`${text}`, "gi");
        return city.city_ascii.match(regex);
      });
    }

    setSuggestions(matches);
    setText(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.key == "Enter") {
      setCity(text);
      let res = cities.filter((c) => text === c.city_ascii);
      setCityDetails(res);
      setText("");
    }
  };

  console.log("cityDetails", cityDetails);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#D3CDC3",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }));

  return (
    <div className="App">
      <h1>Search cities</h1>
      <div>
        <input
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
        {suggestions &&
          suggestions.slice(0, 7).map((suggestion, i) => (
            <div
              key={i}
              className="suggestion"
              onClick={() => onSuggestHandler(suggestion.city)}
            >
              {suggestion.city}
            </div>
          ))}
      </div>

      <div>
        <h1>Details</h1>
        {cityDetails
          ? cityDetails.map((c) => {
              return (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Item>
                        <label style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          City :{" "}
                        </label>
                        <p>{c.city}</p>
                      </Item>
                      <Item>
                        <label style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          Country :{" "}
                        </label>
                        <p>{c.country}</p>
                      </Item>
                      <Item>
                        <label style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          Latitude :{" "}
                        </label>
                        <p>{c.lat}</p>
                      </Item>
                      <Item>
                        <label style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          Longitude :{" "}
                        </label>
                        <p>{c.lng}</p>
                      </Item>
                      <Item>
                        <label style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          Population :{" "}
                        </label>
                        <p>{c.population}</p>
                      </Item>
                    </Grid>
                    <Grid item xs={8}>
                      <Item style={{height:"19rem"}}>
                        <p>Map container</p>
                      </Item>
                    </Grid>
                  </Grid>
                  {/* <div style={{marginTop: "1rem"}}> 
                    <MapContainer
                      center={[c.lat, c.lng]}
                      zoom={13}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
                      />
                      <Marker position={[c.lat, c.lng]}>
                        <Tooltip>{c.city}</Tooltip>
                      </Marker>
                    </MapContainer>
                  </div> */}
                </>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default App;
