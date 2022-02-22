import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import _ from "utils/utils";

import App from "../app";
import RadioOptions from "../components/RadioOptions";
import Switch from "../components/Switch";
import Modal from "../components/Modal"; 
import { toTitleCase } from "../utils";
import GameTypes from "./GameTypes";
import GameOptions from "./GameOptions";

import "./CreateGameButton.scss"

// set this out here so the create button has the capability
// to open the modal
let showModal;
let createModalButtonRef;

const ModalSection = (props) => {
  if (props.hide) {
    return null;
  }

  return (
    <div className="modal-section">
      <label htmlFor={props.inputId}>{props.label}</label>
      <div className={"modal-section-content " + props.className}>{props.children}</div>
    </div>
  );
};

ModalSection.propTypes = {
  hide: PropTypes.bool,
  label: PropTypes.string,
  inputId: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
};

const CreateRoomModal = () => {
  const [open, setOpen] = useState(false);
  const draftNameInput = useRef();

  showModal = () => {
    setOpen(true);
    // must wait for the modal to be open
    // before we can focus on the input
    setTimeout(() => {
      draftNameInput.current.focus();
    }, 200);
  };

  const closeModal = () => {
    setOpen(false);
    createModalButtonRef.current.focus();
  };

  const {title, seats} = App.state;
  const gameTypes = ["draft", "sealed"];

  return (
    <Modal
      show={open}
      headerText="Create Game"
      footerConfirmButtonText="Create"
      onClose={closeModal}
      onConfirm={App._emit("create")}
    >
      <ModalSection label="Name" inputId="game-title-input" >
        <input type='text'
          ref={draftNameInput}
          id="game-title-input"
          placeholder="Game Room Name"
          value={title}
          onChange={(e) => {App.save("title", e.currentTarget.value);}}
        />
        <div>
          <span className='connected-container'>
            <RadioOptions
              name="type"
              description="Game type"
              appProperty="gametype"
              options={gameTypes.map(type => {
                return {
                  label: toTitleCase(type),
                  value: type
                };
              })}
              onChange={() => {
                // always change back to the default when updating main
                // game type
                App.save("gamesubtype", "regular");
              }}
            />
          </span>
        </div>
      </ModalSection>

      <ModalSection label="Players" inputId="game-players-input" className="Players" >
        <select id="game-players-input" value={seats} onChange={(e) => {App.save("seats", e.currentTarget.value);}}>
          {_.seq(100, 1).map((x, i) =>
            <option key={i}>{x}</option>)}
        </select>

        <Switch
          appProperty="isPrivate"
          checked={{
            label: "Private",
            tooltip: "A link is required"
          }}
          unchecked={{
            label: "Public",
            tooltip: "Anyone can join"
          }}
        />
      </ModalSection>

      <ModalSection label="Type" inputId="game-type-input" >
        <GameTypes/>
      </ModalSection>

      <ModalSection label="Packs" inputId="game-packs-input" >
        <GameOptions/>
      </ModalSection>

      {/* TODO This probably needs a better design, but for now, just show all app errors here since most of them at this stage will be about the room setup failing */}
      <ModalSection hide={!App.err} label="Error" >
        <p dangerouslySetInnerHTML={{__html: App.err}} className='error' />
      </ModalSection>
    </Modal>
  );
};

const CreateGameButton = () => {
  createModalButtonRef = useRef(null);

  return (
    <div className="CreateGameButton">
      <CreateRoomModal />
      <button ref={createModalButtonRef} onClick={e => showModal()}>
        Create Game
      </button>
    </div>
  )
};

export default CreateGameButton;
