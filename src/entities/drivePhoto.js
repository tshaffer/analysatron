// @flow

export class DrivePhoto {

  path: string;
  dimensions: Object;
  exifCreateDate: string;
  exifDateTimeOriginal: string;
  hash: string;
  hashablePath: string;
  lastModified: string;
  lastModifiedISO: string;

  constructor(drivePhotoSpec: Object) {
    this.path = drivePhotoSpec.path;
    this.dimensions = drivePhotoSpec.dimensions;
    this.exifCreateDate = drivePhotoSpec.exifCreateDate;
    this.exifDateTimeOriginal = drivePhotoSpec.exifDateTimeOriginal;
    this.hash = drivePhotoSpec.hash;
    this.hashablePath = drivePhotoSpec.hashablePath;
    this.lastModified = drivePhotoSpec.lastModified;
    this.lastModifiedISO = drivePhotoSpec.lastModifiedISO;
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
