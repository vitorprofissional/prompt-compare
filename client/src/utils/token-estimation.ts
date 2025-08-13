// Token estimation utilities for different AI models
// Based on approximate tokenization patterns for major providers

export interface TokenEstimate {
  tokens: number;
  cost: number;
  currency: string;
}

export interface ModelPricing {
  name: string;
  provider: string;
  inputCostPer1kTokens: number;  // USD per 1000 tokens
  averageTokensPerWord: number;   // Approximate tokens per word
}

export const AI_MODELS: Record<string, ModelPricing> = {
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputCostPer1kTokens: 0.000150, // $0.15 per 1M tokens
    averageTokensPerWord: 1.3
  },
  'gemini-2.0-flash': {
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    inputCostPer1kTokens: 0.000075, // $0.075 per 1M tokens
    averageTokensPerWord: 1.2
  },
  'claude-3-5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputCostPer1kTokens: 0.003, // $3 per 1M tokens
    averageTokensPerWord: 1.25
  }
};

/**
 * Estimates token count and cost for a given text using different AI models
 */
export function estimateTokensAndCost(text: string, modelKey: string): TokenEstimate {
  if (!text.trim()) {
    return { tokens: 0, cost: 0, currency: 'USD' };
  }

  const model = AI_MODELS[modelKey];
  if (!model) {
    // Default to GPT-4o mini if model not found
    const defaultModel = AI_MODELS['gpt-4o-mini'];
    return estimateWithModel(text, defaultModel);
  }

  return estimateWithModel(text, model);
}

function estimateWithModel(text: string, model: ModelPricing): TokenEstimate {
  // Basic word count
  const wordCount = text.trim().split(/\s+/).length;
  
  // Estimate tokens based on model's average
  const estimatedTokens = Math.ceil(wordCount * model.averageTokensPerWord);
  
  // Add extra tokens for special characters, code blocks, formatting
  let adjustedTokens = estimatedTokens;
  
  // Code blocks and special formatting add extra tokens
  const codeBlockMatches = text.match(/```[\s\S]*?```/g) || [];
  const inlineCodeMatches = text.match(/`[^`]+`/g) || [];
  const xmlTagMatches = text.match(/<[^>]+>/g) || [];
  const markdownMatches = text.match(/[*_#\[\]()]/g) || [];
  
  adjustedTokens += codeBlockMatches.length * 5; // Code blocks use more tokens
  adjustedTokens += inlineCodeMatches.length * 2;
  adjustedTokens += xmlTagMatches.length * 2;
  adjustedTokens += Math.floor(markdownMatches.length / 10); // Markdown symbols
  
  // Calculate cost
  const cost = (adjustedTokens / 1000) * model.inputCostPer1kTokens;
  
  return {
    tokens: adjustedTokens,
    cost: parseFloat(cost.toFixed(6)),
    currency: 'USD'
  };
}

/**
 * Get all available models for selection
 */
export function getAllModels(): ModelPricing[] {
  return Object.values(AI_MODELS);
}

/**
 * Format cost for display
 */
export function formatCost(cost: number, currency: string = 'USD'): string {
  if (cost < 0.000001) return `< $0.000001`;
  if (cost < 0.01) return `$${cost.toFixed(6)}`;
  if (cost < 1) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return `${tokens}`;
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
  return `${(tokens / 1000000).toFixed(1)}M`;
}