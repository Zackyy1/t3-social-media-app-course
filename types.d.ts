type PostProps = {
  author: {
    name: string;
    id: string;
  };
  content: string;
  createdAt: string;
  _count: {
    comments: number;
  };
  id: string;
  hideAdditionalData?: boolean;
  refreshCallback?: () => void;
};

type CommentProps = {
  author: {
    name: string;
  };
  content: string;
  createdAt: string;
  id: string;
  postId: string;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  posts: PostProps[];
  friends: UserProps[];
  friendOf: UserProps[];
  comments: CommentProps[];
  _count?: {
    friends: number;
    friendOf: number;
    comments: number;
    posts: number;
  };
};
