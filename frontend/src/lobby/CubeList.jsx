import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import { Textarea } from "../utils";
import App from "../app";

const CubeList = () => {
  const [cubes, setCubes] = useState("");
  const [, selectCube] = useState("none");
  let cubeOptions = [];

  const getCubes = async () => {
    const { data: cubes } = await axios.get("/api/cubes");
    setCubes(cubes);
  };

  useEffect(() => { !cubes && getCubes(); });

  Object.keys(cubes).forEach(key => {
    const option = <option value={key} key={key}>{key}</option>;
    cubeOptions.push(option);
  });

  const handleChange = (e) => {
    e.preventDefault();
    selectCube(e.target.value);
    App.set({
      list: e.target.value === "none" ? "" : cubes[e.target.value]
    });
  };

  return <div id='cube-list'>
    <div className='column'>
      <div>one card per line</div>
      <Textarea
        placeholder='cube list'
        link='list'
      />
    </div>
    <div className='column'>
      {cubes && <div id='preset-cubes'>
        <div>Preset Cubes:</div>
        <select onChange={handleChange}>
          <option value='none' key='none'>None</option>
          <optgroup label="Cube Tutor">
            {cubeOptions}
          </optgroup>
        </select>
      </div>}
      <CubeCobra />
    </div>
  </div>;
};

const CubeCobra = () => {
  const [name, setName] = useState("");

  const getCubeCobraList = async (cubeId) => {
    axios.get(`https://cubecobra.com/cube/api/cubelist/${cubeId}`)
      .then(({ data:list }) => {
        App.set({ list });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment >
      <label style={{marginTop: "10px", marginLeft: "4px"}}>
        <a href="https://cubecobra.com/" target="_blank">CubeCobra</a> CubeId:{" "}
        <input
          style={{ width: "100px" }}
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)} />
      </label>
      <input style={{marginTop: "5px", marginLeft: "4px"}} type="button" value="Fetch Cubelist" onClick={() => getCubeCobraList(name)} />
    </Fragment>
  );
};

export default CubeList;
