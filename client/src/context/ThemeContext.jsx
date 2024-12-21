import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's theme preference on mount
  useEffect(() => {
    const fetchUserTheme = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userTheme = response.data.data.themePreference;
          setIsDark(userTheme === 'dark');
          document.documentElement.classList.toggle('dark', userTheme === 'dark');
        } else {
          // If no token, check localStorage or system preference
          const savedTheme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
          document.documentElement.classList.toggle('dark', 
            savedTheme === 'dark' || (!savedTheme && prefersDark)
          );
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
        // Fallback to localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark ? 'dark' : 'light';
      const token = localStorage.getItem('token');

      if (token) {
        // Update theme in backend if user is logged in
        await axios.put('/api/user/theme', 
          { themePreference: newTheme },
          { headers: { Authorization: `Bearer ${token}` }}
        );
      }

      // Update local state and localStorage
      setIsDark(!isDark);
      document.documentElement.classList.toggle('dark', !isDark);
      localStorage.setItem('theme', newTheme);

    } catch (error) {
      console.error('Error updating theme:', error);
      // Still update local state even if API call fails
      setIsDark(!isDark);
      document.documentElement.classList.toggle('dark', !isDark);
      localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isLoading }}>
      {!isLoading && children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 