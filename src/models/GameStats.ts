import mongoose from 'mongoose';

const GameStatsSchema = new mongoose.Schema(
	{
		gameId: {
			type: String,
			required: [true, 'Game ID is required'],
		},
		platform: {
			enum: ['Steam', 'Xbox'],
		},
		playtimeRecent: Number,
		playtimeTotal: Number,
		achievements: [
			{
				name: String,
				completed: Boolean,
				completedTime: Number,
			},
		],
	},
	{ _id: false }
);

GameStatsSchema.index({ gameId: 1, platform: 1 }, { unique: true });

export default (mongoose.models.GameStats as mongoose.Model<GameStats>) ||
	mongoose.model('GameStats', GameStatsSchema);
