// @flow

// https://flowtype.org/docs/quick-reference.html#type-aliases
// https://flowtype.org/blog/2015/02/18/Import-Types.html
// https://flowexport type.org/docs/quick-reference.html#export type-aliases
// https://flowtype.org/blog/2015/02/18/Typecasts.html

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



// Drive Photo specific types
export type DrivePhotoItem = {
  photo: DrivePhoto,
  matchedPhotoGroupIndex: ?number
}

export type DrivePhotoItems = Array<DrivePhotoItem>;

export type DriveIdenticalPhotos = {
  hash: string,
  key: string,
  photoItems: DrivePhotoItems,
  closestGooglePhoto: ClosestHashSearchResult
};

export type DrivePhotosByHash = { [hash:string]: IdenticalDrivePhotos };



// Google Photo specific types
export type GooglePhotoItem = {
  photo: GooglePhoto,
  matchedPhotoGroupIndex: ?number
}

export type GooglePhotoItems = Array<GooglePhotoItem>;

export type IdenticalGooglePhotos = {
  hash: string,
  key: string,
  photoItems: GooglePhotoItems,
};

export type GooglePhotosByHash = { [hash:string]: IdenticalGooglePhotos };

