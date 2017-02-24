// @flow

// https://flowtype.org/docs/quick-reference.html#type-aliases
// https://flowtype.org/blog/2015/02/18/Import-Types.html
// https://flowexport type.org/docs/quick-reference.html#export type-aliases

import Photo from './entities/photo';

export type PhotoItem = {
  photo: Photo,
  matchedPhotoGroupIndex: ?number
}

export type PhotoItems = Array<PhotoItem>;

export type ClosestHashSearchResult = {
  minHashDistance: number,
  googlePhotoHash: string
};

export type IdenticalPhotos = {
  hash: string,
  key: string,
  photoItems: PhotoItems,
  closestGooglePhoto: ClosestHashSearchResult
};

export type PhotosByHash = { [hash:string]: IdenticalPhotos };

export type MatchedPhoto = {
  drivePhotos: IdenticalPhotos,
  matchedGooglePhotos: IdenticalPhotos
};

export type PhotoComparisonResults = {
  matchedPhotos: Array<MatchedPhoto>,
  unmatchedPhotos: Array<IdenticalPhotos>
};

export type DrivePhotoToGooglePhotoComparisonResult = {
  name: string,
  path: string,
  result: string
}

export type DrivePhotoToGooglePhotoComparisonResults = { [path:string]: DrivePhotoToGooglePhotoComparisonResult };