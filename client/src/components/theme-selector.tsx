import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";
import { useTheme, ThemeName, themes } from "@/contexts/theme-context";

export default function ThemeSelector() {
  const { currentTheme, setTheme, themeDefinition } = useTheme();
  

  const themesByCategory = {
    dark: Object.values(themes).filter(theme => theme.category === 'dark'),
    light: Object.values(themes).filter(theme => theme.category === 'light'),
    'high-contrast': Object.values(themes).filter(theme => theme.category === 'high-contrast')
  };

  const categoryLabels = {
    dark: 'Temas Escuros',
    light: 'Temas Claros',
    'high-contrast': 'Alto Contraste'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          data-testid="button-theme-selector"
        >
          <Palette className="w-4 h-4" />
          {themes[currentTheme].displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Escolher Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(themesByCategory).map(([category, categoryThemes]) => (
          <div key={category}>
            <DropdownMenuLabel 
              className="text-xs font-medium"
              style={{ color: themeDefinition.colors.foregroundMuted }}
            >
              {categoryLabels[category as keyof typeof categoryLabels]}
            </DropdownMenuLabel>
            {categoryThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.name}
                onClick={() => setTheme(theme.name)}
                className="flex items-center justify-between py-2 cursor-pointer"
                data-testid={`theme-option-${theme.name}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                  <span className="text-sm">{theme.displayName}</span>
                </div>
                {currentTheme === theme.name && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}