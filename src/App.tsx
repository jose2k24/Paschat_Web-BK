import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OTPVerification from "./pages/OTPVerification";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="bottom-center" />
          <BrowserRouter>
            <Routes>
              {/* Redirect root based on auth status */}
              <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace />} 
              />

              {/* Public routes */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />} 
              />
              <Route 
                path="/verify" 
                element={isAuthenticated ? <Navigate to="/chat" replace /> : <OTPVerification />} 
              />

              {/* Protected routes */}
              <Route 
                path="/chat" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/chat/:chatId" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/group/:groupId" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/channel/:channelId" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/contacts" 
                element={isAuthenticated ? <Contacts /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/saved-messages" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/settings/*" 
                element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/help" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/bug-report" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;