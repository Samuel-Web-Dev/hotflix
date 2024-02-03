import React from 'react'

import styles from './TermsAndCondition.module.css'

const TermsAndCondition = () => {
  return (
    <div className={styles.terms}>
      <input type="checkbox" />
      <div>
        I've read and agree to
         <span className={styles["condition-color"]}>
          <a href="#">Terms & Conditions</a>
        </span>
      </div>
    </div>
  );
}

export default TermsAndCondition