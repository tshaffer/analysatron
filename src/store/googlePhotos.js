// @flow

import type { PhotosByHash } from '../types';

import { readFile } from '../utilities/utils';

import GooglePhoto from '../entities/googlePhoto';

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

// ------------------------------------
// Constants
// ------------------------------------
const ADD_GOOGLE_PHOTOS = 'ADD_GOOGLE_PHOTOS';
// const SET_GOOGLE_PHOTO_DICTIONARIES = 'SET_GOOGLE_PHOTO_DICTIONARIES';
const SET_GOOGLE_PHOTOS_BY_HASH = 'SET_GOOGLE_PHOTOS_BY_HASH';

// ------------------------------------
// Action Creators
// ------------------------------------
export function readGooglePhotos() {

  return function (dispatch: Function) {

    return new Promise( (resolve, reject) => {

      readFile('googlePhotos.json').then((googlePhotosBuf) => {

        let googlePhotosStr = decoder.write(googlePhotosBuf);
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

export function setGooglePhotosByHash(googlePhotosByHash : PhotosByHash) {
  return {
    type: SET_GOOGLE_PHOTOS_BY_HASH,
    payload: googlePhotosByHash
  };
}

// function setGooglePhotoDictionaries(
//   gfsByDateTime,
//   gfsByExifDateTime,
//   gfsByName,
//   photosByAltKey,
//   gfsByHash) {
//   return {
//     type: SET_GOOGLE_PHOTO_DICTIONARIES,
//     payload: {
//       gfsByDateTime,
//       gfsByExifDateTime,
//       gfsByName,
//       photosByAltKey,
//       gfsByHash
//     }
//   };
// }


// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  googlePhotos: [],
  gfsByExifDateTime: {},
  gfsByName: {},
  photosByAltKey: {},
  gfsByHash: {},
  googlePhotosByHash: {}

};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case ADD_GOOGLE_PHOTOS:
      {
        let newState = Object.assign({}, state);
        newState.googlePhotos = action.payload;
        newState.googlePhotosByHash = state.googlePhotosByHash;
        return newState;
      }
    case SET_GOOGLE_PHOTOS_BY_HASH:
      {
        let newState = Object.assign({}, state);
        newState.googlePhotos = state.googlePhotos;
        newState.googlePhotosByHash = action.payload;
        return newState;
      }
    // case SET_GOOGLE_PHOTO_DICTIONARIES:
    //   {
    //     let payload = action.payload;
    //     let newState = Object.assign({}, state);
    //     newState.gfsByDateTime = payload.gfsByDateTime;
    //     newState.gfsByExifDateTime = payload.gfsByExifDateTime;
    //     newState.gfsByName = payload.gfsByName;
    //     newState.photosByAltKey = payload.photosByAltKey;
    //     newState.gfsByHash = payload.gfsByHash;
    //     return newState;
    //   }
  }

  return state;
}

