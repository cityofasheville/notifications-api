import  { LRUCache } from 'lru-cache';
const options = {
  max: 1024 * 250,
  sizeCalculation: (value, key) => {
    return 1
  },
  ttl: 1000 * 60 * 5,
  maxSize: 5000,
  allowStale: false,
};

const cache_client = new LRUCache(options);

export default cache_client;