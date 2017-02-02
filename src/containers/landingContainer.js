// @flow

import { connect } from 'react-redux';

import Landing from '../components/landing';

import { analyzePhotos } from '../store/index';
// import { readGooglePhotos } from '../store/googlePhotos';
// import { readDrivePhotos } from '../store/drivePhotos';

// function mapStateToProps (state) {
//   return {
//     googlePhotos: state.googlePhotos.googlePhotos,
//   };
// }

function mapDispatchToProps(dispatch) {
  return {
    onAnalyzePhotos: () => {
      dispatch(analyzePhotos());
    }
    // onReadGooglePhotos: () => {
    //   dispatch(readGooglePhotos());
    // },
    // onReadDrivePhotos: () => {
    //   dispatch(readDrivePhotos());
    // }
  };
}

const LandingContainer = connect(
  null,
  mapDispatchToProps
)(Landing);

export default LandingContainer;

