const parser = require('./parser.cjs');

const intRegex = /^\d+$/;
const taskAndProjectRegex = /^([a-z][a-z0-9-]*)_(\d+)$/;

function flowdockHashtag(tokens, idx) {
  const tag = tokens[idx].content;
  const markup = tokens[idx].markup;
  let result = '<a ';
  if (flowdockHashtag.options && (flowdockHashtag.options.href_channel || flowdockHashtag.options.href_task)) {
    if (intRegex.test(tag) && tag !== '0' && flowdockHashtag.options.pid) {
      result += 'class="task" data-tasknum="' + tag + '" data-taskpid="' + flowdockHashtag.options.pid + '"';
    } else if (intRegex.test(tag) && tag !== '0') {
      result += 'class="ticket" data-ticketnum="' + tag + '"';
    } else if (taskAndProjectRegex.test(tag)) {
      result += 'class="task" data-task="' + tag + '"';
    } else {
      result += 'class="tag" href="' + flowdockHashtag.options.href_channel + encodeURIComponent('#' + tag) + '"';
    }
  } else {
    result += 'class="tag"';
  }
  result += '>' + markup + tag + '</a>';

  return result;
}

module.exports = function hashtag(md, options) {
  const split = '#|＃';
  const hashtagParser = parser(md, 'hashtag', new RegExp(split));
  md.core.ruler.push('hashtag', hashtagParser);
  flowdockHashtag.options = options && options.hashtags;
  md.renderer.rules.hashtag = flowdockHashtag;
};
