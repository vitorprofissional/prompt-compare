import { Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  estimateTokensAndCost, 
  formatTokenCount, 
  formatCost, 
  getAllModels,
  type ModelPricing 
} from "@/utils/token-estimation";
import { useTheme } from "@/contexts/theme-context";

interface TokenInfoProps {
  content: string;
}

export default function TokenInfo({ content }: TokenInfoProps) {
  const { themeDefinition } = useTheme();
  const models = getAllModels();
  
  const modelKeys = Object.keys({
    'gpt-4o-mini': 1,
    'gemini-2.0-flash': 1,
    'claude-3-5-sonnet': 1
  });
  
  const estimates = models.map((model, index) => {
    const modelKey = modelKeys[index] || 'gpt-4o-mini';
    const estimate = estimateTokensAndCost(content, modelKey);
    return { model, estimate };
  });

  // Get the most commonly used model for main display
  const mainEstimate = estimateTokensAndCost(content, 'gpt-4o-mini');
  
  if (!content.trim()) {
    return (
      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
        <span>0 tokens</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center space-x-1 text-xs cursor-help"
            style={{ color: themeDefinition.colors.foregroundMuted }}
          >
            <span data-testid="text-token-count">
              ~{formatTokenCount(mainEstimate.tokens)} tokens
            </span>
            <Info className="w-3 h-3" />
          </div>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-xs p-3"
          style={{
            backgroundColor: themeDefinition.colors.background,
            color: themeDefinition.colors.foreground,
            borderColor: themeDefinition.colors.border
          }}
        >
          <div className="space-y-2">
            <div className="font-medium text-sm">Estimativa de Tokens e Custos</div>
            <div className="space-y-1.5">
              {estimates.map(({ model, estimate }) => (
                <div key={model.name} className="flex justify-between items-center text-xs">
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div 
                      className="text-xs"
                      style={{ color: themeDefinition.colors.foregroundMuted }}
                    >
                      {model.provider}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatTokenCount(estimate.tokens)} tokens</div>
                    <div 
                      className="text-xs"
                      style={{ color: themeDefinition.colors.accent }}
                    >
                      {formatCost(estimate.cost)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div 
              className="text-xs pt-2 border-t"
              style={{ 
                color: themeDefinition.colors.foregroundMuted,
                borderColor: themeDefinition.colors.border 
              }}
            >
              Estimativas aproximadas baseadas em padrões de tokenização
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}