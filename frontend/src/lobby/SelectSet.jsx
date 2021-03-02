import React from "react";
import PropTypes from "prop-types";
import SelectSearch from "react-select-search";
import Fuse from "fuse.js";

import "./SelectSet.scss";

function fuzzySearch (options) {
  return value => {
    if (!value.length) {
      return options;
    }

    return options.reduce((acc, group) => {
      const fuse = new Fuse(group.items, {
        keys: ["name", "value"],
        minMatchCharLength: 2,
        threshold: 0.3
      })
      const matches = fuse.search(value)

      if (matches.length) {
        acc.push({
          ...group,
          items: matches
        })
      }
      return acc
    }, [])
  };
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
      className="SelectSet"
      options={options}
      name="card-set"
      placeholder="Choose a set"
      value={value}
      onChange={onChange}
      search
      filterOptions={fuzzySearch}
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
