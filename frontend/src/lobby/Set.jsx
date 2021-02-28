import React from "react";
import PropTypes from "prop-types";
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';

function fuzzySearch (options) {
  return value => {
    if (!value.length) {
      return options;
    }

    return options.reduce((acc, group) => {
      const fuse = new Fuse(group.items, {
        keys: ['name', 'value'],
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

const Set = ({ index, selectedSet, type }) => {
  const options = Object.entries(App.state.availableSets).reduce((acc, [setType, sets]) => {
    acc.push({
      type: 'group',
      name: setType, // TODO titlecase
      items: sets.map(set => ({
        name: set.name,
        value: set.code
      }))
    })

    return acc
  }, [])

  const handleSetChange = (value) => {
    const sets = App.state[type];
    sets[index] = value;

    App.save(type, App.state[type]);
  };

  return (
    <SelectSearch
      options={options}
      name="card-set"
      placeholder="Choose a set"
      value={selectedSet}
      onChange={handleSetChange}
      search
      filterOptions={fuzzySearch}
      renderValue={(valueProps, ref, selectedValue) => {
        return (
          <div className='select-search_input-container'>
            <i className={`ss ss-${App.state[type][index].toLowerCase()}`} />
            <input className='select-search__input' {...valueProps} />
          </div>
        )
      }}
      renderOption={(optionProps, optionData) => {
        return (
          <button className='select-search__option' {...optionProps}>
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

Set.propTypes = {
  index: PropTypes.number,
  selectedSet: PropTypes.string,
  type: PropTypes.string
};

export default Set;
