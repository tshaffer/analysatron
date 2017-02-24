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

    this.props.readDrivePhotoToGooglePhotoComparisonResults();

    const unmatchedPhotos: Array<IdenticalPhotos> = this.props.photoComparisonResults.unmatchedPhotos;
    if (!unmatchedPhotos) {
      debugger;
    }

    // let unmatchedExistingPhotos : Array<IdenticalPhotos> = unmatchedPhotos.map( function (unmatchedPhoto : IdenticalPhotos) : IdenticalPhotos {
    //   const photoItems : PhotoItems = unmatchedPhoto.photoItems;
    //   const photoItem : PhotoItem = photoItems[0];
    //   if (photoItem.photo.fileExists()) {
    //     return unmatchedPhoto;
    //   }
    //   else {
    //     return null;
    //   }
    // });

    // strip out photos that don't exist
    let unmatchedExistingPhotos : Array<IdenticalPhotos> = [];
    unmatchedPhotos.forEach( (unmatchedPhoto) => {
      const photoItems : PhotoItems = unmatchedPhoto.photoItems;
      const photoItem : PhotoItem = photoItems[0];
      if (photoItem.photo.fileExists()) {
        unmatchedExistingPhotos.push(unmatchedPhoto);
      }
    });

    unmatchedExistingPhotos.sort( (identicalPhotosA, identicalPhotosB) => {
      if (identicalPhotosA && identicalPhotosB) {
        const minHashDistanceA : number = identicalPhotosA.closestGooglePhoto.minHashDistance;
        const minHashDistanceB : number = identicalPhotosB.closestGooglePhoto.minHashDistance;
        return minHashDistanceA - minHashDistanceB;
      }
      return 0;
    });

    this.unmatchedPhotos = unmatchedExistingPhotos;
  }

  drivePhotoItems: PhotoItems;
  unmatchedPhotos: Array<IdenticalPhotos>;

  moveToNext() {

    let drivePhotoIndex = this.props.drivePhotoIndex + 1;
    if (drivePhotoIndex >= this.props.photoComparisonResults.unmatchedPhotos.length) {
      drivePhotoIndex = 0;
    }

    this.props.onSetDrivePhotoIndex(drivePhotoIndex);
  }

  handleMatch() {
    this.props.onMatch(this.drivePhotoItems);
    this.moveToNext();
  }

  handleNotAMatch() {
    this.props.onNotAMatch(this.drivePhotoItems);
    this.moveToNext();
  }

  handleSave() {
    this.props.onSave();
  }

  handleNext() {
    this.moveToNext();
  }

  handlePrev() {

    let drivePhotoIndex = this.props.drivePhotoIndex - 1;
    if (drivePhotoIndex < 0) {
      drivePhotoIndex = this.props.photoComparisonResults.unmatchedPhotos.length - 1;
    }

    this.props.onSetDrivePhotoIndex(drivePhotoIndex);
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

    if (!this.props.photoComparisonResults.unmatchedPhotos) {
      return (
        <div>Loading photoComparisonResults...</div>
      );
    }

    if (!this.props.drivePhotoToGooglePhotoComparisonResults ||
          Object.keys(this.props.drivePhotoToGooglePhotoComparisonResults).length === 0) {
      return (
        <div>Loading drivePhotoToGooglePhotoComparisonResults...</div>
      );
    }

    let identicalDrivePhotos : IdenticalPhotos;
    let drivePhotoItem : PhotoItem;

    let drivePhotoIndex = this.props.drivePhotoIndex;

    // let haveUncheckedPhoto = false;
    // while (!haveUncheckedPhoto) {
    //   identicalDrivePhotos = this.unmatchedPhotos[drivePhotoIndex];
    //   this.drivePhotoItems = identicalDrivePhotos.photoItems;
    //   // TODO, for now ignore matchedPhotoGroupIndex
    //   drivePhotoItem = this.drivePhotoItems[0];
    //
    //   if (!this.props.drivePhotoToGooglePhotoComparisonResults[drivePhotoItem.photo.path]) {
    //     haveUncheckedPhoto = true;
    //   }
    //   else {
    //     drivePhotoIndex++;
    //   }
    // }

    identicalDrivePhotos = this.unmatchedPhotos[drivePhotoIndex];
    this.drivePhotoItems = identicalDrivePhotos.photoItems;
    drivePhotoItem = this.drivePhotoItems[0];

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
  readDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  drivePhotoIndex: React.PropTypes.number.isRequired,
  onSetDrivePhotoIndex: React.PropTypes.func.isRequired,
};

export default CompareUnmatchedDriveToGooglePhotos;

