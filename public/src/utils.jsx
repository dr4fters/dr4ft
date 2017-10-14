import React, {Component} from "react"

import App from './app'
import _ from "../lib/utils"

/**
 * Utils offers a list of "connected" tools
 * through a "link" prop to connect to the app state
 */

export const Checkbox = ({link, text, side, onChange}) => (
  <div>
    {side == 'right'
      ? text
      : ''}
    <input
      type="checkbox"
      onChange={onChange || function (e) {
      App.save(link, e.currentTarget.checked)
    }}
      checked={App.state[link]}/> {side == 'left'
      ? text
      : ''}
  </div>
)

export const Spaced = ({elements}) => (
  elements
  .map(x => <span key={_.uid()}>{x}</span>)
  .reduce((prev, curr) => [
    prev,
    <span key = { _.uid() } className = 'spacer-dot' />,
    curr
  ])
)

export const Select = ({ link, opts, ...rest }) => (
  <select
    onChange={(e) => {
      App.save(link, e.currentTarget.value)
    }}
    value={App.state[link]}
    {...rest}>
      {opts.map(opt =>
        <option key={_.uid()}>{opt}</option>
      )}
  </select>
)

export const Textarea = ({ link, ...rest}) => (
  <textarea
    onChange=
      { (e) => { App.save("list", e.currentTarget.value) } }
    value={App.state[link]}
    {...rest} />
)
