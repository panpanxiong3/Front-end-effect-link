document.querySelectorAll('a').forEach(elem => {

  elem.onmouseenter =
  elem.onmouseleave = e => {

    const tolerance = 5;

    const left = 0;
    const right = elem.clientWidth;

    let x = e.pageX - elem.offsetLeft;

    if (x - tolerance < left) x = left;
    if (x + tolerance > right) x = right;

    elem.style.setProperty('--x', `${x}px`);

  };

});