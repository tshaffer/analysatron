// @flow

import { connect } from 'react-redux';

import Landing from '../components/landing';

import { analyzePhotos } from '../store/index';

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
  };
}

const LandingContainer = connect(
  null,
  mapDispatchToProps
)(Landing);

export default LandingContainer;

