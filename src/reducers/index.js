import { combineReducers } from 'redux';

import playerReducer from './playerReducer';
import userReducer from './userReducer';

export default combineReducers({
    player: playerReducer,
    user: userReducer
})
