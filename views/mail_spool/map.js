function (doc) {
  if (doc.type == 'mail' && doc.status == 'spool') {
    emit(null, null);
  }
}
