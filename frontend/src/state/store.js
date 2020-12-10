import {combineReducers, configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER } from 'redux-persist';
import {initialState as startControlInitState} from "./ingame-host-settings";
import inGameHostSettings from "./ingame-host-settings";
import migrateState from './migration';

const reducers = combineReducers({
    inGameHostSettings: inGameHostSettings.reducer
});

const persistConfig = {
    key: "root",
    storage,
    migrate: (state) => {
        if (!state) { 
            state = {};
        }
        console.log("Migration running");
        console.log("state before migration", state);
        const newState = {
            ...state,
            inGameHostSettings: migrateState(startControlInitState, state.inGameHostSettings)
        };
        console.log("state after migration", newState);
        return Promise.resolve(newState);
    }
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
          }
      }),
})