import React from 'react'
import ReactDOM from 'react-dom';
import { FaUserCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MyLogo } from '../../assets/Images';

import styles from './MovieHeader.module.css'


const MovieHeader = ({ toggleModal, photoURL }) => {
   
  return (
    <div className={styles["movie-header"]}>
      <div className={styles["account-setting"]} onClick={toggleModal}>
        <img src={photoURL} alt='profile' />
        <div>Account</div>
      </div>
    </div>
  );
}

export default MovieHeader