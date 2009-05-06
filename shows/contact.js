function (doc, req) {
  // !json templates
  // !code lib/helpers/couchapp.js
  // !code lib/helpers/ejs.js
  var template = templates.head + templates.contact + templates.tail;
  return {
    headers: {'Content-Type': 'text/html; charset=utf-8'},
    body: new EJS({text: template}).render({
      title: 'Contact Us',
      assets: assetPath()
    })
  };
}
