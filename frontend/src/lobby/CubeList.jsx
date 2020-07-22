import React, { useState, Fragment } from "react";
import axios from "axios";

import TextArea from "../components/TextArea";
import App from "../app";

const CubeList = () => {
  return (<div id='cube-list'>
    <div>
      <CubeCobra />
    </div>
    <br />
    <div>
      <ManualCubeInput />
    </div>
  </div>
  );
};

const ManualCubeInput = () => {
  const cubeListLength =
    App.state.list.length === 0
      ? 0
      : App.state.list.split("\n").length;

  return (
    <Fragment>
      <div>{`Or copy and paste your cube. One card per line! (${cubeListLength} cards)`}</div>
      <TextArea className="cube-list"
        placeholder='cube list'
        link='list'
      />
    </Fragment>
  );
};

const CubeCobra = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [cubeImportMessage, setCubeImportMessage] = useState("");

  const getCubeCobraList = async (cubeId) => {
    if (!cubeId) {
      return;
    }
    axios.get(`https://cubecobra.com/cube/api/cubelist/${cubeId}`)
      .then(({ data: list }) => {
        setError("");
        setCubeImportMessage(`The cube with ID "${cubeId}" was imported.`);
        App.save("list", list);
      })
      .catch(() => {
        setError(`Could not retrieve CubeCobra list with ID ${cubeId}`);
        setCubeImportMessage("");
      });
  };

  const onKeyPress = (e) => {
    if (event.key !== "Enter"){
      return;
    }

    return getCubeCobraList(e.target.value);
  };

  return (
    <Fragment >
      <div>
        Import from <a href="https://cubecobra.com/" target="_blank" rel="noopener noreferrer">CubeCobra</a>. Paste the ID for your cube and then press enter.
      </div>
      <label>
        <input
          type='text'
          value={name}
          className={error ? "error": ""}
          placeholder="CubeCobra Cube ID"
          onKeyPress={onKeyPress}
          onChange={(e) => setName(e.target.value)} />
      </label>

      <div>
        <small>{cubeImportMessage}</small>
        <small className="error">{error}</small>
      </div>
    </Fragment>
  );
};

export default CubeList;
