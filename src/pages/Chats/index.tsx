import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Bubble from './components/Bubble';
import { CircleArrowUp, UserRound } from 'lucide-react';
import { useChatsStore, useGlobalStore } from '../../store';

const Chats = () => {
  const { id } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { aiModel } = useGlobalStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { role: string; content: string; thinkingContent?: string }[]
  >([]);
  const { chats, updateChat } = useChatsStore();
  const [isStreaming, setIsStreaming] = useState(false);

  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResize();
  }, []);

  const handleSubmit = async () => {
    if (!input || isStreaming) return;
    // 提交逻辑待实现
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    handleResize();
    let response: Response | undefined;
    console.log(import.meta.env);

    try {
      const apiBaseUrl = import.meta.env.DEV
        ? '/api/v1/chat/completions'
        : '/api/chat-proxy';
      response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer sk-309b4b83d4a2863f38446b817d0d761a',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [...messages, { role: 'user', content: input }],
          stream: true
        })
      });
      if (!response || !response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response?.status || 'unknown'}`);
      }

      // 添加空的系统消息用于流式响应
      setMessages((prev) => [...prev, { role: 'system', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer) {
            processLine(buffer);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          processLine(line.trim());
        }
      }

      function processLine(line: string) {
        if (line === '') return;

        if (line.startsWith('data:')) {
          const data = line.slice('data:'.length).trim();
          if (data === '[DONE]') return;

          try {
            const json = JSON.parse(data);
            const contentDelta = json.choices?.[0]?.delta?.content;
            const thinkingDelta = json.choices?.[0]?.delta?.reasoning_content;

            if (thinkingDelta) {
              setMessages((prev) => {
                const lastIndex = prev.length - 1;
                const updatedMessages = [...prev];
                updatedMessages[lastIndex] = {
                  ...updatedMessages[lastIndex],
                  thinkingContent:
                    (updatedMessages[lastIndex].thinkingContent || '') +
                    thinkingDelta
                };
                return updatedMessages;
              });
            }

            if (contentDelta) {
              setMessages((prev) => {
                const lastIndex = prev.length - 1;
                const updatedMessages = [...prev];
                updatedMessages[lastIndex] = {
                  ...updatedMessages[lastIndex],
                  content: updatedMessages[lastIndex].content + contentDelta
                };
                return updatedMessages;
              });
            }
          } catch (parseError) {
            console.error(
              'Error parsing stream chunk:',
              parseError,
              'Data:',
              data
            );
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorText =
        (response && (await response.text().catch(() => 'Unknown error'))) ??
        'Network error';
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: `Error: ${errorText.substring(0, 100)}` }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (id) {
      updateChat(id, {
        chatName: chats.find((item) => item.id === id)?.name as string,
        messages
      });
    }
  }, [messages]);

  useEffect(() => {
    if (id) {
      setMessages(chats.find((item) => item.id === id)?.messages || []);
    }
  }, [id]);

  // 新对话的处理逻辑
  return (
    <div className='flex flex-col h-full '>
      <div className='flex-1 h-full overflow-auto '>
        <div className='px-6 py-3 gap-4 flex flex-col'>
          {messages.map((item, index) => (
            <Bubble
              key={index}
              avatar={{
                icon: <UserRound size={32} />,
                style:
                  item.role === 'system'
                    ? { color: '#f56a00', backgroundColor: '#fde3cf' }
                    : { color: '#fff', backgroundColor: '#87d068' }
              }}
              content={item.content}
              placement={item.role === 'system' ? 'left' : 'right'}
              thinkingContent={
                item.role === 'system' ? item.thinkingContent : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className='flex items-center m-4'>
        <div className='border rounded-lg w-full px-4 py-2 flex flex-row items-center justify-between gap-2'>
          <textarea
            ref={textareaRef}
            className='focus:outline-none w-full'
            placeholder='请输入消息'
            onChange={(e) => {
              setInput(e.target.value);
              handleResize();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            value={input}
            style={{ minHeight: '2rem', maxHeight: '12rem', resize: 'none' }}
          />
          <CircleArrowUp
            onClick={handleSubmit}
            className='self-end text-primary w-8 h-8 cursor-pointer hover:text-primary/80'
            size={32}
          />
        </div>
      </div>
    </div>
  );
};

export default Chats;
