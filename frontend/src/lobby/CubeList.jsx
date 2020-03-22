import React, {useState, useEffect} from "react";
import axios from "axios";

import { Textarea } from "../utils";
import App from "../app";

const CubeList = () => {
  const [cubes, setCubes] = useState("");
  const [, selectCube] = useState("none");
  let cubeOptions = [];

  const getCubes = async function() {
    const {data: cubes} = await axios.get("/api/cubes");
    setCubes(cubes);
  };

  useEffect(() => {!cubes && getCubes();});

  Object.keys(cubes).forEach(key => {
    const option = <option value={key} key={key}>{key}</option>;
    cubeOptions.push(option);
  });

  const handleChange = (e) => {
    e.preventDefault();
    selectCube(e.target.value);
    App.set( {
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
    {cubes && <div id='preset-cubes'>
      <div>Preset Cubes:</div>
      <select onChange={handleChange}>
        <option value='none' key='none'>None</option>
        <optgroup label="Cube Tutor">
          {cubeOptions}
        </optgroup>
      </select>
      <div>Fetch Cube from <a href="https://cubecobra.com">Draft Cobra</a>:</div>
      <input
        // style={{ width: "150px" }}
        type='text'
        value={App.state.cubeId || ""}
        onChange={(e) => {
          const cubeId = e.currentTarget.value;
          App.save("cubeId", cubeId);
        }}
      />
      <button onClick={async () => {
        const {data: list} = await axios.get(`https://cubecobra.com/cube/api/cubelist/${App.state.cubeId}`);
        App.set({ list });
      }}>
        Fetch cube list
      </button>
    </div>}
  </div>;
};

export default CubeList;
