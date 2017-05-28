// @flow

import Photo from './photo';

export default class GooglePhoto extends Photo {

  url: string;
  width: string;
  height: string;
  dateTime: string;
  exifDateTime: string;

  constructor(googlePhotoSpec: Object) {
    super(googlePhotoSpec);
    this.url = googlePhotoSpec.url;
    this.width = googlePhotoSpec.width;
    this.height = googlePhotoSpec.height;
    this.dateTime = googlePhotoSpec.dateTime;
    this.exifDateTime = googlePhotoSpec.exifDateTime;
  }

  getUrl() : string {
    return this.url;
  }

  getDisplayUrl() : string {
    return this.getUrl();
  }

  getWidth(): string {
    return this.width;
  }

  getHeight(): string {
    return this.height;
  }

  getDateTime(): string {
    return this.dateTime;
  }

  getExifDateTime(): string {
    return this.exifDateTime;
  }
}
