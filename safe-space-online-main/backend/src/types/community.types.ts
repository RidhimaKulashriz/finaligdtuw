export interface ICommunityPost {
  _id: string;
  user: string;
  title: string;
  content: string;
  category: string;
  likes: string[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  user: string;
  content: string;
  createdAt: Date;
}