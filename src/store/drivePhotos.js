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

  return function (dispatch: Function) {

    let promise = readFile('drivePhotos.json');
    promise.then((drivePhotosStr) => {
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

    }, (reason) => {
      throw(reason);
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
        debugger;
        return newState;
      }
  }

  return state;
}




