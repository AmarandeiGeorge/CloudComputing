const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	Destination: String,
	Date: Date,
	Duration: Number,
	WayOfTravel: String
});

module.exports = mongoose.model('Trips', Schema);
