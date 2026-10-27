import mongoose from 'mongoose';

let connectionPromise = null;

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 10000 })
    .then((conn) => {
      console.log(`[KAAMMAP] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    })
    .catch((err) => {
      connectionPromise = null;
      // Never log the URI (it contains credentials).
      console.error(`[KAAMMAP] MongoDB connection failed: ${err.message}`);
      throw err;
    });

  return connectionPromise;
}

export async function disconnectDB() {
  connectionPromise = null;
  await mongoose.disconnect();
}

export function dbStatus() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
}
