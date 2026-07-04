const parser = require('./parser.cjs');

function flowdockMention(tokens, idx) {
  const tag = tokens[idx].content;
  const markup = tokens[idx].markup;
  const options = flowdockMention.options || {};
  const users = options.users || [];
  const groups = options.groups || [];
  const isUserMention = users.includes(tag);
  const isGroupMention = groups.includes(tag);

  if (!flowdockMention.options) {
    return '<a class="mention">' + markup + tag + '</a>';
  }

  if (isUserMention) {
    let result = '<a data-user="' + tag + '" class="mention mention-user"';
    if (options.href) {
      result += ' href="' + options.href + encodeURIComponent(tag) + '"';
    }
    result += '>' + markup + tag + '</a>';
    return result;
  }

  if (isGroupMention) {
    let result = '<span data-group="' + tag + '" class="mention mention-group"';
    result += '>' + markup + tag + '</span>';
    return result;
  }

  return markup + tag;
}

module.exports = function mention(md, options) {
  const split = '@|＠';
  const mentionParser = parser(md, 'mention', new RegExp(split));
  md.core.ruler.push('mention', mentionParser);
  flowdockMention.options = options && options.mentions;
  md.renderer.rules.mention = flowdockMention;
};
