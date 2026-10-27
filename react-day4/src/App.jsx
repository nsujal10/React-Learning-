import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ToastProvider } from './components/Toast';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
