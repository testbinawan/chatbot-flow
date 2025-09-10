export type BotTemplateData = {
  id: number;
  name: string;
  media_id: number;
  is_active: number;
  created: string;
  updated: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  nodes?: any[]; // Using any for now, but could be more specific if needed
  connections?: any[]; // Using any for now, but could be more specific if needed
}