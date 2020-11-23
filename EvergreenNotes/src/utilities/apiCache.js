import CacheModule from 'cache-service-cache-module';
import SuperagentCache from 'superagent-cache-plugin';

var cache = new CacheModule({
   storage: 'session',
   defaultExpiration: 30,
});

export var superagentCache = SuperagentCache(cache);
// Require superagent-cache-plugin and pass your cache module
export default superagentCache;

export const flushCache = () => {
   cache.flush();
};

//tsc --out foo.js --declaration B.d.ts A.ts
