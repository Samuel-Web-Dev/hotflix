import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' 
import {  MyLogo } from '../../assets/Images'
import { LiaTimesSolid } from "react-icons/lia";

import Homepage from '../../pages/Homepage/Homepage'
import { categories, genres } from './Data' 
import './Sidebar.css'


const Sidebar = ({ handleCategoryChange, isMenuOpen }) => {
  const [activeItem, setActiveItem] = useState(categories[0].group);

  const navigate = useNavigate()
  const handleItemClick = (group) => {
    setActiveItem(group)
    handleCategoryChange(group);
    navigate('/homepage')
  };

  useEffect(() => {
    // Set the activeItem to the group of the first item in categories on initial render
    setActiveItem(categories[0].group);
  }, []); // E
  
  return (
    <div className={`side-bar  ${isMenuOpen ? "open" : ""}`}>
      <h1 className="logo">
        <img src={MyLogo} alt="logo" />
      </h1>

      <div className="categories">
        <p>Categories</p>
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className={`categories__listItem ${
                activeItem === category.group ? "active" : ""
              }`}
              onClick={() => handleItemClick(category.group)}
            >
              <img src={category.icon} />
              <span>{category.title}</span>
            </div>
          );
        })}
      </div>

      <div className="genres">
        <p>Genres</p>
        {genres.map((genre) => {
          return (
            <div
              key={genre.id}
              className={`genres__listItem ${
                activeItem === genre.withGenre ? "active" : ""
              }`}
              onClick={() => handleItemClick(genre.withGenre)}
            >
              <img src={genre.icon} />
              <span>{genre.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar