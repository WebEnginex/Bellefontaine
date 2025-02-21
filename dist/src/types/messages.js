export const getStatusConfig = (status) => {
    switch (status) {
        case "unread":
            return {
                label: "Non lu",
                variant: "destructive",
                className: "bg-red-500 hover:bg-red-600"
            };
        case "pending":
            return {
                label: "En attente",
                variant: "secondary",
                className: "bg-orange-500 hover:bg-orange-600"
            };
        case "replied":
            return {
                label: "Répondu",
                variant: "default",
                className: "bg-green-500 hover:bg-green-600"
            };
    }
};
