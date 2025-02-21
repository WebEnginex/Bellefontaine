import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, {}), _jsx(Navbar, {}), _jsx("main", { className: "min-h-screen bg-background", children: _jsx(Suspense, { fallback: _jsx(Loading, {}), children: _jsxs(Routes, { children: [_jsx(Route, { index: true, element: _jsx(Index, {}) }), _jsxs(Route, { path: "auth", children: [_jsx(Route, { index: true, element: _jsx(Auth, {}) }), _jsx(Route, { path: "reset-password", element: _jsx(Auth, {}) })] }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "account", element: _jsx(Account, {}) }), _jsx(Route, { path: "reserver", element: _jsx(Reserver, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) })] }));
}
export default App;
