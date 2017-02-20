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

function mapStateToProps (state, ownProps) {
  return {
    googlePhotos: state.googlePhotos.googlePhotos,
    drivePhotosByHash: state.drivePhotos.drivePhotosByHash,
    googlePhotosByHash: state.googlePhotos.googlePhotosByHash,
    parameters: ownProps.params
  };
}

export default connect(mapStateToProps)(CompareUnmatchedDriveToGooglePhotosContainer);


