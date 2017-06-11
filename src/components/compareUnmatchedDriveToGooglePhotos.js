// @flow

const Jimp = require('jimp');

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

  componentWillMount() {
    this.props.initUnmatchedDrivePhotoComparisons();
  }

  drivePhotoItems: PhotoItems;
  unmatchedPhotos: Array<IdenticalPhotos>;

  moveToNext() {
    this.props.onNavigateForward();
  }

  handleMatch() {
    this.props.onMatch(this.drivePhotoItems);
    this.props.onNavigateForward();
  }

  handleGoogleLowRes() {
    this.props.onGoogleLowRes(this.drivePhotoItems);
    this.props.onNavigateForward();
  }

  handleDrivePhotoLowRes() {
    this.props.onDrivePhotoLowRes(this.drivePhotoItems);
    this.props.onNavigateForward();
  }

  handleNotAMatch() {
    this.props.onNotAMatch(this.drivePhotoItems);
    this.props.onNavigateForward();
  }

  handleDiscard() {
    this.props.onDiscard(this.drivePhotoItems);
    this.props.onNavigateForward();
  }

  handleSave() {
    this.props.onSave();
  }

  handleNext() {
    this.props.onNavigateForward();
  }

  handlePrev() {
    this.props.onNavigateBackward();
  }

  handleHome() {
    hashHistory.push('/');
  }

  getButtonStyle() {
    return {
      height: '24px',
      width: '180px',
      marginLeft: '2px'
    };
  }

  getButtonLabelStyle() {
    return {
      fontSize: '12px',
    };
  }

  render() {

    // display loading until all data is loaded...

    if (!this.props.photoComparisonResults.unmatchedPhotos) {
      return (
        <div>Loading photoComparisonResults...</div>
      );
    }

    if (this.props.drivePhotoIndex < 0) {
      return (
        <div>Loading drivePhotoIndex...</div>
      );
    }
    // is the following true?? closestGooglePhoto.googlePhotoHash - doesn't include aspectRatio, but it needs to.

    // get drivePhoto
    const identicalDrivePhotos : IdenticalPhotos = this.props.unmatchedExistingPhotos[this.props.drivePhotoIndex];
    this.drivePhotoItems = identicalDrivePhotos.photoItems;
    const drivePhotoItem : PhotoItem = this.drivePhotoItems[0];

    // get googlePhoto
    const closestGooglePhoto : ClosestHashSearchResult = identicalDrivePhotos.closestGooglePhoto;
    const googlePhotosByHash: PhotosByHash = this.props.googlePhotosByHash;
    const nonMatchingGooglePhotos: IdenticalPhotos = googlePhotosByHash[closestGooglePhoto.googlePhotoHash];
    if (!nonMatchingGooglePhotos) {
      debugger;
    }
    const googlePhotoItems: PhotoItems = nonMatchingGooglePhotos.photoItems;
    const googlePhotoItem: PhotoItem = googlePhotoItems[0];

    // display drivePhoto, googlePhoto side by side
    const photoItems = [
      drivePhotoItem,
      googlePhotoItem
    ];

    let matchSuffix = '';
    let nextSuffix = '';
    let googleLowResSuffix = '';
    let driveLowResSuffix = '';
    let notAMatchSuffix = '';

    let hashDistance = 69;
    if (drivePhotoItem.photo && drivePhotoItem.photo.hash && googlePhotoItem.photo && googlePhotoItem.photo.hash) {
      hashDistance = Jimp.distanceByHash(drivePhotoItem.photo.hash, googlePhotoItem.photo.hash);
    }
    const hashThreshold = 0.05;
    if (hashDistance > hashThreshold) {
      notAMatchSuffix = ' *';
    }
    else {
      if (drivePhotoItem.photo.dimensions) {
        if (drivePhotoItem.photo.dimensions.width === Number(googlePhotoItem.photo.width) &&
          drivePhotoItem.photo.dimensions.height === Number(googlePhotoItem.photo.height)) {
          matchSuffix = ' *';
        }
        else {
          let totalNumberOfDrivePixels = Number(drivePhotoItem.photo.dimensions.width) * Number(drivePhotoItem.photo.dimensions.height);
          let totalNumberOfGooglePixels = Number(googlePhotoItem.photo.width) * Number(googlePhotoItem.photo.height);
          if (totalNumberOfDrivePixels < totalNumberOfGooglePixels) {
            driveLowResSuffix = ' *';
          }
          else {
            googleLowResSuffix = ' *';
          }
        }
      }
      else {
        nextSuffix = ' *';
      }
    }

    return (
      <MuiThemeProvider>
        <div className="photoPageContainer">
          <div className="photosDiv">
            <div className="dayOfPhotosDiv" key={Math.random().toString()}>
              <RaisedButton
                label={'Match' + matchSuffix}
                onClick={this.handleMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label={'Google Low Res' + googleLowResSuffix}
                onClick={this.handleGoogleLowRes.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label={'Drive Photo Low Res' + driveLowResSuffix}
                onClick={this.handleDrivePhotoLowRes.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label={'Not a match' + notAMatchSuffix}
                onClick={this.handleNotAMatch.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
              />
              <RaisedButton
                label={'Next' + nextSuffix}
                onClick={this.handleNext.bind(this)}
                style={this.getButtonStyle()}
                labelStyle={this.getButtonLabelStyle()}
                type="submit"
              />
              <RaisedButton
                label='Discard'
                onClick={this.handleDiscard.bind(this)}
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
              Hash distance: {hashDistance.toString()}
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
  photoComparisonResults: React.PropTypes.object.isRequired,
  drivePhotoToGooglePhotoComparisonResults: React.PropTypes.object.isRequired,
  onMatch: React.PropTypes.func.isRequired,
  onNotAMatch: React.PropTypes.func.isRequired,
  onDiscard: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  onMatch: React.PropTypes.func.isRequired,
  onGoogleLowRes: React.PropTypes.func.isRequired,
  onDrivePhotoLowRes: React.PropTypes.func.isRequired,
  drivePhotoIndex: React.PropTypes.number.isRequired,
  unmatchedExistingPhotos: React.PropTypes.array.isRequired,
  onSetDrivePhotoIndex: React.PropTypes.func.isRequired,
  onNavigateForward: React.PropTypes.func.isRequired,
  onNavigateBackward: React.PropTypes.func.isRequired,
};

export default CompareUnmatchedDriveToGooglePhotos;

