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
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="bottom-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<OTPVerification />} />
              <Route path="/" element={<Index />} />
              <Route path="/chat/:chatId" element={<Index />} />
              <Route path="/group/:groupId" element={<Index />} />
              <Route path="/channel/:channelId" element={<Index />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/saved-messages" element={<Index />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/help" element={<Index />} />
              <Route path="/bug-report" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;