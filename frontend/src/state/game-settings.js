import { createSlice } from "@reduxjs/toolkit";

export const sortChoices = ["cmc", "color", "type", "rarity"];

export const sizeDisplay = {
  "text": "Text-Only",
  "small": "Low",
  "normal": "Medium",
  "large": "High",
};

export const imgLanguageDisplay = {
  "en": "English",
  "fr": "French (Français)",
  "es": "Spanish (Español)",
  "de": "German (Deutsch)",
  "it": "Italian (Italiano)",
  "pt": "Portuguese (Português)",
  "ja": "Japanese (日本語)",
  "ko": "Korean (한국어)",
  "ru": "Russian (Русский)",
  "zhs": "Simplified Chinese (简体中文)",
  "zht": "Traditional Chinese (繁體中文)"
};

export const initialState = {
  beep: true,
  notify: false,
  notificationGranted: false,
  chat: false,
  cols: false,
  hidepicks: false,
  side: false,
  sort: "rarity",
  cardSize: "normal",
  cardLang: "en",
  notificationResult: "",
};

const gameSettings = createSlice({
  name: "gameSettings",
  initialState,
  reducers: {
    toggleBeep: state => {
      state.beep = !state.beep;
    },
    toggleNotify: state => {
      state.notify = !state.notify;
    },
    setNotificationResult: (state, action) => {
      state.notificationResult = action.payload;
    },
    toggleChat: state => {
      state.chat = !state.chat;
    },
    toggleHidepicks: state => {
      state.hidepicks = !state.hidepicks;
    },
    toggleSide: state => {
      state.side = !state.side;
    },
    changeSort: (state, action) => {
      if (sortChoices.includes(action.payload)) {
        state.sort = action.payload;
      }
    },
    changeCardSize: (state, action) => {
      if (Object.keys(sizeDisplay).includes(action.payload)) {
        state.cardSize = action.payload;
      }
    },
    changeCardLang: (state, action) => {
      if (Object.keys(imgLanguageDisplay).includes(action.payload)) {
        state.cardLang = action.payload;
      }
    },
    toggleCols: state => {
      state.cols = !state.cols;
    }
  }
});

export const selectBeep = state => state.gameSettings.beep;
export const selectNotify = state => state.gameSettings.notify;
export const selectNotificationGranted = state => state.gameSettings.notificationGranted;
export const selectChat = state => state.gameSettings.chat;
export const selectHidepicks = state => state.gameSettings.hidepicks;
export const selectSide = state => state.gameSettings.side;
export const selectSort = state => state.gameSettings.sort;
export const selectCols = state => state.gameSettings.cols;
export const selectCardSize = state => state.gameSettings.cardSize;
export const selectCardLang = state => state.gameSettings.cardLang;
export const notificationBlocked = state => ["denied", "notsupported"].includes(state.gameSettings.notificationResult);

export const {changeCardLang, changeCardSize, changeSort, toggleBeep, toggleChat, toggleHidepicks, toggleNotify, setNotificationResult, toggleSide, toggleCols} = gameSettings.actions;

export default gameSettings;