import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../../component/Sidebar/Sidebar';
import Header from '../../component/Header/Header';
import MainContent from '../../component/Content/MainContent';
import MovieDetail from '../../component/MovieDetail/MovieDetail';
import './Homepage.css';
import CastDetail from '../../component/CastDetail/CastDetail';

import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Homepage = () => {
  const API_KEY = 'b2dfdaa86645fe8db1cf996b0f0886fe';
  const [count, setCount] = useState(1)
  const [movieLists, setMovieLists] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('')

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);


  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted+

    const getMovies = () => {
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${count}`)
        .then(response => response.json())
        .then(data => {
          if (isMounted) {
            setDataLoaded(true);
            setMovieLists(data);
            // console.log(data);
          }
        })
        .catch(error => {
          console.error('Error while fetching data', error);
        });
    };

    getMovies();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, [count]);


  // Function to handle button click and update category
  const handleCategoryChange = async (newCategory)=> {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${newCategory}&with_genres=${newCategory}`)
    const data = await response.json()
    setMovieLists(data)
    setSearchResults([])
    setCount(1); // Reset count to 1 when the category changes
  };


  // Search Functionality
  const handleSearch = useCallback(async (event) => {
  
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${count}`
      );
  
      const data = await response.json();
      setSearchResults(data.results);
      
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  }, [API_KEY, query, count, setSearchResults, setCount, setQuery]);
  


  

  const increment = () => {
    // if(searchResults.length <= count || movieLists.results.length <= count) return
    setCount(prevCount => prevCount + 1)
    handleSearch()
  }

  const decrement = () => {
    if(count <= 1) return
    setCount(prevCount => prevCount - 1)
    handleSearch()
  }

   const handleInput = (e) => {
    setQuery(e.target.value)
   }


    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
      setIsOverlayVisible(!isOverlayVisible);
    };
  
  return (
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
        handleCategoryChange={handleCategoryChange}
        isMenuOpen={isMenuOpen}
      />
      <div className="main__section">
        <Header
          onSearch={handleSearch}
          handleInput={handleInput}
          toggleMenu={toggleMenu}
        />
        {/* Conditionally render MainContent based on dataLoaded */}
        {/* {dataLoaded && <MainContent movies={filteredItems} count={count} increment={increment} decrement={decrement} />} */}

        <Routes>
          <Route
            exact
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
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/actors/:id" element={<CastDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default Homepage;
