export interface Slot {
  id: string;
  date: string;
  circuit_1_capacity: number;
  circuit_2_capacity: number;
  circuit_1_available: number;
  circuit_2_available: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
}

export interface Booking {
  id: string;
  user_id: string;
  slot_id: string;
  circuit_number: number;
  number_of_pilots: number;
  created_at: string;
  updated_at: string;
  payment_status: string;
  slot?: Slot;
  profile?: Profile;
}
