import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all active sessions
      const keys = await kv.keys('session:*');
      let sessions = [];
      
      if (keys.length > 0) {
        const values = await kv.mget(keys);
        sessions = keys.map((key, index) => ({
          id: key.replace('session:', ''),
          progress: values[index] || 0,
          lastSeen: new Date().toISOString() // KV keys are live, so we assume they're recently updated
        }));
      }
      
      return res.status(200).json({
        totalActive: sessions.length,
        sessions: sessions
      });
    } catch (error) {
      console.error('Live GET error:', error);
      return res.status(500).json({ error: 'Failed to fetch active sessions' });
    }
  }

  if (req.method === 'POST') {
    const { sessionId, progress } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    try {
      // Store progress with a 1-hour expiration
      await kv.set(`session:${sessionId}`, progress, { ex: 3600 });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Live POST error:', error);
      return res.status(500).json({ error: 'Failed to update live progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
