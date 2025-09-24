import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AppProvider } from '@/contexts/AppContext'; // ✅ Add this line

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
