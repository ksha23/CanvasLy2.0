import React, { useState, useEffect } from "react";
import "./SuccessPopup.css"; // Import your CSS file for styling

const Modal = ({ show, message }) => {
  const [display, setDisplay] = useState(show);

  useEffect(() => {
    let timeout;

    if (show) {
      setDisplay(true);
      timeout = setTimeout(() => {
        setDisplay(false);
      }, 3000); // Display for 3 seconds
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  return (
    <>
      {display && (
        <div className="modal-popup">
          <div className="modal-content">
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
