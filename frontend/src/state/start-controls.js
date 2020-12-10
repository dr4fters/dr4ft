import { createSlice } from '@reduxjs/toolkit';

export const timers = ["Fast", "Moderate", "Slow", "Leisurely"];

export const initialState = {
    addBots: true,
    shufflePlayers: true,
    useTimer: true,
    timerLength: "Moderate", // Fast Moderate or Slow
};

const startControls = createSlice({
        name: "startControls",
        initialState,
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

export const selectAddBots = state => state.startControls.addBots;
export const selectShufflePlayers = state => state.startControls.shufflePlayers;
export const selectUseTimer = state => state.startControls.useTimer;
export const selectTimerLength = state => state.startControls.timerLength;

export const { toggleBots, toggleShufflePlayers, toggleUseTimer, setTimerLength } = startControls.actions;

export default startControls;