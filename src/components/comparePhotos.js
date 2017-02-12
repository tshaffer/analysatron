// @flow

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class ComparePhotos extends Component {

  constructor(props: Object) {
    super(props);
    this.state = {
      photoGroupIndex: 0,
      photoGroups: []
    };
  }


  componentWillMount() {

    let photoGroups = [];

    switch(this.props.comparisonType) {
      case 'identicalGooglePhotos': {
        // for now, find the first google photo that has a match with other google photos
        const googlePhotosByHash = this.props.googlePhotosByHash;
        for (let hash in googlePhotosByHash) {
          if (googlePhotosByHash.hasOwnProperty(hash)) {
            const identicalPhotos = googlePhotosByHash[hash];
            const identicalGooglePhotos = identicalPhotos.photos;
            if (identicalGooglePhotos.length > 1) {
              photoGroups.push(identicalPhotos);
            }
          }
        }

        this.setState({photoGroups});

        break;
      }
      // case 'identicalDrivePhotos':
      // {
      //   const drivePhotosByHash = this.props.drivePhotosByHash;
      //   for (let hash in drivePhotosByHash) {
      //     if (drivePhotosByHash.hasOwnProperty(hash)) {
      //       const identicalPhotos = drivePhotosByHash[hash];
      //       const identicalDrivePhotos = identicalPhotos.photos;
      //       const closestGooglePhoto = identicalPhotos.closestGooglePhoto;
      //       if (closestGooglePhoto.minHashDistance === 1 && identicalDrivePhotos.length > 1) {
      //         debugger;
      //       }
      //     }
      //   }
      //   break;
      // }
      default: {
        debugger;
      }
    }
  }

  handleNextPhotoGroup() {

    let photoGroupIndex = this.state.photoGroupIndex + 1;
    if (photoGroupIndex >= this.state.photoGroups.length) {
      photoGroupIndex = 0;
    }

    this.setState( { photoGroupIndex });
  }

  getPhotosToDisplay(photos) {

    let photosJSX = photos.map(function(photo) {

      let width = photo.getWidth();
      let height = photo.getHeight();

      let dateTime = photo.getDateTime();
      let exifDateTime = photo.getExifDateTime();

      let name = photo.getName();

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img  src={photo.url} className="thumbImg"
          />
          <p>{name}</p>
        </li>
      );
    });

    return photosJSX;
  }

  render() {

    const buttonStyle = {
      marginLeft: '2px',
      marginTop: '4px',
      fontSize: '12px',
    };


    const photoGroups = this.state.photoGroups[this.state.photoGroupIndex];
    if (!photoGroups) {
      return (
        <div>Loading...</div>
      );
    }

    return (
      <MuiThemeProvider>
        <div className="photoPageContainer">
          <div className="photosDiv">
            <div className="dayOfPhotosDiv" key={Math.random().toString()}>
              <RaisedButton
                label='Next'
                onClick={this.handleNextPhotoGroup.bind(this)}
                style={buttonStyle}
              />
              <ul className="flex-container wrap">
                {this.getPhotosToDisplay(photoGroups.photos)}
              </ul>
            </div>
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
  googlePhotosByHash: React.PropTypes.object.isRequired,

  // diskImageUrl: React.PropTypes.string.isRequired,
  // googleImageUrl: React.PropTypes.string.isRequired,
};


export default ComparePhotos;
