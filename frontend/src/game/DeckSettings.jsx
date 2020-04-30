import React from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZoneDisplayName, ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";
import {COLORS_TO_LANDS_NAME} from "../gamestate";
import {Select} from "../utils";

const DeckSettings = () => (
  (App.state.isGameFinished || App.state.didGameStart)
    ? <div className='deck-settings'>
      <LandsPanel />
      <DownloadPanel />
    </div>
    : <div/>
);

const LandsPanel = () => (
  <fieldset className='land-controls fieldset'>
    <legend className='legend game-legend'>Lands</legend>
    <table>
      <thead>
        <ManaSymbols />
      </thead>
      <tbody>
        <LandsRow zoneName={ZONE_MAIN}/>
        <LandsRow zoneName={ZONE_SIDEBOARD}/>
      </tbody>
      <tfoot>
        <SuggestLands />
      </tfoot>
    </table>
  </fieldset>
);

const ManaSymbols = () => {
  const manaSymbols = ["W", "U", "B", "R", "G"];
  const path = color => `../../media/${color}.svg`;

  return (
    <tr>
      <td />
      {manaSymbols.map((color, index) =>
        <td key={index}>
          <img src={path(color)} alt={color}/>
        </td>)
      }
    </tr>
  );
};

const LandsRow = ({zoneName}) => (
  <tr>
    <td>{getZoneDisplayName(zoneName)}</td>
    {Object.keys(COLORS_TO_LANDS_NAME).map((color, index) =>
      <td key={index}>
        <input
          className='number'
          min={0}
          onChange={App._emit("land", zoneName, color)}
          type='number'
          value={App.state.gameState.getLandDistribution(zoneName, color) || 0}/>
      </td>)}
  </tr>
);

LandsRow.propTypes = {
  zoneName: PropTypes.string.isRequired
};

const SuggestLands = () => (
  <tr>
    <td>Deck size</td>
    <td>
      <input
        className='number'
        min={0}
        onChange={App._emit("deckSize")}
        type='number'
        value={App.state.deckSize}/>
    </td>
    <td colSpan={2}>
      <button className='land-suggest-button' onClick={App._emit("resetLands")}>
        Reset lands
      </button>
    </td>
    <td colSpan={2}>
      <button className='land-suggest-button' onClick={App._emit("suggestLands")}>
        Suggest lands
      </button>
    </td>
  </tr>
);

const DownloadPanel = () => (
  <fieldset className='fieldset'>
    <legend className='legend game-legend'>Download</legend>
    <div className='column'>
      <Download />
      <Copy />
      <Log />
    </div>
  </fieldset>
);

const Download = () => {
  const filetypes = ["cod", "json", "mwdeck", "txt"];
  const select = <Select link='filetype' opts={filetypes}/>;

  return (
    <div className='connected-container'>
      <button className='connected-component' onClick={App._emit("download")}>
        Download as
      </button>
      <input
        type='text'
        className='download-filename connected-component'
        placeholder='filename'
        value={App.state["filename"]}
        onChange={e => { App.save("filename", e.currentTarget.value); }} />
      {select}
      <span className='download-button'/>
    </div>
  );
};

const Copy = () => (
  <div className='copy-controls connected-container'>
    <button
      className='connected-component'
      onClick={App._emit("copy")}>
      Copy deck to clipboard
    </button>
  </div>
);

const Log = () => (
  App.state.isGameFinished && (/draft/.test(App.state.gametype) || /glimpse/.test(App.state.gametype))
    ? <div>
      <button className='connected-component'
        onClick={App._emit("getLog")}>
        Download Draft Log
      </button>
    </div>
    : <div />
);

export default DeckSettings;
