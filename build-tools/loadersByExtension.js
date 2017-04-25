function extsToRegExp(exts) {
	return new RegExp("\\.(" + exts.map(function(ext) {
		return ext.replace(/\./g, "\\.");
	}).join("|") + ")(\\?.*)?$");
}

module.exports = function loadersByExtension(obj) {
	var loaders = [];
	Object.keys(obj).forEach(function(key) {
		var exts = key.split("|");
		var value = obj[key];
		var entry = {
			extensions: exts,
			test: extsToRegExp(exts)
		};
		if(Array.isArray(value)) {
			entry.loaders = value;
		} else if(typeof value === "string") {
			entry.loader = value;
		} else {
			Object.keys(value).forEach(function(valueKey) {
				entry[valueKey] = value[valueKey];
			});
		}
		loaders.push(entry);
	});
	return loaders;
};
