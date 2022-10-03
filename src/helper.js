const respond = (res, statusCode, contentType, content) => {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.write(content);
  res.end();
};

const respondMeta = (res, statusCode, contentType) => {
  res.writeHead(statusCode, { 'Content-Type': contentType });
  res.end();
};

const respondJson = (res, statusCode, obj) => {
  respond(res, statusCode, 'application/json', JSON.stringify(obj));
};

const respondJsonMeta = (res, statusCode) => {
  respondMeta(res, statusCode, 'application/json');
};

module.exports = {
  respond,
  respondMeta,
  respondJson,
  respondJsonMeta,
};
