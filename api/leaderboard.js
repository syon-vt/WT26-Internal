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
      const counts = {};
      const keys = await client.keys('member_matches:*');
      if (keys.length > 0) {
        for (const key of keys) {
          const id = key.split(':')[1];
          const members = await client.sMembers(key);
          counts[id] = members || [];
        }
      }
      return res.status(200).json(counts);
    }

    if (req.method === 'POST') {
      const { id, userName, sessionId } = req.body;
      if (!id || !userName) {
        return res.status(400).json({ error: 'ID and userName are required' });
      }
      // Attach a hidden sessionId so two users picking the name "John" count as 2 distinct matches
      const uniqueEntry = sessionId ? `${userName}::${sessionId}` : userName;
      await client.sAdd(`member_matches:${id}`, uniqueEntry);
      const members = await client.sMembers(`member_matches:${id}`);
      return res.status(200).json({ id, count: members.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

