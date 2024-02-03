// src/ProfilePicUploader.js
import React, { useState } from "react";

import styles from "./ProfilePics.module.css";
import { cameraImg } from "../../assets/Images";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebaseUtility";

const ProfilePics = (props) => {
  const [fileInput, setFileInput] = useState(null)

  const fileInputHandler = (event) => {
    const file = event.target.files[0]
    const convertedFile = URL.createObjectURL(file)
    props.profilePhoto(convertedFile)
    
    // const storageRef = ref(storage, 'profilePics');

    // uploadBytes(storageRef, convertedFile).then((snapshot) => {
    //   console.log('Uploaded a blob or file successfully');
    //   console.log(snapshot);
    // })
    setFileInput(convertedFile)
  }
  return (
    <div className={styles.container}>
      <div>Upload profile photo</div>
      {
        fileInput ? (
          <img src={fileInput} width='200' height='200' />
        ) : (
            <img src={cameraImg} style={{objectFit: 'contain', objectPosition: 'center' }} />
        )
      }
      <input type="file" name="profile" className={styles.input} onChange={fileInputHandler} />
    </div>
  );
};

export default ProfilePics;
