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

  getPhotosToDisplay(photoItems : PhotoItems) {

    let self = this;

    const maxHeight = 400;

    return photoItems.map(function(photoItem: PhotoItem) {

      const photo = photoItem.photo;
      let width = Number(photo.getWidth());
      let height = Number(photo.getHeight());

      let aspectRatio = width / height;
      if (height > maxHeight) {
        height = maxHeight;
        width = aspectRatio * height;
      }

      let dateTime = photo.getDateTime();
      let formattedDateTime = self.formatDateTime(dateTime);

      let exifDateTime = photo.getExifDateTime();
      let formattedExifDateTime = self.formatDateTime(exifDateTime);

      // <input id={photo.getUrl()} type="checkbox" className="thumbSelector"
      //        onClick={() => self.togglePhotoSelection(photoItem)}
      // />

      return (
        <li className="flex-item photoThumbsDiv thumbLi" key={Math.random().toString()}>
          <img
            className="thumbImg"
            src={self.getPhotoUrl(photo)}
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
  photoItems: React.PropTypes.array.isRequired
};

export default ComparePhotoItems;
