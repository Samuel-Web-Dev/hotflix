import React, { useState } from "react";
import styles from './PasswordInput.module.css'

const PasswordInput = ({
  type,
  name,
  onChange,
  placeholder,
  lockIcon,
  eyeIcon,
  eyeSlashIcon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles["input-field"]}>
      <span className={styles["icon-container"]}>{lockIcon}</span>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        onChange={e => onChange(e)}
      />
      <span
        className={styles["icon-container"]}
        onClick={togglePasswordVisibility}
      >
        {showPassword ? eyeSlashIcon : eyeIcon}
      </span>
    </div>
  );
};

export default PasswordInput;
