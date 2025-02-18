export type Message = {
  id: string;
  full_name: string;
  email: string;
  message: string;
  status: "pending" | "replied";
  admin_response: string | null;
  created_at: string;
  read: boolean;
};
