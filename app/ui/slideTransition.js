define(function(require, exports, module) {

	function slideTransition(oldDiv, currDiv, back) {

		oldDiv.style.display = "block";
		currDiv.style.display = "block";
		var that = this;
		if (back) {
			currDiv.style.zIndex = 2;
			oldDiv.style.zIndex = 1;
			that.css3animate(oldDiv, {
				x: "0%",
				y: "0%",
				complete: function() {
					that.css3animate(oldDiv, {
						x: "100%",
						time: "150ms",
						complete: function() {
							that.finishTransition(oldDiv, currDiv);
						}
					}).link(currDiv, {
						x: "0%",
						time: "150ms"
					});
				}
			}).link(currDiv, {
				x: "-100%",
				y: "0%"
			});
		} else {
			currDiv.style.zIndex = 2;
			oldDiv.style.zIndex = 1;
			that.css3animate(oldDiv, {
				x: "0%",
				y: "0%",
				complete: function() {
					that.css3animate(oldDiv, {
						x: "-100%",
						time: "150ms",
						complete: function() {
							that.finishTransition(oldDiv, currDiv);
						}
					}).link(currDiv, {
						x: "0%",
						time: "150ms"
					});
				}
			}).link(currDiv, {
				x: "100%",
				y: "0%"
			});
		}
	}

	module.exports = slideTransition;
});