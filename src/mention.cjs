import parser from './parser';

function flowdockMention(tokens, idx) {
  var tag = tokens[idx].content;
  var markup = tokens[idx].markup;
  const isUserMention = flowdockMention.options.users && flowdockMention.options.users.includes(tag);
  const isGroupMention = flowdockMention.options.groups && flowdockMention.options.groups.includes(tag);

  if (isUserMention) {
    var result = '<a data-user="' + tag + '" class="mention mention-user"';
    if (flowdockMention.options && flowdockMention.options.href) {
      result += ' href="' + flowdockMention.options.href + encodeURIComponent(tag) + '"';
    }
    result += '>' + markup + tag + '</a>';
    return result;
  } else if (isGroupMention) {
    var result = '<span data-group="' + tag + '" class="mention mention-group"';
    result += '>' + markup + tag + '</span>';
    return result;
  } else {
    return markup + tag;
  }
}

export default function (md, options) {
  const split = "@|＠";
  const mention = parser(md, 'mention', new RegExp(split));
  md.core.ruler.push('mention', mention);
  flowdockMention.options = options && options.mentions;
  md.renderer.rules.mention = flowdockMention;
};
