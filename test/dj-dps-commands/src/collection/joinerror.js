let JoinImplError = function(message) {
    this.message = message;
    this.name = "Command 'collection join' implementation error";
}
JoinImplError.prototype = Object.create(Error.prototype);
JoinImplError.prototype.constructor = JoinImplError;

module.exports = JoinImplError