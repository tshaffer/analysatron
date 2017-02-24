// @flow

const fs = require('fs');

import type {
  PhotoComparisonResults,
  DrivePhotoToGooglePhotoComparisonResults
} from '../types';

import { readFile } from '../utilities/utils';

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

// ------------------------------------
// Constants
// ------------------------------------
const SET_PHOTO_COMPARISON_RESULTS = 'SET_PHOTO_COMPARISON_RESULTS';
const ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS = 'ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS';
const SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS = 'SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS';
const SET_DRIVE_PHOTO_INDEX = 'SET_DRIVE_PHOTO_INDEX';

// ------------------------------------
// Action Creators
// ------------------------------------
export function saveDrivePhotoToGooglePhotoComparisonResults() {

  return function (_: Function, getState: Function) {

    const drivePhotoToGooglePhotoComparisonResultsStr =
      JSON.stringify(getState().photoComparisonResults.drivePhotoToGooglePhotoComparisonResults, null, 2);
    fs.writeFileSync('drivePhotoToGooglePhotoComparisonResults.json', drivePhotoToGooglePhotoComparisonResultsStr);
  };
}

export function readDrivePhotoToGooglePhotoComparisonResults() {

  return function (dispatch: Function, __: Function) {

    readFile('drivePhotoToGooglePhotoComparisonResults.json').then((drivePhotoToGooglePhotoComparisonResultsBuf) => {

      let drivePhotoToGooglePhotoComparisonResultsStr = decoder.write(drivePhotoToGooglePhotoComparisonResultsBuf);
      let drivePhotoToGooglePhotoComparisonResultsSpec = JSON.parse(drivePhotoToGooglePhotoComparisonResultsStr);
      dispatch(setDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResultsSpec));

      dispatch(setDrivePhotoIndex(0));
    });
  };
}


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

export function addDrivePhotoToGooglePhotoComparisonResults(
  drivePhotoToGooglePhotoComparisonResults: DrivePhotoToGooglePhotoComparisonResults) {

  return {
    type: ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS,
    payload: drivePhotoToGooglePhotoComparisonResults
  };
}

export function setDrivePhotoIndex(drivePhotoIndex : number) {

  return {
    type: SET_DRIVE_PHOTO_INDEX,
    payload: drivePhotoIndex
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  photoComparisonResults: {},
  drivePhotoToGooglePhotoComparisonResults: {},
  drivePhotoIndex: 0
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case SET_DRIVE_PHOTO_INDEX: {
      let newState = Object.assign({}, state);
      newState.drivePhotoIndex = action.payload;
      return newState;
    }

    case SET_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.photoComparisonResults = action.payload;
        // newState.drivePhotoToGooglePhotoComparisonResults = state.drivePhotoToGooglePhotoComparisonResults;
        return newState;
      }

    case ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotoToGooglePhotoComparisonResults =
          Object.assign(newState.drivePhotoToGooglePhotoComparisonResults, action.payload);
        console.log('ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS');
        console.log(newState);
        return newState;
      }

    case SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotoToGooglePhotoComparisonResults = action.payload;
        console.log('SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS');
        console.log(newState);
        return newState;
      }
  }

  return state;
}




