import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import AboutPage from "./pages/AboutPage"
import Film from "./pages/Film"
import HomeClassic from "./pages/HomeClassic"
import Saved from "./pages/Saved"
import Portfolio from "./pages/Portfolio"
import Auth from "./pages/Auth"
import Admin from "./pages/Admin"
// three.js only loads when someone walks into the 3D shop
const Boutique = lazy(() => import("./pages/Boutique"))
import CursorFollower from "./components/CursorFollower"
import IntroLoader from "./components/IntroLoader"
import CartDrawer from "./components/CartDrawer"
import WishlistDrawer from "./components/WishlistDrawer"
import FloatingChrome from "./components/FloatingChrome"
import { LangProvider } from "./lib/lang"
import { ThemeProvider } from "./lib/theme"
import { WishlistProvider } from "./lib/wishlist"
import { CartProvider } from "./lib/cart"
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
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    style: { background: "#1A1611", border: "1px solid #C28773", color: "#F3EEE4" },
                  }}
                />
                <IntroLoader />
                <CursorFollower />
                <CartDrawer />
                <WishlistDrawer />
                <FloatingChrome />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/film" element={<Film />} />
                  <Route path="/classic" element={<HomeClassic />} />
                  <Route path="/saved" element={<Saved />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/boutique" element={<Suspense fallback={<div className="fixed inset-0 z-[65] bg-[#1b2a20]" />}><Boutique /></Suspense>} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </QueryClientProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
