const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: 'mongodb://test:test@ds143342.mlab.com:43342/todolist',
    secret:crypto,
    db:'mean-angular-2'
}