// @flow

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

  handleNotAMatch() {
    this.props.onNotAMatch(this.drivePhotoItems);
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
                onClick={this.handleNotAMatch.bind(this)}
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
  photoComparisonResults: React.PropTypes.object.isRequired,
  drivePhotoToGooglePhotoComparisonResults: React.PropTypes.object.isRequired,
  onMatch: React.PropTypes.func.isRequired,
  onNotAMatch: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired,
  initUnmatchedDrivePhotoComparisons: React.PropTypes.func.isRequired,
  drivePhotoIndex: React.PropTypes.number.isRequired,
  unmatchedExistingPhotos: React.PropTypes.array.isRequired,
  onSetDrivePhotoIndex: React.PropTypes.func.isRequired,
  onNavigateForward: React.PropTypes.func.isRequired,
  onNavigateBackward: React.PropTypes.func.isRequired,
};

export default CompareUnmatchedDriveToGooglePhotos;

