import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import SyntaxHighlighter from "@/components/syntax-highlighter";
import TokenInfo from "./token-info";
import { useTheme } from "@/contexts/theme-context";

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
  const { themeDefinition } = useTheme();
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500"
  };

  return (
    <div 
      className="editor-panel rounded-xl shadow-sm border flex flex-col"
      style={{
        backgroundColor: themeDefinition.colors.background,
        borderColor: themeDefinition.colors.border
      }}
    >
      <div 
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: themeDefinition.colors.border }}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 ${colorClasses[color]} rounded-full`}></div>
          <h2 
            className="text-lg font-medium"
            style={{ color: themeDefinition.colors.foreground }}
          >
            {title}
          </h2>
          <div className="flex items-center space-x-3">
            <span 
              className="text-sm"
              style={{ color: themeDefinition.colors.foregroundMuted }}
              data-testid={`text-word-count-${color}`}
            >
              {stats.words} palavras
            </span>
            <TokenInfo content={content} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="p-1.5 rounded-md transition-colors hover:bg-secondary"
            style={{ 
              color: themeDefinition.colors.foregroundMuted
            }}
            data-testid={`button-toggle-preview-${color}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="p-1.5 rounded-md transition-colors hover:text-red-500 hover:bg-red-50"
            style={{ 
              color: themeDefinition.colors.foregroundMuted
            }}
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
            className="editor-textarea w-full h-full resize-none border-0 focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar"
            style={{
              backgroundColor: themeDefinition.colors.background,
              color: themeDefinition.colors.foreground
            }}
            data-testid={`textarea-prompt-${color}`}
          />
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div 
          className="editor-preview border-t p-4 max-h-48 overflow-y-auto"
          style={{
            borderColor: themeDefinition.colors.border,
            backgroundColor: themeDefinition.colors.backgroundSecondary
          }}
        >
          <div 
            className="text-xs font-medium mb-2"
            style={{ color: themeDefinition.colors.foregroundMuted }}
          >
            PREVIEW
          </div>
          <div className="max-w-none" data-testid={`text-preview-${color}`}>
            {content ? (
              <SyntaxHighlighter 
                content={content} 
                className="text-sm"
              />
            ) : (
              <p 
                className="italic"
                style={{ color: themeDefinition.colors.foregroundMuted }}
              >
                Preview da formatação aparecerá aqui...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
