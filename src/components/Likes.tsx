import React from "react";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "@/utils/api";

interface LikesProps {
  count: number;
  commentId: string;
  isLikedByMe: boolean;
  refreshCallback?: () => void;
}

const Likes = ({
  count,
  commentId,
  isLikedByMe,
  refreshCallback,
}: LikesProps) => {
  const [likes, setLikes] = React.useState<number>(count);
  const [isLiked, setIsLiked] = React.useState<boolean>(isLikedByMe);

  const likeComment = api.like.likeComment.useMutation({
    onSuccess: (data) => {
      setLikes(likes + data);
      setIsLiked(data === 1);
      refreshCallback && refreshCallback();
    },
  });

  return (
    <button onClick={() => likeComment.mutate({ id: commentId })}>
      {likes} <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeart} />
    </button>
  );
};

export default Likes;
