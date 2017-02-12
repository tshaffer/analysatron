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

function mapStateToProps (state, ownProps) {
  return {
    googlePhotos: state.googlePhotos.googlePhotos,
    drivePhotosByHash: state.drivePhotos.drivePhotosByHash,
    googlePhotosByHash: state.googlePhotos.googlePhotosByHash,
    comparisonType: ownProps.params.id
  };
}
//
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({saveResults, manualMatchFound, noMatchFound },
//     dispatch);
// }

export default connect(mapStateToProps)(ComparePhotosContainer);

