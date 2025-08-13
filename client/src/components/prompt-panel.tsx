import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PromptPanelProps {
  title: string;
  color: "blue" | "green";
  content: string;
  onContentChange: (content: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  onClear: () => void;
  stats: { chars: number; words: number; lines: number };
  placeholder: string;
}

export default function PromptPanel({
  title,
  color,
  content,
  onContentChange,
  showPreview,
  onTogglePreview,
  onClear,
  stats,
  placeholder
}: PromptPanelProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${colorClasses[color]} rounded-full`}></div>
          <h2 className="text-lg font-medium text-slate-900">{title}</h2>
          <span className="text-sm text-slate-500" data-testid={`text-word-count-${color}`}>
            {stats.words} palavras
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            data-testid={`button-toggle-preview-${color}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
            data-testid={`button-clear-${color}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="h-full">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full resize-none border-0 focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar placeholder-slate-400"
            data-testid={`textarea-prompt-${color}`}
          />
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-medium text-slate-700 mb-2">PREVIEW</div>
          <div className="prose prose-sm max-w-none" data-testid={`text-preview-${color}`}>
            {content ? (
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }) => {
                    return inline ? (
                      <code className="bg-slate-200 px-1 py-0.5 rounded text-xs" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
                        <code {...props}>{children}</code>
                      </pre>
                    );
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-500 italic">Preview da formatação aparecerá aqui...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
