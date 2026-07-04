const hashtag = require('./hashtag.cjs');
const mention = require('./mention.cjs');

module.exports = function hashmention(md, options) {
  hashtag(md, options);
  mention(md, options);
};
