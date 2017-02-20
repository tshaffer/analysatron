// @flow

import type { PhotosByHash, PhotoComparisonResults } from '../types';

import { readFile } from '../utilities/utils';

import DrivePhoto from '../entities/drivePhoto';

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');


// ------------------------------------
// Constants
// ------------------------------------
const ADD_DRIVE_PHOTOS = 'ADD_DRIVE_PHOTOS';
const SET_DRIVE_PHOTOS_BY_HASH = 'SET_DRIVE_PHOTOS_BY_HASH';
const SET_PHOTO_COMPARISON_RESULTS = 'SET_PHOTO_COMPARISON_RESULTS';

// ------------------------------------
// Action Creators
// ------------------------------------
export function readDrivePhotos() {

  return function(dispatch: Function) {

    return new Promise( (resolve, reject) => {

      readFile('drivePhotos.json').then((drivePhotosBuf) => {

        let drivePhotosStr = decoder.write(drivePhotosBuf);
        let drivePhotosSpec = JSON.parse(drivePhotosStr);

        let drivePhotos = [];

        for (let photoPath in drivePhotosSpec) {
          if (drivePhotosSpec.hasOwnProperty(photoPath)) {
            let drivePhotoSpec = drivePhotosSpec[photoPath];
            let drivePhoto = new DrivePhoto(drivePhotoSpec);
            drivePhotos.push(drivePhoto);
          }
        }

        dispatch(addDrivePhotos(drivePhotos));

        resolve();
      }).catch( (err) => {
        reject(err);
      });
    });
  };
}

// ------------------------------------
// Helpers
// ------------------------------------
let drivePhotosByPath = {};

export function buildDrivePhotoDictionaries() {

  return function (_: Function, getState: Function) {
    const state = getState();
    const drivePhotos = state.drivePhotos.drivePhotos;

    drivePhotosByPath = {};
    drivePhotos.forEach( (drivePhoto: DrivePhoto) => {
      if (drivePhotosByPath[drivePhoto.path]) {
        debugger;
      }
      else {
        drivePhotosByPath[drivePhoto.path] = drivePhoto;
      }
    });
  };

}
// ------------------------------------
// Actions
// ------------------------------------
function addDrivePhotos(drivePhotos) {
  return {
    type: ADD_DRIVE_PHOTOS,
    payload: drivePhotos
  };
}

export function setDrivePhotosByHash(drivePhotosByHash : PhotosByHash) {
  return {
    type: SET_DRIVE_PHOTOS_BY_HASH,
    payload: drivePhotosByHash
  };
}

export function setPhotoComparisonResults(photoComparisonResults: PhotoComparisonResults) {
  return {
    type: SET_PHOTO_COMPARISON_RESULTS,
    payload: photoComparisonResults
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  drivePhotos: [],
  drivePhotosByHash: {},
  photoComparisonResults: {}
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case ADD_DRIVE_PHOTOS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotos = action.payload;
        newState.drivePhotosByHash = state.drivePhotosByHash;
        newState.photoComparisonResults = state.photoComparisonResults;
        return newState;
      }

    case SET_DRIVE_PHOTOS_BY_HASH:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotos = state.drivePhotos;
        newState.drivePhotosByHash = action.payload;
        newState.photoComparisonResults = state.photoComparisonResults;
        return newState;
      }

    case SET_PHOTO_COMPARISON_RESULTS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotos = state.drivePhotos;
        newState.drivePhotosByHash = action.drivePhotosByHash;
        newState.photoComparisonResults = action.payload;
        return newState;
      }
  }

  return state;
}




