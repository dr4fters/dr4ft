import React from "react";
import PropTypes from "prop-types";

import _ from "Lib/utils";
import App from "Src/app";
import {BASICS, Zones} from "Src/cards";
import {Select} from "Src/utils";

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
        <LandsRow zoneName="main" />
        <LandsRow zoneName="side" />
      </tbody>
      <tfoot>
        <SuggestLands />
      </tfoot>
    </table>
  </fieldset>
);

const ManaSymbols = () => {
  const manaSymbols = ["White", "Blue", "Black", "Red", "Green"];
  const url = x => `https://www.wizards.com/Magic/redesign/${x}_Mana.png`;

  return (
    <tr>
      <td />
      {manaSymbols.map(x =>
        <td key={_.uid()}>
          <img src={url(x)} alt={x}/>
        </td>)
      }
    </tr>
  );
};

const LandsRow = ({zoneName}) => (
  <tr>
    <td>{zoneName}</td>
    {BASICS.map(cardName =>
      <td key={_.uid()}>
        <input
          className='number'
          min={0}
          onChange={App._emit("land", zoneName, cardName)}
          type='number'
          value={Zones[zoneName][cardName] || 0}/>
      </td>)}
  </tr>
);

LandsRow.propTypes = {
  zoneName: PropTypes.string.isRequired
};

const SuggestLands = () => (
  <tr>
    <td>deck size</td>
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
        reset lands
      </button>
    </td>
    <td colSpan={2}>
      <button className='land-suggest-button' onClick={App._emit("suggestLands")}>
        suggest lands
      </button>
    </td>
  </tr>
);

const DownloadPanel = () => (
  <fieldset className='download-controls fieldset'>
    <legend className='legend game-legend'>Download</legend>
    <Download />
    <Copy />
    <Log />
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
        onChange={e => { App.save("filename", e.currentTarget.checked); }} />
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
  /draft|chaos/.test(App.state.type)
    ? <div>
      <button className='connected-component'
        onClick={App._emit("getLog")}>
        Download Draft Log
      </button>
    </div>
    : <div />
);

export default DeckSettings;
