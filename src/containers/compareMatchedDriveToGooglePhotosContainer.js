// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import CompareMatchedDriveToGooglePhotos from '../components/compareMatchedDriveToGooglePhotos';

class CompareMatchedDriveToGooglePhotosContainer extends Component {

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <CompareMatchedDriveToGooglePhotos
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

export default connect(mapStateToProps)(CompareMatchedDriveToGooglePhotosContainer);
