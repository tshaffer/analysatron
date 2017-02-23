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
  setDrivePhotoToGooglePhotoComparisonResults
} from '../store/photoComparisonResults';

class CompareUnmatchedDriveToGooglePhotosContainer extends Component {

  handleMatch(drivePhotoItems : PhotoItems) {

    const drivePhotoToGooglePhotoComparisonResults : DrivePhotoToGooglePhotoComparisonResults = [];

    drivePhotoItems.forEach( (drivePhotoItem : PhotoItem) => {
      const drivePhotoToGooglePhotoComparisonResult : DrivePhotoToGooglePhotoComparisonResult = {
        driveFilePath : drivePhotoItem.photo.path,
        result: 'match'
      };
      drivePhotoToGooglePhotoComparisonResults.push(drivePhotoToGooglePhotoComparisonResult);
    });

    this.props.setDrivePhotoToGooglePhotoComparisonResults(drivePhotoToGooglePhotoComparisonResults);
  }

  handleNotAMatch(drivePhotoItems) {

    console.log('handleNotAMatch: ', drivePhotoItems);
  }

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <CompareUnmatchedDriveToGooglePhotos
        {...this.props}
        onMatch={this.handleMatch.bind(this)}
        onNotAMatch={this.handleNotAMatch.bind(this)}
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
  return bindActionCreators({ setDrivePhotoToGooglePhotoComparisonResults },
    dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


