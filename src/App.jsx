import { useEffect, useState } from "react";
import "./App.css";
import SpotifyIcon from "./Components/SpotifyIcon";

const clientId = "f65e53e58bc041df807f07afec02e5c3";
const clientSecret = "f35903e1ebb942b1b2eeaeb990cc1dac";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);

  //accses token
  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((resp) => resp.json())
      .then((resp) => setAccessToken(resp.access_token));
  }, []);

  //Searchi logika
  async function search() {
    const artistParameters = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    const artistID = await fetch(
      `https://api.spotify.com/v1/search?q=${value}&type=artist`,
      artistParameters
    )
      .then((resp) => resp.json())
      .then((resp) => {
        return resp.artists.items[0].id;
      });

    await fetch(
      `https://api.spotify.com/v1/artists/${artistID}/albums?offset=0&limit=50&include_groups=album,single,compilation,appears_on`,
      artistParameters
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  // useEffect(() => {
  //   if (!accessToken || !value) return; //Ardyoq ka tenc value
  //   const artistParameters = {
  //     method: 'GET',
  //     headers: {
  //       Authorization: 'Bearer ' + accessToken,
  //     },
  //   };
  //   fetch(`https://api.spotify.com/v1/search?q=${value}&type=artist`, artistParameters)
  //     .then((resp) => resp.json())
  //     .then((resp) => {
  //       setData(resp.artists.items[0]);
  //     });
  // }, [accessToken, value]);
  // console.log(data.items);

  return (
    <div className="App">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          if (value.trim()) {
            search();
          }
        }}
      >
        Search
      </button>
      {data.items?.map(
        (e) =>
          e.images.length > 0 && (
            <SpotifyIcon key={e.id} imageUrl={e.images[0].url} name={e.name} />
          )
      )}
    </div>
  );
}

export default App;
