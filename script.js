(function(){
	var app = {
		init: function(){
			console.log("appinit");
			var game = new Phaser.Game(900, 600, Phaser.AUTO, "#app");
		},

	}
	$(document).ready(function(){
		app.init();
	})

})();