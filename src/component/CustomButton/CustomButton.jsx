import React from 'react'

import styles from './CustomButton.module.css'

const CustomButton = (props) => {
  return (
    <div className={styles.button}>
      <button type={props.type}>{props.children}</button>
    </div>
  );
}

export default CustomButton