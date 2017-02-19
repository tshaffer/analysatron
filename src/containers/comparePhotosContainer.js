// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import ComparePhotos from '../components/comparePhotos';

class ComparePhotosContainer extends Component {

  render() {
    console.log("ComparePhotosContainer render invoked");

    return (
      <ComparePhotos
        {...this.props}
      />
    );
  }
}

// drivePhotosByHash: state.drivePhotos.drivePhotosByHash,
//   googlePhotosByHash: state.googlePhotos.googlePhotosByHash,

function mapStateToProps (state, ownProps) {
  return {
    googlePhotos: state.googlePhotos.googlePhotos,
    parameters: ownProps.params
  };
}
//
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({saveResults, manualMatchFound, noMatchFound },
//     dispatch);
// }

export default connect(mapStateToProps)(ComparePhotosContainer);

