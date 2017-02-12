// @flow

import React, { Component } from 'react';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class ComparePhotos extends Component {

// getImagesJSX(leftPhotoUrl, rightPhotoUrl) {
//
//     return (
//       <div className="sideBySidePhotos">
//         <div className="allImages">
//           <div className="leftPanel">
//             <img className="leftImage"
//               src={leftPhotoUrl}
//             />
//           </div>
//           <div className="rightPanel">
//             <img className="rightImage"
//               src={rightPhotoUrl}
//             />
//           </div>
//         </div>
//         <div className="clear" />
//       </div>
//     );
//
//     return (
//       <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
//         <img  src={self.thumbUrl} className="thumbImg" width={photo.width}
//              height={photo.height}
//              onClick={() => self.props.selectPhoto(photo)}
//              onDoubleClick={() => self.displayFullSizePhoto(photo)}
//         />
//       </li>
//     );
//
//   }
//

  // <img id={photo.dbId} src={self.thumbUrl} className="thumbImg" width={photo.width}
// height={photo.height}
// />

  getPhotosToDisplay(photos) {
    let photosJSX = photos.map(function(photo) {
      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img  src={photo.url} className="thumbImg"
          />
        </li>
      );
    });

    return photosJSX;
  }

  render() {

    debugger;

    // let imagesJSX;
    let photosToDisplay;

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
      case 'identicalGooglePhotos':
        {
          // for now, find the first google photo that has a match with other google photos
          const googlePhotosByHash = this.props.googlePhotosByHash;
          for (let hash in googlePhotosByHash) {
            if (googlePhotosByHash.hasOwnProperty(hash)) {
              const identicalPhotos = googlePhotosByHash[hash];
              const identicalGooglePhotos = identicalPhotos.photos;
              if (identicalGooglePhotos.length > 1) {
                photosToDisplay = [identicalGooglePhotos[0], identicalGooglePhotos[1]];

                // imagesJSX = this.getImagesJSX(
                //   identicalGooglePhotos[0].url,
                //   identicalGooglePhotos[1].url
                // );
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

    // const imagesJSX = this.getImagesJSX(
    //   this.props.googlePhotos[0].url,
    //   this.props.googlePhotos[1].url
    // );


    return (
      <div className="photoPageContainer">
        <div className="photosDiv">
          <div className="dayOfPhotosDiv" key={Math.random().toString()}>
            <ul className="flex-container wrap">
              {this.getPhotosToDisplay(photosToDisplay)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

ComparePhotos.propTypes = {
  googlePhotos: React.PropTypes.array.isRequired,
  comparisonType: React.PropTypes.string.isRequired,
  drivePhotosByHash: React.PropTypes.object.isRequired,
  googlePhotosByHash: React.PropTypes.object.isRequired,

  // diskImageUrl: React.PropTypes.string.isRequired,
  // googleImageUrl: React.PropTypes.string.isRequired,
};


export default ComparePhotos;
