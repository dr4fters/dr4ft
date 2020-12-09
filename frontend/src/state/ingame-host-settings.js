import { createSlice } from '@reduxjs/toolkit';

export const timers = ["Fast", "Moderate", "Slow", "Leisurely"];

const inGameHostSettings = createSlice({
        name: "ingameHostSettings",
        initialState: {
            addBots: true,
            shufflePlayers: true,
            useTimer: true,
            timerLength: "Moderate", // Fast Moderate or Slow
        },
        reducers: {
            toggleBots: state => {
                state.addBots = !state.addBots;
            },
            toggleShufflePlayers: state => {
                state.shufflePlayers = !state.shufflePlayers;
            },
            toggleUseTimer: state => {
                state.useTimer = !state.useTimer;
            },
            setTimerLength: (state, action) => {
                if (timers.includes(action.payload)) {
                    state.timerLength = action.payload;
                }
            }
        }
    }
);

export const selectAddBots = state => state.inGameHostSettings.addBots;
export const selectShufflePlayers = state => state.inGameHostSettings.shufflePlayers;
export const selectUseTimer = state => state.inGameHostSettings.useTimer;
export const selectTimerLength = state => state.inGameHostSettings.timerLength;

export const { toggleBots, toggleShufflePlayers, toggleUseTimer, setTimerLength } = inGameHostSettings.actions;

export default inGameHostSettings;