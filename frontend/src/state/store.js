import {configureStore} from '@reduxjs/toolkit';
import inGameHostSettings from "./ingame-host-settings";

export default configureStore({
    reducer: {
        inGameHostSettings: inGameHostSettings.reducer
    }
})