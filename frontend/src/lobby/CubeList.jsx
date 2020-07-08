import React, { useState, Fragment } from "react";
import axios from "axios";

import TextArea from "../components/TextArea";
import App from "../app";

const CubeList = () => {
  const cubeListLength =
    App.state.list.length === 0
      ? 0
      : App.state.list.split("\n").length;

  return (<div id='cube-list'>
    <div className='column'>
      <div>{`One card per line! (${cubeListLength} cards)`}</div>
      <TextArea className="cube-list"
        placeholder='cube list'
        link='list'
      />
    </div>
    <div className='column'>
      <CubeCobra />
    </div>
  </div>
  );
};

const CubeCobra = () => {
  const [name, setName] = useState("");

  const getCubeCobraList = async (cubeId) => {
    if (!cubeId) {
      return;
    }
    axios.get(`https://cubecobra.com/cube/api/cubelist/${cubeId}`)
      .then(({ data: list }) => {
        App.err = "";
        App.save("list", list);
      })
      .catch(() => {
        App.error(`Could not retrieve CubeCobra list with ID ${cubeId}`);
      });
  };

  return (
    <Fragment >
      <label style={{ marginTop: "10px", marginLeft: "4px" }}>
        <a href="https://cubecobra.com/" target="_blank" rel="noopener noreferrer">CubeCobra</a> cube ID:{" "}
        <input
          style={{ width: "100px" }}
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)} />
      </label>
      <input style={{ marginTop: "5px", marginLeft: "4px" }} type="button" value="Fetch Cube List" onClick={() => getCubeCobraList(name)} />
    </Fragment>
  );
};

export default CubeList;
