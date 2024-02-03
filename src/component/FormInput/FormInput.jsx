import React from 'react'

import styles from './FormInput.module.css'

const FormInput = (props) => {
  return (
    <div className={styles['input-field']}>
      <span className={styles['icon-container']}>{props.icon}</span>
      <input type={props.type} placeholder={props.placeholder} name={props.name} onChange={(e) => props.onChange(e)} />
    </div>
  );
}

export default FormInput