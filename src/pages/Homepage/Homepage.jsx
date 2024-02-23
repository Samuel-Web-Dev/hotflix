import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactDOM } from "react-dom";
import { Routes, Route, BrowserRouter as Router, useNavigate } from "react-router-dom";
import Sidebar from "../../component/Sidebar/Sidebar";
import Header from "../../component/Header/Header";
import MainContent from "../../component/Content/MainContent";
import MovieDetail from "../../component/MovieDetail/MovieDetail";
import "./Homepage.css";
import CastDetail from "../../component/CastDetail/CastDetail";

import { MdOutlineKeyboardBackspace } from "react-icons/md";
import swal from "sweetalert";


const Homepage = () => {
  const navigate = useNavigate()
  const API_KEY = "b2dfdaa86645fe8db1cf996b0f0886fe";
  const API_URL = `https://api.themoviedb.org/3`;
  const [count, setCount] = useState(1);
  const [movieLists, setMovieLists] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted+

    const getMovies = () => {
      fetch(
        `${API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${count}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (isMounted) {
            setDataLoaded(true);
            setMovieLists(data);
            // console.log(data);
          }
        })
        .catch((error) => {
          console.error("Error while fetching data", error);
        });
    };

    getMovies();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [count]);

  const handleFetch = async (group) => {
    fetch(`${API_URL}/movie/${group}?api_key=${API_KEY}&language=en-US&page=1`)
      .then((response) => response.json())
      .then((response) => {
        setMovieLists(response);
        setSearchResults([]);
        setCount(1); // Reset count to 1 when the category changes
      })
      .catch((err) => console.error(err));
  };

  // Function to handle button click and update category
  const handleGenreChange = async (newGenre) => {
    const response = await fetch(
      `${API_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${newGenre}`
    );
    const data = await response.json();
    setMovieLists(data);
    setSearchResults([]);
    setCount(1); // Reset count to 1 when the category changes
  };

  // Search Functionality
  const handleSearch = useCallback(
    async (event) => {
      try {
        const response = await fetch(
          `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${count}`
        );

        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error("Error searching movies:", error);
      }
    },
    [setSearchResults, query, count, API_KEY, setCount]
  );

  const increment = () => {
    // if(searchResults.length <= count || movieLists.results.length <= count) return
    setCount((prevCount) => prevCount + 1);
    handleSearch();
  };

  const decrement = () => {
    if (count <= 1) return;
    setCount((prevCount) => prevCount - 1);
    handleSearch();
  };

  const handleInput = (e) => {
    setQuery(e.target.value);

    console.log(query);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOverlayVisible(!isOverlayVisible);
    // setAllowScroll(!isMenuOpen && !isOverlayVisible);
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      swal({
        title: 'Upload Your Own Movie',
        text: 'Login to your account to upload your own movie',
        icon: 'info',
        buttons: ['Cancel', 'Login'],
        closeOnClickOutside: false
      }).then(value => {
        if(value) {
          navigate('/login')
        }
      })
    }, 7000);

    // Clean up the timeout to prevent memory leaks
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    
      <div className="homepage">
        {isOverlayVisible && (
          <>
            <div onClick={toggleMenu}>
              <MdOutlineKeyboardBackspace className="close-btn" />
            </div>
            <div className="close-overlay" onClick={toggleMenu}></div>
          </>
        )}
        <Sidebar
          handleGenreChange={handleGenreChange}
          handleFetch={handleFetch}
          isMenuOpen={isMenuOpen}
        />
        <div className="main__section">
          <Header
            onSearch={handleSearch}
            handleInput={handleInput}
            toggleMenu={toggleMenu}
          />

          <Routes>
            <Route
              path="/"
              element={
                dataLoaded && (
                  <MainContent
                    movies={movieLists.results}
                    searchResults={searchResults}
                    count={count}
                    increment={increment}
                    decrement={decrement}
                  />
                )
              }
            />
            <Route path="homepage/movie/:id" element={<MovieDetail />} />
            <Route path="homepage/actors/:id" element={<CastDetail />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default React.memo(Homepage);
