# console-hrtime

High-res replacement for console.time() for Node.js and browsers:

```js
const ConsoleHrTime = require('console-hrtime');
const timer = new ConsoleHrTime(optionalLoggerFn);

timer.start('foo');
timer.start('bar');
setTimeout(() => {
  timer.endLog('foo'); // foo: 1.00796409 sec
  const ms = timer.end('bar'); // ms ~= 1007.96409
}, 1000)
```

## API

### `timer.start(label)`

Begin measuring interval.

### `timer.end(label)`

End the interval. Returns the elapsed time in milliseconds.

### `timer.read(label)`

Returns the elapsed time in milliseconds.

### `timer.log(label, optionalLoggerFn)`

Logs the elapsed time. The default logger outputs the elapsed time scaled to humane units (i.e. ms, sec, min, or hr depending on the size of the value) via `timer.msToUnits` (see below) . You can inject a custom logger function at instantiation, or you can override the instance's logger by passing a logger function to this method.

### `timer.endLog(label, optionalLoggerFn)`

End the interval. Calls timer.log()

### `timer.msToUnits(ms, precision)`

Utility method, returns an object: `{ value, units }` where `value` is the number of milliseconds (`ms`) scaled to `units` at a given `precision`

```
timer.msToUnits(12.01010101, 5); // {"value":12.0101,"units":"ms"}
timer.msToUnits(1234.01010101, 2); // {"value":1.23,"units":"sec"}
timer.msToUnits(123456.01010101, 1); // {"value":2.1,"units":"min"}
timer.msToUnits(12345678.01010101, 0); // {"value":3,"units":"hr"}
```

### Custom logger function example

```js
const ConsoleHrTime = require('console-hrtime');
const timer = new ConsoleHrTime(myLogger);

timer.start('foo');

setTimeout(() => {
  timer.endLog('foo'); // foo --> 1 sec
}, 1000)

function myLogger(label, duration) {
  // your code here,  e.g.
  const convert = timer.msToUnits(duration, 1);
  console.log(`${label} --> ${convert.value} ${convert.units}`);
}
```

## Time Sources

This library automatically uses the highest resolution time source available in a given environment:

### [Node.js: `process.hrtime`](https://nodejs.org/api/process.html)

### [Browsers: `performance.now`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

### [Legacy: `Date.now`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now)

## Examples

Examples can be found [here](examples/example.js)