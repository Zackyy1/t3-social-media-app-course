import React, { useEffect } from "react";

interface UtilityMenuDropdownProps {
  deleteCallback: () => void;
  editCallback: () => void;
  closeMenu: () => void;
}

const UtilityMenuDropdown = ({
  deleteCallback,
  editCallback,
  closeMenu,
}: UtilityMenuDropdownProps) => {
  useEffect(() => {
    const handleClickOutside = () => closeMenu();
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <div className="absolute right-0 top-10 flex flex-col gap-2 rounded-md border border-slate-300/10 bg-slate-700 px-4 py-2">
      <button onMouseDown={() => editCallback && editCallback()}>Edit</button>
      <button onMouseDown={() => deleteCallback && deleteCallback()}>
        Delete
      </button>
    </div>
  );
};

export default UtilityMenuDropdown;
