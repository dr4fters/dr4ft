import { createSlice } from '@reduxjs/toolkit';

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
            }
        }
    }
);

export const selectAddBots = state => state.inGameHostSettings.addBots;
export const selectShufflePlayers = state => state.inGameHostSettings.shufflePlayers;
export const selectUseTimer = state => state.inGameHostSettings.useTimer;


export const { toggleBots, toggleShufflePlayers, toggleUseTimer } = inGameHostSettings.actions;

export default inGameHostSettings;