import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import _ from "utils/utils";
import App from "../app";
import RadioOptions from "../components/RadioOptions";
import Modal from "../components/Modal";

import { toTitleCase } from "../utils";
import GameTypes from "./GameTypes";
import GameOptions from "./GameOptions";

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
      <div className="modal-section-content">{props.children}</div>
    </div>
  );
};

ModalSection.propTypes = {
  hide: PropTypes.bool,
  label: PropTypes.string,
  inputId: PropTypes.string,
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
      headerText="Create"
      footerConfirmButtonText="Create"
      onClose={closeModal}
      onConfirm={App._emit("create")}
    >
      <ModalSection
        label="Title"
        inputId="game-title-input"
      >
        <input type='text'
          ref={draftNameInput}
          id="game-title-input"
          placeholder="Name your draft"
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
      <ModalSection
        label="Players"
        inputId="game-players-input"
      >
        <select id="game-players-input" value={seats} onChange={(e) => {App.save("seats", e.currentTarget.value);}}>
          {_.seq(100, 1).map((x, i) =>
            <option key={i}>{x}</option>)}
        </select>
        <RadioOptions
          name="public-private"
          description="Create a public or private game"
          appProperty="isPrivate"
          options={[{
            label: "Public",
            value: false,
            tooltip: "Anyone can join"
          }, {
            label: "Private",
            value: true,
            tooltip: "A link is required to join"
          }]}
        />
      </ModalSection>
      <ModalSection
        label="Type"
        inputId="game-type-input"
      >
        <GameTypes/>
      </ModalSection>
      <ModalSection
        label="Packs"
        inputId="game-packs-input"
      >
        <GameOptions/>
      </ModalSection>
      {/* TODO This probably needs a better design, but for now, just show all app errors here since most of them at this stage will be about the room setup failing */}
      <ModalSection
        hide={!App.err}
        label="Error"
      >
        <p dangerouslySetInnerHTML={{__html: App.err}} className='error' />
      </ModalSection>
    </Modal>
  );
};

const CreatePanel = () => {
  createModalButtonRef = useRef(null);

  return (
    <fieldset className='fieldset'>
      <legend className='legend'>
        Create a Room
      </legend>
      <CreateRoomModal />
      <p>
        <button ref={createModalButtonRef} onClick={e => {
          showModal();
        }}>
          Create Room
        </button>
      </p>
    </fieldset>
  );
};

export default CreatePanel;
