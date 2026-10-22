import React from "react";
import PropTypes from "prop-types";
// The package's ESM build exports its CommonJS exports object as default, so use the CJS build
import SelectSearch from "react-select-search/dist/cjs";
import Fuse from "fuse.js";
import { groupBy } from "lodash";

import "./SelectSet.scss";

// react-select-search hands over a flat list where each option carries its group,
// so search group by group to keep the groups in their original order
function fuzzySearch (options, query) {
  if (!query.length) {
    return options;
  }

  return Object.values(groupBy(options, "group")).flatMap(items => {
    const fuse = new Fuse(items, {
      keys: ["name", "value"],
      minMatchCharLength: 2,
      threshold: 0.3
    })
    return fuse.search(query).map(match => match.item)
  })
}

// v4 derives every class name from a string className as "SelectSet-<key>",
// so map them to the names SelectSet.scss uses
const classNames = {
  "container": "SelectSet",
  "value": "SelectSet__value",
  "input": "SelectSet__input",
  "select": "SelectSet__select",
  "options": "SelectSet__options",
  "row": "SelectSet__row",
  "option": "SelectSet__option",
  "group": "SelectSet__group",
  "group-header": "SelectSet__group-header",
  "not-found": "SelectSet__not-found",
  "is-multiple": "SelectSet--multiple",
  "is-disabled": "is-disabled",
  "is-loading": "is-loading",
  "is-selected": "is-selected",
  "is-highlighted": "is-highlighted",
  "has-focus": "has-focus"
}

import App from "../app";

const SelectSet = ({ value, onChange }) => {
  const options = Object.entries(App.state.availableSets).reduce((acc, [setType, sets]) => {
    acc.push({
      type: "group",
      name: setType, // TODO titlecase
      items: sets.map(set => ({
        name: set.name,
        value: set.code
      }))
    })

    return acc
  }, [])

  return (
    <SelectSearch
      className={classNames}
      options={options}
      name="card-set"
      placeholder="Choose a set"
      value={value}
      onChange={onChange}
      search
      fuzzySearch={false}
      filterOptions={[fuzzySearch]}
      renderValue={(valueProps) => {
        return (
          <div className="SelectSet__input-container" >
            <i className={`ss ss-${value.toLowerCase()}`} />
            <input className='SelectSet__input' {...valueProps} />
          </div>
        )
      }}
      renderOption={(optionProps, optionData, snapshot, className) => {
        return (
          <button {...optionProps} className={className} type="button">
            <i className={`ss ss-${optionData.value.toLowerCase()}`} />
            {optionData.name}
            <span className='set-code'>
              {optionData.value}
            </span>
          </button>

        )
      }}
    />
  );
};

SelectSet.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default SelectSet;
