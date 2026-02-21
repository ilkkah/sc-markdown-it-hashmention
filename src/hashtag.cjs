import parser from './parser';

var intRegex = /^\d+$/;
var taskAndProjectRegex = /^([a-z][a-z0-9-]*)_(\d+)$/;

function flowdockHashtag(tokens, idx) {
  var tag = tokens[idx].content;
  var markup = tokens[idx].markup;
  var result = '<a ';
  if (flowdockHashtag.options && (flowdockHashtag.options.href_channel || flowdockHashtag.options.href_task)) {
    if (intRegex.test(tag) && tag !== '0' && flowdockHashtag.options.pid) {
      result += 'class="task" data-tasknum="' + tag + '" data-taskpid="' + flowdockHashtag.options.pid + '"';
    }
    else if (intRegex.test(tag) && tag !== '0') {
      result += 'class="ticket" data-ticketnum="' + tag + '"';
    }
    else if (taskAndProjectRegex.test(tag)) {
      result += 'class="task" data-task="' + tag + '"';
    } else {
      result += 'class="tag" href="' + flowdockHashtag.options.href_channel + encodeURIComponent('#' + tag) + '"';
    }
  }
  result += '>' + markup + tag + '</a>';

  return result;
}

export default function (md, options) {
  const split = "#|＃";
  const hashtag = parser(md, 'hashtag', new RegExp(split));
  md.core.ruler.push('hashtag', hashtag);
  flowdockHashtag.options = options && options.hashtags;
  md.renderer.rules.hashtag = flowdockHashtag;
};
