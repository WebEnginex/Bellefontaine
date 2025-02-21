export type MessageStatus = "unread" | "pending" | "replied";

export type Message = {
  id: string;
  full_name: string;
  email: string;
  message: string;
  status: MessageStatus;
  admin_response: string | null;
  created_at: string;
  read: boolean;
};

export const getStatusConfig = (status: MessageStatus) => {
  switch (status) {
    case "unread":
      return {
        label: "Non lu",
        variant: "destructive" as const,
        className: "bg-red-500 hover:bg-red-600"
      };
    case "pending":
      return {
        label: "En attente",
        variant: "secondary" as const,
        className: "bg-orange-500 hover:bg-orange-600"
      };
    case "replied":
      return {
        label: "Répondu",
        variant: "default" as const,
        className: "bg-green-500 hover:bg-green-600"
      };
  }
};
