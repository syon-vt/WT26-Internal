import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all member counts
      // We expect keys like 'member:1', 'member:2', etc.
      // For simplicity, we'll fetch them all in one go if we have a small set
      const counts = {};
      // Get all keys starting with 'member:'
      const keys = await kv.keys('member:*');
      if (keys.length > 0) {
        const values = await kv.mget(keys);
        keys.forEach((key, index) => {
          const id = key.split(':')[1];
          counts[id] = values[index] || 0;
        });
      }
      return res.status(200).json(counts);
    } catch (error) {
      console.error('Leaderboard GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  if (req.method === 'POST') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    try {
      const newCount = await kv.incr(`member:${id}`);
      return res.status(200).json({ id, count: newCount });
    } catch (error) {
      console.error('Leaderboard POST error:', error);
      return res.status(500).json({ error: 'Failed to increment count' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
