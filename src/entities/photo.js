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

  getDisplayUrl() : string {
    return '';
  }

  getPath() : string {
    return '';
  }

  updatePath() {
    console.log('base class updatePath');
  }

  fileExists(): boolean {
    return true;
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