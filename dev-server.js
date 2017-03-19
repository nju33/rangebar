const browserSync = require('browser-sync');
const config = require('./bs-config');

const bs = browserSync.create();
bs.init(config);
