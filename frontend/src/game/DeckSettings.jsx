import React from "react";
import PropTypes from "prop-types";

import App from "../app";
import {getZoneDisplayName, ZONE_MAIN, ZONE_SIDEBOARD} from "../zones";
import {COLORS_TO_LANDS_NAME} from "../gamestate";
import exportDeck from "../export";
import Select from "../components/Select";

import "./DeckSettings.scss";

const DeckSettings = () => {
  if (App.state.didGameStart || App.state.isGameFinished) {
    return (
      <div className='DeckSettings'>
        <LandsPanel />
        <ExportDeckPanel />

        {
          App.state.isGameFinished && /draft/.test(App.state.gametype)
            ? <DraftLogPanel />
            : null
        }
      </div>
    )
  }
  return null
};

const LandsPanel = () => (
  <fieldset className='LandsPanel fieldset'>
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

const ExportDeckPanel = () => {
  const activeFormatKey = App.state.exportDeckFormat
  const activeFormat = exportDeck[activeFormatKey]

  return (
    <fieldset className='ExportDeckPanel fieldset'>
      <legend className='legend game-legend'>Deck Export</legend>

      <div className="formats">
        {
          Object.entries(exportDeck).map(([formatKey, format]) => {
            if (!format) return null
            return (
              <div
                className={`format ${formatKey === activeFormatKey ? "-active" : ""}`}
                onClick={() => App.save("exportDeckFormat", formatKey)}
                key={formatKey}
              >
                {format.name}
              </div>
            )
          })
        }
      </div>

      <div className='exports'>

        { /* Download */ }
        {
          activeFormat && activeFormat.download
            ? (
              <div className='download'>
                {/* <span>Download</span> */}
                <input
                  type='text'
                  className=''
                  placeholder='filename'
                  value={App.state.exportDeckFilename}
                  onChange={e => App.save("exportDeckFilename", e.currentTarget.value) }
                />
                
                <div className="extension">
                  {activeFormat.downloadExtension}
                </div>

                <button onClick={App._emit("download")}>
                  <i className="icon ion-android-download" /> Download
                </button>
              </div>
            )
            : null
        }

        { /* Copy */ }
        {
          activeFormat && activeFormat.copy
            ? (
              <div className='copy'>
                <span>Copy to clipboard</span>
                <button onClick={App._emit("copy")}>
                  <i className="icon ion-android-clipboard" /> Copy
                </button>
              </div>
            )
            : null
        }

      </div>
    </fieldset>
  )
};

const DraftLogPanel = () => (
  <fieldset className='DraftLogPanel fieldset'>
    <legend className='legend game-legend'>Draft Log</legend>

    <div className="draft-log">
      <div className='filename'>
        {App.state.exportDeckFilename + '-draftlog.txt' }
      </div>

      <button onClick={App._emit("getLog")}>
        <i className="icon ion-android-download" /> Download
      </button>
    </div>
  </fieldset>
);

export default DeckSettings;
