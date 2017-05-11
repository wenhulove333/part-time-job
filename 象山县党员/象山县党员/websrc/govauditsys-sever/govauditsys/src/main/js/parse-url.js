module.exports = function parseUrl(url) {
	var url = url;
	var urlParse = new Object();
	urlParse['params'] = {};
	var questionPos = url.indexOf("?");
	if (questionPos != -1) {
		urlParse.pureUrl = url.substr(0, questionPos);
		var urlParams = url.substr(questionPos + 1);
		var strs = urlParams.split("&");
		for(var i = 0; i < strs.length; i ++) {
			urlParse['params'][strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
	    }
	}
	
	urlParse.toUrl = function() {
		var url = urlParse.pureUrl;
		var params = '';
		
		for (var key in urlParse['params']) { 
			params = params + key + '=' + escape(urlParse['params'][key]) + '&';
		}
		if (params !== '') {
			url = url + '?' + params;
		}
		
		return url;
	};
	
	urlParse.changeParam = function(key, value) {
		urlParse['params'][key] = value;
	}
	
	urlParse.getParam = function(key) {
		return urlParse['params'][key];
	}
	
	return urlParse;
};
