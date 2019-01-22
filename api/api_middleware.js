

const middlewares = [
  function sample(req, res, next) {
    // You can insert middleware code here, or just delete this function.
    next();
  },
];

module.exports = middlewares;
