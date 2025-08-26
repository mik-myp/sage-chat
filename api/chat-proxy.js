// api/chat-proxy.js

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 直接使用req.body，Vercel会自动解析JSON请求体
    const { body, headers } = req;

    // 转发请求到iflow API
    const apiResponse = await fetch(
      'https://apis.iflow.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: headers.authorization || ''
        },
        body: JSON.stringify(body)
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`API响应错误: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({
      error: '内部服务器错误',
      message: error.message
    });
  }
}
