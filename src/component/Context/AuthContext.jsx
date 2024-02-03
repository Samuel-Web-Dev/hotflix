import React, { useState } from 'react'

 export const MovieContext = React.createContext({
  viewCount: 0,
  handleIncrement: () => {}
 })



const AuthContext = (props) => {
   const [viewCount, setViewCount] = useState(0);

   const handleIncrement = () => {
     setViewCount((prevViewCount) => prevViewCount + 1);

     console.log('increment called');
   };

  const contextValue = {
    viewCount,
    handleIncrement,
  }

  return (
    <MovieContext.Provider value={contextValue}>{props.children}</MovieContext.Provider>
  )
}

export default AuthContext
