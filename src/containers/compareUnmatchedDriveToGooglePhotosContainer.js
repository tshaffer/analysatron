// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import CompareUnmatchedDriveToGooglePhotos from '../components/compareUnmatchedDriveToGooglePhotos';

class CompareUnmatchedDriveToGooglePhotosContainer extends Component {

  handleMatch(drivePhotoItems) {
    console.log('handleMatch: ', drivePhotoItems);
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

export default connect(mapStateToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


