// @flow

// const Jimp = require('jimp');

import { readFile } from '../utilities/utils';
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

import { readGooglePhotos } from './googlePhotos';
import { readDrivePhotos } from './drivePhotos';
import { buildDrivePhotoDictionaries } from './drivePhotos';

import Photo from '../entities/photo';
// import DrivePhoto from '../entities/drivePhoto';
// import GooglePhoto from '../entities/googlePhoto';

// https://flowtype.org/docs/quick-reference.html#type-aliases
type IdenticalPhotos = {
  hash: string,
  photos: Array<Photo>,
  closestGooglePhoto: ClosestHashSearchResult
};

type PhotosByHash = { [hash:string]: IdenticalPhotos };

type MatchedPhoto = {
  drivePhotos: IdenticalPhotos,
  matchedGooglePhotos: IdenticalPhotos
};

type PhotoComparisonResults = {
  matchedPhotos: Array<MatchedPhoto>,
  unmatchedPhotos: Array<IdenticalPhotos>
};
type ClosestHashSearchResult = {
  minHashDistance: number,
  googlePhotoIndexOfMinHashDistance: number
}

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
      const googlePhotosByHash : PhotosByHash  = getPhotosByHash(googlePhotos);
      // const duplicateGooglePhotosByHash = getDuplicatePhotos(googlePhotosByHash);
      // const numDuplicateGooglePhotos = Object.keys(duplicateGooglePhotosByHash).length;
      console.log('Number of googlePhotos: ', googlePhotos.length);
      console.log('Number of google photos with unique hashes: ', Object.keys(googlePhotosByHash).length);
      // console.log('Number of duplicate google photos: ', numDuplicateGooglePhotos);

      // const googlePhotosByHashAndName = getPhotosByHashAndName(googlePhotos);
      // console.log('Number of google photos with unique hash/name combos: ',
      //   Object.keys(googlePhotosByHashAndName).length);

      
      let drivePhotos  = state.drivePhotos.drivePhotos;
      const drivePhotosByHash : PhotosByHash = getPhotosByHash(drivePhotos);
      // const duplicateDrivePhotosByHash = getDuplicatePhotos(drivePhotosByHash);
      // const numDuplicateDrivePhotos = Object.keys(duplicateDrivePhotosByHash).length;
      console.log('Number of drivePhotos: ', drivePhotos.length);
      console.log('Number of drive photos with unique hashes: ', Object.keys(drivePhotosByHash).length);
      // console.log('Number of duplicate drive photos: ', numDuplicateDrivePhotos);
      
      // const drivePhotosByHashAndName = getPhotosByHashAndName(drivePhotos);
      // console.log('Number of drive photos with unique hash/name combos: ',
      //   Object.keys(drivePhotosByHashAndName).length);

      let photoComparisonResults : PhotoComparisonResults =
        getMatchesByExactHash(drivePhotosByHash, googlePhotosByHash);

      console.log('Number of drive photos with exact hash matches: ', photoComparisonResults.matchedPhotos.length);
      console.log('Number of drive photos without an exact hash match: ',
        photoComparisonResults.unmatchedPhotos.length);

      console.log(photoComparisonResults);

      // photoComparisonResults.unmatchedPhotos.forEach( (identicalDrivePhotos) => {
      //   let closestGooglePhoto = getClosestGooglePhotoByHash(identicalDrivePhotos, googlePhotos);
      //   identicalDrivePhotos.closestGooglePhoto = closestGooglePhoto;
      //
      //   console.log('poo');
      // });
      //
      // const unmatchedDrivePhotosStr = JSON.stringify(photoComparisonResults.unmatchedPhotos, null, 2);
      // fs.writeFileSync('unmatchedDrivePhotos.json', unmatchedDrivePhotosStr);

      readFile('unmatchedDrivePhotos.json').then((unmatchedDrivePhotosBuffer) => {
        let unmatchedDrivePhotosStr = decoder.write(unmatchedDrivePhotosBuffer);
        let unmatchedDrivePhotos = JSON.parse(unmatchedDrivePhotosStr);
        photoComparisonResults.unmatchedPhotos = unmatchedDrivePhotos;
        analyzeHashDifferences(photoComparisonResults);
      }).catch( (err) => {
        console.log(err);
        debugger;
      });


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
    Number of drive photos with exact hash matches:  4358
    Number of drive photos without an exact hash match:  4655
    Number of photos whose hashes are close enough to qualify for a match:  1178 (hashThreshold 0.04)
    Number of photos that don't match at all:  3477

 Number of photos whose hashes are close enough to qualify for a match:  1308 (hashThreshold 0.05)
 Number of photos that don't match at all:  3347

 */
    }).catch( (err) => {
      throw(err);
    });
  };
}

function analyzeHashDifferences(photoComparisonResults) {

  // const hashThreshold = 0.04;
  const hashThreshold = 0.05;

  let numCloseEnoughHashes = 0;
  let numNotEvenCloseHashes = 0;

  photoComparisonResults.unmatchedPhotos.forEach( (identicalDrivePhotos) => {
    let closestGooglePhoto: ClosestHashSearchResult = identicalDrivePhotos.closestGooglePhoto;
    if (closestGooglePhoto.minHashDistance < hashThreshold) {
      numCloseEnoughHashes++;
    }
    else {
      numNotEvenCloseHashes++;
    }
  });

  console.log('Number of photos whose hashes are close enough to qualify for a match: ', numCloseEnoughHashes);
  console.log('Number of photos that don\'t match at all: ', numNotEvenCloseHashes);
}

function getPhotosByHash(photos) : PhotosByHash {

  let photosByHash : PhotosByHash = {};

  photos.forEach( (photo) => {
    const hash = photo.hash;
    if (!photosByHash[hash]) {
      // TODO - any better way to do this other than by making this a class?
      let closestGooglePhoto: ClosestHashSearchResult = { minHashDistance: 1, googlePhotoIndexOfMinHashDistance: -1};
      let identicalPhotos : IdenticalPhotos = { hash: '', photos: [], closestGooglePhoto};
      identicalPhotos.hash = hash;
      identicalPhotos.photos.push(photo);
      photosByHash[hash] = identicalPhotos;
    }
    else {
      let identicalPhotos : IdenticalPhotos = photosByHash[hash];
      identicalPhotos.photos.push(photo);
    }
  });

  return photosByHash;
}

// function getPhotosByHashAndName(photos) : PhotosByHash {
//   let photosByHashAndName = {};
//
//   photos.forEach( (photo) => {
//     const key = photo.hash + photo.name;
//     if (!photosByHashAndName[key]) {
//       photosByHashAndName[key] = [];
//     }
//     photosByHashAndName[key].push(photo);
//   });
//
//   return photosByHashAndName;
// }
//
// function getDuplicatePhotos(photosByHash) : PhotosByHash {
//
//   let duplicatePhotosByHash = {};
//   for (let hash in photosByHash) {
//     if (photosByHash.hasOwnProperty(hash)) {
//       let duplicatePhotos = photosByHash[hash];
//       if (duplicatePhotos.length > 1) {
//         duplicatePhotosByHash[hash] = duplicatePhotos;
//       }
//     }
//   }
//
//   return duplicatePhotosByHash;
// }

function getMatchesByExactHash(
  drivePhotosByHash: PhotosByHash,
  googlePhotosByHash: PhotosByHash) : PhotoComparisonResults {

  let matchedPhotos : Array<MatchedPhoto> = [];
  let unmatchedPhotos: Array<IdenticalPhotos> = [];

  for (let hash in drivePhotosByHash) {
    if (drivePhotosByHash.hasOwnProperty(hash)) {
      const drivePhotos : IdenticalPhotos = drivePhotosByHash[hash];

      // TODO - hash should be a property of drivePhotos. i.e., drivePhotos should be an object, not an array
      const drivePhotoHash = drivePhotos.hash;

      // is there a google photo match
      if (googlePhotosByHash[drivePhotoHash]) {

        let matchedGooglePhotos: IdenticalPhotos = googlePhotosByHash[drivePhotoHash];
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

// function getClosestGooglePhotoByHash(
//   drivePhoto: IdenticalPhotos,
//   googlePhotos : Array<GooglePhoto>) : ClosestHashSearchResult {
//
//   const drivePhotoHash : string = drivePhoto.hash;
//
//   let googlePhotoIndexOfMinHashDistance = -1;
//   let minHashDistance = 1;
//
//   googlePhotos.forEach( (googlePhoto, index) => {
//     if (googlePhoto.getHash()) {
//       let hashDistance = Jimp.distanceByHash(drivePhotoHash, googlePhoto.getHash());
//       if (hashDistance < minHashDistance) {
//         minHashDistance = hashDistance;
//         googlePhotoIndexOfMinHashDistance = index;
//       }
//     }
//   });
//
//   let closestHashSearchResult : ClosestHashSearchResult = {
//     minHashDistance,
//     googlePhotoIndexOfMinHashDistance
//   };
//   return closestHashSearchResult;
// }