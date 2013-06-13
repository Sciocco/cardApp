(function() {
	var app = window.APP;
	app.version = "1.0.1";
	app.resources = {
		sounds: [{
				id: "bgSound",
				src: "sound/M-GameBG.mp3"
			}
		],
		images:[{
			id:"battleBg",
			src:"images/battleBg.png"
		}],
		scripts: ['js/app.js'],
		styles: ['css/app.css']
	};
})();