import { Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Loading from "@/components/ui/loading";

// Lazy loading des pages
const Auth = lazy(() => import("@/pages/Auth"));
const Account = lazy(() => import("@/pages/Account"));
const Circuits = lazy(() => import("@/pages/Circuits"));
const Contact = lazy(() => import("@/pages/Contact"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Reserver = lazy(() => import("@/pages/Reserver"));

// Layout component avec Suspense
const Layout = () => (
  <>
    <Navbar />
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </>
);

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/reset-password" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/circuits" element={<Circuits />} /> */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reserver" element={<Reserver />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
