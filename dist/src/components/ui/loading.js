import { jsx as _jsx } from "react/jsx-runtime";
export function Loading() {
    return (_jsx("div", { className: "flex h-screen w-screen items-center justify-center", children: _jsx("div", { className: "h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900" }) }));
}
