

type PostProps = {
  author: {
    name: string;
  };
  content: string;
  createdAt: string;
  _count: {
    comments: number;
  };
  id: string;
  hideAdditionalData?: boolean;
}


type CommentProps = {
  author: {
    name: string;
  };
  content: string;
  createdAt: string;
  id: string;
  postId: string;
  
}