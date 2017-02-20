// @flow

import type { Photo, PhotoItem, PhotoItems } from '../types';

import React, { Component } from 'react';

class ComparePhotoItems extends Component {

  formatDateTime(dateTimeStr : string) {

    const dateTime = new Date(dateTimeStr);
    if (dateTime.toString().startsWith("Invalid")) {
      return dateTimeStr;
    }
    return dateTime.toDateString() + ', ' + dateTime.toLocaleTimeString();
  }

  getPhotoUrl(photo: Photo) {

    let url = photo.getUrl();

    if (url.startsWith('file:////E:')) {
      let newPath = photo.getPath().replace('E:\\RemovableMedia\\',
        '/Users/tedshaffer/Documents/RemovableMedia/');
      url = this.replaceAll(newPath, '\\', '/');
      url = 'file://' + url;
    }

    return url;
  }

  escapeRegExp(str : string) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  replaceAll(str : string, find : string, replace: string) {
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
  }

// <input id={photoItem.photo.getUrl()} type="checkbox" className="thumbSelector"
// onClick={() => this.togglePhotoSelection(photoItem)}
// />

  renderCheckBoxes(displayCheckBoxes: boolean, photoItem: PhotoItem) {

    if (displayCheckBoxes) {
      return (
        <input id={photoItem.photo.getUrl()} type="checkbox" className="thumbSelector"
        />
      );
    }
    else {
      return (
        null
      );
    }
  }


  renderName(photo: Photo) {
    return (
      <p>{'Name: ' + photo.getName()}</p>
    );
  }

  renderDateTime(photo: Photo) {
    let dateTime = photo.getDateTime();
    let formattedDateTime = this.formatDateTime(dateTime);
    return (
      <p>{'DateTime: ' + formattedDateTime}</p>
    );
  }

  renderExifDateTime(photo: Photo) {
    let exifDateTime = photo.getExifDateTime();
    let formattedExifDateTime = this.formatDateTime(exifDateTime);

    return (
      <p>{'ExifDateTime: ' + formattedExifDateTime}</p>
    );
  }

  renderWidth(photo : Photo) {
    return (
      <p>{'Width: ' + photo.getWidth()}</p>
    );
  }

  renderHeight(photo : Photo) {
    return (
      <p>{'Height: ' + photo.getHeight()}</p>
    );
  }

  renderAspectRatio(aspectRatio: number) {
    return (
      <p>{'Aspect ratio: ' + aspectRatio.toString()}</p>
    );
  }


  renderHash(photo: Photo) {
    return (
      <p>{photo.getHash()}</p>
    );
  }

  getDimensions(photo: Photo) {

    const maxHeight = 400;

    let width = Number(photo.getWidth());
    let height = Number(photo.getHeight());

    let aspectRatio = width / height;
    if (height > maxHeight) {
      height = maxHeight;
      width = aspectRatio * height;
    }

    let dimensions = {};
    dimensions.height = height;
    dimensions.width = width;
    dimensions.aspectRatio = aspectRatio;

    return dimensions;
  }

  getPhotosToDisplay(photoItems : PhotoItems) {

    let self = this;

    return photoItems.map(function(photoItem: PhotoItem) {

      const photo = photoItem.photo;

      const dimensions = self.getDimensions(photo);

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img
            className="thumbImg"
            src={self.getPhotoUrl(photo)}
            width={dimensions.width}
            height={dimensions.height}
          />
          {self.renderCheckBoxes(self.props.displayCheckBoxes, photoItem)}
          {self.renderName(photo)}
          {self.renderDateTime(photo)}
          {self.renderExifDateTime(photo)}
          {self.renderWidth(photo)}
          {self.renderHeight(photo)}
          {self.renderAspectRatio(dimensions.aspectRatio)}
          {self.renderHash(photo)}
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="flex-container wrap">
        {this.getPhotosToDisplay(this.props.photoItems)}
      </ul>
    );
  }
}

ComparePhotoItems.propTypes = {
  photoItems: React.PropTypes.array.isRequired,
  displayCheckBoxes: React.PropTypes.bool.isRequired
};

export default ComparePhotoItems;
