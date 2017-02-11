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

}