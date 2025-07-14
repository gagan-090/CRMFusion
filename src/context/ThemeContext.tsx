import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type Theme = {
  dark: boolean;
  colors: {
    background: string;
    text: string;
    tabBarBackground: string;
    tabBarIconActive: string;
    tabBarIconInactive: string;
    tabBarIconBackgroundActive: string;
    tabBarIconBackgroundInactive: string;
    sectionBackground: string;
    logoutButtonBackground: string;
    logoutButtonText: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    tv: number;
  };
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#f7fafa',
    text: '#2c3e50',
    tabBarBackground: '#fff',
    tabBarIconActive: '#4CAF50',
    tabBarIconInactive: '#9E9E9E',
    tabBarIconBackgroundActive: '#E8F5E9',
    tabBarIconBackgroundInactive: '#FAFAFA',
    sectionBackground: '#fff',
    logoutButtonBackground: '#e74c3c',
    logoutButtonText: '#fff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  breakpoints: {
    xs: 0,
    sm: 360,
    md: 600,
    lg: 900,
    tv: 1200,
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#121212',
    text: '#ffffff',
    tabBarBackground: '#222222',
    tabBarIconActive: '#81C784',
    tabBarIconInactive: '#B0B0B0',
    tabBarIconBackgroundActive: '#2E7D32',
    tabBarIconBackgroundInactive: '#333333',
    sectionBackground: '#1E1E1E',
    logoutButtonBackground: '#c0392b',
    logoutButtonText: '#fff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  breakpoints: {
    xs: 0,
    sm: 360,
    md: 600,
    lg: 900,
    tv: 1200,
  },
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<Theme>(colorScheme === 'dark' ? darkTheme : lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme.dark ? lightTheme : darkTheme));
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
