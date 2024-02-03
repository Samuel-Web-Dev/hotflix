import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import RatingIcon from '../MovieDetail/RatingIcon';

import './CastDetail.css'

const CastDetail = () => {
  const apiKey = "b2dfdaa86645fe8db1cf996b0f0886fe";
  const { id } = useParams();
  const [castDetails, setCastDetails] = useState({})
  const [isloading, setIsLoading] = useState(true)

  const [moviesByCast, setMoviesByCast] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 12

  
  // Fetch Cast Details for Movie
  useEffect(() => {
    const fetchCastMemberDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`
        );
    
        if (!response.ok) {
          throw new Error('Failed to fetch cast member details');
        }
    
        const data = await response.json();
        setCastDetails(data)
        if(castDetails){
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching cast member details:', error);
      }
    };

    fetchCastMemberDetails();


// Fetch a list of movies in which the person has participated.
    const fetchMoviesByCast = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}`
        );
    
        if (!response.ok) {
          throw new Error('Failed to fetch movie credits for the cast member');
        }
    
        const data = await response.json();
        setMoviesByCast(data.cast)
      } catch (error) {
        console.error('Error fetching movie credits for the cast member:', error);
      }
    };

    fetchMoviesByCast();
  },[])
  

   let indexOfLastMovie = currentPage * moviesPerPage
   let indexOfFirstMovie = indexOfLastMovie - moviesPerPage
   let currentMovies = moviesByCast.slice(indexOfFirstMovie, indexOfLastMovie)

   const renderMovies = () =>{
     return currentMovies.map((movie) =>(
      <Link to={`/homepage/homepage/movie/${movie.id}`} className='movies-participated-link' key={movie.id}>
      <div className='participated-movie-card' key={movie.id}>
         <p><img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} /></p>
         <h3>{movie.title}</h3>
         <div className="rating">{<RatingIcon rating={movie.vote_average} />}</div>
      </div>
      </Link>
     ))
   }

  //  Handle Page Pagination
  document.addEventListener('DOMContentLoaded',() => {
    useEffect(() => {
      const pagination = document.querySelector('.pagination')
    if(moviesByCast.length <= moviesPerPage){
      pagination.style.display = 'none'
    }
    }, [])
  })

  function checkClass() {
    let checkPrev = document.querySelector('.opacity')
    if(checkPrev){
      // document.classList.remove('opacity')
      checkPrev.classList.remove('opacity')
    }
  }
  const incrementNumber = () => {
    if(currentPage >= (moviesByCast.length / moviesPerPage)){
      document.querySelector('.next-btn').classList.add('opacity')
       return
    }
    checkClass()
    setCurrentPage(prevPage => prevPage + 1)
  }
  
  const decrementNumber = () => {
    if(currentPage <= 1){
      document.querySelector('.prev-btn').classList.add('opacity')
      return
   }
   checkClass()
    setCurrentPage(prevPage => prevPage - 1)
  }

  const navigate = useNavigate()
  const handlebackbutton = () => {
    navigate(-1)
  }


  // const { biography, name, profile_path } = castDetails
  let formattedDate;
  if(!isloading){
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    formattedDate = new Date(castDetails.birthday).toLocaleDateString('en-US', options)
  }


  return (
    castDetails && moviesByCast ? (
       <>
    <div className='cast-detail'>
        <img src={`https://image.tmdb.org/t/p/w500/${castDetails.profile_path}`} alt="profile path" />
        <div className="biography">
           <h1>{castDetails.name}</h1>
           <h2>Born: {formattedDate}</h2>
           <p>{castDetails.biography}</p>

           <div className='nav-buttons'>
             <a className='nav-buttons__link' href={`https://www.imdb.com/title${castDetails.imdb_id}`}><button>IMDB</button></a>
             <button onClick={handlebackbutton}><MdKeyboardBackspace style={{fontSize: '17px'}} /> Back</button>
           </div>
        </div>
    </div>

    <div className='movies-participated'>
      <h1>Movies</h1>
    <div className="movie-participated-box">
       { renderMovies() }
    </div>

     <div className="pagination">
        <button onClick={decrementNumber} className='prev-btn'>Prev</button>
         <p>{currentPage}</p>
         <button onClick={incrementNumber} className='next-btn'>Next</button>
     </div>
    </div>
   </>
    ) : (
       <div>Loading</div>
    )
     
  )
}

export default CastDetail