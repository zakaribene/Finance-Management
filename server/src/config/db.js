import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  if (env.mongoUri.startsWith('mongodb+srv://')) {
    // Some networks/routers don't answer Node's default DNS resolver for SRV
    // records, which mongodb+srv:// needs to discover the replica set members.
    // Falling back to public resolvers avoids a hard crash on startup.
    dns.setServers([...dns.getServers(), '8.8.8.8', '1.1.1.1']);
  }
  await mongoose.connect(env.mongoUri);
}
