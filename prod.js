const helmet = require('helmet');
const comp = require('compression');
const compression = require('compression');
module.exports = function (app) {
     app.use(helmet());
     app.use(compression());
 }
