const mongoose = require('mongoose');
const env = require('dotenv').config();
const Trip = require('./schema.js');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

module.exports = function() {
	return {
		async getAll() {
			try {
				let results = await Trip.find();
				return {
					status: 200,
					data: results
				};
			} catch (err) {
				return {
					status: 500,
					data: { message: 'error' }
				};
			}
		},
		async getOne(id) {
			try {
				let result = await Trip.findById(id);
				if (result != '') {
					return {
						status: 200,
						data: result
					};
				} else return;
			} catch (error) {
				return {
					status: 404,
					data: { message: 'Invalid id' }
				};
			}
		},
		async postTrip(data) {
			console.log(data);
			let trip = new Trip({
				Destination: data.Destination,
				Date: data.Date,
				Duration: data.Duration,
				WayOfTravel: data.WayOfTravel
			});
			try {
				let newTrip = await trip.save();
				return {
					status: 201,
					data: newTrip
				};
			} catch (err) {
				return {
					status: 500,
					data: { message: 'error' }
				};
			}
		},
		async deleteMany() {
			try {
				await Trip.deleteMany();
				return {
					status: 200,
					data: { message: 'deleted whole colection' }
				};
			} catch (error) {
				return {
					status: 500,
					data: { message: 'error' }
				};
			}
		},
		async deleteOne(id) {
			try {
				let valid = await Trip.findById(id);
				if (valid == null)
					return {
						status: 404,
						data: { message: 'invalid id' }
					};
				await Trip.findByIdAndDelete(id, (err, doc) => {
					console.log(err);
				});
				return {
					status: 200,
					data: { message: 'removed' }
				};
			} catch (error) {
				console.log(error);
				return {
					status: 500,
					data: { message: 'error' }
				};
			}
		},
		async modifyMany(data) {
			try {
				await Trip.updateMany(
					{},
					{
						$set: {
							Destination: data.Destination,
							Date: data.Date,
							Duration: data.Duration,
							WayOfTravel: data.WayOfTravel
						}
					},
					{
						multi: true,
						upsert: true
					}
				);
				return {
					status: 200,
					data: { message: 'modified whole colection' }
				};
			} catch (err) {
				return {
					status: 500,
					data: { message: error }
				};
			}
		},
		async ModifyOne(data, id) {
			try {
				let valid = await Trip.findById(id);
				if (valid == null)
					return {
						status: 404,
						data: { message: 'invalid id' }
					};
				await Trip.updateOne(
					{ _id: id },
					{
						$set: {
							Destination: data.Destination,
							Date: data.Date,
							Duration: data.Duration,
							WayOfTravel: data.WayOfTravel
						}
					}
				);
				return {
					status: 200,
					data: { message: 'modified' }
				};
			} catch (err) {
				return {
					status: 500,
					data: { message: error }
				};
			}
		}
	};
};
