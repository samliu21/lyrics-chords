import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

import songsReducer from "./reducers/songsReducer";
import selectedSongReducer from "./reducers/selectedSongReducer";
import authReducer from "./reducers/authReducer";
import commentReducers from "./reducers/commentReducers";

const rootReducer = combineReducers({
	songs: songsReducer,
	selectedSong: selectedSongReducer,
	auth: authReducer,
	comments: commentReducers
});

const persistConfig = {
	key: "root",
	storage: storage,
	stateReconciler: autoMergeLevel1,
	blacklist: ["songs, comments"],
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);

// export default store;
