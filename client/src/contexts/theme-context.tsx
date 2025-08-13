import { createContext, useContext, useState, useEffect } from "react";

export type ThemeName = 
  | 'one-dark-pro'
  | 'github-light' 
  | 'github-dark'
  | 'dracula'
  | 'monokai'
  | 'atom-one-light'
  | 'nord'
  | 'solarized-dark'
  | 'solarized-light'
  | 'material-theme'
  | 'high-contrast-dark'
  | 'high-contrast-light';

export interface ThemeDefinition {
  name: ThemeName;
  displayName: string;
  category: 'dark' | 'light' | 'high-contrast';
  colors: {
    // Background colors
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    
    // Text colors
    foreground: string;
    foregroundMuted: string;
    
    // Syntax highlighting colors
    keyword: string;      // Purple/Blue (keywords, imports, if/else)
    string: string;       // Green (strings)
    number: string;       // Orange/Yellow (numbers, constants)
    function: string;     // Blue/Yellow (functions, methods)
    variable: string;     // Red/Orange (variables)
    comment: string;      // Gray (comments)
    operator: string;     // Cyan/Blue (operators, brackets)
    tag: string;          // Red/Blue (HTML tags, XML tags)
    attribute: string;    // Orange (HTML attributes)
    type: string;         // Yellow/Purple (types, classes)
    
    // UI colors
    border: string;
    selection: string;
    highlight: string;
    lineHighlight: string;
    accent: string;
  };
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  'one-dark-pro': {
    name: 'one-dark-pro',
    displayName: 'One Dark Pro',
    category: 'dark',
    colors: {
      background: '#282c34',
      backgroundSecondary: '#21252b',
      backgroundTertiary: '#32363e',
      foreground: '#abb2bf',
      foregroundMuted: '#5c6370',
      keyword: '#c678dd',
      string: '#98c379',
      number: '#d19a66',
      function: '#61afef',
      variable: '#e06c75',
      comment: '#5c6370',
      operator: '#56b6c2',
      tag: '#e06c75',
      attribute: '#d19a66',
      type: '#e5c07b',
      border: '#3e4452',
      selection: '#3d4b5c',
      highlight: '#528bff',
      lineHighlight: '#2c313c',
      accent: '#61afef',
    }
  },
  'github-light': {
    name: 'github-light',
    displayName: 'GitHub Light',
    category: 'light',
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f6f8fa',
      backgroundTertiary: '#f1f3f4',
      foreground: '#24292f',
      foregroundMuted: '#656d76',
      keyword: '#cf222e',
      string: '#0a3069',
      number: '#0550ae',
      function: '#8250df',
      variable: '#e36209',
      comment: '#6e7781',
      operator: '#cf222e',
      tag: '#116329',
      attribute: '#0550ae',
      type: '#8250df',
      border: '#d0d7de',
      selection: '#0969da26',
      highlight: '#0969da',
      lineHighlight: '#f6f8fa',
      accent: '#0969da',
    }
  },
  'github-dark': {
    name: 'github-dark',
    displayName: 'GitHub Dark',
    category: 'dark',
    colors: {
      background: '#0d1117',
      backgroundSecondary: '#161b22',
      backgroundTertiary: '#21262d',
      foreground: '#e6edf3',
      foregroundMuted: '#7d8590',
      keyword: '#ff7b72',
      string: '#a5d6ff',
      number: '#79c0ff',
      function: '#d2a8ff',
      variable: '#ffa657',
      comment: '#8b949e',
      operator: '#ff7b72',
      tag: '#7ee787',
      attribute: '#79c0ff',
      type: '#f0883e',
      border: '#30363d',
      selection: '#264f78',
      highlight: '#58a6ff',
      lineHighlight: '#21262d40',
      accent: '#58a6ff',
    }
  },
  'dracula': {
    name: 'dracula',
    displayName: 'Dracula',
    category: 'dark',
    colors: {
      background: '#282a36',
      backgroundSecondary: '#1e1f29',
      backgroundTertiary: '#3d4046',
      foreground: '#f8f8f2',
      foregroundMuted: '#6272a4',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      function: '#50fa7b',
      variable: '#ffb86c',
      comment: '#6272a4',
      operator: '#ff79c6',
      tag: '#ff79c6',
      attribute: '#50fa7b',
      type: '#8be9fd',
      border: '#44475a',
      selection: '#44475a',
      highlight: '#6272a4',
      lineHighlight: '#44475a40',
      accent: '#ff79c6',
    }
  },
  'monokai': {
    name: 'monokai',
    displayName: 'Monokai',
    category: 'dark',
    colors: {
      background: '#272822',
      backgroundSecondary: '#1e1f1c',
      backgroundTertiary: '#3e3d32',
      foreground: '#f8f8f2',
      foregroundMuted: '#75715e',
      keyword: '#f92672',
      string: '#e6db74',
      number: '#ae81ff',
      function: '#a6e22e',
      variable: '#fd971f',
      comment: '#75715e',
      operator: '#f92672',
      tag: '#f92672',
      attribute: '#a6e22e',
      type: '#66d9ef',
      border: '#3c3d37',
      selection: '#49483e',
      highlight: '#f92672',
      lineHighlight: '#3e3d32',
      accent: '#a6e22e',
    }
  },
  'atom-one-light': {
    name: 'atom-one-light',
    displayName: 'Atom One Light',
    category: 'light',
    colors: {
      background: '#fafafa',
      backgroundSecondary: '#f0f0f1',
      backgroundTertiary: '#e5e5e6',
      foreground: '#2c2f33',
      foregroundMuted: '#6c7086',
      keyword: '#a626a4',
      string: '#50a14f',
      number: '#986801',
      function: '#4078f2',
      variable: '#e45649',
      comment: '#6c7086',
      operator: '#0184bb',
      tag: '#e45649',
      attribute: '#986801',
      type: '#c18401',
      border: '#e5e5e6',
      selection: '#e5e5e6',
      highlight: '#4078f2',
      lineHighlight: '#f0f0f1',
      accent: '#4078f2',
    }
  },
  'nord': {
    name: 'nord',
    displayName: 'Nord',
    category: 'dark',
    colors: {
      background: '#2e3440',
      backgroundSecondary: '#242933',
      backgroundTertiary: '#3b4252',
      foreground: '#eceff4',
      foregroundMuted: '#616e88',
      keyword: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      function: '#88c0d0',
      variable: '#d08770',
      comment: '#616e88',
      operator: '#81a1c1',
      tag: '#81a1c1',
      attribute: '#d08770',
      type: '#5e81ac',
      border: '#434c5e',
      selection: '#434c5e',
      highlight: '#5e81ac',
      lineHighlight: '#3b425240',
      accent: '#88c0d0',
    }
  },
  'solarized-dark': {
    name: 'solarized-dark',
    displayName: 'Solarized Dark',
    category: 'dark',
    colors: {
      background: '#002b36',
      backgroundSecondary: '#073642',
      backgroundTertiary: '#0d4f62',
      foreground: '#fdf6e3',
      foregroundMuted: '#93a1a1',
      keyword: '#268bd2',
      string: '#2aa198',
      number: '#d33682',
      function: '#b58900',
      variable: '#cb4b16',
      comment: '#586e75',
      operator: '#859900',
      tag: '#268bd2',
      attribute: '#b58900',
      type: '#dc322f',
      border: '#073642',
      selection: '#073642',
      highlight: '#268bd2',
      lineHighlight: '#07364240',
      accent: '#268bd2',
    }
  },
  'solarized-light': {
    name: 'solarized-light',
    displayName: 'Solarized Light',
    category: 'light',
    colors: {
      background: '#fdf6e3',
      backgroundSecondary: '#eee8d5',
      backgroundTertiary: '#e9e2d0',
      foreground: '#2e3440',
      foregroundMuted: '#5e6c7e',
      keyword: '#268bd2',
      string: '#2aa198',
      number: '#d33682',
      function: '#b58900',
      variable: '#cb4b16',
      comment: '#93a1a1',
      operator: '#859900',
      tag: '#268bd2',
      attribute: '#b58900',
      type: '#dc322f',
      border: '#eee8d5',
      selection: '#eee8d5',
      highlight: '#268bd2',
      lineHighlight: '#eee8d540',
      accent: '#268bd2',
    }
  },
  'material-theme': {
    name: 'material-theme',
    displayName: 'Material Theme',
    category: 'dark',
    colors: {
      background: '#263238',
      backgroundSecondary: '#1e272c',
      backgroundTertiary: '#37474f',
      foreground: '#eeffff',
      foregroundMuted: '#546e7a',
      keyword: '#c792ea',
      string: '#c3e88d',
      number: '#f78c6c',
      function: '#82aaff',
      variable: '#eeffff',
      comment: '#546e7a',
      operator: '#89ddff',
      tag: '#f07178',
      attribute: '#ffcb6b',
      type: '#ffcb6b',
      border: '#37474f',
      selection: '#37474f',
      highlight: '#82aaff',
      lineHighlight: '#37474f40',
      accent: '#82aaff',
    }
  },
  'high-contrast-dark': {
    name: 'high-contrast-dark',
    displayName: 'High Contrast Dark',
    category: 'high-contrast',
    colors: {
      background: '#000000',
      backgroundSecondary: '#0c0c0c',
      backgroundTertiary: '#1c1c1c',
      foreground: '#ffffff',
      foregroundMuted: '#c0c0c0',
      keyword: '#569cd6',
      string: '#ce9178',
      number: '#b5cea8',
      function: '#dcdcaa',
      variable: '#9cdcfe',
      comment: '#6a9955',
      operator: '#d4d4d4',
      tag: '#92c5f8',
      attribute: '#92c5f8',
      type: '#4ec9b0',
      border: '#6fc3df',
      selection: '#264f78',
      highlight: '#0e639c',
      lineHighlight: '#0e639c40',
      accent: '#007acc',
    }
  },
  'high-contrast-light': {
    name: 'high-contrast-light',
    displayName: 'High Contrast Light',
    category: 'high-contrast',
    colors: {
      background: '#ffffff',
      backgroundSecondary: '#f3f3f3',
      backgroundTertiary: '#e8e8e8',
      foreground: '#000000',
      foregroundMuted: '#292929',
      keyword: '#0000ff',
      string: '#a31515',
      number: '#09885a',
      function: '#795e26',
      variable: '#001080',
      comment: '#008000',
      operator: '#000000',
      tag: '#800000',
      attribute: '#ff0000',
      type: '#267f99',
      border: '#8b8b8b',
      selection: '#add6ff',
      highlight: '#0000ff',
      lineHighlight: '#f0f0f0',
      accent: '#005a9e',
    }
  }
};

interface ThemeContextType {
  currentTheme: ThemeName;
  themeDefinition: ThemeDefinition;
  setTheme: (theme: ThemeName) => void;
  themes: Record<ThemeName, ThemeDefinition>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('one-dark-pro');

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
    localStorage.setItem('preferred-theme', theme);
  };

  useEffect(() => {
    const saved = localStorage.getItem('preferred-theme') as ThemeName;
    if (saved && themes[saved]) {
      setCurrentTheme(saved);
    }
  }, []);

  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--editor-bg', theme.colors.background);
    root.style.setProperty('--editor-bg-secondary', theme.colors.backgroundSecondary);
    root.style.setProperty('--editor-bg-tertiary', theme.colors.backgroundTertiary);
    root.style.setProperty('--editor-fg', theme.colors.foreground);
    root.style.setProperty('--editor-fg-muted', theme.colors.foregroundMuted);
    root.style.setProperty('--editor-border', theme.colors.border);
    root.style.setProperty('--editor-selection', theme.colors.selection);
    root.style.setProperty('--editor-highlight', theme.colors.highlight);
    root.style.setProperty('--editor-line-highlight', theme.colors.lineHighlight);
    root.style.setProperty('--editor-accent', theme.colors.accent);
    
    // Syntax colors
    root.style.setProperty('--syntax-keyword', theme.colors.keyword);
    root.style.setProperty('--syntax-string', theme.colors.string);
    root.style.setProperty('--syntax-number', theme.colors.number);
    root.style.setProperty('--syntax-function', theme.colors.function);
    root.style.setProperty('--syntax-variable', theme.colors.variable);
    root.style.setProperty('--syntax-comment', theme.colors.comment);
    root.style.setProperty('--syntax-operator', theme.colors.operator);
    root.style.setProperty('--syntax-tag', theme.colors.tag);
    root.style.setProperty('--syntax-attribute', theme.colors.attribute);
    root.style.setProperty('--syntax-type', theme.colors.type);
  }, [currentTheme]);

  const value = {
    currentTheme,
    themeDefinition: themes[currentTheme],
    setTheme,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}