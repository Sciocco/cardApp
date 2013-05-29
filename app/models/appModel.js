define(function(require, exports, module) {

	var appModel = {
		className: "app",
		attributes: {},
		save: function() {

			localStorage[this.className] = JSON.stringify(this.attributes);
			return localStorage[this.className];
		},
		load: function() {
			var result;
			result = localStorage[this.className];
			if (result !== undefined) {
				$.extend(this.attributes, JSON.parse(result));
			}
		},
		setValue: function(key, value) {
			this.attributes[key] = value;
			this.save();
		},
		deleteValue: function(key) {
			delete this.attributes[key];
			this.save();
		},
		getValue: function(key) {
			var value;
			if (key in this.attributes) {
				value = this.attributes[key];
			}
			return value;
		}
	};

	appModel.load();

	module.exports = appModel;
});