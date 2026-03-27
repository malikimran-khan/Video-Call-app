import React, { useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

const TextScramble: React.FC<TextScrambleProps> = ({ text, className, delay = 0 }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    if (!textRef.current) return;

    const el = textRef.current;
    let frame = 0;
    let queue: any[] = [];
    const oldText = '';
    
    for (let i = 0; i < text.length; i++) {
      const from = oldText[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queue.push({ from, to, start, end, char: '' });
    }

    let frameRequest: number;

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = chars[Math.floor(Math.random() * chars.length)];
            queue[i].char = char;
          }
          output += `<span className="opacity-50">${char}</span>`;
        } else {
          output += from;
        }
      }
      el.innerHTML = output;
      if (complete === queue.length) {
        cancelAnimationFrame(frameRequest);
      } else {
        frame++;
        frameRequest = requestAnimationFrame(update);
      }
    };

    const timeout = setTimeout(() => {
        update();
    }, delay * 1000);

    return () => {
        clearTimeout(timeout);
        cancelAnimationFrame(frameRequest);
    };
  }, [text, delay]);

  return <span ref={textRef} className={className} />;
};

export default TextScramble;
