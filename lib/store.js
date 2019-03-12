import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/lib/persistReducer";
import { createLogger } from "redux-logger";

import rootReducer from "./reducers";

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
  collapsed: true,
});

const middleware = isProduction
  ? applyMiddleware(thunk)
  : applyMiddleware(thunk, logger);

const persistConfig = {
  key: "root",
  storage,
};

const combinedReducers = combineReducers(rootReducer);

export const initStore = (initialState) => {
  if (!process.browser) {
    initialState = initialState || {};

    return createStore(combinedReducers, initialState, middleware);
  } else {
    const persistedReducer = persistReducer(persistConfig, combinedReducers);
    const store = createStore(persistedReducer, initialState, middleware);

    store.__persistor = persistStore(store);

    return store;
  }
};
