import React from 'react';
import { cn } from '@/lib/utils';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItContainer from 'markdown-it-container';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';

const md = markdownit({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string | undefined): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
})
  .use(markdownItAbbr)
  .use(markdownItContainer)

  .use(markdownItFootnote)
  .use(markdownItIns)
  .use(markdownItMark)
  .use(markdownItSub)
  .use(markdownItSup);

interface IProps {
  avatar?: {
    icon: React.ReactNode;
    style?: React.CSSProperties;
  };
  content?: string;
  placement?: 'left' | 'right';
  thinkingContent?: string;
}
const Bubble = (props: IProps) => {
  const { avatar, content, placement, thinkingContent } = props;

  return (
    <div
      className={cn('flex flex-row gap-3', {
        'flex-row-reverse': placement === 'right'
      })}
    >
      <div className='w-8 h-8 rounded-[50%] bg-gray-200' style={avatar?.style}>
        {avatar?.icon}
      </div>
      <div className='flex flex-col'>
        <div className='rounded-xl py-3 px-4 bg-gray-200 text-sm'>
          {thinkingContent && (
            <details
              className='my-2 text-xs text-muted-foreground animate-fadeIn'
              open
            >
              <summary className='cursor-pointer hover:text-primary'>
                查看思考过程
              </summary>
              <div className='mt-1 pl-2 border-l-2 border-primary/30 py-1 whitespace-pre-wrap'>
                {thinkingContent}
              </div>
            </details>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: md.render(content as string) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Bubble;
