
export enum Category {
  EBOOK = 'Ebook',
  COURSE = 'Curso',
  SUBSCRIPTION = 'Assinatura'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  contentCount?: number;
  status?: 'published' | 'draft' | 'archived';
  modules?: Module[];
  quiz?: Quiz;
}

export interface User {
  id: string;
  name: string;
  email: string;
  purchasedIds: string[];
  savedIds: string[];
  subscriptionActive: boolean;
  role: 'user' | 'producer';
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  videoUrl?: string;
  locked?: boolean;
  attachments?: Attachment[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ProducerStats {
  totalRevenue: number;
  totalSales: number;
  activeStudents: number;
}

export interface Sale {
  id: string;
  studentName: string;
  studentEmail: string;
  productTitle: string;
  productId: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded';
}
