import React, { useState } from 'react'
import { FaUser } from "react-icons/fa6";
import { FaPhone } from 'react-icons/fa6';
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import FormInput from '../../component/FormInput/FormInput';
import PasswordInput from '../../component/FormInput/PasswordInput';

import styles from './SignUp.module.css'
import CustomButton from '../../component/CustomButton/CustomButton';
import Card from '../../component/UI/Card';
import { Link, useNavigate } from 'react-router-dom'

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../firebaseUtility';


const SignUp = () => {
    const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: '',
    phone: '',
    name: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value
    }))

  }


  const createUser = (event) => {
    event.preventDefault();
    const { email, password, name } = inputValue
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log(user);
          // Set the display name using updateProfile
          updateProfile(user, { displayName: name })
            .then(() => {
              console.log("Display name set successfully");
              // Navigate to another page after successful user creation and profile update
              navigate("/homepage");
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
 


  return (
    <Card>
      <div className={styles["box-container"]}>
        <h1 className={styles.header}>
          <span>Sign Up</span> form
        </h1>
        <div className={styles.container}>
          <div className={styles["left-part"]}>
            <h3>Hello, friend!</h3>

            <form onSubmit={createUser}>
              <FormInput
                type="text"
                icon={<FaUser />}
                placeholder="Name"
                name="name"
                onChange={handleChange}
              />
              <FormInput
                type="text"
                icon={<FaPhone />}
                placeholder="Phone"
                name="phone"
                onChange={handleChange}
              />
              <FormInput
                type="email"
                name="email"
                icon={<MdEmail style={{ fontSize: "20px" }} />}
                placeholder="Email"
                onChange={handleChange}
              />
              <PasswordInput
                type="password"
                placeholder="Password"
                name="password"
                lockIcon={<FaLock />}
                eyeIcon={<FaEye />}
                eyeSlashIcon={<FaEyeSlash />}
                onChange={handleChange}
              />
              {/* <TermsAndCondition /> */}
              <CustomButton type="submit">Create Account</CustomButton>
            </form>
            <div className={styles.signin}>
              Already have an account?
              <span className="condition-color">
                <Link to="/login">Sign In</Link>
              </span>
            </div>
          </div>

          <div className={styles["right-part"]}>
            <h2>Glad to see You!</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborios.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default SignUp