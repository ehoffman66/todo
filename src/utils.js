
export function linkify(inputText) {
    let replacedText, replacePattern1, replacePattern2;

    // URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, (match, url) => {
       let displayText = url.replace(/^https?:\/\//, ''); // Remove "http://" or "https://" from the start of the URL
       displayText = displayText.replace(/\/$/, ''); // Remove trailing slash
       displayText = displayText.length > 40 ? displayText.substr(0, 40) + '...' : displayText;
       return '<a href="' + url + '" target="_blank" style="text-decoration: underline;">' + displayText + '</a>';
    });

    // URLs starting with "www." (without // before it).
    replacePattern2 = /(^|[^/])(www.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, (match, p1, p2) => {
       let displayText = p2.replace(/^www\./, ''); // Remove "www." from the start of the URL
       displayText = displayText.replace(/\/$/, ''); // Remove trailing slash
       displayText = displayText.length > 40 ? displayText.substr(0, 40) + '...' : displayText;
       return p1 + '<a href="http://' + p2 + '" target="_blank" style="text-decoration: underline;">' + displayText + '</a>';
    });

    return replacedText;
 }