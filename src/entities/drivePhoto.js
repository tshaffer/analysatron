// @flow

import Photo from './photo';

export default class DrivePhoto extends Photo {

  path: string;
  dimensions: Object;
  exifCreateDate: string;
  exifDateTimeOriginal: string;
  hashablePath: string;
  lastModified: string;
  lastModifiedISO: string;

  constructor(drivePhotoSpec: Object) {
    super(drivePhotoSpec);
    this.path = drivePhotoSpec.path;
    this.dimensions = drivePhotoSpec.dimensions;
    this.exifCreateDate = drivePhotoSpec.exifCreateDate;
    this.exifDateTimeOriginal = drivePhotoSpec.exifDateTimeOriginal;
    this.hashablePath = drivePhotoSpec.hashablePath;
    this.lastModified = drivePhotoSpec.lastModified;
    this.lastModifiedISO = drivePhotoSpec.lastModifiedISO;

    const parts = this.path.split("\\");
    this.name = parts[parts.length - 1];
  }

  // getName(): string {
  //   return this.name;
  // }
  //
  // getWidth(): string {
  //   return this.width;
  // }
  //
  // getHeight(): string {
  //   return this.height;
  // }
  //
  // getDateTime(): string {
  //   return this.dateTime;
  // }
  //
  // getExifDateTime(): string {
  //   return this.exifDateTime;
  // }
}
