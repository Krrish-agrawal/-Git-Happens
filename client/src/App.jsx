import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        <Router>
          <Navbar />
          <main className="pt-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Your existing routes and components */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
                <h1 className="text-2xl font-bold">Welcome to Your App</h1>
                <p className="mt-4">This content will adapt to dark/light mode automatically.</p>
              </div>
            </div>
          </main>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App; 