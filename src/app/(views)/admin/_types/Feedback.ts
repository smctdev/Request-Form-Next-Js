export interface FeedbackType {
  id: number;
  feedback_code: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  opinion: string;
  department: string;
  other_opinion: string;
  phone: number | string;
  created_at: string;
}
