import React from 'react'
import Homepage from './pages/Homepage/Homepage'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp/SignUp'
import LoginPage from './pages/Login/LoginPage'
import MovieDetail from './component/MovieDetail/MovieDetail'
import CastDetail from './component/CastDetail/CastDetail'
import ErrorComponent from './pages/Error/ErrorComponent'
import WatchMovies from './pages/UsersAccount/WatchMovies'
import UploadMovie from './component/UploadMovie/UploadMovie'
import { auth } from './firebaseUtility'
import FullDesc from './component/full-description/FullDesc'

function App() {

  const RequireAuth = ({ children }) => {
    const user = auth.currentUser
    return (
      user ? (children) : <Navigate to='/login' />
    )
  }


   return (

     <div>
       <Routes>
         <Route path="/" element={<SignUp />} />
         <Route path="/homepage/*" element={<Homepage />} />
         <Route path="/userAccount" element={<WatchMovies />} exact />
         <Route path="/login" element={<LoginPage />} />
         <Route
           path="/userAccount/desc/:movieId"
           element={<FullDesc />}
         />
         
         <Route path="*" element={<ErrorComponent />} />
       </Routes>
     </div>
   );
}

export default App