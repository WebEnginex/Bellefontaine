import { reducer } from "./reducer";
import { genId } from "./utils";
export const listeners = [];
export let memoryState = { toasts: [] };
export function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
}
export function toast({ ...props }) {
    const id = genId();
    const update = (props) => dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
    });
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
                if (!open)
                    dismiss();
            },
        },
    });
    return {
        id: id,
        dismiss,
        update,
    };
}
