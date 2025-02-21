import { useEffect, useState } from "react";
import { listeners, memoryState, toast, dispatch } from "./toast/store";
function useToast() {
    const [state, setState] = useState(memoryState);
    useEffect(() => {
        listeners.push(setState);
        return () => {
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [state]);
    return {
        ...state,
        toast,
        dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
    };
}
export { useToast, toast };
