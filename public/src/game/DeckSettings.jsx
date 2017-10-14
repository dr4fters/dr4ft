import App from '../app'
import {BASICS, Zones} from '../cards'
import React from "react"
import {Select} from "../utils"

function Lands() {
  let colors = ['White', 'Blue', 'Black', 'Red', 'Green']
  let symbols = colors.map(x => <td>
    <img src={`http://www.wizards.com/Magic/redesign/${x}_Mana.png`}/>
  </td>)

  let [main,
    side] = ['main', 'side'].map(zoneName => {
    let inputs = BASICS.map(cardName => <td>
      <input
        className='number'
        min={0}
        onChange={App._emit('land', zoneName, cardName)}
        type='number'
        value={Zones[zoneName][cardName] || 0}/>
    </td>)

    return (
      <tr>
        <td>{zoneName}</td>
        {inputs}
      </tr>
    )
  })

  let suggest = (
    <tr>
      <td>deck size</td>
      <td><input
        className='number'
        min={0}
        onChange={App._emit('deckSize')}
        type='number'
        value={App.state.deckSize}/></td>
      <td colSpan={2}>
        <button className='land-suggest-button' onClick={App._emit('resetLands')}>
          reset lands
        </button>
      </td>
      <td colSpan={2}>
        <button className='land-suggest-button' onClick={App._emit('suggestLands')}>
          suggest lands
        </button>
      </td>
    </tr>
  )

  return (
    <fieldset className='land-controls fieldset'>
      <legend className='legend game-legend'>Lands</legend>
      <table>
        <tr>
          <td/> {symbols}
        </tr>
        {main}
        {side}
        {suggest}
      </table>
    </fieldset>
  )
}

function Download() {
  const filetypes = ['cod', 'json', 'mwdeck', 'txt']
  // TODO: Checker car j'ai ajouté un <label> dans le Select par rapport à avant!
  const select = <Select link='filetype' opts={filetypes}/>

  return (
    <div className='connected-container'>
      <button className='connected-component' onClick={App._emit('download')}>
        Download as
      </button>
      <input
        type='text'
        className='download-filename connected-component'
        placeholder='filename'
        value={App.state["filename"]}
        onChange={function (e) {
        App.save("filename", e.currentTarget.checked)
      }}/> {select}
      <span className='download-button'/>
    </div>
  )
}

export default class DeckSettings extends React.Component {
  render() {
    if (App.state.isGameFinished || App.state.didGameStart) 
      return (
        <div className='deck-settings'>
          {Lands()}
          <fieldset className='download-controls fieldset'>
            <legend className='legend game-legend'>Download</legend>
            {Download()}
            {this.Copy()}
            {this.Log()}
          </fieldset>
        </div>
      )
    return null
  };
  Copy() {
    return (
      <div className='copy-controls connected-container'>
        <button
          className='connected-component'
          onClick={App._emit('copy', this.refs.decklist)}>
          Make copyable text
        </button>
        <textarea
          className='connected-component'
          placeholder='decklist'
          ref='decklist'
          readOnly={true}/>
      </div>
    )
  };
  Log() {
    return (
      <div>
        <button className='connected-component' onClick={App._emit('getLog')}>Download Draft Log</button>
      </div>
    )
  }
}
