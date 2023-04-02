import React from "react";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "@/utils/api";
import { UseTRPCMutationOptions } from "@trpc/react-query/shared";

interface LikesProps {
  count: number;
  commentId?: string;
  postId?: string;
  isLikedByMe: boolean;
  refreshCallback?: () => void;
}

const Likes = ({
  count,
  commentId,
  postId,
  isLikedByMe,
  refreshCallback,
}: LikesProps) => {
  const [likes, setLikes] = React.useState<number>(count);
  const [isLiked, setIsLiked] = React.useState<boolean>(isLikedByMe);

  const postOrComment = commentId ? "comment" : "post";

  // const successCallback = (data: number) => ;

  const apiCallback = {
    onSuccess: (data: number) => {
      setLikes(likes + data);
      setIsLiked(data === 1);
      refreshCallback && refreshCallback();
    },
  };

  const like =
    postOrComment === "comment"
      ? api.comment.like.useMutation(apiCallback)
      : api.post.like.useMutation(apiCallback);

  return (
    <button
      onClick={() =>
        like.mutate({
          id:
            postOrComment === "post"
              ? (postId as string)
              : (commentId as string),
        })
      }
    >
      {likes} <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeart} />
    </button>
  );
};

export default Likes;
