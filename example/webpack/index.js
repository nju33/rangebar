import Rangebar from '../..';

new Rangebar({
  target: document.getElementById('h1'),
  data: {
    buttons: [50],
    onChange(val) {
      console.log(val)
    }
  }
});
new Rangebar({
  target: document.getElementById('h2'),
  data: {
    buttons: [25, 75],
    onChange(val) {
      console.log(val)
    }
  }
});
new Rangebar({
  target: document.getElementById('h3'),
  data: {
    buttons: [17, 17 * 3, 17 * 5],
    onChange(val) {
      console.log(val)
    }
  }
});
new Rangebar({
  target: document.getElementById('v1'),
  data: {
    horizontal: false,
    buttons: [50],
    onChange(val) {
      console.log(val)
    }
  }
});
new Rangebar({
  target: document.getElementById('v2'),
  data: {
    horizontal: false,
    buttons: [25, 75],
    onChange(val) {
      console.log(val)
    }
  }
});
new Rangebar({
  target: document.getElementById('v3'),
  data: {
    horizontal: false,
    buttons: [17, 17 * 3, 17 * 5],
    onChange(val) {
      console.log(val)
    }
  }
});
