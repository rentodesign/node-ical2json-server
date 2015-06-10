(function loop() {
	setTimeout(function() {

		console.log("Running loop...");
		loop();

	}, 5000);
})();
