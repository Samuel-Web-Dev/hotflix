// MovieDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TfiWorld } from "react-icons/tfi";
import { MdMovie } from "react-icons/md";
import { PiLadderSimpleFill } from "react-icons/pi";
import { GiEternalLove } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineArrowUpward } from "react-icons/md";
import { loader } from "../../assets/Images";

import RatingIcon from "./RatingIcon";

import "./MovieDetail.css";

const MovieDetail = () => {
  const apiKey = "b2dfdaa86645fe8db1cf996b0f0886fe";
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [topCast, setTopCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [likeMore, setLikeMore] = useState([])

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovieDetails(data);

        // Fetch top cast for the movie
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
        );
        const castData = await castResponse.json();
        setTopCast(castData.cast.slice(0, 6));

 
        const url = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`);
        const recommend = await url.json();
        setLikeMore(recommend.results)
        

      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, []);



  // Recommended Movie Details
  const fetchRecommendedMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
      );
      const data = await response.json();
      setMovieDetails(data);
  
      // Fetch top cast for the recommended movie
      const castResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`
      );
      const castData = await castResponse.json();
      setTopCast(castData.cast.slice(0, 6));

     window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error("Error fetching recommended movie details:", error);
    }
  };
  

  const handleFetchVidoe = async () => {
    const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`);
    const videosData = await videosResponse.json();
     // Find the first video that is likely to be a trailer
     const trailer = videosData.results.find((video) => video.type === "Trailer" && video.site === "YouTube");
     if (trailer) {
      setTrailerKey(trailer.key);
    }
  }

  const openTrailerModal = () => {
    handleFetchVidoe()
     // Set the overflow property to hidden when the modal is opened
     document.body.style.overflow = "hidden";
    setShowTrailerModal(true);

    // Add event listener to close modal when clicking outside of it
    document.addEventListener("mousedown", handleOutsideClick);
  };

  const closeTrailerModal = () => {
    // Reset the overflow property to auto when the modal is closed
    document.body.style.overflow = "auto";
    setShowTrailerModal(false);

    // Remove event listener when the modal is closed
    document.removeEventListener("mousedown", handleOutsideClick);
  };

  const handleOutsideClick = (event) => {
    // Close the modal if the click is outside the modal content
    const modalContent = document.querySelector(".modal-content");
    if (modalContent && !modalContent.contains(event.target)) {
      closeTrailerModal();
    }
  };


  const navigate = useNavigate()
  const backButton = () => {
   navigate(-1)
  }

  let releaseDate;

  // If MovieDetails is true, Modify the release date
  if (movieDetails) {
    releaseDate = movieDetails.release_date.slice(0, 4);
  }

  if (!movieDetails || !topCast || !likeMore) {
    document.body.style.overflow = 'hidden'
    return <div className="loading"><img src={loader} /></div>;
  }

  return (
    <>
      <div className="movie__detail">
        <img
          src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
          alt="The poster Image"
          className="movie__detail--poster"
        />

        <div className="movie__detail--content">
          <h1>{`${movieDetails.title}(${releaseDate})`}</h1>
          <h3>{movieDetails.tagline}</h3>

          <div className="movie__detail--ratings">
            <div className="movie__detail--ratings-icon">
              <span>
                {movieDetails && (
                  <RatingIcon rating={movieDetails.vote_average} />
                )}
              </span>
              <span>{`${movieDetails.vote_average} / 10`}</span>
            </div>

            <div>{`${movieDetails.runtime}min`}</div>
          </div>

          <div className="movie__detail--genres">
            {movieDetails.genres.map((genre) => (
              <div key={genre.id}>
                <span>{genre.name}</span>
              </div>
            ))}
          </div>

          <div className="movie__detail--overview">
            <h4 className="overview-title">Overview</h4>
            <div>{movieDetails.overview}</div>
          </div>

          <div className="movie__detail--cast">
            <h4 className="cast-title">Top Cast</h4>
            <div className="movie__detail--top-cast">
              {topCast.map((cast) => (
                <Link
                  to={`/actors/${cast.id}`}
                  key={cast.id}
                  className="movie__detail-top-cast-link"
                >
                  <div className="movie__detail--cast-content">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                      alt="profile path"
                    />
                    <div className="movie__detail--cast-name">
                      <span>{cast.name}</span>
                      <span>{cast.character}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="todos">
            <div className="todo__button">
              <Link to={`${movieDetails.homepage}`} className="link">
                <span>WEBSITE</span> <TfiWorld />
              </Link>
              <Link
                to={`https://www.imdb.com/title/${movieDetails.imdb_id}`}
                className="link"
              >
                <span>IMDB</span> <MdMovie />
              </Link>
              <Link onClick={openTrailerModal} className="link">
                <span>TRAILER</span> <PiLadderSimpleFill />
              </Link>
            </div>

            <div className="todo__button">
              <Link className="link">
                <span>FAVOURITE</span> <GiEternalLove />
              </Link>
              <Link className="link">
                <span>WATCHLIST +1</span>{" "}
              </Link>
              <Link className="link" onClick={backButton}>
                <span>BACK</span> <IoArrowBack />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {likeMore && (
        <>
          <h1 className="like-more">You might also Like</h1>
          <div className="recommendation">
            {likeMore.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="recommend"
                onClick={() => fetchRecommendedMovieDetails(movie.id)}
              >
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  />
                  <p>{movie.title}</p>
                  <div className="rating">
                    {<RatingIcon rating={movie.vote_average} />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {showTrailerModal && (
        <div className="trailer-modal">
          <div className="modal-content">
            <span className="close" onClick={closeTrailerModal}>
              &times;
            </span>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieDetail;
