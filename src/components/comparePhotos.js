// @flow

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class ComparePhotos extends Component {

  getImagesJSX(leftPhotoUrl, rightPhotoUrl) {

    return (
      <div className="sideBySidePhotos">
        <div className="allImages">
          <div className="leftPanel">
            <img className="leftImage"
              src={leftPhotoUrl}
            />
          </div>
          <div className="rightPanel">
            <img className="rightImage"
              src={rightPhotoUrl}
            />
          </div>
        </div>
        <div className="clear" />
      </div>
    );

  }

  render() {

    debugger;

    switch(this.props.comparisonType) {
      case 'identicalDrivePhotos':
        {
          // for now, find the first drive photo that has a match with other drive photos
          const drivePhotosByHash = this.props.drivePhotosByHash;
          for (let hash in drivePhotosByHash) {
            if (drivePhotosByHash.hasOwnProperty(hash)) {
              const identicalPhotos = drivePhotosByHash[hash];
              const identicalDrivePhotos = identicalPhotos.photos;
              const closestGooglePhoto = identicalPhotos.closestGooglePhoto;
              if (closestGooglePhoto.minHashDistance === 1 && identicalDrivePhotos.length > 1) {
                debugger;
              }
            }
          }
          break;
        }
      default:
        {
          debugger;
        }
    }

    const imagesJSX = this.getImagesJSX(
      this.props.googlePhotos[0].url,
      this.props.googlePhotos[1].url
    );

    return (
      <MuiThemeProvider>
        <div>
          <div>
            {imagesJSX}
            <div className="clear" />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ComparePhotos.propTypes = {
  googlePhotos: React.PropTypes.array.isRequired,
  comparisonType: React.PropTypes.string.isRequired,
  drivePhotosByHash: React.PropTypes.object.isRequired,

  // diskImageUrl: React.PropTypes.string.isRequired,
  // googleImageUrl: React.PropTypes.string.isRequired,
};


export default ComparePhotos;
