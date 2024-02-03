import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import MovieHeader from "../../component/MovieHeader/MovieHeader";
import { FaUserCircle } from "react-icons/fa";
import { RiFeedbackLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MyLogo, videoImg } from "../../assets/Images";

import styles from "./WatchMovies.module.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { storage } from "../../firebaseUtility";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { v4 } from "uuid";
import {
  setDoc,
  doc,
  onSnapshot,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebaseUtility";
import { onAuthStateChanged } from "firebase/auth";
import FullDesc from "../../component/full-description/FullDesc";
import { MovieContext } from "../../component/Context/AuthContext";

const ModalOverlay = ({ isActive, handleUploadModal, displayName, photoURL }) => (
  <div className={`${styles.container} ${isActive ? styles.active : ""}`}>
    <div className={styles["profile"]}>
      <div>
        <img src={photoURL} alt="profile" />
        <div className={styles["profile-name"]}>
          {displayName && displayName}
        </div>
      </div>
      <hr />
      <h3 onClick={handleUploadModal}>
        <FaVideo />
        <span>Upload Movie</span>
      </h3>
      <h3>
        <FiLogOut />
        <span>Sign Out</span>
      </h3>
    </div>

    <div className={styles["profile-setting"]}>
      <IoMdSettings className={styles["settings-icon"]} />
      <h3>setting</h3>
    </div>
  </div>
);

const Backdrop = ({ isActive, toggleModal }) => (
  <div
    className={`${isActive ? styles.backdrop : ""}`}
    onClick={toggleModal}
  ></div>
);

const UploadMovieOverlay = ({ isVisible, handleUploadModal, toggleModal }) => {
  const fileInputRef = useRef();
  const titleInputRef = useRef();
  const descInputRef = useRef();
  const videoRef = useRef();
  const [fileInput, setFileInput] = useState(null);
  const [error, setError] = useState(false);
  // const [data, setData] = useState({});
  // const [count, setCount] = useState(0);
  // const [inputField, setInputField] = useState({})

  const handleVideoSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile.type.includes("video/mp4")) {
      setError(true);
      setFileInput(null);
      return;
    }

    // const movieUrl = URL.createObjectURL(selectedFile);
    setError(false);
    setFileInput(selectedFile);
  };

  // Set Custom style for the Video
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    // setPlaying(!isPlaying);
  };

  const handleVideoLoad = () => {
    // Video has loaded, update the state to trigger a re-render
    setFileInput((prevFileInput) => prevFileInput);
  };

  const handleVideoUpload = () => {
    const title = titleInputRef.current.value;
    const desc = descInputRef.current.value;
    if (!fileInput || (!title.trim() && !desc.trim())) {
      console.log("Select a Video file to continue");
      return;
    }

    const storageRef = ref(storage, `videos/${v4() + fileInput.name}`);

    const uploadTask = uploadBytesResumable(storageRef, fileInput);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // console.log("File available at", downloadURL);
          // setData((prevData) => ({...prevData, img: downloadURL}))
          setFileInput(null);
          const user = auth.currentUser;
          const UID = auth.currentUser.uid;

          if (user) {
            // const uid = user.uid;

            const newMovieId = v4();

            await setDoc(doc(db, "users", newMovieId), {
              title,
              desc,
              video: downloadURL,
              movieId: newMovieId,
              viewCount: 0,
              viewers: [],
              comments: [],
              uploadDate: serverTimestamp(),
            });

            titleInputRef.current.value = "";
            descInputRef.current.value = "";

            handleUploadModal();
            toggleModal();
          }
        });
      }
    );
  };

  return (
    <div
      className={`${styles["movieOverlay"]}  ${
        isVisible ? styles.visible : ""
      }`}
    >
      <div className={styles.modalContent}>
        <div className={styles["movieOverlay__header"]}>
          <h3>Upload Videos</h3>
          <div>
            <RiFeedbackLine style={{ fontSize: "2rem", cursor: "pointer" }} />
            <IoMdClose
              style={{ fontSize: "2rem", cursor: "pointer" }}
              onClick={handleUploadModal}
            />
          </div>
        </div>
        <hr />

        <div className={styles["upload-movie__input"]}>
          {error && <p className={styles.errorMsg}>format not supported</p>}
          <span>
            {fileInput ? (
              <video
                src={fileInput && URL.createObjectURL(fileInput)}
                className={styles.video}
                onLoadedData={handleVideoLoad}
                ref={videoRef}
                onClick={togglePlayPause}
              ></video>
            ) : (
              <img
                className={styles.videoPng}
                src={videoImg}
                onClick={handleVideoSelect}
              />
            )}
            <input
              type="text"
              name="title"
              placeholder="Movie Title"
              ref={titleInputRef}
              className={styles.title}
            />

            <textarea
              name="desc"
              ref={descInputRef}
              placeholder="Movie Description"
            ></textarea>
          </span>

          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* <h4>Drag and drop video files to upload</h4> */}
          <p>Your videos will be private until you publish them</p>
          <div>
            <button onClick={handleVideoSelect}>SELECT MOVIE</button>
            <button onClick={handleVideoUpload}>UPLOAD MOVIE</button>
          </div>
        </div>

        <div className={styles["rules"]}>
          By submitting your videos to Hotflix, you acknowledge that you agree
          to Hotflix's Terms of Service and Community Guidelines. <br /> Please
          be sure not to violate others' copyright or privacy rights.
        </div>
      </div>
    </div>
  );
};

const WatchMovies = () => {
  const videoRefs = useRef([]);
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null)
  const movieCtx = useContext(MovieContext);

  const toggleModal = () => {
    setIsActive(!isActive);
  };

  const handleUploadModal = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setProfilePhoto(user.photoURL);
        console.log("User UID:", user.displayName);
      } else {
        console.log("User is not logged in");
      }
    });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const onMouseOver = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  const onMouseOut = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0; // Reset to the beginning
    }
  };

  const handleMovieView = async (movieId) => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const docRef = doc(db, "users", movieId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const movieData = docSnap.data();

        // Check if the user has already viewed the movie
        if (!movieData.viewers.includes(userId)) {
          // Update the database to increment viewCount
          await updateDoc(docRef, {
            viewCount: increment(1),
            viewers: arrayUnion(userId),
          });
          window.location.reload();
        } else {
          // User has already viewed the movie
          console.log("User has already viewed this movie");
        }
      }
    } else {
      console.log("User is not logged in");
    }
  };


   if (!userName || profilePhoto === null) {
     // Return loading indicator or placeholder if profile information is not yet available
     return <div>Loading...</div>;
   }

  return (
    <>
      <div>
        <MovieHeader toggleModal={toggleModal} photoURL={profilePhoto} />

        <div className={styles["movie-list"]}>
          {data.map((movie, index) => {
            return (
              <div
                key={movie.movieId}
                onClick={() => {
                  navigate(`/userAccount/desc/${movie.movieId}`);
                  handleMovieView(movie.movieId);
                }}
              >
                <video
                  src={movie.video}
                  className={styles["movie-uploaded"]}
                  ref={(videoRef) => (videoRefs.current[index] = videoRef)}
                  onMouseOver={() => onMouseOver(index)}
                  onMouseOut={() => onMouseOut(index)}
                ></video>

                <div>
                  <h2>{movie.title}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {ReactDOM.createPortal(
        <ModalOverlay
          isActive={isActive}
          navigate={navigate}
          displayName={userName}
          photoURL={profilePhoto && profilePhoto}
          isVisible={isVisible}
          handleUploadModal={handleUploadModal}
        />,
        document.getElementById("modal-root")
      )}
      {ReactDOM.createPortal(
        <Backdrop toggleModal={toggleModal} isActive={isActive} />,
        document.getElementById("backdrop")
      )}

      {ReactDOM.createPortal(
        <UploadMovieOverlay
          isVisible={isVisible}
          handleUploadModal={handleUploadModal}
          toggleModal={toggleModal}
        />,
        document.getElementById("uploadMovie-root")
      )}
    </>
  );
};

export default WatchMovies;
