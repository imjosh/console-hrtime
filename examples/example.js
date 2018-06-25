const ConsoleHrTime = require('../');

const timer = new ConsoleHrTime();
const customTimer = new ConsoleHrTime(custLogSeconds); // inject custom logger

const delay = 1500;

timer.start('foo');
timer.start('bar');
customTimer.start('baz');

setTimeout(() => {
  // log current duration, delete the label
  timer.endLog('foo'); // foo: 1.502278893 sec

  // label "foo" no longer exists
  timer.endLog('foo'); // Stopwatch: no such label 'foo'

  // log current duration, keep the label
  timer.log('bar'); // bar: 1.50796409 sec

  // still going
  timer.log('bar'); // bar: 1.50844691 sec

  // return duration in millis, don't delete label
  console.log(timer.read('bar')); // 1503.800535

  // return duration in millis, delete label
  console.log(`It's been ${timer.end('bar')} ms`); // It's been 1503.865914 ms

  // with injected custom logger
  customTimer.log('baz'); // baz --> 1.501894023 seconds

  // override instance's logger (whether there is an injected logger, or just the default logger)
  customTimer.log('baz', custLogUnits); // baz --> 1.5 sec

  /* helper method to convert milliseconds to humane time units,
   * i.e. sec, min, hr, day - depending on the size of the value */
  const precision = 4;
  const { value, units } = timer.msToUnits(customTimer.end('baz'), precision);
  console.log(`It's been ${value} ${units}`); // It's been 1.506 sec

  timer.msToUnits(12.01010101, 5); // {"value":12.0101,"units":"ms"}
  timer.msToUnits(1234.01010101, 2); // {"value":1.23,"units":"sec"}
  timer.msToUnits(123456.01010101, 1); // {"value":2.1,"units":"min"}
  timer.msToUnits(12345678.01010101, 0); // {"value":3,"units":"hr"}
}, delay);

function custLogSeconds(label, duration) {
  console.log(`${label} --> ${duration / 1000} seconds`);
}

function custLogUnits(label, duration) {
  const convert = timer.msToUnits(duration, 1);
  console.log(`${label} --> ${convert.value} ${convert.units}`);
}
