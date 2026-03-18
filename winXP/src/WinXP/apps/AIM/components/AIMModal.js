import React, { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";
import LoadingGif from "../assets/videos/folder-copy.gif";
import AlertIcon from "../assets/images/alert.png";

const AIMModal = () => {
  const { error, setError, loading, success, setSuccess } =
    useContext(ErrorContext);

  const handleClose = () => {
    setError(false);
    setSuccess(false);
  };

  if (!error && !loading && !success) return null;

  return (
    <div className="aim-modal-overlay">
      <div className="aim-modal">
        <div className="aim-modal__titlebar">
          <span>{loading ? "Loading" : error ? "Error" : "Success"}</span>
          {!loading && (
            <button onClick={handleClose} className="aim-modal__close">X</button>
          )}
        </div>
        <div className="aim-modal__body">
          {(error || success) && (
            <div className="aim-modal__info">
              <img className="aim-modal__image" src={AlertIcon} alt="" />
              <span className="aim-modal__message">{error || success}</span>
            </div>
          )}
          {loading && (
            <div className="aim-modal__loading">
              <img className="aim-modal__loading-gif" src={LoadingGif} alt="" />
              <p className="aim-modal__loading-message">{loading.message}...</p>
              <progress
                className="aim-modal__loader"
                max="100"
                value={loading.value}
              />
            </div>
          )}
          {!loading && (
            <div className="aim-modal__actions">
              <button onClick={handleClose}>Ok</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMModal;
