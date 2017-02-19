// @flow

import { connect } from 'react-redux';

import Landing from '../components/landing';

import { analyzePhotos } from '../store/index';

function mapStateToProps (state) {
  return {
    googlePhotosByHash: state.googlePhotos.googlePhotosByHash,
    drivePhotosByHash: state.drivePhotos.drivePhotosByHash,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAnalyzePhotos: () => {
      dispatch(analyzePhotos());
    }
  };
}

const LandingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);

export default LandingContainer;

