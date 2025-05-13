export type FormData = {
  purpose: string;
  items: Item[];
  date: string;
  branch: string;
  grand_total: string;
  supplier?: string;
  address?: string;
  totalBoatFare?: string;
  totalContingency?: string;
  totalFare?: string;
  totalHotel?: string;
  totalperDiem?: string;
  totalExpense?: string;
  cashAdvance?: string;
  short?: string;
  name?: string;
  signature?: string;
};

export type Item = {
  quantity: string;
  description: string;
  unitCost: string;
  totalAmount: string;
  remarks?: string | null;
  date?: string;
  branch?: string;
  status?: string;
  day?: string;
};

export type Request = {
  id: number;
  request_code: string;
  user_id: number;
  form_type: string;
  form_data: FormData[];
  date: string;
  branch: string;
  status: string;
  purpose?: string;
  totalBoatFare?: string;
  destination?: string;
  approvers_id?: number;
  created_at?: string;
};
