/* High-res replacement for console.time */

function Stopwatch(customLogger) {
  if (typeof customLogger !== 'undefined' && typeof customLogger !== 'function') {
    throw new Error('customLogger must be a function or undefined');
  }

  const _global = (typeof global === 'object') ? global : window;
  const { timeSrc, timeDiff } = getTimeFunctions();

  const self = this;
  self.logger = customLogger || defaultLogger;

  const labels = new Map();

  function read(label, keep) {
    const labelTime = labels.get(label);
    if (!labelTime) {
      console.warn(`Stopwatch: no such label '${label}'`);
      return undefined;
    }
    const diff = timeDiff(labelTime);
    if (!keep) {
      labels.delete(label);
    }
    return diff;
  }

  function log(label, _logger, keep) {
    const duration = read(label, keep);
    const myLogger = (typeof _logger === 'function')
      ? _logger
      : self.logger;
    myLogger(label, duration);
  }

  function defaultLogger(label, duration) {
    if (!duration) {
      return;
    }
    const convert = msToUnits(duration);
    console.log(`${label}: ${convert.value} ${convert.units}`);
  }

  function getTimeFunctions() {
    if (typeof process === 'object' && typeof process.hrtime === 'function') {
      return {
        timeDiff: hrDiff,
        timeSrc: process.hrtime.bind(process),
      };
    }

    if (typeof performance === 'object' && typeof performance.now === 'function') {
      return {
        timeDiff: stdDiff,
        timeSrc: performance.now.bind(performance),
      };
    }

    return {
      timeDiff: stdDiff,
      timeSrc: Date.now.bind(_global),
    };
  }

  function stdDiff(initTime) {
    return timeSrc() - initTime;
  }

  function hrDiff(initTime) {
    const elapsed = process.hrtime(initTime);
    return (elapsed[0] * 1e3) + (elapsed[1] / 1e6);
  }

  function msToUnits(millis, precision) {
    let units;
    let value;
    if (millis < 1000) {
      units = 'ms';
      value = millis;
    } else if (millis < 6e4) {
      units = 'sec';
      value = millis / 1000;
    } else if (millis < 3.6e6) {
      units = 'min';
      value = millis / 6e4;
    } else {
      units = 'hr';
      value = millis / 3.6e6;
    }
    if (typeof precision !== 'undefined') {
      value = precisionRound();
    }

    return { value, units };

    function precisionRound() {
      const _precision = precision;
      if (_precision === 0) {
        return Number(value.toFixed(0));
      }
      const factor = Math.pow(10, _precision); // eslint-disable-line no-restricted-properties
      return Math.round(value * factor) / factor;
    }
  }

  return {
    // start timer with label
    start: label => labels.set(label, timeSrc()),

    // return time in ms, destroy timer
    end: label => read(label, false),

    // return time in ms, keep timer running
    read: label => read(label, true),

    // log time, keep timer running
    log: (label, logger) => {
      log(label, logger, true);
    },

    // log time, destroy timer
    endLog: (label, logger) => {
      log(label, logger, false);
    },

    // humane time unit conversion utility
    msToUnits,
  };
}

if (typeof module !== 'undefined') {
  module.exports = Stopwatch;
}
