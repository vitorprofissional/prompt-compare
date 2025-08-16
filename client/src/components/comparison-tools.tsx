import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";

interface ComparisonToolsProps {
  statsA: { chars: number; words: number; lines: number };
  statsB: { chars: number; words: number; lines: number };
  similarity: number;
  onHighlightToggle?: (enabled: boolean) => void;
}

export default function ComparisonTools({ statsA, statsB, similarity, onHighlightToggle }: ComparisonToolsProps) {
  const { themeDefinition } = useTheme();
  const [differencesHighlighted, setDifferencesHighlighted] = useState(false);
  
  const [showStatistics, setShowStatistics] = useState(false);

  const highlightDifferences = () => {
    const newState = !differencesHighlighted;
    setDifferencesHighlighted(newState);
    onHighlightToggle?.(newState);
  };


  const toggleStatistics = () => {
    setShowStatistics(!showStatistics);
  };

  return (
    <div 
      className="mt-6 rounded-xl shadow-sm border p-4"
      style={{
        backgroundColor: themeDefinition.colors.background,
        borderColor: themeDefinition.colors.border
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 
            className="text-sm font-medium"
            style={{ color: themeDefinition.colors.foreground }}
          >
            Ferramentas de Comparação
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={highlightDifferences}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                differencesHighlighted 
                  ? 'bg-primary-100 text-primary-700 border-primary-300' 
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
              data-testid="button-highlight-differences"
            >
              Destacar Diferenças
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleStatistics}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                showStatistics 
                  ? 'bg-primary-100 text-primary-700 border-primary-300' 
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
              }`}
              data-testid="button-show-statistics"
            >
              Estatísticas
            </Button>
          </div>
        </div>
        
        <div 
          className="flex items-center space-x-4 text-sm"
          style={{ color: themeDefinition.colors.foregroundMuted }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span data-testid="text-stats-a">
              Prompt A: {statsA.chars} chars, {statsA.lines} linhas
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span data-testid="text-stats-b">
              Prompt B: {statsB.chars} chars, {statsB.lines} linhas
            </span>
          </div>
          <div 
            className="font-medium" 
            data-testid="text-similarity"
            style={{ color: themeDefinition.colors.accent }}
          >
            Similaridade: {similarity}%
          </div>
        </div>
      </div>

      {showStatistics && (
        <div 
          className="mt-4 pt-4 border-t"
          style={{ borderColor: themeDefinition.colors.border }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: themeDefinition.colors.backgroundSecondary }}
            >
              <div className="text-blue-500 font-medium">Prompt A</div>
              <div className="mt-1" style={{ color: themeDefinition.colors.foreground }}>
                <div>Caracteres: {statsA.chars}</div>
                <div>Palavras: {statsA.words}</div>
                <div>Linhas: {statsA.lines}</div>
              </div>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: themeDefinition.colors.backgroundSecondary }}
            >
              <div className="text-green-500 font-medium">Prompt B</div>
              <div className="mt-1" style={{ color: themeDefinition.colors.foreground }}>
                <div>Caracteres: {statsB.chars}</div>
                <div>Palavras: {statsB.words}</div>
                <div>Linhas: {statsB.lines}</div>
              </div>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: themeDefinition.colors.backgroundSecondary }}
            >
              <div 
                className="font-medium"
                style={{ color: themeDefinition.colors.foreground }}
              >
                Diferença
              </div>
              <div className="mt-1" style={{ color: themeDefinition.colors.foregroundMuted }}>
                <div>Chars: {Math.abs(statsA.chars - statsB.chars)}</div>
                <div>Palavras: {Math.abs(statsA.words - statsB.words)}</div>
                <div>Linhas: {Math.abs(statsA.lines - statsB.lines)}</div>
              </div>
            </div>
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: themeDefinition.colors.backgroundSecondary }}
            >
              <div 
                className="font-medium"
                style={{ color: themeDefinition.colors.accent }}
              >
                Similaridade
              </div>
              <div 
                className="mt-1 text-lg font-semibold"
                style={{ color: themeDefinition.colors.accent }}
              >
                {similarity}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
