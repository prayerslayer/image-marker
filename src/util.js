export function atLeast(min) {
  return val => Math.max(min, val);
}

export function debounce(func, wait = 100, immediate = false) {
  let timeout;

  return function() {
    const context = this;
    const args = arguments;

    function later() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args)
    };
  };
}
