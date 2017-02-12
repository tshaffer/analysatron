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

  handlePrevPhotoGroup() {

    let photoGroupIndex = this.state.photoGroupIndex - 1;
    if (photoGroupIndex < 0 ) {
      photoGroupIndex = this.state.photoGroups.length - 1;
    }

    this.setState( { photoGroupIndex });
  }

  formatDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }

  getPhotosToDisplay(photos) {

    let self = this;

    const maxHeight = 400;

    let photosJSX = photos.map(function(photo) {

      let width = photo.getWidth();
      let height = photo.getHeight();

      let aspectRatio = width / height;
      if (height > maxHeight) {
        height = maxHeight;
        width = aspectRatio * height;
      }

      let dateTime = photo.getDateTime();
      let formattedDateTime = self.formatDateTime(dateTime);

      let exifDateTime = photo.getExifDateTime();
      let formattedExifDateTime = self.formatDateTime(exifDateTime);

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img
            className="thumbImg"
            src={photo.url}
            width={width}
            height={height}
          />
          <p>{'Name: ' + photo.getName()}</p>
          <p>{'DateTime: ' + formattedDateTime}</p>
          <p>{'ExifDateTime: ' + formattedExifDateTime}</p>
          <p>{'Width: ' + photo.getWidth()}</p>
          <p>{'Height: ' + photo.getHeight()}</p>
          <p>{'Aspect ratio: ' + aspectRatio}</p>
          <p>{photo.getHash()}</p>
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
                label='Prev'
                onClick={this.handlePrevPhotoGroup.bind(this)}
                style={buttonStyle}
              />
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
