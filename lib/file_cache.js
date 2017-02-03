'use strict';

const FS = require('fs');

class FileCache {
  constructor () {
    this._cache = {};
  }

  get (path) {
    return this._cache[path] || this.refresh(path)
  }

  refresh (path) {
    try {
      this._cache[path] = fs.readFileSync(path);
    } catch (e) {
      console.log(`CACHE ERROR: failed to refresh file: ${path}`)
    }
    return this._cache[path];
  }

  invalidate(path) {
    delete this._cache[path];
  }

  flush() {
    let keys = Object.key(this._cache);
    for (let key of keys) delete this._cache[key];
  }
}

module.exports = Cache;
