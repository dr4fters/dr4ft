import React from "react";

import App from "../app";
import exportDeck from "../export";

import "./DeckSettings.scss";

const DeckSettings = () => {
  if (App.state.didGameStart || App.state.isGameFinished) {
    return (
      <div className='DeckSettings'>
        <ExportDeckPanel />

        {
          App.state.isGameFinished && /draft/.test(App.state.gametype)
            ? <DraftLogPanel />
            : null
        }
      </div>
    );
  }
  return null;
};

const ExportDeckPanel = () => {
  const activeFormatKey = App.state.exportDeckFormat;
  const activeFormat = exportDeck[activeFormatKey];

  return (
    <fieldset className='ExportDeckPanel fieldset'>
      <legend className='legend game-legend'>Deck Export</legend>

      <div className="formats">
        {
          Object.entries(exportDeck).map(([formatKey, format]) => {
            if (!format) return null;
            return (
              <div
                className={`format ${formatKey} ${formatKey === activeFormatKey ? "-active" : ""}`}
                onClick={() => App.save("exportDeckFormat", formatKey)}
                key={formatKey}
              >
                {format.name}
              </div>
            );
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
  );
};

const DraftLogPanel = () => (
  <fieldset className='DraftLogPanel fieldset'>
    <legend className='legend game-legend'>Draft Log</legend>

    <div className="draft-log">
      <div className='filename'>
        {App.state.exportDeckFilename + "-draftlog.txt" }
      </div>

      <button onClick={App._emit("getLog")}>
        <i className="icon ion-android-download" /> Download
      </button>
    </div>
  </fieldset>
);

export default DeckSettings;
