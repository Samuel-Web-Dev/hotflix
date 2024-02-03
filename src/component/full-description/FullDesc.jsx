import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../../firebaseUtility";
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import styles from "./FullDesc.module.css";
import { onAuthStateChanged } from "firebase/auth";

import { BiDislike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { FaDownload } from "react-icons/fa6";
import { PiShareFatLight } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { useMediaQuery } from "react-responsive";
import { MovieContext } from "../Context/AuthContext";
import { BsEmojiSmile } from "react-icons/bs";
import { family } from "../../assets/Images";
import Comment from "../comment/Comment";
import { v4 } from "uuid";

const initialState = {
  userComment: [],
};

const reducerFunc = (state, action) => {
  switch (action.type) {
    case "userComment": {
      return {
        ...state,
        userComment: action.userComment,
      };
    }

    default:
      return state;
  }
};

const FullDesc = () => {
  const { movieId } = useParams();
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(reducerFunc, initialState);
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showCommentBtn, setCommentBtn] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const isScreenSmall = useMediaQuery({ query: "(min-width: 768px)" });
  const menuRef = useRef(null);

  const showButtons = () => {
    setCommentBtn(true);
  };

  const hideButtons = () => {
    setCommentBtn(false);
  };

  useEffect(() => {
    const getMovie = async () => {
      const docRef = doc(db, "users", movieId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const uploadDate = userData.uploadDate;

        // Format and display the upload date
        const formattedDate = new Date(
          uploadDate.seconds * 1000
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        //  Get the userName
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const { displayName } = user;
            // Get an array of values from the userData object
            const valuesObj = { ...userData, displayName, formattedDate };
            setData(valuesObj);

            console.log("User UID:", user.displayName);
          } else {
            console.log("User is not logged in");
          }
        });
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    getMovie();

    // Add a click event listener to close the menu when clicking outside of it
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [movieId]);

  const showMenuItemsHandler = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const toggleDescription = (e) => {
    e.preventDefault();
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const sendComment = async () => {
    if (!inputValue.trim()) {
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", movieId);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          let dynamicId = v4();
          await updateDoc(docRef, {
            comments: arrayUnion({
              name: `@${user.displayName.toLowerCase()}`,
              value: inputValue,
              id: dynamicId,
              profileImg: user.photoURL,
            }),
          });

          const unsubscribe = onSnapshot(docRef, (doc) => {
            const updatedMovieData = doc.data();
            dispatch({
              type: "userComment",
              userComment: updatedMovieData.comments,
            });
          });

          setInputValue("");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };



  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, "users", movieId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const movieData = docSnap.data();
        dispatch({ type: "userComment", userComment: movieData.comments });
      }
    };

    getData();
  }, []);

  const preventContextMenu = (event) => {
    event.preventDefault();
  };

  return (
    data && (
      <>
        <div className={styles.container}>
          <div className={styles["video-container"]}>
            <video
              src={data.video}
              className={styles.video}
              controls
              onContextMenu={preventContextMenu}
              controlsList="nodownload"
            ></video>
          </div>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.content}>
            <div className={styles["content-description"]}>
              <div className={styles.displayName}>{data.displayName}</div>
            </div>
            <div className={styles.engagement}>
              <div className={styles["content-engagement"]}>
                <div className={styles["like-increase"]}>
                  <BiLike className={styles.icon} />
                  <p>79</p>
                </div>
                <hr />
                <div className={styles["like-decrease"]}>
                  <BiDislike className={styles.icon} />
                </div>
              </div>

              {isScreenSmall && (
                <div className={styles.share}>
                  <PiShareFatLight />
                  <p>Share</p>
                </div>
              )}

              {/* Conditionally render the "Download" section based on screen width */}
              {isScreenSmall && (
                <div className={styles.download}>
                  <FaDownload />
                  <p>Download</p>
                </div>
              )}

              {!isScreenSmall && (
                <div className={styles.menu} ref={menuRef}>
                  <div
                    className={styles.menuIcon}
                    onClick={showMenuItemsHandler}
                  >
                    <HiDotsHorizontal />
                  </div>
                  {showMenu && (
                    <ul className={styles[`menu-items`]}>
                      <li>
                        <PiShareFatLight />
                        <p>Share</p>
                      </li>
                      <li>
                        <FaDownload />
                        <p>Download</p>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.description}>
            <p>
              {data.viewCount}{" "}
              <span>{data.viewCount >= 2 ? "views" : "view"}</span>{" "}
              <span>{data.formattedDate}</span>
            </p>
            <div className={styles.desc}>
              {data.desc && (
                <span>{expanded ? data.desc : data.desc.slice(0, 150)}</span>
              )}{" "}
              {data.desc && data.desc.length >= 150 && (
                <a
                  href="#"
                  onClick={toggleDescription}
                  className={styles["read-more"]}
                >
                  {expanded ? "show less..." : "...more"}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={styles.comment}>
          <div className={styles["total-comment"]}>
            {state.userComment.length}{" "}
            {state.userComment.length <= 1 ? "Comment" : "Comments"}
          </div>
          <div className={styles["comment-box"]}>
            <div className={styles.inputField}>
              <span className={styles.userAvatar}>
                <img src={family} alt="" />
              </span>
              <span className={styles.commentInput}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={showButtons}
                />
              </span>
            </div>
            {showCommentBtn && (
              <div className={styles["handle-btn"]}>
                <p>
                  <BsEmojiSmile className={styles.emoji} />
                </p>
                <p className={styles.buttons}>
                  <button
                    className={styles["cancel-comment"]}
                    onClick={hideButtons}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles[`send-comment`]} ${
                      inputValue.trim() ? styles.active : ""
                    }`}
                    onClick={sendComment}
                  >
                    Comment
                  </button>
                </p>
              </div>
            )}
          </div>

          <Comment userComment={state.userComment} movieId={movieId} />
        </div>
      </>
    )
  );
};

export default FullDesc;
