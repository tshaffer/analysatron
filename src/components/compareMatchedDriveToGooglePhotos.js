// @flow

import type {
  MatchedPhoto,
  Photo,
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
  PhotosByHash,
} from '../types';

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import ComparePhotoItems from './comparePhotoItems';

class CompareMatchedDriveToGooglePhotos extends Component {

  constructor(props: Object) {
    super(props);

    this.state = {
      // identicalPhotoItemsCollectionIndex: 0,
      // identicalPhotoItemsCollection: []
      drivePhotoIndex: 0
    };
  }

  state: Object;

/*
export type PhotoItem = {
 photo: Photo,
 matchedPhotoGroupIndex: ?number
 }

export type PhotoItems = Array<PhotoItem>;

export type IdenticalPhotos = {
  hash: string,
  key: string,
  photoItems: PhotoItems,
  closestGooglePhoto: ClosestHashSearchResult
};

export type MatchedPhoto = {
 drivePhotos: IdenticalPhotos,
 matchedGooglePhotos: IdenticalPhotos
 };

export type PhotoComparisonResults = {
  matchedPhotos: Array<MatchedPhoto>,
  unmatchedPhotos: Array<IdenticalPhotos>
};
*/

  // componentWillMount() {
  //
  //   let identicalPhotoItemsCollection : Array<PhotoItems> = [];
  //
  // }

  handleMatch() {
  }

  handleNotMatch() {
  }

  handleSave() {
    // const photosByHashStr = JSON.stringify(this.photosByHash, null, 2);
    // fs.writeFileSync(this.outputFileName, photosByHashStr);
    // console.log('photosByHash write complete.');
  }

  handleNext() {
  }

  handlePrev() {
  }

  handleHome() {
  }

  formatDateTime(dateTimeStr : string) {

    const dateTime = new Date(dateTimeStr);
    if (dateTime.toString().startsWith("Invalid")) {
      return dateTimeStr;
    }
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }


  getPhotoUrl(photo: Photo) {

    let url = photo.getUrl();

    if (url.startsWith('file:////E:')) {
      let newPath = photo.getPath().replace('E:\\RemovableMedia\\',
        '/Users/tedshaffer/Documents/RemovableMedia/');
      url = this.replaceAll(newPath, '\\', '/');
      url = 'file://' + url;
    }

    return url;
  }

  escapeRegExp(str : string) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  replaceAll(str : string, find : string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }


  getPhotosToDisplay(photoItems : PhotoItems) {

    let self = this;

    const maxHeight = 400;

    let photosJSX = photoItems.map(function(photoItem: PhotoItem) {

      const photo = photoItem.photo;
      let width = Number(photo.getWidth());
      let height = Number(photo.getHeight());

      let aspectRatio = width / height;
      if (height > maxHeight) {
        height = maxHeight;
        width = aspectRatio * height;
      }

      let dateTime = photo.getDateTime();
      let formattedDateTime = self.formatDateTime(dateTime);

      let exifDateTime = photo.getExifDateTime();
      let formattedExifDateTime = self.formatDateTime(exifDateTime);

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img
            className="thumbImg"
            src={self.getPhotoUrl(photo)}
            width={width}
            height={height}
          />
          <p>{'Name: ' + photo.getName()}</p>
          <p>{'DateTime: ' + formattedDateTime}</p>
          <p>{'ExifDateTime: ' + formattedExifDateTime}</p>
          <p>{'Width: ' + photo.getWidth()}</p>
          <p>{'Height: ' + photo.getHeight()}</p>
          <p>{'Aspect ratio: ' + aspectRatio}</p>
          <p>{photo.getHash()}</p>
        </li>
      );
    });

    return photosJSX;

  }

  getButtonStyle() {
    return {
      height: '24px',
      width: '200px',
      marginLeft: '2px'
    };
  }

  getButtonLabelStyle() {
    return {
      fontSize: '12px',
    };
  }

  render() {

    if (!this.props.photoComparisonResults) {
      return (
        <div>Loading...</div>
      );
    }

    const matchedPhotos: Array<MatchedPhoto> = this.props.photoComparisonResults.matchedPhotos;
    const matchedDrivePhoto: MatchedPhoto = matchedPhotos[this.state.drivePhotoIndex];
    const identicalDrivePhotos : IdenticalPhotos = matchedDrivePhoto.drivePhotos;
    const drivePhotoItems: PhotoItems = identicalDrivePhotos.photoItems;
    // TODO, for now ignore matchedPhotoGroupIndex
    const drivePhotoItem : PhotoItem = drivePhotoItems[0];
    // const drivePhotoHash: string = identicalDrivePhotos.hash;
    const drivePhotoKey: string = identicalDrivePhotos.key;

    const googlePhotosByHash: PhotosByHash = this.props.googlePhotosByHash;
    const matchingIdenticalGooglePhotos: IdenticalPhotos = googlePhotosByHash[drivePhotoKey];
    if (!matchingIdenticalGooglePhotos) {
      debugger;
    }
    const googlePhotoItems: PhotoItems = matchingIdenticalGooglePhotos.photoItems;
    // TODO, for now ignore matchedPhotoGroupIndex
    const googlePhotoItem: PhotoItem = googlePhotoItems[0];

    const photoItems = [
      drivePhotoItem,
      googlePhotoItem
    ];

    return (
      <MuiThemeProvider>
        <div className="photoPageContainer">
          <div className="photosDiv">
            <div className="dayOfPhotosDiv" key={Math.random().toString()}>
              <RaisedButton
                label='Match'
                onClick={this.handleMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Not a match'
                onClick={this.handleNotMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Save'
                onClick={this.handleSave.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Next'
                onClick={this.handleNext.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Prev'
                onClick={this.handlePrev.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label='Home'
                onClick={this.handleHome.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <ComparePhotoItems
                photoItems={photoItems}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

CompareMatchedDriveToGooglePhotos.propTypes = {
  googlePhotosByHash: React.PropTypes.object.isRequired,
  photoComparisonResults: React.PropTypes.object.isRequired
};

export default CompareMatchedDriveToGooglePhotos;

