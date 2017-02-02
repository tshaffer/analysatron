// @flow

import { readFile } from '../utilities/utils';

import { DrivePhoto } from '../entities/drivePhoto';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_DRIVE_PHOTOS = 'ADD_DRIVE_PHOTOS';

// ------------------------------------
// Action Creators
// ------------------------------------
export function readDrivePhotos() {

  return function(dispatch: Function) {

    return new Promise( (resolve, reject) => {

      readFile('drivePhotos.json').then((drivePhotosStr) => {

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

  return function (dispatch: Function, getState: Function) {
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

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  drivePhotos: [],
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case ADD_DRIVE_PHOTOS:
      {
        let newState = Object.assign({}, state);
        newState.drivePhotos = action.payload;
        return newState;
      }
  }

  return state;
}




