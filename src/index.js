import { debounce, atLeast } from "./util";
import './style.css';

export default class ImageMarker {
  constructor(
    opts = {
      markerSelector: ".img-marker",
      document: document,
      window: window
    }
  ) {
    this._window = opts.window;
    this._document = opts.document;
    this._images = {};
    this._markerSelector = opts.markerSelector;
    this._eventListeners = {};
    this._debouncedLayout = debounce(this.layout.bind(this));

    this._addEventListeners();
    this.registerMarkers();
  }

  _registerImage(selector, width, height) {
    if (!this._images[selector]) {
      this._images[selector] = { width, height, markers: [] };
    }
    this._images[selector].width = width;
    this._images[selector].height = height;
    return this._images[selector];
  }

  _registerMarker(marker) {
    const data = marker.dataset;
    const imgNode = this._document.querySelector(data.img);
    const img = this._registerImage(
      data.img,
      imgNode.naturalWidth,
      imgNode.naturalHeight
    );

    if (img.markers.some(m => m.id === marker.id)) {
      return;
    }

    img.markers.push({
      id: marker.id,
      left: parseInt(data.left),
      top: parseInt(data.top),
      width: parseInt(data.width),
      height: parseInt(data.height),
      cropWidth: atLeast(parseInt(data.minWidth || 0)),
      cropHeight: atLeast(parseInt(data.minHeight || 0))
    });
  }

  registerMarkers() {
    const imgMarkers = this._document.querySelectorAll(this._markerSelector);
    imgMarkers.forEach(marker => this._registerMarker(marker));
    this.layout();
  }

  layout() {
    Object.keys(this._images).forEach(imgSelector => {
      const image = this._images[imgSelector];
      const imageNode = this._document.querySelector(imgSelector);
      const currentWidth = imageNode.clientWidth;
      const currentHeight = imageNode.clientHeight;

      image.markers.forEach(marker => {
        const xFactor = currentWidth / image.width;
        const yFactor = currentHeight / image.height;
        const height = marker.cropHeight(marker.height * yFactor);
        const width = marker.cropWidth(marker.width * xFactor);

        const top = marker.top * yFactor - height / 2;
        const left = marker.left * xFactor - width / 2;

        const markerNode = this._document.querySelector("#" + marker.id);
        markerNode.setAttribute(
          "style",
          `top:${top}px;left:${left}px;width:${width}px;height:${height}px;`
        );
      });
    });
  }

  _removeMarkers() {
    Object.keys(this._images).forEach(image =>
      this._images[image].markers.forEach(marker =>
        document.querySelector("#" + marker.id).remove()
      )
    );
  }

  destroy() {
    // free memory!
    this._removeEventListeners();
    this._removeMarkers();
    this._images = null;
    this._document = null;
    this._window = null;
    this._eventListeners = null;
  }

  _addEventListener(event, fn, target = this._window) {
    if (!this._eventListeners[event]) {
      target.addEventListener(event, fn, { passive: true });
      this._eventListeners[event] = () => target.removeEventListener(event, fn);
    }
  }

  _removeEventListeners() {
    Object.keys(this._eventListeners).forEach(event =>
      this._eventListeners[event]()
    );
  }

  _addEventListeners() {
    this._addEventListener("load", this.registerMarkers.bind(this));
    //Cope with window being resized whilst on another tab
    this._addEventListener("focus", this._debouncedLayout);
    this._addEventListener("resize", this._debouncedLayout);
    this._addEventListener("readystatechange", this._debouncedLayout);
    this._addEventListener(
      "fullscreenchange",
      this._debouncedLayout,
      this._document
    );
  }
}
