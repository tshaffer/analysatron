// @flow

// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
const Jimp = require('jimp');

import { readFile } from '../utilities/utils';
import * as utils from '../utilities/utils';
import { convertPhoto } from '../utilities/photoUtilities';
import DrivePhoto from '../entities/drivePhoto';

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

import {
  readDrivePhotos,
  setDrivePhotosByHash,
  buildDrivePhotoDictionaries,
} from './drivePhotos';

import {
  readGooglePhotos,
  setGooglePhotosByHash,
} from './googlePhotos';

import {
  setPhotoComparisonResults,
} from './photoComparisonResults';

// import Photo from '../entities/photo';
import GooglePhoto from '../entities/googlePhoto';

import type {
  PhotoItem,
  IdenticalPhotos,
  PhotosByHash,
  MatchedPhoto,
  PhotoComparisonResults,
  ClosestHashSearchResult,
  PhotoItems
}
from '../types';


import {
  readDrivePhotoToGooglePhotoComparisonResults,
} from '../store/photoComparisonResults';

let tiffDrivePhotosToCopy = [];

export function analyzePhotos() {

  return (dispatch: Function, getState: Function) => {

    let readGooglePhotosPromise = dispatch(readGooglePhotos());
    let readDrivePhotosPromise = dispatch(readDrivePhotos());
    let readDrivePhotoToGooglePhotoComparisonResultsPromise = dispatch(readDrivePhotoToGooglePhotoComparisonResults());

    Promise.all([readGooglePhotosPromise, readDrivePhotosPromise,
      readDrivePhotoToGooglePhotoComparisonResultsPromise]).then(() => {

        // checks for duplicates in drivePhotos db?
        dispatch(buildDrivePhotoDictionaries());

        let state = getState();

        let googlePhotos = state.googlePhotos.googlePhotos;
        console.log('Number of googlePhotos: ', googlePhotos.length);

        const rebuildGooglePhotosByHash = false;
        getGooglePhotosByHash(rebuildGooglePhotosByHash, googlePhotos, dispatch, state).then( () => {
          finalAnalysis(getState);
        });

      // finalAnalysis();
      }).catch( (err) => {
        console.log(err);
        debugger;
      });
  };
}

function finalAnalysis(getState) {

  // export type DrivePhotoToGooglePhotoComparisonResult = {
  //   name: string,
  //   path: string,
  //   result: string
  // }
  //
  // investigate
  //      "C:\Users\Ted\Documents\RemovableMedia\8-13-05\My Photos In Process\2005\03_March_3\_DSC2477.jpg"
  //        "hash": "1000101110101101011110011010010001100011000111000010010000000000",
  //        "dimensions": {
  //          "height": 2400,
  //          "width": 1940,
  //          "type": "jpg"
  //         },
  //        "lastModified": "2017-01-25T00:41:36.879Z",
  //        "lastModifiedISO": "2017-01-25T00:41:36.879Z"
  // no google photo match

  //      "C:\Users\Ted\Documents\RemovableMedia\8-13-05\My Photos In Process\2005\03_March_3\_DSC2467.jpg"
  // no google photo match

  //  C:\Users\Ted\Documents\RemovableMedia\8-13-05\My Photos In Process\2005\03_March_3
  // copy files
  //    fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));
  //
  // drivePhotosByHash
  //      for any given hash, there can be multiple drive photos
  //      only want to back up one of the photos, as they are identical
  //      given a 'notAMatch' entry in drivePhotoToGooglePhotoComparisonResults, how to get the corresponding
  //      entry in drivePhotosByHash
  //
  //  iterate through drivePhotos
  //  for each drivePhoto, find corresponding record in drivePhotoToGooglePhotoComparisonResults
  //  if notAMatch
  //      get its hash
  //      add a record to notAMatchByHash
  //  iterate through notAMatchByHash
  //    retrieve drivePhotoByHash
  //    copy to analysatron

  debugger;

  let state = getState();
  const drivePhotoToGooglePhotoComparisonResults = state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults;

  let notAMatchByHash : any = {};
  let tiffDrivePhotosToCopyByName : any = {};

  state.drivePhotos.drivePhotos.forEach( (drivePhoto) => {
    const drivePhotoPath = drivePhoto.getPath();
    const photoComparisonResults = drivePhotoToGooglePhotoComparisonResults[drivePhotoPath];
    if (!photoComparisonResults) {
      debugger;
    }
    if (photoComparisonResults.result === 'notAMatch') {
      const aspectRatio = (Number(drivePhoto.getWidth()) / Number(drivePhoto.getHeight())).toString();
      const key = drivePhoto.hash + '-' + aspectRatio;
      const photosByHash : PhotosByHash = state.drivePhotos.drivePhotosByHash[key];
      if (!photosByHash) {
        debugger;
      }
      if (!notAMatchByHash[key]) {
        const extname = path.extname(drivePhoto.path);
        if (extname.toLowerCase() === '.tif' || extname.toLowerCase() === '.tiff') {
          tiffDrivePhotosToCopy.push(drivePhoto);


          // const targetDir = "E:\\AnalysatronTifFiles";
          // const guid = utils.guid();
          // let targetPath = path.join(targetDir, path.basename(drivePhoto.path) + guid + ".tif");
          // convertPhoto(drivePhoto.path, targetPath).then( () => {
          //   debugger;
          // });
        }
        //   let filename;
        //   if (extname.toLowerCase() === '.tif') {
        //     filename = path.basename(drivePhoto.path, '.tif');
        //   }
        //   else {
        //     filename = path.basename(drivePhoto.path, '.tiff');
        //   }
        //   if (!tiffDrivePhotosToCopyByName[filename]) {
        //     tiffDrivePhotosToCopyByName[filename] = [];
        //   }
        //   tiffDrivePhotosToCopyByName[filename].push(drivePhoto);
        // }
        // else {
        //   notAMatchByHash[key] = photosByHash;
        // }
      }
    }
  });

  debugger;
  copyTiffFiles();
  return;

  let filesToCopyByName : any = {};

  for (let hash in notAMatchByHash) {
    if (notAMatchByHash.hasOwnProperty(hash)) {
      const photosByHash = notAMatchByHash[hash];
      if (photosByHash.photoItems.length > 0) {
        const photoToCopy = photosByHash.photoItems[0].photo;
        let fileName = photoToCopy.name;
        if (fileName.toLowerCase().endsWith('tif') || fileName.toLowerCase().endsWith('tiff')) {
        }
        else {
          if (filesToCopyByName[fileName]) {
            // yes, there are in fact, filesToCopy with the same name - need to have a unique file name
            // append a suffix to it
            let suffixCounter = 0;
            while (true) {
              fileName = photoToCopy.name + '-' + suffixCounter.toString();
              if (!filesToCopyByName[fileName]) {
                break;
              }
              suffixCounter++;
            }
            console.log('updated fileName: ', fileName);
          }
          filesToCopyByName[fileName] = photoToCopy;
        }
      }
      else {
        // entry for this key in drivePhotosByHash, and it is indeed empty
        // note - all drivePhotos with this hash are tif files and, it appears that there are no tif files in
        // drivePhotosByHash. there's probably a reason for this
        debugger;
        console.log('poo');
      }
    }
  }

  debugger;
  return;

  // perform file copies
  for (let fileName in filesToCopyByName) {
    if (filesToCopyByName.hasOwnProperty(fileName)) {
      const fileToCopy : DrivePhoto = filesToCopyByName[fileName];
      const sourcePath = fileToCopy.path;
      const destinationPath = path.join("E:\\AnalysatronResults2", fileName);
      copyFile(sourcePath, destinationPath);
    }
  }
}

function copyTiffFiles() {

  const drivePhoto = tiffDrivePhotosToCopy.shift();

  const extname = path.extname(drivePhoto.path);

  let filename;
  if (extname.toLowerCase() === '.tif') {
    filename = path.basename(drivePhoto.path, '.tif');
  }
  else {
    filename = path.basename(drivePhoto.path, '.tiff');
  }

  const targetDir = "E:\\AnalysatronTifFiles";
  const guid = utils.guid();
  let targetPath = path.join(targetDir, filename + guid + ".jpg");

  console.log('convert file: ' + drivePhoto.path);
  convertPhoto(drivePhoto.path, targetPath).then( () => {
    copyTiffFiles();
  });
}

function copyFile(source, target) {
  try {
    fs.copySync(source, target);
    console.log('copy from: ' + source + ' to: ' + target);
  } catch (err) {
    console.error(err);
    debugger;
  }
}

// function copyFile(source, target, cb) {
//   let cbCalled = false;
//
//   let rd = fs.createReadStream(source);
//   rd.on("error", function(err) {
//     done(err);
//   });
//   let wr = fs.createWriteStream(target);
//   wr.on("error", function(err) {
//     done(err);
//   });
//   wr.on("close", function(ex) {
//     done();
//   });
//   rd.pipe(wr);
//
//   function done(err) {
//     if (!cbCalled) {
//       // cb(err);
//       cbCalled = true;
//       debugger;
//     }
//   }
// }
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


function getGooglePhotosByHash(rebuildGooglePhotosByHash: boolean, googlePhotos, dispatch, state) {

  return new Promise((resolve) => {
    let googlePhotosByHash : PhotosByHash = {};

    if (rebuildGooglePhotosByHash) {
      googlePhotosByHash = getMatchingPhotos(googlePhotos);
      getDrivePhotos(false, googlePhotos, googlePhotosByHash, dispatch, state).then( () => {
        resolve();
      });
    }
    else {
      readFile('googlePhotosByHash.json').then((googlePhotosByHashBuffer) => {
        let googlePhotosByHashStr = decoder.write(googlePhotosByHashBuffer);
        let googlePhotosByHashRaw = JSON.parse(googlePhotosByHashStr);

        for (let hash in googlePhotosByHashRaw) {
          if (googlePhotosByHashRaw.hasOwnProperty(hash)) {
            const identicalPhotos = googlePhotosByHashRaw[hash];
            const photoItems = identicalPhotos.photoItems;
            photoItems.forEach((photoItem) => {
              const photo = new GooglePhoto(
                {
                  name: photoItem.photo.name,
                  hash: photoItem.photo.hash,
                  url: photoItem.photo.url,
                  width: photoItem.photo.width,
                  height: photoItem.photo.height,
                  dateTime: photoItem.photo.dateTime,
                  exifDateTime: photoItem.photo.exifDateTime
                }
              );
              photoItem.photo = photo;
            });

            googlePhotosByHash[hash] = identicalPhotos;
          }
        }
        getDrivePhotos(false, googlePhotos, googlePhotosByHash, dispatch, state).then( () => {
          resolve();
        });
      });
    }
  });
}


function getDrivePhotos(rebuildDrivePhotosByHash, googlePhotos, googlePhotosByHash, dispatch, state) {

  return new Promise( (resolve) => {
    dispatch(setGooglePhotosByHash(googlePhotosByHash));
    console.log('Number of google photos with unique keys: ', Object.keys(googlePhotosByHash).length);

    let drivePhotosByHash : PhotosByHash = {};

    const drivePhotos  = state.drivePhotos.drivePhotos;
    console.log('Number of drivePhotos: ', drivePhotos.length);

    if (rebuildDrivePhotosByHash) {
      drivePhotosByHash = getMatchingPhotos(drivePhotos);
      processDrivePhotosByHash(drivePhotosByHash, googlePhotos, googlePhotosByHash, dispatch);
      // RESOLVE?
    }
    else {
      readFile('drivePhotosByHash.json').then((drivePhotosByHashBuffer) => {
        let drivePhotosByHashStr = decoder.write(drivePhotosByHashBuffer);
        let drivePhotosByHashRaw = JSON.parse(drivePhotosByHashStr);
        for (let hash in drivePhotosByHashRaw) {
          if (drivePhotosByHashRaw.hasOwnProperty(hash)) {

            const identicalPhotos = drivePhotosByHashRaw[hash];
            const photoItems = identicalPhotos.photoItems;
            let index = 0;
            while (index < photoItems.length) {
              let photoItem = photoItems[index];
              if (path.extname(photoItem.photo.path).toLowerCase() !== '.tif') {
                photoItem.photo = new DrivePhoto(photoItem.photo);
                index++;
              }
              else {
                photoItems.splice(index, 1);
              }
            }
            drivePhotosByHash[hash] = identicalPhotos;
          }
        }

        processDrivePhotosByHash(drivePhotosByHash, googlePhotos, googlePhotosByHash, dispatch);

        resolve();
      });
    }

  });
}

function processDrivePhotosByHash(drivePhotosByHash, googlePhotos, googlePhotosByHash, dispatch) {

  dispatch(setDrivePhotosByHash(drivePhotosByHash));
  console.log('Number of drive photos with unique keys: ', Object.keys(drivePhotosByHash).length);

  let photoComparisonResults : PhotoComparisonResults =
    getMatchesByExactHash(drivePhotosByHash, googlePhotosByHash);

  console.log('Number of drive photos with exact hash matches: ', photoComparisonResults.matchedPhotos.length);
  console.log('Number of drive photos without an exact hash match: ',
    photoComparisonResults.unmatchedPhotos.length);

  console.log(photoComparisonResults);

  const rebuildUnmatchedDrivePhotos = false;
  getUnmatchedDrivePhotos(rebuildUnmatchedDrivePhotos, photoComparisonResults, googlePhotos, dispatch);
}

function getUnmatchedDrivePhotos(rebuildUnmatchedDrivePhotos: boolean, photoComparisonResults, googlePhotos, dispatch) {
  if (rebuildUnmatchedDrivePhotos) {
    photoComparisonResults.unmatchedPhotos.forEach( (identicalDrivePhotos) => {
      identicalDrivePhotos.closestGooglePhoto = getClosestGooglePhotoByHash(identicalDrivePhotos, googlePhotos);
    });

    const unmatchedDrivePhotosStr = JSON.stringify(photoComparisonResults.unmatchedPhotos, null, 2);
    fs.writeFileSync('unmatchedDrivePhotos.json', unmatchedDrivePhotosStr);

    dispatch(setPhotoComparisonResults(photoComparisonResults));

    analyzeHashDifferences(photoComparisonResults);
  }
  else {
    readFile('unmatchedDrivePhotos.json').then((unmatchedDrivePhotosBuffer) => {
      let unmatchedDrivePhotosStr = decoder.write(unmatchedDrivePhotosBuffer);
      let unmatchedDrivePhotos = JSON.parse(unmatchedDrivePhotosStr);

      // TODO - iterate through unmatchedDrivePhotos, creating actual drive photo objects
      // that's what it needs to do, however this is entirely ridiculous code.
      let unmatchedDrivePhotosRealObjects : Array<IdenticalPhotos> = [];

      unmatchedDrivePhotos.forEach( (identicalPhotos) => {

        let identicalPhotosNew = {};
        identicalPhotosNew.hash = identicalPhotos.hash;
        identicalPhotosNew.key = identicalPhotos.key;
        identicalPhotosNew.closestGooglePhoto = {};
        identicalPhotosNew.closestGooglePhoto.minHashDistance = identicalPhotos.closestGooglePhoto.minHashDistance;
        identicalPhotosNew.closestGooglePhoto.googlePhotoHash = identicalPhotos.closestGooglePhoto.googlePhotoHash;
        identicalPhotosNew.photoItems = [];

        let photoItems : PhotoItems = identicalPhotos.photoItems;
        photoItems.forEach( (photoItem) => {
          let drivePhoto = new DrivePhoto(photoItem.photo);
          let newPhotoItem = {};
          newPhotoItem.photo = drivePhoto;
          newPhotoItem.matchedPhotoGroupIndex = photoItem.matchedPhotoGroupIndex;
          identicalPhotosNew.photoItems.push(newPhotoItem);
        });

        unmatchedDrivePhotosRealObjects.push(identicalPhotosNew);
      });

      // photoComparisonResults.unmatchedPhotos = unmatchedDrivePhotos;
      photoComparisonResults.unmatchedPhotos = unmatchedDrivePhotosRealObjects;

      dispatch(setPhotoComparisonResults(photoComparisonResults));
      analyzeHashDifferences(photoComparisonResults);
    }).catch( (err) => {
      console.log(err);
      debugger;
    });
  }
}

function analyzeHashDifferences(photoComparisonResults : PhotoComparisonResults) {

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

function getMatchingPhotos(photos) : PhotosByHash {

  // photos are considered an exact match if and only if
  //    hashes match
  //    aspect ratios match
  //    hash it not one of the magic numbers? not implemented yet

  let photosByHash : PhotosByHash = {};

  photos.forEach( (photo) => {
    const hash = photo.hash;
    const aspectRatio = (Number(photo.getWidth()) / Number(photo.getHeight())).toString();
    const key = hash + '-' + aspectRatio;

    if (!photosByHash[key]) {
      // TODO - any better way to do this other than by making this a class?
      let closestGooglePhoto: ClosestHashSearchResult = { minHashDistance: 1, googlePhotoHash: ''};
      let identicalPhotos : IdenticalPhotos = { hash: '', key: '', photoItems: [], closestGooglePhoto};
      identicalPhotos.hash = hash;
      identicalPhotos.key = key;

      const photoItem : PhotoItem = {
        photo,
        matchedPhotoGroupIndex : null
      };
      identicalPhotos.photoItems.push(photoItem);
      photosByHash[key] = identicalPhotos;
    }
    else {
      let identicalPhotos : IdenticalPhotos = photosByHash[key];
      const photoItem : PhotoItem = {
        photo,
        matchedPhotoGroupIndex : null
      };
      identicalPhotos.photoItems.push(photoItem);
    }
  });

  return photosByHash;
}

function getMatchesByExactHash(
  drivePhotosByHash: PhotosByHash,
  googlePhotosByHash: PhotosByHash) : PhotoComparisonResults {

  let matchedPhotos : Array<MatchedPhoto> = [];
  let unmatchedPhotos: Array<IdenticalPhotos> = [];

  for (let key in drivePhotosByHash) {
    if (drivePhotosByHash.hasOwnProperty(key)) {
      const drivePhotos : IdenticalPhotos = drivePhotosByHash[key];

      // is there a google photo match
      if (googlePhotosByHash[key]) {

        let matchedGooglePhotos: IdenticalPhotos = googlePhotosByHash[key];
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

function getClosestGooglePhotoByHash(
  drivePhoto: IdenticalPhotos,
  googlePhotos : Array<GooglePhoto>) : ClosestHashSearchResult {

  const drivePhotoHash : string = drivePhoto.hash;

  let minHashDistance = 1;
  let googlePhotoHash = '';

  googlePhotos.forEach( (googlePhoto) => {
    const hash : string = googlePhoto.getHash();
    if (hash) {
      let hashDistance = Jimp.distanceByHash(drivePhotoHash, hash);
      if (hashDistance < minHashDistance) {

        minHashDistance = hashDistance;

        const aspectRatio = (Number(googlePhoto.getWidth()) / Number(googlePhoto.getHeight())).toString();
        const key = hash + '-' + aspectRatio;

        googlePhotoHash = key;
      }
    }
  });

  let closestHashSearchResult : ClosestHashSearchResult = {
    minHashDistance,
    googlePhotoHash
  };
  return closestHashSearchResult;
}