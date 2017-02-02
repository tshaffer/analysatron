import { readGooglePhotos } from './googlePhotos';
import { readDrivePhotos } from './drivePhotos';
import { buildDrivePhotoDictionaries } from './drivePhotos';

export function analyzePhotos() {

  return function (dispatch: Function, getState: Function) {

    let readGooglePhotosPromise = dispatch(readGooglePhotos());
    let readDrivePhotosPromise = dispatch(readDrivePhotos());

    Promise.all([readGooglePhotosPromise, readDrivePhotosPromise]).then( () => {

      // both google photos and drive photos have been read in and added to the store,
      // now begin analysis

      // any duplicates in drivePhotos db?
      dispatch(buildDrivePhotoDictionaries());

      // get the duplicate google photos
      //    same hash
      //    same date
      //    same resolution / same aspect ratio
      // TODO - figure out the data structure for saving this information
      // TODO - I'd like to create an easy way to visually inspect these 'duplicate' photos

      // find the drive photos that have a match with one or more google photos
      //    same hash,
      //      same or different date
      //      same or different dimensions / aspect ratio
      // TODO - figure out the data structure for saving this information
      // TODO - I'd like to create an easy way to visually inspect these 'duplicate' photos
      // TODO - do I only want to see the ones with the same dates, same dateTimes,
      // TODO - same aspectRatios, or some combination of the above?
      let state = getState();

      let googlePhotos = state.googlePhotos.googlePhotos;
      const duplicateGooglePhotosByHash = getDuplicatePhotos(googlePhotos);

      let drivePhotos = state.drivePhotos.drivePhotos;
      const duplicateDrivePhotosByHash = getDuplicatePhotos(drivePhotos);

      // TODO - determine the number of unique photos / true duplicates
      // TODO - of the duplicate photos, how many have duplicate
      // TODO - names
      // TODO - dimensions / aspect ratios
      // TODO - dates
      // TODO - dateTimes

      // TODO - iterate through duplicate photos
      // TODO - for each duplicate photo array
      // TODO -     figure out the number that are unique / true duplicates
      // TODO -     using whichever criteria I choose
      // TODO -     sum up that count


      debugger;
    }).catch( (err) => {
      throw(err);
    });
  };
}

function getDuplicatePhotos(photos) {

  let photosByHash = {};

  photos.forEach( (photo) => {
    const hash = photo.hash;
    if (!photosByHash[hash]) {
      photosByHash[hash] = [];
    }
    photosByHash[hash].push(photo);
  });

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
