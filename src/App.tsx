import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import Admin from "./pages/Admin"
import LoadingScreen from "./components/LoadingScreen"
import CursorFollower from "./components/CursorFollower"
import { useEffect } from "react"
import { LangProvider } from "./lib/lang"
import { ThemeProvider } from "./lib/theme"
import { trackVisit } from "./lib/analytics"

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = localStorage.getItem("sinar_admin_auth") === "true"
  return auth ? <>{children}</> : <Navigate to="/auth" replace />
}

if (typeof window !== "undefined") trackVisit()

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { background: "#0F2415", border: "1px solid #1C3020", color: "#F5F0E8" },
            }}
          />
          <LoadingScreen />
          <CursorFollower />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
