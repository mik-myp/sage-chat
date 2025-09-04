import chatCompletionHandler from '../src/handlers/chatCompletion.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return chatCompletionHandler(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
