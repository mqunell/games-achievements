import mongoose from 'mongoose';

const GameStatsSchema = new mongoose.Schema({
	gameId: {
		type: String,
		required: [true, 'Game ID is required'],
	},
	platform: {
		enum: ['Steam', 'Xbox'],
		required: [true, 'Platform is required'],
	},
	playtimeRecent: Number,
	playtimeTotal: Number,
	completedAchievements: [String],
});

export default (mongoose.models.GameStats as mongoose.Model<GameStats>) ||
	mongoose.model('GameStats', GameStatsSchema);
