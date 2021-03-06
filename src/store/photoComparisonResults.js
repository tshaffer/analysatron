// @flow

const fs = require('fs');
const path = require('path');

import type {
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
  PhotoComparisonResults,
  DrivePhotoToGooglePhotoComparisonResults,
  MatchedPhoto
} from '../types';

import { readFile } from '../utilities/utils';

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

import { convertPhoto } from '../utilities/photoUtilities';

import * as utils from '../utilities/utils';

// ------------------------------------
// Constants
// ------------------------------------
const SET_PHOTO_COMPARISON_RESULTS = 'SET_PHOTO_COMPARISON_RESULTS';
const ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS = 'ADD_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS';
const SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS = 'SET_DRIVE_PHOTO_TO_GOOGLE_PHOTO_COMPARISON_RESULTS';

const SET_DRIVE_PHOTO_INDEX = 'SET_DRIVE_PHOTO_INDEX';
const SET_MATCHED_DRIVE_PHOTO_INDEX = 'SET_MATCHED_DRIVE_PHOTO_INDEX';

const SET_MATCHED_EXISTING_PHOTOS = 'SET_MATCHED_EXISTING_PHOTOS';
const SET_UNMATCHED_EXISTING_PHOTOS = 'SET_UNMATCHED_EXISTING_PHOTOS';

// ------------------------------------
// Action Creators
// ------------------------------------
export function saveDrivePhotoToGooglePhotoComparisonResults() {

  return function (_: Function, getState: Function) {

    const drivePhotoToGooglePhotoComparisonResultsStr =
      JSON.stringify(getState().photoComparisonResults.drivePhotoToGooglePhotoComparisonResults, null, 2);
    fs.writeFileSync('drivePhotoToGooglePhotoComparisonResults.json', drivePhotoToGooglePhotoComparisonResultsStr);

    console.log('drivePhotoToGooglePhotoComparisonResults.json write complete');
  };
}

export function initMatchedDrivePhotoComparisons() {

  return function (dispatch: Function, getState: Function) {

    const state = getState();

    // matched photos - strip out those that don't exist (due to debugging configuration)
    const matchedPhotos: Array<MatchedPhoto> =
      state.photoComparisonResults.photoComparisonResults.matchedPhotos;
    if (!matchedPhotos) {
      debugger;
    }

    let matchedExistingPhotos: Array<MatchedPhoto> = [];
    let numMissingPhotoItems = 0;
    matchedPhotos.forEach((matchedPhoto, index) => {
      const drivePhotos : IdenticalPhotos = matchedPhoto.drivePhotos;
      const photoItems: PhotoItems = drivePhotos.photoItems;
      const photoItem: PhotoItem = photoItems[0];
      if (!photoItem || !photoItem.photo) {
        numMissingPhotoItems++;
      }
      else if (photoItem.photo.fileExists()) {
        matchedExistingPhotos.push(matchedPhoto);
      }
    });

    console.log("numMissingPhotosItems: ", numMissingPhotoItems);
    console.log("number of photos to compare: ", matchedPhotos.length);

    dispatch(setMatchedDrivePhotoIndex(-1));
    dispatch(setMatchedExistingPhotos(matchedExistingPhotos));
    dispatch(navigateMatchedForward());

  };
}

export function getUnreviewedPhotos() {

  return function (dispatch: Function, getState: Function) {
    return new Promise( (resolve) => {

      const state = getState();
      const unmatchedPhotos: Array<IdenticalPhotos> =
        state.photoComparisonResults.photoComparisonResults.unmatchedPhotos;
      let unmatchedExistingPhotos: Array<IdenticalPhotos> = [];
      unmatchedPhotos.forEach((unmatchedPhoto) => {
        const photoItems: PhotoItems = unmatchedPhoto.photoItems;
        const photoItem: PhotoItem = photoItems[0];
        if (photoItem.photo.fileExists()) {
          unmatchedExistingPhotos.push(unmatchedPhoto);
        }
      });

      let drivePhotoIndex : number = 0;

      let unreviewedPhotos : Array<IdenticalPhotos> = [];
      unmatchedExistingPhotos.forEach( (unmatchedExistingPhoto, drivePhotoIndex) => {
        const identicalDrivePhotos: IdenticalPhotos = unmatchedExistingPhotos[drivePhotoIndex];
        const drivePhotoItems : PhotoItems = identicalDrivePhotos.photoItems;
        const drivePhotoItem : PhotoItem = drivePhotoItems[0];
        if (!state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults[drivePhotoItem.photo.getPath()]) {
          unreviewedPhotos.push(identicalDrivePhotos);
        }
      });

      let unreviewedPhotoItems : Array<PhotoItem> = [];
      unreviewedPhotos.forEach( (unreviewedPhoto : IdenticalPhotos) => {
        const drivePhotoItems : PhotoItems = unreviewedPhoto.photoItems;
        drivePhotoItems.forEach( (drivePhotoItem : PhotoItem) => {
          unreviewedPhotoItems.push(drivePhotoItem);
        });
      });
      resolve(unreviewedPhotoItems);
    });
  };
}
export function initUnmatchedDrivePhotoComparisons() {

  return function (dispatch: Function, getState: Function) {

    const state = getState();

    console.log('length in initUnmatchedDrivePhotoComparisons: ',
      Object.keys(state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults).length);

    const drivePhotoToGooglePhotoComparisonResults = state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults;
    const drivePhotos = state.drivePhotos.drivePhotos;
    drivePhotos.forEach( (drivePhoto) => {
      if (!drivePhotoToGooglePhotoComparisonResults[drivePhoto.getPath()]) {
        // console.log('drivePhoto missing in drivePhotoToGooglePhotoComparisonResults: ');
        // console.log(drivePhoto);

        drivePhotoToGooglePhotoComparisonResults[drivePhoto.getPath()] = {
          name : drivePhoto.name,
          path: drivePhoto.path,
          result: 'notAMatch'
        };
      }
    });
    // however, now we need a way to save these results
    // one time only
    // dispatch(saveDrivePhotoToGooglePhotoComparisonResults());
    return;

    // unmatched photos - strip out those that don't exist (due to debugging configuration)
    // const unmatchedPhotos: Array<IdenticalPhotos> =
    //   state.photoComparisonResults.photoComparisonResults.unmatchedPhotos;
    // if (!unmatchedPhotos) {
    //   debugger;
    // }
    //
    // let unmatchedExistingPhotos: Array<IdenticalPhotos> = [];
    // unmatchedPhotos.forEach((unmatchedPhoto) => {
    //   const photoItems: PhotoItems = unmatchedPhoto.photoItems;
    //   const photoItem: PhotoItem = photoItems[0];
    //   if (photoItem.photo.fileExists()) {
    //     unmatchedExistingPhotos.push(unmatchedPhoto);
    //   }
    // });
    //
    // unmatchedExistingPhotos.sort((identicalPhotosA, identicalPhotosB) => {
    //   if (identicalPhotosA && identicalPhotosB) {
    //     const minHashDistanceA: number = identicalPhotosA.closestGooglePhoto.minHashDistance;
    //     const minHashDistanceB: number = identicalPhotosB.closestGooglePhoto.minHashDistance;
    //     return minHashDistanceA - minHashDistanceB;
    //   }
    //   return 0;
    // });
    //
    // console.log('unmatchedExistingPhotos: ');
    // console.log(unmatchedExistingPhotos);
    //
    // dispatch(setDrivePhotoIndex(-1));
    // dispatch(setUnmatchedExistingPhotos(unmatchedExistingPhotos));
    // dispatch(navigateForward());
    //
    // // find out how many are yet to be reviewed
    // let drivePhotoIndex : number = state.photoComparisonResults.drivePhotoIndex;
    // if (!drivePhotoIndex || drivePhotoIndex < 0) {
    //   drivePhotoIndex = 0;
    // }
    // let remainingPhotosToReview = 0;
    // unmatchedExistingPhotos.forEach( (unmatchedExistingPhoto, drivePhotoIndex) => {
    //   const identicalDrivePhotos: IdenticalPhotos = unmatchedExistingPhotos[drivePhotoIndex];
    //   const drivePhotoItems : PhotoItems = identicalDrivePhotos.photoItems;
    //   const drivePhotoItem : PhotoItem = drivePhotoItems[0];
    //   if (!state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults[drivePhotoItem.photo.getPath()]) {
    //     remainingPhotosToReview++;
    //   }
    // });
    // console.log("Number of drive photos remaining to be reviewed = ", remainingPhotosToReview);
  };
}

export function readDrivePhotoToGooglePhotoComparisonResults() {

  return function (dispatch: Function, getState: Function) {

    return new Promise( (resolve, _) => {

      // only perform the read on startup
      const state = getState();
      if (Object.keys(state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults).length !== 0) {
        resolve();
        return;
      }

      readFile('drivePhotoToGooglePhotoComparisonResults.json').then((drivePhotoToGooglePhotoComparisonResultsBuf) => {

        let drivePhotoToGooglePhotoComparisonResultsStr = decoder.write(drivePhotoToGooglePhotoComparisonResultsBuf);
        let drivePhotoToGooglePhotoComparisonResults = JSON.parse(drivePhotoToGooglePhotoComparisonResultsStr);

        dispatch(setDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResults));

        resolve();
      // }).catch( (err) => {
      }).catch( (__) => {
        // file must not exist yet - TODO - check err
        let drivePhotoToGooglePhotoComparisonResults = {};
        dispatch(setDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResults));
        resolve();
      });
    });
  };
}


// ------------------------------------
// Helpers
// ------------------------------------
function navigateMatched(increment : number) {

  return function(dispatch: Function, getState: Function) {

    const state = getState();

    let matchedExistingPhotos : Array<MatchedPhoto> = state.photoComparisonResults.matchedExistingPhotos;

    console.log('navigateMatched:');
    console.log('index: ', state.photoComparisonResults.matchedDrivePhotoIndex);
    console.log('num matched photos: ', matchedExistingPhotos.length);

    let drivePhotoIndex : number = state.photoComparisonResults.matchedDrivePhotoIndex;
    drivePhotoIndex += increment;
    if (drivePhotoIndex >= matchedExistingPhotos.length) {
      drivePhotoIndex = 0;
    }
    else if (drivePhotoIndex < 0) {
      drivePhotoIndex = matchedExistingPhotos.length - 1;
    }

    let drivePhotoToGooglePhotoComparisonResults : Object =
      state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults;

    let haveUnreviewedPhoto : boolean = false;
    while (!haveUnreviewedPhoto) {
      const identicalMatchedDrivePhotos: IdenticalPhotos = matchedExistingPhotos[drivePhotoIndex].drivePhotos;
      const drivePhotoItems : PhotoItems = identicalMatchedDrivePhotos.photoItems;
      const drivePhotoItem : PhotoItem = drivePhotoItems[0];
      if (!drivePhotoToGooglePhotoComparisonResults[drivePhotoItem.photo.getPath()]) {
        haveUnreviewedPhoto = true;
      }
      else {
        drivePhotoIndex += increment;
        if (drivePhotoIndex >= matchedExistingPhotos.length) {
          drivePhotoIndex = 0;
        }
        else if (drivePhotoIndex < 0) {
          drivePhotoIndex = matchedExistingPhotos.length - 1;
        }
      }
    }

    dispatch(setMatchedDrivePhotoIndex(drivePhotoIndex));
  };

}

export function navigateMatchedForward() {
  return navigateMatched(1);
}

export function navigateMatchedBackward() {
  return navigateMatched(-1);
}

function navigate(increment : number) {

  return function(dispatch: Function, getState: Function) {

    const state = getState();

    let unmatchedExistingPhotos : Array<IdenticalPhotos> = state.photoComparisonResults.unmatchedExistingPhotos;

    let drivePhotoIndex : number = state.photoComparisonResults.drivePhotoIndex;
    drivePhotoIndex += increment;
    if (drivePhotoIndex >= unmatchedExistingPhotos.length) {
      drivePhotoIndex = 0;
    }
    else if (drivePhotoIndex < 0) {
      drivePhotoIndex = unmatchedExistingPhotos.length - 1;
    }

    console.log("**** drivePhotoIndex: ", drivePhotoIndex, " out of " + unmatchedExistingPhotos.length);

    let drivePhotoToGooglePhotoComparisonResults : Object =
      state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults;

    let haveUnreviewedPhoto : boolean = false;
    while (!haveUnreviewedPhoto) {
      const identicalDrivePhotos: IdenticalPhotos = unmatchedExistingPhotos[drivePhotoIndex];
      const drivePhotoItems : PhotoItems = identicalDrivePhotos.photoItems;
      const drivePhotoItem : PhotoItem = drivePhotoItems[0];
      if (!drivePhotoToGooglePhotoComparisonResults[drivePhotoItem.photo.getPath()]) {
        haveUnreviewedPhoto = true;
      }
      else {
        drivePhotoIndex += increment;
        if (drivePhotoIndex >= unmatchedExistingPhotos.length) {
          drivePhotoIndex = 0;
        }
        else if (drivePhotoIndex < 0) {
          drivePhotoIndex = unmatchedExistingPhotos.length - 1;
        }
      }
    }

    // convert to tif if necessary
    const drivePhotoPath = unmatchedExistingPhotos[drivePhotoIndex].photoItems[0].photo.path;
    const extension = path.extname(drivePhotoPath).toLowerCase();
    if (extension === '.tif' || extension === '.tiff') {

      let photoFilePath = drivePhotoPath;
      if (photoFilePath.startsWith('file://')) {
        photoFilePath = photoFilePath.slice(9);
      }

      let photoName = path.basename(photoFilePath).toLowerCase();
      let fileNameWithoutExtension = photoName.slice(0, -4);
      photoName = fileNameWithoutExtension + ".jpg";

      const targetDir = "C:\\Users\\Ted\\Documents\\Projects\\analysatron\\tmpFiles";
      const guid = utils.guid();
      let targetPath = path.join(targetDir, fileNameWithoutExtension + guid + ".jpg");
      console.log('convertPhoto then display it: ', photoFilePath);

      convertPhoto(photoFilePath, targetPath).then( () => {

        // converted file should be at targetPath
        // TODO - don't know why, but it appears as though sometimes a '-0' is appended to the photo file name
        if (!fs.existsSync(targetPath)) {
          console.log(targetPath, ' converted file does not exist');
          targetPath = path.join(targetDir, fileNameWithoutExtension + guid + "-0.jpg");
          if (!fs.existsSync(targetPath)) {
            debugger;
          }
        }

        if (!targetPath.startsWith('file://')) {
          targetPath = 'file:////' + targetPath;
        }

        // assign updated path to the photoItem
        unmatchedExistingPhotos[drivePhotoIndex].photoItems[0].photo.pathOfConvertedFile = targetPath;

        dispatch(setDrivePhotoIndex(drivePhotoIndex));

      }).catch( (err) => {
        console.log(err);
        debugger;
      });
    }
    else {
      dispatch(setDrivePhotoIndex(drivePhotoIndex));
    }
  };
}

export function navigateForward() {
  return navigate(1);
}

export function navigateBackward() {
  return navigate(-1);
}

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

export function setMatchedDrivePhotoIndex(matchedDrivePhotoIndex : number) {

  return {
    type: SET_MATCHED_DRIVE_PHOTO_INDEX,
    payload: matchedDrivePhotoIndex
  };
}

export function setUnmatchedExistingPhotos(unmatchedExistingPhotos : Array<IdenticalPhotos>) {

  return {
    type: SET_UNMATCHED_EXISTING_PHOTOS,
    payload: unmatchedExistingPhotos
  };
}

export function setMatchedExistingPhotos(matchedExistingPhotos : Array<MatchedPhoto>) {

  return {
    type: SET_MATCHED_EXISTING_PHOTOS,
    payload: matchedExistingPhotos
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: Object = {
  photoComparisonResults: {},
  drivePhotoToGooglePhotoComparisonResults: {},
  drivePhotoIndex: -1,
  matchedDrivePhotoIndex: -1,
  matchedExistingPhotos: [],
  unmatchedExistingPhotos: [],
};

export default function(state: Object = initialState, action: Object) {

  switch (action.type) {

    case SET_DRIVE_PHOTO_INDEX: {
      let newState = Object.assign({}, state);
      newState.drivePhotoIndex = action.payload;
      return newState;
    }

    case SET_MATCHED_DRIVE_PHOTO_INDEX: {
      let newState = Object.assign({}, state);
      newState.matchedDrivePhotoIndex = action.payload;
      return newState;
    }

    case SET_MATCHED_EXISTING_PHOTOS: {
      let newState = Object.assign({}, state);
      newState.matchedExistingPhotos = action.payload;
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
        console.log('length before: ', Object.keys(newState.drivePhotoToGooglePhotoComparisonResults).length);
        console.log(newState);
        newState.drivePhotoToGooglePhotoComparisonResults =
          Object.assign(newState.drivePhotoToGooglePhotoComparisonResults, action.payload);
        console.log(newState);
        console.log('length after: ', Object.keys(newState.drivePhotoToGooglePhotoComparisonResults).length);
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




