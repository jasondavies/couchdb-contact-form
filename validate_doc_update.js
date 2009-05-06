function (newDoc, oldDoc, userCtx) {
  // !code _attachments/js/validate.js
  if (userCtx.roles.indexOf('_admin') != -1) {
    return;
  }
  if (oldDoc == null) {
    return validate(newDoc);
  }
  throw {forbidden: "Invalid operation: existing messages cannot be modified."};
}
