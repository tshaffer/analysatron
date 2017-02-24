// @flow

const fs = require('fs');
const Jimp = require('jimp');

import { readFile } from '../utilities/utils';
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


export function analyzePhotos() {

  return (dispatch: Function, getState: Function) => {

    let readGooglePhotosPromise = dispatch(readGooglePhotos());
    let readDrivePhotosPromise = dispatch(readDrivePhotos());

    Promise.all([readGooglePhotosPromise, readDrivePhotosPromise]).then(() => {

      // checks for duplicates in drivePhotos db?
      dispatch(buildDrivePhotoDictionaries());

      let state = getState();

      let googlePhotos = state.googlePhotos.googlePhotos;
      console.log('Number of googlePhotos: ', googlePhotos.length);

      const rebuildGooglePhotosByHash = false;
      getGooglePhotosByHash(rebuildGooglePhotosByHash, googlePhotos, dispatch, state);
    }).catch( (err) => {
      console.log(err);
      debugger;
    });
  };
}

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

  let googlePhotosByHash : PhotosByHash = {};

  if (rebuildGooglePhotosByHash) {
    googlePhotosByHash = getMatchingPhotos(googlePhotos);
    getDrivePhotos(googlePhotos, googlePhotosByHash, dispatch, state);

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
      getDrivePhotos(googlePhotos, googlePhotosByHash, dispatch, state);
    });
  }
}


function getDrivePhotos(googlePhotos, googlePhotosByHash, dispatch, state) {

  dispatch(setGooglePhotosByHash(googlePhotosByHash));
  console.log('Number of google photos with unique keys: ', Object.keys(googlePhotosByHash).length);

  let drivePhotos  = state.drivePhotos.drivePhotos;
  const drivePhotosByHash : PhotosByHash = getMatchingPhotos(drivePhotos);
  dispatch(setDrivePhotosByHash(drivePhotosByHash));
  console.log('Number of drivePhotos: ', drivePhotos.length);
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