module.exports = {
  center: function (arr) {
	var minX= 1500, maxX= -1500, minY= 1500, maxY= -1500; //initializing seems to fix a weird bug
    for (var i = 0; i < arr.length; i++) {
		//console.log("loop n: ", i + 1);
        var x = arr[i][0], y = arr[i][1];
		//console.log("x: ", x);
		//console.log("y: ", y);
        minX = (x < minX || minX == null) ? x : minX;
		minY = (y < minY || minY == null) ? y : minY;
        maxX = (x > maxX || maxX == null) ? x : maxX;
        maxY = (y > maxY || maxY == null) ? y : maxY;
		//console.log("minX: ", minX);
		//console.log("maxX: ", maxX);
		//console.log("minY: ", minY);
		//console.log("maxY: ", maxY);
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  },


  linkify: function (inputText) {
	var replacedText, replacePattern1, replacePattern2, replacePattern3;

    // http://, https://, ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    return replacedText;
  }
};
