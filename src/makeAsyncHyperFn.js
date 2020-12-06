module.exports = function makeAsyncHyperFn(name, drive) {
  return function (...args) {
    return new Promise((done, fail) =>
      drive[name](...args, (err, dat) => (err ? fail(err) : done(dat)))
    );
  };
};
