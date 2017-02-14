// @flow

// https://flowtype.org/docs/quick-reference.html#type-aliases

import Photo from './entities/photo';

export type PhotoItem = {
  photo: Photo,
  matchedPhotoGroupIndex: ?number
}

export type PhotoItems = Array<PhotoItem>;

// https://flowexport type.org/docs/quick-reference.html#export type-aliases
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

export type ClosestHashSearchResult = {
  minHashDistance: number,
  googlePhotoIndexOfMinHashDistance: number
};
