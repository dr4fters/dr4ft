import {combineReducers, configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { persistReducer, FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER } from 'redux-persist';
import {initialState as startControlInitState} from "./start-controls";
import startControls from "./start-controls";
import migrateState from './migration';

const reducers = combineReducers({
    startControls: startControls.reducer
});

const persistConfig = {
    key: "root",
    storage,
    migrate: (state) => {
        if (!state) { 
            state = {};
        }
        const newState = {
            ...state,
            startControls: migrateState(startControlInitState, state.startControls)
        };
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