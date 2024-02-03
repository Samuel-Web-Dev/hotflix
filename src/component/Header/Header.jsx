import React, { useEffect, useState } from 'react'
import { RiMoonClearFill } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import './Header.css'
import { Link } from 'react-router-dom';

const Header = ({ onSearch, handleInput, toggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // const handleScroll = () => {
  //   const scrollY = window.pageYOffset;
  //   // Adjust the scroll threshold as needed
  //   setIsScrolled(scrollY > 50);
  // };

  // // Add a scroll listener
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
      e.target.value = "";
    }
  };

  // Failed to fetch
  return (
    <div className={`header`}>
      <FiMenu className="header__hamburgerMenu" onClick={toggleMenu} />
      <div className="header__inputField">
        <IoIosSearch className="header__icon-search" />
        <input
          type="text"
          placeholder="Search Movie"
          onChange={handleInput}
          onKeyPress={handleKeyPress}
        />
      </div>

      <Link className="user_link" to={'/login'}>
        <div className="User_login">
          <span>Login</span>
          <FaUserCircle />
        </div>
      </Link>
    </div>
  );
}

export default Header