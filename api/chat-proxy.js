// api/chat-proxy.js

export default async function handler(request, response) {
  // 1. 设置CORS头部，允许你的前端域名访问这个代理函数
  // 部署后，将 'http://localhost:5173' 替换为你的Vercel域名，或用通配符 '*'
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  // 2. 处理浏览器发送的 OPTIONS 预检请求 (Preflight Request)
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // 3. 只允许 POST 请求
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 4. 从请求体中获取要转发的数据
    const body = await request.json();

    // 5. 向 iflow.cn 的API发起请求
    const apiResponse = await fetch(
      'https://apis.iflow.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: request.headers.authorization // 重要：转发授权头！
          // 如果 iflow API 需要其他特定的头，也在这里添加
        },
        body: JSON.stringify(body)
      }
    );

    // 6. 检查响应是否成功
    if (!apiResponse.ok) {
      throw new Error(
        `上游API错误: ${apiResponse.status} ${apiResponse.statusText}`
      );
    }

    // 7. 获取响应数据并返回给前端
    const data = await apiResponse.json();
    response.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    response.status(500).json({
      error: '内部服务器错误',
      message: error.message
    });
  }
}
