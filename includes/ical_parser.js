var fs        = require('fs');
var request   = require('request');
var ical2json = require("ical2json");

function loop(icalURL) {

	request.get({url: icalURL, encoding: 'binary'}, function (err, response, body) {

		fs.writeFile("calendar.ics", body, 'binary', function(err) {
			if(err) {
				console.log(err);
			} else {

				console.log("Saved calendar.ics file!");
				// File saved, continue with logic

				fs.readFile("calendar.ics", function(error, buffer) {

					var output, sortedOutput;

					if (error != null) {
						throw new Error(error);
					}
					output = ical2json.convert(buffer.toString());

					// sort events by date
					sortedOutput = output["VEVENT"];
					sortedOutput.sort(function(a,b) { return parseFloat(a["DTSTART;VALUE=DATE"]) - parseFloat(b["DTSTART;VALUE=DATE"]) } );

					fs.writeFile("calendar.json", JSON.stringify(sortedOutput, null, "  "), function(err) {
						if(err) {
							console.log(err);
						} else {
							console.log("Saved calendar.json file!");
						}
					});
				});

			}

		});
	});

	setTimeout(function() {

		console.log("Sleeping 10 min...");
		loop();

	}, 600000);
}

function findIndexOfLatest(array,date) {
	var indexOfLatest;
	for (var i = 0; i < array.length; i++) {
		if (
		array[i]["DTSTART;VALUE=DATE"] < date
		)
		{
			indexOfLatest = i;
		}
	}
	return indexOfLatest+1;
}

module.exports = loop;
