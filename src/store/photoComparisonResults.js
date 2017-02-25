// @flow

const fs = require('fs');

import type {
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
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
const SET_UNMATCHED_EXISTING_PHOTOS = 'SET_UNMATCHED_EXISTING_PHOTOS';

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

export function navigateForward() {

  return function(dispatch: Function, getState: Function) {

    const state = getState();

    let drivePhotoIndex : number = state.photoComparisonResults.drivePhotoIndex;
    let unmatchedExistingPhotos : Array<IdenticalPhotos> = state.photoComparisonResults.unmatchedExistingPhotos;
    let drivePhotoToGooglePhotoComparisonResults : Object =
      state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults;

    let haveUnreviewedPhoto : boolean = false;
    while (!haveUnreviewedPhoto) {
      const identicalDrivePhotos: IdenticalPhotos = unmatchedExistingPhotos[drivePhotoIndex];
      const drivePhotoItems : PhotoItems = identicalDrivePhotos.photoItems;
      const drivePhotoItem : PhotoItem = drivePhotoItems[0];
      if (!drivePhotoToGooglePhotoComparisonResults[drivePhotoItem.photo.path]) {
        haveUnreviewedPhoto = true;
      }
      else {
        drivePhotoIndex++;
        if (drivePhotoIndex >= unmatchedExistingPhotos.length) {
          drivePhotoIndex = 0;
        }
      }
    }

    dispatch(setDrivePhotoIndex(drivePhotoIndex));
  };
}

export function readDrivePhotoToGooglePhotoComparisonResults() {

  return function (dispatch: Function, getState: Function) {

    readFile('drivePhotoToGooglePhotoComparisonResults.json').then((drivePhotoToGooglePhotoComparisonResultsBuf) => {

      let drivePhotoToGooglePhotoComparisonResultsStr = decoder.write(drivePhotoToGooglePhotoComparisonResultsBuf);
      let drivePhotoToGooglePhotoComparisonResults = JSON.parse(drivePhotoToGooglePhotoComparisonResultsStr);

      const state = getState();

      // unmatched photos - strip out those that don't exist (due to debugging configuration)
      const unmatchedPhotos: Array<IdenticalPhotos> =
        state.photoComparisonResults.photoComparisonResults.unmatchedPhotos;
      if (!unmatchedPhotos) {
        debugger;
      }

      let unmatchedExistingPhotos : Array<IdenticalPhotos> = [];
      unmatchedPhotos.forEach( (unmatchedPhoto) => {
        const photoItems : PhotoItems = unmatchedPhoto.photoItems;
        const photoItem : PhotoItem = photoItems[0];
        if (photoItem.photo.fileExists()) {
          unmatchedExistingPhotos.push(unmatchedPhoto);
        }
      });

      unmatchedExistingPhotos.sort( (identicalPhotosA, identicalPhotosB) => {
        if (identicalPhotosA && identicalPhotosB) {
          const minHashDistanceA : number = identicalPhotosA.closestGooglePhoto.minHashDistance;
          const minHashDistanceB : number = identicalPhotosB.closestGooglePhoto.minHashDistance;
          return minHashDistanceA - minHashDistanceB;
        }
        return 0;
      });


      dispatch(setDrivePhotoIndex(0));
      dispatch(setUnmatchedExistingPhotos(unmatchedExistingPhotos));
      dispatch(setDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResults));

      dispatch(navigateForward());
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

export function setUnmatchedExistingPhotos(unmatchedExistingPhotos : Array<IdenticalPhotos>) {

  return {
    type: SET_UNMATCHED_EXISTING_PHOTOS,
    payload: unmatchedExistingPhotos
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  photoComparisonResults: {},
  drivePhotoToGooglePhotoComparisonResults: {},
  drivePhotoIndex: 0,
  unmatchedExistingPhotos: [],
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case SET_DRIVE_PHOTO_INDEX: {
      let newState = Object.assign({}, state);
      newState.drivePhotoIndex = action.payload;
      return newState;
    }

    case SET_UNMATCHED_EXISTING_PHOTOS: {
      let newState = Object.assign({}, state);
      newState.unmatchedExistingPhotos = action.payload;
      return newState;
    }

    case SET_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.photoComparisonResults = action.payload;
        return newState;
      }

    case ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotoToGooglePhotoComparisonResults =
          Object.assign(newState.drivePhotoToGooglePhotoComparisonResults, action.payload);
        return newState;
      }

    case SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotoToGooglePhotoComparisonResults = action.payload;
        return newState;
      }
  }

  return state;
}




