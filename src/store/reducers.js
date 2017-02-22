// @flow

import {combineReducers} from 'redux';
import GooglePhotosReducer from './googlePhotos';
import DrivePhotosReducer from './drivePhotos';
import PhotoComparisonResultsReducer from './photoComparisonResults';

const rootReducer = combineReducers({
  googlePhotos: GooglePhotosReducer,
  drivePhotos: DrivePhotosReducer,
  photoComparisonResults: PhotoComparisonResultsReducer,
});

export default rootReducer;
