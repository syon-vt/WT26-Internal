import { createClient } from 'redis';

let redisClient;
async function getClient() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on('error', err => console.error('Redis Client Error:', err));
    await redisClient.connect();
  }
  return redisClient;
}

export default async function handler(req, res) {
  try {
    const client = await getClient();

    if (req.method === 'GET') {
      const keys = await client.keys('user_session:*');
      let sessions = [];
      
      if (keys.length > 0) {
        const values = await client.mGet(keys);
        sessions = keys.map((key, index) => {
          let data = { name: "Unknown", progress: 0, submitted: false };
          try {
            data = JSON.parse(values[index]);
          } catch(e) {
            data.progress = parseInt(values[index], 10) || 0;
          }
          return {
            id: key.replace('user_session:', ''),
            name: data.name,
            progress: data.progress,
            submitted: data.submitted || false,
            lastSeen: new Date().toISOString()
          };
        });
      }
      
      return res.status(200).json({
        totalActive: sessions.length,
        sessions: sessions
      });
    }

    if (req.method === 'POST') {
      const { sessionId, userName, progress, submitted } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      await client.set(
        `user_session:${sessionId}`, 
        JSON.stringify({ name: userName || "Unknown", progress, submitted: !!submitted }), 
        { EX: 3600 }
      );
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      if (req.query.wipe === 'all') {
        await client.flushAll(); // Completely wipes the entire Redis DB
        return res.status(200).json({ success: true, wiped: true });
      }
      
      const keys = await client.keys('user_session:*');
      if (keys.length > 0) {
        await client.del(keys); // Deletes all tracked active users in one go
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Live API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

