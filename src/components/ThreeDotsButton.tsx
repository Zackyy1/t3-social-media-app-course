import React from "react";

interface ThreeDotsButtonProps {
  onClick: () => void;
}

const ThreeDotsButton = ({ onClick }: ThreeDotsButtonProps) => {
  return (
    <button
      className="pr-2 text-xl hover:scale-110"
      onClick={() => onClick && onClick()}
    >
      •••
    </button>
  );
};

export default ThreeDotsButton;
