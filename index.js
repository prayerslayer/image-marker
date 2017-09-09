(function() {
  const images = {};
  let debouncing = null;

  function atLeast(min) {
    return val => Math.max(min, val);
  }

  function debounce(fn, ms = 100) {
    if (debouncing !== null) {
      clearTimeout(debouncing);
    }

    debouncing = setTimeout(function() {
      fn.call(fn, arguments);
      debouncing = null;
    }, ms);
  }

  function registerImage(selector, width, height) {
    if (!images[selector]) {
      images[selector] = { width, height, links: [] };
    }
    // else assume data didn't change
    return images[selector];
  }

  function setup() {
    const img_links = document.querySelectorAll('.img-link');
    img_links.forEach(link => {
      const data = link.dataset;
      const imgNode = document.querySelector(data.img);
      const img = registerImage(
        data.img,
        imgNode.naturalWidth,
        imgNode.naturalHeight
      );

      img.links.push({
        id: '#' + link.id,
        left: parseInt(data.left),
        top: parseInt(data.top),
        width: parseInt(data.width),
        height: parseInt(data.height),
        cropWidth: atLeast(parseInt(data.minWidth || 0)),
        cropHeight: atLeast(parseInt(data.minHeight || 0))
      });
    });
    relayout();
  }

  function relayout() {
    Object.keys(images).forEach(imgSelector => {
      const image = images[imgSelector];
      const imageNode = document.querySelector(imgSelector);
      const currentWidth = imageNode.clientWidth;
      const currentHeight = imageNode.clientHeight;

      image.links.forEach(link => {
        const xFactor = currentWidth / image.width;
        const yFactor = currentHeight / image.height;
        const height = link.cropHeight(link.height * yFactor);
        const width = link.cropWidth(link.width * xFactor);

        const top = (link.top - height / 2) * yFactor;
        const left = (link.left - width / 2) * xFactor;

        const linkNode = document.querySelector(link.id);
        linkNode.setAttribute(
          'style',
          `top:${top}px;left:${left}px;width:${width}px;height:${height}px;`
        );
      });
    });
  }

  const debouncedLayout = debounce.bind(null, relayout);
  window.addEventListener('load', setup, false);
  window.addEventListener('focus', debouncedLayout, false); //Cope with window being resized whilst on another tab
  window.addEventListener('resize', debouncedLayout, false);
  window.addEventListener('readystatechange', debouncedLayout, false);
  document.addEventListener('fullscreenchange', debouncedLayout, false);
})();
