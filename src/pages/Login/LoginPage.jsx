import React, { useState } from 'react'
import { FaUser } from "react-icons/fa6";
import { FaPhone } from 'react-icons/fa6';
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import FormInput from '../../component/FormInput/FormInput'
import PasswordInput from '../../component/FormInput/PasswordInput';
import CustomButton from '../../component/CustomButton/CustomButton';
import Card from '../../component/UI/Card';

import styles from './LoginPage.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseUtility';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import ProfilePics from '../../component/profilePics/ProfilePics';

const LoginPage = () => {
  const navigate = useNavigate()
  const [photoUrl, setPhotoUrl] = useState(null)
  const [inputValue, setInputValue] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => {
      return {
        ...prevState,
        [name]: value
      }
    })
  }


  const handlePhotoChange = (url) => {
    setPhotoUrl(url)
  }

   const LogUserIn = (event) =>{
    event.preventDefault();
    const { email, password } = inputValue
    
     signInWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
         // Signed in
         const user = userCredential.user;

         updateProfile(user, { photoURL: photoUrl })
           .then(() => {
             console.log(photoUrl);
             console.log("photo name set successfully");
             navigate("/userAccount");
           })
           .catch((error) => {
             console.error("Error setting display name:", error);
           });
       })
       .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorCode);
         console.log(errorMessage);
       });
  } 
  
  // const user = auth.currentUser
  // let renderProfile;
  // if (user) {
  //   renderProfile = null
  // } else {
  //   renderProfile = <ProfilePics profilePhoto={handlePhotoChange} />;
  // }
  return (
    <div className={styles["login-container"]}>
      {/* <h2>Login Form</h2> */}
      <div className={styles.container}>
        <form onSubmit={LogUserIn}>
          <ProfilePics profilePhoto={handlePhotoChange} />
          <FormInput
            type="email"
            name="email"
            placeholder="Email"
            icon={<MdEmail />}
            onChange={handleChange}
          />
          <PasswordInput
            type="password"
            name="password"
            placeholder="Password"
            lockIcon={<FaLock />}
            eyeIcon={<FaEye />}
            eyeSlashIcon={<FaEyeSlash />}
            onChange={handleChange}
          />

          <CustomButton type="submit">Login</CustomButton>
        </form>
        <div className={styles.signUp}>
          Don't have an account?
          <span className={styles["condition-color"]}>
            <Link to="/">Sign Up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage