// Fix: Populating file with necessary type definitions for the application.
/*
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
*/
export enum UserRole {
  Admin = 'Admin',
  Visitor = 'Visitor',
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isApproved: boolean;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string; // Markdown content
  imageUrls: string[];
  comments: Comment[];
  carrousel?: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  base100Color: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  headerText: string;
  footerText: string;
}

export interface SocialLink {
  id: number;
  title: string;
  link: string;
  logo: string;
  order: number;
  isActive: boolean;
}