# image-link-positioner

## Usage

~~~ jade
div.img-link-positioner
  a.img-link
  img
~~~

Provide positions to the link via `data` attributes:

~~~ html
<a
  class="img-link"
  href="#foo"
  data-width="50"
  data-height="50"
  data-left="100"
  data-top="200" />
~~~

This will create a 50px square above 100/200 in the image.

Note that some special CSS is necessary for the positioning to work, but not much (see Codepen).

# TODO

* How cross-browser is this
* Debouncing of layout
* Other possible events? Check at [image-map-resizer](https://github.com/davidjbradshaw/image-map-resizer/blob/master/js/imageMapResizer.js) what they do.

# Fair Warning

I have a terrible track record of maintaining things, don't count on me.
