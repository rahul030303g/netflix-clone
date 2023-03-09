import React,{useEffect, useState} from 'react';
import axios from './axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";


function Row({title,fetchUrl,isLargeRow}){

    const [movies,setMovies] = useState([]);
    const [trailerUrl,setTrailerUrl] = useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
   

      useEffect(()=>{
        
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            // console.log(request);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    },[fetchUrl])

      

     
    

    const opts = {
        height:"390",
        width:"100%",
        playerVars:{
            autoplay:1
        },
    };
    
    let handleClick = (movie)=>{
        if(trailerUrl){
            console.log(trailerUrl,"t")
            setTrailerUrl("");
        }else{
           
            setErrorMessage("")
            console.log(movie,"tt")
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

    // console.log(movies)
    return(
        <div className="row">
        <h1>{title}</h1>
            <div className="row__posters">
            {movies.map(movie=>
              
            <img key={movie.id}
            onClick={()=>{
                handleClick(movie)
            }}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`} src=
            {`${base_url}${isLargeRow?movie.poster_path:movie.backdrop_path}`} 
            alt={movie.name}/>

            
            )}
            </div>
            {errorMessage ?  <div class="alert alert-danger" role="alert">
            {errorMessage}
          </div> : null}
            {trailerUrl ? <YouTube videoId={trailerUrl} opts={opts}></YouTube> :
           null
        }
        </div>
    )
}

export default Row;

