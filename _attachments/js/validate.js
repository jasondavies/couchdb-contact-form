function validate(doc) {
  if (doc.type == 'mail') {
    var allowed_fields = {
      _id: /.*/,
      _rev: /.*/,
      _revisions: /.*/,
      status: /^(spool|processing|sent)$/,
      from: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      from_name: /^[A-Z0-9.\- ]+$/i,
      text: /.*/,
      type: /mail/
    };
    for (var field in doc) {
      if (allowed_fields[field] == undefined) {
        throw {forbidden: "Invalid field detected: " + field};
      }
      if (!allowed_fields[field].test(doc[field])) {
        throw {forbidden: "Invalid field value detected for: " + field};
      }
    }
    for (var field in allowed_fields) {
      if (doc[field] == undefined) {
        throw {forbidden: "Missing field detected: " + field};
      }
    }
  }
}
