import React, { useEffect, useState } from "react";
import axios from "./axios";
import requests from "./request";
import "./Banner.css";
import movieTrailer from 'movie-trailer';
import YouTube from 'react-youtube';

const Banner = () => {

  const [movie, setMovie] = useState([]);
  const [trailerUrl,setTrailerUrl] = useState("");
  const [errorMessage,setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const opts = {
    height:"390",
    width:"100%",
    playerVars:{
        autoplay:1
    },
    
};

  let handleClick = (movie)=>{
    if(trailerUrl){
        setTrailerUrl("");
    }else{
       
        setErrorMessage("")

        movieTrailer(movie?.name || "")
        .then(url=>{
            const urlParams = new URLSearchParams(new URL(url).search);
            const urlOfMovie =  urlParams.get('v')
            console.log(urlOfMovie, 'url t')
            setTrailerUrl(urlParams.get('v'));
        })
        .catch(error=>{
            console.log(error,"er")
            setErrorMessage("Movie trailer not Available")
        })
    }
}

  console.log(movie,'mv');
  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(
                "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
            )`,
        backgroundPosition: "center center",
      }}
    >
  
      {trailerUrl ? <YouTube videoId={trailerUrl} opts={opts}></YouTube> :
     null
  }
   
      <div className="banner__contents">
      {errorMessage ?  <div class="alert alert-danger" role="alert">
      {errorMessage}
    </div> : null}
        <h1 className="banner__title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="banner__buttons">
          <button onClick = {()=> handleClick(movie)} className="banner__button">Play</button>
          <button className="banner__button">List</button>
        </div>
        <h1 className="banner__description">
          {movie?.overview}
          {truncate(movie?.overview, 150)}
        </h1>
      </div>
      <div className="fade--bottom"></div>
   
    </header>
  );
};

export default Banner;
