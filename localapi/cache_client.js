import { LRUCache } from 'lru-cache'
const defaultOptions = {
  max: 500,
  sizeCalculation: (value, key) => {
    return 1
  },
  ttl: 1000 * 60 * 5,
  maxSize: 5000,
  allowStale: false,
};

class CacheClient {
  constructor(options = null) {
    this.cache = new LRUCache(options || defaultOptions);
  }

  store(key, value, hours) {
    this.cache.set(key, value);
    return Promise.resolve('OK');
  }

  get(key) {
    return Promise.resolve(this.cache.get(key));
  }

  del(key) {
    this.cache.clear();
    return Promise.resolve('OK');
  }
}

const cache_client = new CacheClient(defaultOptions);

export default cache_client;