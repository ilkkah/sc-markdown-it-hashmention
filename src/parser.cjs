const tagBody = '\\p{L}\\p{M}\\p{N}\\p{Pc}\\p{Pd}';
const tagCharacter = `[${tagBody}.]`;
const tagEnd = `[${tagBody}]`;

function not(group) {
  return '[^' + group.slice(1);
}

function matcher(boundary, body, end) {
  return new RegExp('(?:^|$|' + not(end) + ')((?:' + boundary + ')(?:' + body + ')*(?:' + end + ')+)', 'gu');
}

function split(currentToken, boundary, regex, Token, name) {
  let text = currentToken.content;
  const level = currentToken.level;
  const matches = text.match(regex);

  if (matches === null) return;

  const nodes = [];

  for (let m = 0; m < matches.length; m++) {
    const start = matches[m].search(boundary);
    const tagName = matches[m].slice(start + 1);
    const pos = text.indexOf(matches[m]) + start;

    if (pos > 0) {
      const token = new Token('text', '', 0);
      token.content = text.slice(0, pos);
      token.level = level;
      nodes.push(token);
    }

    const token = new Token(name, '', 0);
    token.content = tagName;
    token.markup = matches[m][start];
    token.level = level;
    nodes.push(token);
    text = text.slice(pos + 1 + tagName.length);
  }

  if (text.length > 0) {
    const token = new Token('text', '', 0);
    token.content = text;
    token.level = level;
    nodes.push(token);
  }

  return nodes;
}

module.exports = function createParser(md, name, boundary) {
  const arrayReplaceAt = md.utils.arrayReplaceAt;
  const regex = matcher(boundary.source, tagCharacter, tagEnd);

  return function parser(state) {
    const blockTokens = state.tokens;
    let tokens;

    for (let j = 0; j < blockTokens.length; j++) {
      if (blockTokens[j].type !== 'inline') continue;

      tokens = blockTokens[j].children;

      for (let i = tokens.length - 1; i >= 0; i--) {
        const currentToken = tokens[i];

        if (currentToken.type === 'link_close') {
          i--;
          while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
            i--;
          }
          continue;
        }

        if (currentToken.type !== 'text') continue;

        const nodes = split(currentToken, boundary, regex, state.Token, name);

        if (nodes) {
          blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
        }
      }
    }
  };
};
