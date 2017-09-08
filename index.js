(function() {
  const images = {};

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
        minWidth: parseInt(data.minWidth || 0),
        minHeight: parseInt(data.minHeight || 0)
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
        let height = link.height * yFactor;
        let width = link.width * xFactor;
        if (height < link.minHeight) {
          height = link.minHeight;
        }
        if (width < link.minWidth) {
          width = link.minWidth;
        }
        const top = (link.top - height/2) * yFactor;
        const left = (link.left -width/2)* xFactor;

        const linkNode = document.querySelector(link.id);
        linkNode.setAttribute(
          'style',
          `top:${top}px;left:${left}px;width:${width}px;height:${height}px;`
        );
      });
    });
  }

  window.addEventListener('load', () => setup());
  window.addEventListener('resize', () => relayout());
})();
