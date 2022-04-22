import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import "./custom.css";
import { styled } from "@mui/material/styles";
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
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  const [cities, setCities] = useState([]);
  const [cityDetails, setCityDetails] = useState([]);
  const [cord, setCord] = useState([]);
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

  const onSuggestHandler = (text) => {
    setText(text);
    setSuggestions([]);
  };

  const handleChange = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = cities.filter((city) => {
        const regex = new RegExp(`${text}`, "gi");
        return city.city_ascii.match(regex);
      });
    }

    console.log(cities,matches,text);

    setSuggestions(matches);
    setText(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.key == "Enter") {
      setText(text);
      let res = cities.filter((c) => text === c.city_ascii);
      setCityDetails(res);
      console.log(res[0].lat);
      setCord([res[0].lat, res[0].lng]);
      setText("");
    }
  };

  // console.log("cityDetails", cityDetails);

  // console.log(cord);

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

  if(cityDetails){
    const {current} = mapRef;
    if(current){
      current.setView(cord);
    }
  }

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
                      <MapContainer
                        center={cord}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "20rem" }}
                        id={text}
                        ref={mapRef}
                      >
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={cord}>
                          <Tooltip>{text}</Tooltip>
                        </Marker>
                      </MapContainer>
                    </Grid>
                  </Grid>
                </>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default App;










{/* <Autocomplete
            id="asynchronous-demo"
            sx={{ width: 300 , background: "white"}}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onChange={(event, value) => setSelected(value)}
            getOptionLabel={(option) => option.city}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          /> */}
