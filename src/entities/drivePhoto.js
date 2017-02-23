// @flow

const fs = require('fs');

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

  getUrl() : string {
    return 'file:////' + this.path;
  }

  getPath() : string {
    return this.path;
  }

  getWidth(): string {
    // apparently, not all drive photos have dimensions
    if (!this.dimensions) {
      return '1';
    }
    return this.dimensions.width.toString();
  }

  getHeight(): string {
    // apparently, not all drive photos have dimensions
    if (!this.dimensions) {
      return '1';
    }
    return this.dimensions.height.toString();
  }

  getDateTime(): string {
    return this.lastModified;
  }

  getExifDateTime(): string {
    if (this.exifCreateDate && this.exifCreateDate !== '') {
      return this.exifCreateDate;
    }
    else if (this.exifDateTimeOriginal) {
      return this.exifDateTimeOriginal;
    }
    return '';
  }

  updatePath() {

    if (this.path.startsWith('E:\\RemovableMedia\\')) {
      let newPath = this.path.replace('E:\\RemovableMedia\\',
        '/Users/tedshaffer/Documents/RemovableMedia/');
      newPath = this.replaceAll(newPath, '\\', '/');
      if (fs.existsSync(newPath)) {
        this.path = newPath;
      }
    }
  }

  fileExists(): boolean {
    
    if (this.path.startsWith('E:\\RemovableMedia\\')) {
      let newPath = this.path.replace('E:\\RemovableMedia\\',
        '/Users/tedshaffer/Documents/RemovableMedia/');
      newPath = this.replaceAll(newPath, '\\', '/');
      if (fs.existsSync(newPath)) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }
  
  escapeRegExp(str : string) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  replaceAll(str : string, find : string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }



}
