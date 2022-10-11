import mongoose from 'mongoose';

const GameMetaSchema = new mongoose.Schema(
	{
		gameId: {
			type: String,
			required: [true, 'Game ID is required'],
			unique: true,
		},
		name: {
			type: String,
			required: [true, 'Game name is required'],
			unique: true,
		},
		achievements: [
			{
				name: String,
				apiName: String,
				description: String,
				globalCompleted: Number,
			},
		],
	},
	{ _id: false }
);

export default (mongoose.models.GameMeta as mongoose.Model<GameMeta>) ||
	mongoose.model('GameMeta', GameMetaSchema);
