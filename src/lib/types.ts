import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL: string;
  content: string;
  timestamp: Timestamp;
  likes: string[]; // Array of user UIDs
  comments: Comment[];
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    timestamp: Timestamp;
}
