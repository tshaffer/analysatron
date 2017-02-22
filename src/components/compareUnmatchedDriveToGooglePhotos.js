// @flow

const fs = require('fs');

import type {
  PhotoItem,
  PhotoItems,
  IdenticalPhotos,
  PhotosByHash,
  ClosestHashSearchResult,
} from '../types';

import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import ComparePhotoItems from './comparePhotoItems';

class CompareUnmatchedDriveToGooglePhotos extends Component {

  constructor(props: Object) {
    super(props);

    this.state = {
      drivePhotoIndex: 0
    };
  }

  state: Object;

  componentWillMount() {

    const unmatchedPhotos: Array<IdenticalPhotos> = this.props.photoComparisonResults.unmatchedPhotos;
    if (!unmatchedPhotos) {
      debugger;
    }

    // strip out photos that don't exist
    let unmatchedExistingPhotos = unmatchedPhotos.map( (unmatchedPhoto) => {
      const photoItems = unmatchedPhoto.photoItems;
      const photoItem = photoItems[0];
      if (photoItem.photo.path.startsWith('E:\\RemovableMedia\\')) {
        let newPath = photoItem.photo.path.replace('E:\\RemovableMedia\\',
          '/Users/tedshaffer/Documents/RemovableMedia/');
        newPath = this.replaceAll(newPath, '\\', '/');
        if (fs.existsSync(newPath)) {
          return unmatchedPhoto;
        }
      }
    });

    unmatchedExistingPhotos.sort( (identicalPhotosA, identicalPhotosB) => {
      const minHashDistanceA : Number = identicalPhotosA.closestGooglePhoto.minHashDistance;
      const minHashDistanceB : Number = identicalPhotosB.closestGooglePhoto.minHashDistance;
      return minHashDistanceA - minHashDistanceB;
    });

    this.unmatchedPhotos = unmatchedExistingPhotos;
  }

  escapeRegExp(str : string) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  replaceAll(str : string, find : string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

  moveToNext() {

    let drivePhotoIndex = this.state.drivePhotoIndex + 1;
    if (drivePhotoIndex >= this.props.photoComparisonResults.matchedPhotos.length) {
      drivePhotoIndex = 0;
    }

    this.setState( { drivePhotoIndex });
  }

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
    this.moveToNext();
  }

  handlePrev() {

    let drivePhotoIndex = this.state.drivePhotoIndex - 1;
    if (drivePhotoIndex < 0) {
      drivePhotoIndex = this.props.photoComparisonResults.matchedPhotos.length - 1;
    }

    this.setState( { drivePhotoIndex });
  }

  handleHome() {
    hashHistory.push('/');
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

    const identicalDrivePhotos: IdenticalPhotos = this.unmatchedPhotos[this.state.drivePhotoIndex];
    const drivePhotoItems: PhotoItems = identicalDrivePhotos.photoItems;
    // TODO, for now ignore matchedPhotoGroupIndex
    const drivePhotoItem : PhotoItem = drivePhotoItems[0];
    // const drivePhotoHash: string = identicalDrivePhotos.hash;
    // const drivePhotoKey: string = identicalDrivePhotos.key;

    const closestGooglePhoto : ClosestHashSearchResult = identicalDrivePhotos.closestGooglePhoto;

    // closestGooglePhoto.googlePhotoHash - doesn't include aspectRatio, but it needs to.
    const googlePhotosByHash: PhotosByHash = this.props.googlePhotosByHash;
    const nonMatchingGooglePhotos: IdenticalPhotos = googlePhotosByHash[closestGooglePhoto.googlePhotoHash];
    if (!nonMatchingGooglePhotos) {
      debugger;
    }
    const googlePhotoItems: PhotoItems = nonMatchingGooglePhotos.photoItems;
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
                displayCheckBoxes={false}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );

  }
}

CompareUnmatchedDriveToGooglePhotos.propTypes = {
  googlePhotosByHash: React.PropTypes.object.isRequired,
  photoComparisonResults: React.PropTypes.object.isRequired
};

export default CompareUnmatchedDriveToGooglePhotos;

