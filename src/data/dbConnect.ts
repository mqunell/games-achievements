import mongoose from 'mongoose';
import 'dotenv/config'; // Only necessary for tsx

const MONGODB_URI: string | any = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error('MONGODB_URI missing in .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
	cached = (global as any).mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
};

export default dbConnect;
