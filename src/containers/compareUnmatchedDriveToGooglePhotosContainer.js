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
  readDrivePhotoToGooglePhotoComparisonResults,
  setDrivePhotoIndex,
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

  handleNotAMatch(drivePhotoItems) {
    this.buildResults(drivePhotoItems, 'notAMatch');
  }

  handleSave() {
    this.props.saveDrivePhotoToGooglePhotoComparisonResults();
  }

  handleSetDrivePhotoIndex(drivePhotoIndex : number) {
    this.props.setDrivePhotoIndex(drivePhotoIndex);
  }

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <CompareUnmatchedDriveToGooglePhotos
        {...this.props}
        onMatch={this.handleMatch.bind(this)}
        onNotAMatch={this.handleNotAMatch.bind(this)}
        onSave={this.handleSave.bind(this)}
        onSetDrivePhotoIndex={this.handleSetDrivePhotoIndex.bind(this)}
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
    readDrivePhotoToGooglePhotoComparisonResults,
    setDrivePhotoIndex,
  }, dispatch);
}

CompareUnmatchedDriveToGooglePhotosContainer.propTypes = {
  addDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  saveDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  readDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  setDrivePhotoIndex: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


