// @flow

import { readGooglePhotos } from './googlePhotos';
import { readDrivePhotos } from './drivePhotos';
import { buildDrivePhotoDictionaries } from './drivePhotos';

import Photo from '../entities/photo';
// import DrivePhoto from '../entities/drivePhoto';

// https://flowtype.org/docs/quick-reference.html#type-aliases
type PhotosByHash = { [hash:string]: Array<Photo> };
type MatchedPhoto = {
  drivePhotos: Array<Photo>,
  matchedGooglePhotos: Array<Photo>
};
type PhotoComparisonResults = {
  matchedPhotos: Array<MatchedPhoto>,
  unmatchedPhotos: Array<Array<Photo>>
};

export function analyzePhotos() {

  return function (dispatch: Function, getState: Function) {

    let readGooglePhotosPromise = dispatch(readGooglePhotos());
    let readDrivePhotosPromise = dispatch(readDrivePhotos());

    Promise.all([readGooglePhotosPromise, readDrivePhotosPromise]).then( () => {

      // both google photos and drive photos have been read in and added to the store,
      // now begin analysis

      // any duplicates in drivePhotos db?
      dispatch(buildDrivePhotoDictionaries());

      let state = getState();

      let googlePhotos = state.googlePhotos.googlePhotos;
      const googlePhotosByHash = getPhotosByHash(googlePhotos);
      const duplicateGooglePhotosByHash = getDuplicatePhotos(googlePhotosByHash);
      const numDuplicateGooglePhotos = Object.keys(duplicateGooglePhotosByHash).length;
      console.log('Number of googlePhotos: ', googlePhotos.length);
      console.log('Number of google photos with unique hashes: ', Object.keys(googlePhotosByHash).length);
      console.log('Number of duplicate google photos: ', numDuplicateGooglePhotos);

      const googlePhotosByHashAndName = getPhotosByHashAndName(googlePhotos);
      console.log('Number of google photos with unique hash/name combos: ',
        Object.keys(googlePhotosByHashAndName).length);

      
      let drivePhotos = state.drivePhotos.drivePhotos;
      const drivePhotosByHash = getPhotosByHash(drivePhotos);
      const duplicateDrivePhotosByHash = getDuplicatePhotos(drivePhotosByHash);
      const numDuplicateDrivePhotos = Object.keys(duplicateDrivePhotosByHash).length;
      console.log('Number of drivePhotos: ', drivePhotos.length);
      console.log('Number of drive photos with unique hashes: ', Object.keys(drivePhotosByHash).length);
      console.log('Number of duplicate drive photos: ', numDuplicateDrivePhotos);
      
      const drivePhotosByHashAndName = getPhotosByHashAndName(drivePhotos);
      console.log('Number of drive photos with unique hash/name combos: ',
        Object.keys(drivePhotosByHashAndName).length);

/*
      Results:
         Number of googlePhotos:  7773
         Number of google photos with unique hashes:  7576
         Number of duplicate google photos:  144
         Number of google photos with unique hash/name combos:  7749
         Number of drivePhotos:  20571
         Number of drive photos with unique hashes:  9013
         Number of duplicate drive photos:  6324
         Number of drive photos with unique hash/name combos:  10293
*/
      let photoComparisonResults : PhotoComparisonResults =
        getMatchesByExactHash(drivePhotosByHash, googlePhotosByHash);

      console.log(photoComparisonResults);

      // TODO - next steps
      //    getPhotosByHashAndNameAndDate
      //        drivePhotos
      //          lastModifiedISO
      //
      //    match drive photos (unique ones) with google photos using hash
      //        could also check
      //            names
      //            dimensions
      //            dates
      //        must also check
      //            hashes that are not identical but are close
      debugger;
    }).catch( (err) => {
      throw(err);
    });
  };
}

function getPhotosByHash(photos) : PhotosByHash {
  let photosByHash = {};

  photos.forEach( (photo) => {
    const hash = photo.hash;
    if (!photosByHash[hash]) {
      photosByHash[hash] = [];
    }
    photosByHash[hash].push(photo);
  });

  return photosByHash;
}

function getPhotosByHashAndName(photos) : PhotosByHash {
  let photosByHashAndName = {};

  photos.forEach( (photo) => {
    const key = photo.hash + photo.name;
    if (!photosByHashAndName[key]) {
      photosByHashAndName[key] = [];
    }
    photosByHashAndName[key].push(photo);
  });

  return photosByHashAndName;
}


function getDuplicatePhotos(photosByHash) : PhotosByHash {

  let duplicatePhotosByHash = {};
  for (let hash in photosByHash) {
    if (photosByHash.hasOwnProperty(hash)) {
      let duplicatePhotos = photosByHash[hash];
      if (duplicatePhotos.length > 1) {
        duplicatePhotosByHash[hash] = duplicatePhotos;
      }
    }
  }

  return duplicatePhotosByHash;
}

function getMatchesByExactHash(
  drivePhotosByHash: PhotosByHash,
  googlePhotosByHash: PhotosByHash) : PhotoComparisonResults {

  let matchedPhotos : Array<MatchedPhoto> = [];
  let unmatchedPhotos: Array<Array<Photo>> = [];

  for (let hash in drivePhotosByHash) {
    if (drivePhotosByHash.hasOwnProperty(hash)) {
      const drivePhotos : Array<Photo> = drivePhotosByHash[hash];

      // TODO - hash should be a property of drivePhotos. i.e., drivePhotos should be an object, not an array
      const drivePhotoHash = drivePhotos[0].hash;

      // is there a google photo match
      if (googlePhotosByHash[drivePhotoHash]) {

        let matchedGooglePhotos: Array<Photo> = googlePhotosByHash[drivePhotoHash];
        let matchedPhoto : MatchedPhoto = {
          drivePhotos,
          matchedGooglePhotos,
        };
        matchedPhotos.push(matchedPhoto);
      }
      else {
        unmatchedPhotos.push(drivePhotos);
      }
    }
  }

  let photoComparisonResults : PhotoComparisonResults = {
    matchedPhotos,
    unmatchedPhotos
  };
  return photoComparisonResults;
}