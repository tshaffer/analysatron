import { readGooglePhotos } from './googlePhotos';
import { readDrivePhotos } from './drivePhotos';
import { buildDrivePhotoDictionaries } from './drivePhotos';

export function analyzePhotos() {

  return function (dispatch: Function, getState: Function) {

    let readGooglePhotosPromise = dispatch(readGooglePhotos());
    let readDrivePhotosPromise = dispatch(readDrivePhotos());

    Promise.all([readGooglePhotosPromise, readDrivePhotosPromise]).then( () => {
      let state = getState();
      debugger;
    }).catch( (err) => {
      throw(err);
    });

    // dispatch(readDrivePhotos());
    // dispatch(buildDrivePhotoDictionaries());
  };
}
