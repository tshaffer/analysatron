// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import CompareUnmatchedDriveToGooglePhotos from '../components/compareUnmatchedDriveToGooglePhotos';

class CompareUnmatchedDriveToGooglePhotosContainer extends Component {

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <CompareUnmatchedDriveToGooglePhotos
        {...this.props}
      />
    );
  }
}

function mapStateToProps (state) {
  return {
    photoComparisonResults: state.drivePhotos.photoComparisonResults,
    googlePhotosByHash: state.googlePhotos.googlePhotosByHash,
  };
}

export default connect(mapStateToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


