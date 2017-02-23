// @flow

import type {
  PhotoComparisonResults,
  DrivePhotoToGooglePhotoComparisonResults
} from '../types';

// ------------------------------------
// Constants
// ------------------------------------
const SET_PHOTO_COMPARISON_RESULTS = 'SET_PHOTO_COMPARISON_RESULTS';
const SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS = 'SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS';

// ------------------------------------
// Action Creators
// ------------------------------------

// ------------------------------------
// Helpers
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------
export function setPhotoComparisonResults(photoComparisonResults: PhotoComparisonResults) {
  return {
    type: SET_PHOTO_COMPARISON_RESULTS,
    payload: photoComparisonResults
  };
}

export function setDrivePhotoToGooglePhotoComparisonResults(
  drivePhotoToGooglePhotoComparisonResults: DrivePhotoToGooglePhotoComparisonResults) {

  return {
    type: SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS,
    payload: drivePhotoToGooglePhotoComparisonResults
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  photoComparisonResults: {},
  drivePhotoToGooglePhotoComparisonResults: []
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case SET_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.photoComparisonResults = action.payload;
        newState.drivePhotoToGooglePhotoComparisonResults = state.drivePhotoToGooglePhotoComparisonResults;
        return newState;
      }

    case SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.photoComparisonResults = state.photoComparisonResults;
        newState.drivePhotoToGooglePhotoComparisonResults = action.payload;
        console.log(newState);
        return newState;
      }
  }

  return state;
}




