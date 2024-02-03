import React, { useEffect, useRef, useState } from 'react'
import { HiEllipsisVertical } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import styles from './Comment.module.css'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseUtility';

const Comment = ({ userComment, movieId }) => {
  const menuRef = useRef(null)
  const [showMenu, setShowMenu] = useState({})


  const toggleDelMenu = (id) => {
    setShowMenu((prevShowMenu) => ({
      ...prevShowMenu,
      [id]: !prevShowMenu[id],
    }));
  };

  const deleteComment = async (id) => {
    try {
      // Assuming you have a reference to the document containing comments
      const docRef = doc(db, "users", movieId);

      // Fetch the current document data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Get the existing comments array
        const comments = docSnap.data().comments;

        // Filter out the comment with the specified ID
        const updatedComments = comments.filter((comment) => comment.id !== id);

        // Update the document with the new comments array
        await updateDoc(docRef, { comments: updatedComments });

        // Update the showMenu state to hide the menu for the deleted comment
        setShowMenu((prevShowMenu) => {
          const newShowMenu = { ...prevShowMenu };
          delete newShowMenu[id];
          return newShowMenu;
        });
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };


  return (
    <div className={styles["comment-container"]}>
      {userComment.map((comment) => (
        <div className={styles.comment} key={comment.id}>
          <article>
            <div>
              <img src={comment.profileImg} alt="" />
            </div>
            <div className={styles["content"]}>
              <p className={styles["username"]}>{comment.name}</p>
              <div className={styles["comment-value"]}>{comment.value}</div>
            </div>
          </article>

          <article className={styles.menu} ref={menuRef}>
            <div
              className={styles["vertical-menu"]}
              onClick={() => toggleDelMenu(comment.id)}
            >
              <HiEllipsisVertical />
            </div>
            {showMenu[comment.id] && (
              <ul>
                <li>
                  <span>
                    <CiEdit />
                  </span>
                  <span>Edit</span>
                </li>
                <li onClick={() => deleteComment(comment.id)}>
                  <span>
                    <RiDeleteBin6Line />
                  </span>
                  <span>Delete</span>
                </li>
              </ul>
            )}
          </article>
        </div>
      ))}
    </div>
  );
}

export default Comment