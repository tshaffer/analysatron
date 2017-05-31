// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CompareUnmatchedDriveToGooglePhotos from '../components/compareUnmatchedDriveToGooglePhotos';

import type {
  PhotoItem,
  PhotoItems,
  DrivePhotoToGooglePhotoComparisonResult,
  DrivePhotoToGooglePhotoComparisonResults }
  from '../types';

import {
  addDrivePhotoToGooglePhotoComparisonResults,
  saveDrivePhotoToGooglePhotoComparisonResults,
  initUnmatchedDrivePhotoComparisons,
  setDrivePhotoIndex,
  navigateForward,
  navigateBackward,
} from '../store/photoComparisonResults';

class CompareUnmatchedDriveToGooglePhotosContainer extends Component {

  buildResults( drivePhotoItems : PhotoItems, result : string )
  {
    const drivePhotoToGooglePhotoComparisonResults : DrivePhotoToGooglePhotoComparisonResults = {};

    drivePhotoItems.forEach( (drivePhotoItem : PhotoItem) => {

      const path = drivePhotoItem.photo.getPath();

      const drivePhotoToGooglePhotoComparisonResult : DrivePhotoToGooglePhotoComparisonResult = {
        name : drivePhotoItem.photo.getName(),
        path,
        result
      };
      drivePhotoToGooglePhotoComparisonResults[path] = drivePhotoToGooglePhotoComparisonResult;
    });

    this.props.addDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResults);
  }

  handleMatch(drivePhotoItems : PhotoItems) {
    this.buildResults(drivePhotoItems, 'match');
  }

  handleLowResMatch(drivePhotoItems : PhotoItems) {
    this.buildResults(drivePhotoItems, 'lowResMatch');
  }

  handleNotAMatch(drivePhotoItems) {
    this.buildResults(drivePhotoItems, 'notAMatch');
  }

  handleDiscard(drivePhotoItems) {
    this.buildResults(drivePhotoItems, 'discard');
  }

  handleSave() {
    this.props.saveDrivePhotoToGooglePhotoComparisonResults();
  }

  handleSetDrivePhotoIndex(drivePhotoIndex : number) {
    this.props.setDrivePhotoIndex(drivePhotoIndex);
  }

  handleNavigateForward() {
    this.props.navigateForward();
  }

  handleNavigateBackward() {
    this.props.navigateBackward();
  }

  render() {

    return (
      <CompareUnmatchedDriveToGooglePhotos
        {...this.props}
        onMatch={this.handleMatch.bind(this)}
        onLowResMatch={this.handleLowResMatch.bind(this)}
        onNotAMatch={this.handleNotAMatch.bind(this)}
        onDiscard={this.handleDiscard.bind(this)}
        onSave={this.handleSave.bind(this)}
        onSetDrivePhotoIndex={this.handleSetDrivePhotoIndex.bind(this)}
        onNavigateForward={this.handleNavigateForward.bind(this)}
        onNavigateBackward={this.handleNavigateBackward.bind(this)}
      />
    );
  }
}

function mapStateToProps (state) {
  return {
    photoComparisonResults: state.photoComparisonResults.photoComparisonResults,
    drivePhotoToGooglePhotoComparisonResults:
      state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults,
    googlePhotosByHash: state.googlePhotos.googlePhotosByHash,
    drivePhotoIndex: state.photoComparisonResults.drivePhotoIndex,
    unmatchedExistingPhotos: state.photoComparisonResults.unmatchedExistingPhotos,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addDrivePhotoToGooglePhotoComparisonResults,
    saveDrivePhotoToGooglePhotoComparisonResults,
    initUnmatchedDrivePhotoComparisons,
    setDrivePhotoIndex,
    navigateForward,
    navigateBackward,
  }, dispatch);
}

CompareUnmatchedDriveToGooglePhotosContainer.propTypes = {
  addDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  saveDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  initUnmatchedDrivePhotoComparisons: React.PropTypes.func.isRequired,
  setDrivePhotoIndex: React.PropTypes.func.isRequired,
  navigateForward: React.PropTypes.func.isRequired,
  navigateBackward: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


