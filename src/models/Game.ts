import mongoose from 'mongoose'

const GameSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: [true, 'Game ID is required'],
		},
		name: {
			type: String,
			required: [true, 'Game name is required'],
		},
		platform: {
			enum: ['Steam', 'Xbox', 'Switch'],
		},
		playtimeRecent: Number,
		playtimeTotal: Number,
		timeLastPlayed: Date,
		achievements: [
			{
				id: String,
				name: String,
				description: String,
				completed: Boolean,
				completedTime: Number,
				globalCompleted: Number,
			},
		],
	},
	{ _id: false },
)

GameSchema.index({ id: 1, platform: 1 }, { unique: true })

export default (mongoose.models.Game as mongoose.Model<Game>) || mongoose.model('Game', GameSchema)
