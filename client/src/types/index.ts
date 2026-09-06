export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES_AGENT";
}

export interface Customer {
  id: string;
  name: string;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  source: string;
  assignedUserId: string | null;
  createdAt: string;
  updatedAt: string;
  assignedUser: Pick<User, "id" | "name" | "email"> | null;
}

export interface CustomerListItem extends Customer {
  _count: { leads: number; conversations: number };
}

export interface CustomerDetail extends Customer {
  leads: Lead[];
  conversations: Conversation[];
  tasks: Task[];
  notes: Note[];
  _count: { leads: number; conversations: number; tasks: number };
}

export interface Lead {
  id: string;
  customerId: string;
  title: string;
  description: string | null;
  value: number | null;
  status: string;
  pipelineStageId: string | null;
  assignedUserId: string | null;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  channel: string;
  status: string;
  subject: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderType: string;
  senderId: string | null;
  content: string;
  messageType: string;
  direction: string;
  status: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  status: string;
  assignedUserId: string | null;
  customerId: string | null;
  leadId: string | null;
  createdAt: string;
}

export interface Note {
  id: string;
  customerId: string;
  content: string;
  createdAt: string;
}
