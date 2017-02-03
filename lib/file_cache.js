'use strict';

const FS = require('fs');
const NodeCache = require('node-cache');

const TTL = 5 * 60; // 5 min

class FileCache {
  constructor (ttl, debug) {
    this.ttl = (ttl >=0 ) ?  ttl : TTL;
    this.cache = new NodeCache({ stdTTL: this.ttl });
    this.debug = debug;

    let debugLogger = (action) => (key, val) => {
      if (!this.debug) return;
      console.log(`CACHE[${action.toUpperCase()}]: ` + (key && val ? `${key} = ${val}` : 'ALL'));
    };

    this.cache.on('set', debugLogger('set'));
    this.cache.on('del', debugLogger('del'));
    this.cache.on('expired', debugLogger('expired'));
    this.cache.on('flush', debugLogger('flush'));
  }

  get (path) {
    let file = this.cache.get(path);
    if (file) {
      return file
    } else {
      return this.refresh(path) || false;
    }
    return file || false;
  }

  refresh (path) {
    let file = false;
    try {
      file = fs.readFileSync(path);
      this.cache.set(path, file)
    } catch (e) {
      console.log(`CACHE ERROR: failed to refresh file: ${path}`);
    }
    return file || false;
  }

  delete (path) {
    this.cache.delete;
  }

  flush() {
    this.cache.flushAll();
  }
}

module.exports = FileCache;
