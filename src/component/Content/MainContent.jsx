import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import RatingIcon from "../MovieDetail/RatingIcon";

import "./MainContent.css";
import { movie, loader } from "../../assets/Images";




const MainContent = ({ movies, count, increment, decrement, searchResults }) => {
 console.log('component re-renders');

 useEffect(() => {
   // Apply animation styles on every re-render
   const mainContentContainer = document.querySelector(
     ".mainContent-container"
   );
   if (mainContentContainer) {
     mainContentContainer.style.animation = "animate 0.5s ease-in-out forwards";
   }
 });

  const displayMovies = searchResults.length > 0 ? searchResults : movies;

  return (
    <div className={`mainContent-container ${displayMovies ? "animate" : ""}`}>
      {/* Hero Content */}
      {displayMovies.length > 0 ? (
        <>
          <Link to={`/movie/${displayMovies[3].id}`}>
            <div className="main-content__hero">
              <div className="overlay"></div>

              {/* Hero Image */}
              {displayMovies[3].poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${displayMovies[3].poster_path}`}
                />
              ) : (
                <img src="https://via.placeholder.com/250x350" />
              )}

              {/* Hero Text */}
              <div className="main-content__hero--text">
                <h3>{displayMovies[3].title}</h3>
                <p>{displayMovies[3].overview}</p>
              </div>
            </div>
          </Link>

          <div className="main-content__movie">
            {displayMovies.map((movie) => {
              return (
                <Link
                  to={`/movie/${movie.id}`}
                  key={movie.id}
                  className="main-content__movie-link"
                >
                  <div className="content">
                    {/* Check if poster_path exists before accessing it */}
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      />
                    ) : (
                      <img src="https://via.placeholder.com/250x350" />
                    )}

                    <h2>{movie.title}</h2>
                    <div className="rating">
                      {<RatingIcon rating={movie.vote_average} />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="buttons">
            <button className="prev-btn" onClick={decrement}>
              Prev
            </button>
            <p>{count}</p>
            <button className="next-btn" onClick={increment}>
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="result-not-found">No match found</div>
      )}
    </div>
  );
};

export default MainContent;
