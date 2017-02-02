// @flow

import { readFile } from '../utilities/utils';

import { GooglePhoto } from '../entities/googlePhoto';

// ------------------------------------
// Constants
// ------------------------------------
const ADD_GOOGLE_PHOTOS = 'ADD_GOOGLE_PHOTOS';
const SET_GOOGLE_PHOTO_DICTIONARIES = 'SET_GOOGLE_PHOTO_DICTIONARIES';

// ------------------------------------
// Action Creators
// ------------------------------------
export function readGooglePhotos() {

  return function (dispatch: Function) {

    return new Promise( (resolve, reject) => {

      readFile('googlePhotos.json').then((googlePhotosStr) => {
        let googlePhotosSpec = JSON.parse(googlePhotosStr);

        let googlePhotos = [];
        googlePhotosSpec.forEach( (googlePhotoSpec ) => {
          let googlePhoto = new GooglePhoto(googlePhotoSpec);
          googlePhotos.push(googlePhoto);
        });

        dispatch(addGooglePhotos(googlePhotos));

        resolve();

      }, (reason) => {
        reject(reason);
      });
    });
  };
}

// ------------------------------------
// Actions
// ------------------------------------
function addGooglePhotos(googlePhotos) {
  return {
    type: ADD_GOOGLE_PHOTOS,
    payload: googlePhotos
  };
}

function setGooglePhotoDictionaries(
  gfsByDateTime,
  gfsByExifDateTime,
  gfsByName,
  photosByAltKey,
  gfsByHash) {
  return {
    type: SET_GOOGLE_PHOTO_DICTIONARIES,
    payload: {
      gfsByDateTime,
      gfsByExifDateTime,
      gfsByName,
      photosByAltKey,
      gfsByHash
    }
  };
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  googlePhotos: [],
  gfsByExifDateTime: {},
  gfsByName: {},
  photosByAltKey: {},
  gfsByHash: {}
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case ADD_GOOGLE_PHOTOS:
      {
        let newState = Object.assign({}, state);
        newState.googlePhotos = action.payload;
        return newState;
      }
    case SET_GOOGLE_PHOTO_DICTIONARIES:
      {
        let payload = action.payload;
        let newState = Object.assign({}, state);
        newState.gfsByDateTime = payload.gfsByDateTime;
        newState.gfsByExifDateTime = payload.gfsByExifDateTime;
        newState.gfsByName = payload.gfsByName;
        newState.photosByAltKey = payload.photosByAltKey;
        newState.gfsByHash = payload.gfsByHash;
        return newState;
      }
  }

  return state;
}

