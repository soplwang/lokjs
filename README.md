lok.js, Utilities for callback hell.
====

Usage:

```
npm i lokjs
```

The first utility `then`, that combines stand-alone error and success continuations into node.js style callback:

```javascript
const then = require('lokjs').then;

redis.get('key', then(err, data => console.log(data)));
redis.get('key2', then(err, data => console.log(data)));
redis.get('key3', then(err, data => console.log(data)));

function err(e) {
  console.error(e);
}
```

The `promisee`, adapt promise with callback paradigm, Desiged intentional works with `co`:

```javascript
const promisee = require('lokjs').promisee;
const co = require('co');

co(function* () {
  var tickets = promisee(), tr = promisee(), coins = promisee(), likes = promisee();
  redis.get('t:1', tickets);
  if ((yield tickets) - 100 >= 0) {
    redis.decr('t:1', 100, tr);
  }
  redis.mget(['c:1', 'c2:1'], coins);
  redis.incr('l:1', 1, likes);
  console.log((yield tr), (yield coins)[0]);
  return (yield tr);
});
```

It just works without `co` like plain old `Promise` too:

```javascript
var r = promisee(), r2 = promisee();

redis.get('r:1', r);
redis.get('r:1', r2);

r2.catch(e => {});

Promise.all(r, r2).then(values => {
  ...
}).catch(e => {
  ...
});
```

LICENSE: MIT
