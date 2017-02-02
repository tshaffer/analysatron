// @flow

import {combineReducers} from 'redux';
import GooglePhotosReducer from './googlePhotos';

const rootReducer = combineReducers({
  googlePhotos: GooglePhotosReducer
});

export default rootReducer;
