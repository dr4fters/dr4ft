import { capitalize } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import App from "../app";
import Checkbox from "../components/Checkbox";
import { imgLanguageDisplay, selectBeep, selectCardLang, setNotificationResult, changeSort, toggleCols, selectCardSize, selectChat, selectHidepicks, notificationBlocked, selectNotify, selectSort, toggleChat, toggleNotify, toggleBeep, selectSide, toggleSide, toggleHidepicks, selectCols, sortChoices, sizeDisplay, changeCardSize, changeCardLang } from "../state/game-settings";
import "./GameSettings.scss";

const GameSettings = () => {
  const dispatch = useDispatch();
  const beep = useSelector(selectBeep);
  const notify = useSelector(selectNotify);
  const isNotificationBlocked = useSelector(notificationBlocked);
  const chat = useSelector(selectChat);
  const side = useSelector(selectSide);
  const hidePicks = useSelector(selectHidepicks);
  const cols = useSelector(selectCols);

  //TODO: that could go inside the reducer? But it has an async behavior ...
  const onNotificationChange = () => {
    if (!notify) {
      dispatch(toggleNotify());
    } else if ("Notification" in window) {
      Notification.requestPermission().then((result) => {
        dispatch(setNotificationResult(result));
        if (result === "granted") {
          dispatch(toggleNotify());
        }
      });
    } else {
      dispatch(setNotificationResult("notsupported"));
      if (notify) {
        dispatch(toggleNotify());
      }
    }
  };

  return (
    <div className='Game-Settings'>
      <fieldset className='fieldset'>
        <legend className='legend game-legend'>Settings</legend>
        <span>
          <Checkbox
            side="left"
            text="Show chat"
            value={chat}
            onChange={() => dispatch(toggleChat())} />
          {!App.state.isSealed &&
          <Checkbox
            side="left"
            text="Enable notifications on new packs"
            value={beep}
            onChange={() => dispatch(toggleBeep())} />
          }
          {!App.state.isSealed &&
          <div style={{paddingLeft: "10px"}} >
            <Checkbox side="left"
              text={isNotificationBlocked ? "Web notifications blocked in browser" : "Use desktop notifications over beep"}
              value={notify}
              disabled={!beep || isNotificationBlocked}
              onChange={onNotificationChange} />
          </div>
          }
          {!App.state.isSealed &&
            <Checkbox
              side="left"
              text="Add picks to sideboard"
              value={side}
              onChange={() => dispatch(toggleSide())} />}
          {!App.state.isSealed &&
            <Checkbox
              side="left"
              text="Hide your picks"
              value={hidePicks}
              onChange={() => dispatch(toggleHidepicks())} />}
          <Checkbox
            side="left"
            text="Use column view"
            value={cols}
            onChange={() => dispatch(toggleCols())} />
          <SortCards />
          <CardsImageQuality />
          {App.state.cardSize != "text" && <CardsImageLanguage />}
        </span>
      </fieldset>
    </div>
  );
};

const SortCards = () => {
  const dispatch = useDispatch();
  const sortValue = useSelector(selectSort);
  return (
    <div className="sort-cards">
  Sort cards by:
      <div className='connected-container' >
        {sortChoices.map((sort, index) => {
          const isActive = sort === sortValue;

          return (
            <label
              key={index}
              className={isActive ? "active connected-component" : "connected-component"}>
              <input checked= {isActive}
                className='radio-input'
                name= 'sort-order'
                onChange= {e => dispatch(changeSort(e.currentTarget.value))}
                type='radio'
                value={sort}
              />
              <div>{capitalize(sort)}</div>
            </label>
          );
        })}
      </div>
    </div>
  );};

const CardsImageQuality = () => {
  const dispatch = useDispatch();
  const cardSize = useSelector(selectCardSize);
  const cardLang = useSelector(selectCardLang);
  return (
    <div className="card-quality">
    Card image quality:
      <div className='connected-container'>
        {Object.keys(sizeDisplay).map((size, index) => {
          const isActive = size === cardSize;

          return (
            <label key={index}
              className={isActive
                ? "active connected-component"
                : "connected-component"
              }
            >
              <input checked={isActive}
                className='radio-input'
                name='card-size'
                onChange={e => dispatch(changeCardSize(e.currentTarget.value))}
                type='radio'
                value={size} />
              <div>{sizeDisplay[size]}</div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

const CardsImageLanguage = () => {
  const dispatch = useDispatch();
  const cardLang = useSelector(selectCardLang);
  return (
    <div className="cards-language">
    Card image language:
      <div className='connected-container'>
        <select
          value={cardLang}
          onChange={e => dispatch(changeCardLang(e.currentTarget.value))}>
          {Object.entries(imgLanguageDisplay).map(([value, label]) =>
            <option key={value} value={value}>{label}</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default GameSettings;
