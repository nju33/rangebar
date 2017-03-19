# Rangebar

<!-- [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

[![Build Status](https://travis-ci.org/nju33/rangebar.svg?branch=master)](https://travis-ci.org/nju33/rangebar) -->

💊 Elements like input[type=range]


![screenshot](https://github.com/nju33/rangebar/raw/master/images/screenshot.gif?raw=true)

## Install or Download

```sh
yarn add rangebar
npm i -S rangebar
```

Or access to [releases page](https://github.com/nju33/rangebar/releases).
Then, download the latest version.

## Usage

```js
import Rangebar from 'rangebar';

new Rangebar({
  target: getElementById('target')
  data: {
    style: {
      // defualts
      len: '8em',
      width: '4px',
      barBackgroundColor: '#222',
      buttonBackgroundColor: '#cb1b45'
    },
    horizontal: true, // or false (vertical) (default: true)
    min: 0, // minimum value (defualt: 0)
    max: 100, // maximum value (default: 100)
    buttons: [
      // specify init position (required)
      10,
      20,
      30
    ],
  }
});
```

### Example

- `test/fixtures/index.js`
- `example/webpack/index.js`

## LICENSE

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
