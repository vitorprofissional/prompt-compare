import ReactMarkdown from "react-markdown";
import { useTheme } from "@/contexts/theme-context";

interface SyntaxHighlighterProps {
  content: string;
  className?: string;
}

export default function SyntaxHighlighter({ content, className = "" }: SyntaxHighlighterProps) {
  const { themeDefinition } = useTheme();

  const highlightSyntax = (text: string): string => {
    if (!text) return text;
    
    // XML/HTML tags
    text = text.replace(/<(\/?[\w-]+)[^>]*>/g, (match, tag) => {
      return `<span class="syntax-tag">${match}</span>`;
    });
    
    // XML attributes
    text = text.replace(/(\w+)=["']([^"']*)["']/g, (match, attr, value) => {
      return `<span class="syntax-attribute">${attr}</span>=<span class="syntax-string">"${value}"</span>`;
    });
    
    // JavaScript/Python keywords
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'class', 'def', 'return', 'import', 'from', 'export', 'try', 'catch', 'finally', 'async', 'await', 'yield'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      text = text.replace(regex, `<span class="syntax-keyword">${keyword}</span>`);
    });
    
    // Strings (double and single quoted)
    text = text.replace(/(["'])([^"']*)\1/g, (match, quote, content) => {
      return `<span class="syntax-string">${quote}${content}${quote}</span>`;
    });
    
    // Numbers
    text = text.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="syntax-number">$1</span>');
    
    // Comments (// and # style)
    text = text.replace(/(\/\/.*$|#.*$)/gm, '<span class="syntax-comment">$1</span>');
    
    // Functions
    text = text.replace(/\b(\w+)(?=\s*\()/g, '<span class="syntax-function">$1</span>');
    
    // Operators
    text = text.replace(/([+\-*\/%=<>!&|]+)/g, '<span class="syntax-operator">$1</span>');
    
    return text;
  };

  return (
    <div 
      className={`syntax-highlighter ${className}`}
      style={{
        backgroundColor: themeDefinition.colors.background,
        color: themeDefinition.colors.foreground,
        border: `1px solid ${themeDefinition.colors.border}`
      }}
    >
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code 
                  className="px-1 py-0.5 rounded text-xs font-mono"
                  style={{
                    backgroundColor: themeDefinition.colors.backgroundSecondary,
                    color: themeDefinition.colors.foreground
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            const codeContent = String(children);
            return (
              <pre 
                className="p-3 rounded text-sm overflow-x-auto font-mono"
                style={{
                  backgroundColor: themeDefinition.colors.backgroundSecondary,
                  border: `1px solid ${themeDefinition.colors.border}`
                }}
              >
                <code 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightSyntax(codeContent) 
                  }}
                  {...props}
                />
              </pre>
            );
          },
          p: ({ children, ...props }) => (
            <p 
              className="mb-2 leading-relaxed"
              style={{ color: themeDefinition.colors.foreground }}
              {...props}
            >
              {children}
            </p>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 pl-4 my-4 italic"
              style={{ 
                borderColor: themeDefinition.colors.accent,
                color: themeDefinition.colors.foregroundMuted
              }}
              {...props}
            >
              {children}
            </blockquote>
          ),
          h1: ({ children, ...props }) => (
            <h1 
              className="text-xl font-bold mb-3"
              style={{ color: themeDefinition.colors.accent }}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 
              className="text-lg font-semibold mb-2"
              style={{ color: themeDefinition.colors.accent }}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 
              className="text-base font-medium mb-2"
              style={{ color: themeDefinition.colors.accent }}
              {...props}
            >
              {children}
            </h3>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-2 space-y-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li 
              className="mb-1"
              style={{ color: themeDefinition.colors.foreground }}
              {...props}
            >
              {children}
            </li>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}