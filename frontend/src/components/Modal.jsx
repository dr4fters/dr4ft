import React, { useEffect } from "react";
import PropTypes from "prop-types";

import ReactTooltip from "react-tooltip";

import "./Modal.scss";

const Modal = ({
  headerText,
  footerConfirmButtonText,
  footerCancelButtonText,
  show,
  onClose,
  onConfirm,
  children,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="Modal" onScroll={() => ReactTooltip.rebuild()}>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-container">
        <header className="modal-header">
          <h2>{headerText}</h2>

          <div className="modal-close-button" onClick={onClose}>
            <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
              <title>close modal button</title>
              <defs>
                <rect id="path-1" x="240" y="94" width="960" height="848" rx="4"></rect>
              </defs>
              <g transform="translate(-1151.000000, -123.000000)">
                <g transform="translate(240.000000, 118.000000)">
                  <g transform="translate(909.000000, 3.000000)">
                    <path d="M3.73748506,2.29810531 L9.5,8.061 L15.2625149,2.29810531 C15.6599887,1.90063156 16.304421,1.90063156 16.7018947,2.29810531 C17.0993684,2.69557905 17.0993684,3.34001131 16.7018947,3.73748506 L10.939,9.5 L16.7018947,15.2625149 C17.0993684,15.6599887 17.0993684,16.304421 16.7018947,16.7018947 C16.304421,17.0993684 15.6599887,17.0993684 15.2625149,16.7018947 L9.5,10.939 L3.73748506,16.7018947 C3.34001131,17.0993684 2.69557905,17.0993684 2.29810531,16.7018947 C1.90063156,16.304421 1.90063156,15.6599887 2.29810531,15.2625149 L8.061,9.5 L2.29810531,3.73748506 C1.90063156,3.34001131 1.90063156,2.69557905 2.29810531,2.29810531 C2.69557905,1.90063156 3.34001131,1.90063156 3.73748506,2.29810531 Z" fill="#079DFF"></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </header>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="secondary">{footerCancelButtonText || "Cancel"}</button>
          <button onClick={onConfirm} className="primary">{footerConfirmButtonText || "Confirm"}</button>
        </div>
      </div>

      <ReactTooltip
        className="modal-tooltip"
        effect="solid"
        type="info"
        place="bottom"
        backgroundColor='#079DFF'
        textColor='white'
      />
    </div>
  );
};

Modal.propTypes = {
  headerText: PropTypes.string.isRequired,
  footerConfirmButtonText: PropTypes.string,
  footerCancelButtonText: PropTypes.string,
  show: PropTypes.bool,

  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,

  children: PropTypes.node.isRequired
};

export default Modal;
