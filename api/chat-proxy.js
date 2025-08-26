// api/chat-proxy.js

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 调试信息 - 查看实际收到的请求内容
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Request body type:', typeof req.body);

    let requestBody = req.body;
    let contentType = 'application/json';

    // 检查是否是FormData或特殊格式
    if (
      req.headers['content-type']?.includes('multipart/form-data') ||
      req.headers['content-type']?.includes(
        'application/x-www-form-urlencoded'
      ) ||
      (typeof req.body === 'string' && req.body.startsWith('data:'))
    ) {
      // 对于FormData或特殊格式，我们需要特殊处理
      // 但iflow.cn API可能只接受JSON，所以我们需要转换或直接转发原始数据
      contentType = req.headers['content-type'];

      // 如果是data:格式，可能需要提取实际数据
      if (typeof req.body === 'string' && req.body.startsWith('data:')) {
        // 提取base64数据部分
        const base64Data = req.body.split(',')[1];
        if (base64Data) {
          requestBody = Buffer.from(base64Data, 'base64').toString('utf8');
          try {
            // 尝试解析为JSON
            requestBody = JSON.parse(requestBody);
            contentType = 'application/json';
          } catch (e) {
            // 如果不是JSON，保持原样
            console.log('Body is not JSON, keeping as string');
          }
        }
      }
    }

    // 准备转发到iflow.cn的请求头
    const headers = {
      'Content-Type': contentType
    };

    // 转发Authorization头
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    // 准备请求体
    let requestBodyToSend = requestBody;
    if (contentType === 'application/json' && typeof requestBody !== 'string') {
      requestBodyToSend = JSON.stringify(requestBody);
    }

    console.log('Forwarding to iflow with Content-Type:', contentType);

    // 向iflow.cn发起请求
    const apiResponse = await fetch(
      'https://apis.iflow.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: headers,
        body: requestBodyToSend
      }
    );

    // 处理响应
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('iflow API错误:', apiResponse.status, errorText);
      return res.status(apiResponse.status).json({
        error: `iflow API错误: ${apiResponse.status}`,
        details: errorText
      });
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('代理错误:', error);
    res.status(500).json({
      error: '内部服务器错误',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
