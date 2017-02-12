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

function mapStateToProps (state) {
  return {
    googlePhotos: state.googlePhotos.googlePhotos,
  };
}
//
// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({saveResults, manualMatchFound, noMatchFound },
//     dispatch);
// }

export default connect(mapStateToProps)(ComparePhotosContainer);

