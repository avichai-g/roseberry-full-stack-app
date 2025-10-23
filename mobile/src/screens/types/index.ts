export type Task = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
};
