// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CompareMatchedDriveToGooglePhotos from '../components/compareMatchedDriveToGooglePhotos';

import type {
  PhotoItem,
  PhotoItems,
  DrivePhotoToGooglePhotoComparisonResult,
  DrivePhotoToGooglePhotoComparisonResults }
  from '../types';

import {
  addDrivePhotoToGooglePhotoComparisonResults,
  saveDrivePhotoToGooglePhotoComparisonResults,
  initMatchedDrivePhotoComparisons,
  setMatchedDrivePhotoIndex,
  navigateMatchedForward,
  navigateMatchedBackward,
} from '../store/photoComparisonResults';


class CompareMatchedDriveToGooglePhotosContainer extends Component {

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

  handleNotAMatch(drivePhotoItems) {
    this.buildResults(drivePhotoItems, 'notAMatch');
  }

  handleDiscard(drivePhotoItems) {
    this.buildResults(drivePhotoItems, 'discard');
  }

  handleSave() {
    this.props.saveDrivePhotoToGooglePhotoComparisonResults();
  }

  handleSetDrivePhotoIndex(matchedDrivePhotoIndex : number) {
    this.props.setMatchedDrivePhotoIndex(matchedDrivePhotoIndex);
  }

  handleNavigateMatchedForward() {
    this.props.navigateMatchedForward();
  }

  handleNavigateMatchedBackward() {
    this.props.navigateMatchedBackward();
  }

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <CompareMatchedDriveToGooglePhotos
        {...this.props}
        onMatch={this.handleMatch.bind(this)}
        onNotAMatch={this.handleNotAMatch.bind(this)}
        onDiscard={this.handleDiscard.bind(this)}
        onSave={this.handleSave.bind(this)}
        onSetDrivePhotoIndex={this.handleSetDrivePhotoIndex.bind(this)}
        onNavigateMatchedForward={this.handleNavigateMatchedForward.bind(this)}
        onNavigateMatchedBackward={this.handleNavigateMatchedBackward.bind(this)}
      />
    );
  }
}

function mapStateToProps (state) {
  return {
    photoComparisonResults: state.photoComparisonResults.photoComparisonResults,
    drivePhotoToGooglePhotoComparisonResults:
      state.photoComparisonResults.drivePhotoToGooglePhotoComparisonResults,
    matchedDrivePhotoIndex: state.photoComparisonResults.matchedDrivePhotoIndex,
    matchedExistingPhotos: state.photoComparisonResults.matchedExistingPhotos,

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addDrivePhotoToGooglePhotoComparisonResults,
    saveDrivePhotoToGooglePhotoComparisonResults,
    initMatchedDrivePhotoComparisons,
    setMatchedDrivePhotoIndex,
    navigateMatchedForward,
    navigateMatchedBackward,
  }, dispatch);
}

CompareMatchedDriveToGooglePhotosContainer.propTypes = {
  addDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  saveDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  initMatchedDrivePhotoComparisons: React.PropTypes.func.isRequired,
  setMatchedDrivePhotoIndex: React.PropTypes.func.isRequired,
  navigateMatchedForward: React.PropTypes.func.isRequired,
  navigateMatchedBackward: React.PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(CompareMatchedDriveToGooglePhotosContainer);
