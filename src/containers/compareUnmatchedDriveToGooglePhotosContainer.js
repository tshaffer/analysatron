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
  setDrivePhotoToGooglePhotoComparisonResults,
  saveDrivePhotoToGooglePhotoComparisonResults,
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

    this.props.setDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResults);
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

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <CompareUnmatchedDriveToGooglePhotos
        {...this.props}
        onMatch={this.handleMatch.bind(this)}
        onNotAMatch={this.handleNotAMatch.bind(this)}
        onSave={this.handleSave.bind(this)}
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setDrivePhotoToGooglePhotoComparisonResults,
    saveDrivePhotoToGooglePhotoComparisonResults
  },
    dispatch);
}

CompareUnmatchedDriveToGooglePhotosContainer.propTypes = {
  setDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
  saveDrivePhotoToGooglePhotoComparisonResults: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


