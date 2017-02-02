// @flow

import { connect } from 'react-redux';

import Landing from '../components/landing';

import { readGooglePhotos } from '../store/googlePhotos';
import { readDrivePhotos } from '../store/drivePhotos';

// function mapStateToProps (state) {
//   return {
//     googlePhotos: state.googlePhotos.googlePhotos,
//   };
// }

function mapDispatchToProps(dispatch) {
  return {
    onReadGooglePhotos: () => {
      dispatch(readGooglePhotos());
    },
    onReadDrivePhotos: () => {
      dispatch(readDrivePhotos());
    }
  };
}

const LandingContainer = connect(
  null,
  mapDispatchToProps
)(Landing);

export default LandingContainer;

