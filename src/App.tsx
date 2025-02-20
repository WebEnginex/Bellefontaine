import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Loading } from "@/components/ui/loading";
import Navbar from "@/components/Navbar";

// Lazy loading des pages
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Contact = lazy(() => import("@/pages/Contact"));
const Account = lazy(() => import("@/pages/Account"));
const Reserver = lazy(() => import("@/pages/Reserver"));
const Index = lazy(() => import("@/pages/Index"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <main className="min-h-screen bg-background">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route index element={<Index />} />
            <Route path="auth">
              <Route index element={<Auth />} />
              <Route path="reset-password" element={<Auth />} />
            </Route>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contact" element={<Contact />} />
            <Route path="account" element={<Account />} />
            <Route path="reserver" element={<Reserver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
