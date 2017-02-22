// @flow

export default class Photo {

  name: string;
  hash: string;

  constructor(photoSpec: Object) {

    this.name = photoSpec.name;
    this.hash = photoSpec.hash;
  }

  getName(): string {
    return this.name;
  }

  getHash(): string {
    return this.hash;
  }

  getUrl() : string {
    return '';
  }

  getWidth(): string {
    return '';
  }

  getHeight(): string {
    return '';
  }

  getDateTime(): string {
    return '';
  }

  getExifDateTime(): string {
    return '';
  }
}