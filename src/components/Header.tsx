import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { push as Menu } from "react-burger-menu";
import AuthButtons from "./AuthButtons";

const styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "36px",
    height: "30px",
    right: "12px",
    top: "12px",
  },
  bmBurgerBars: {
    background: "#ffffff",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenuWrap: {
    position: "fixed",
    height: "100%",
    zIndex: "999999",
  },
  bmMenu: {
    background: "#373a47",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em",
    minHeight: "100vh",
    zIndex: "999999",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
  },

  bmItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },

  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
  },
};

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleIsOpen = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  return (
    <div
      className="z-[99999] flex min-h-[60px]   bg-slate-800 text-center"
      id="header"
    >
      <Link className="absolute self-center pl-4 font-bold" href="/">
        Home
      </Link>
      {session ? (
        <Menu
          right
          pageWrapId={"page-content"}
          outerContainerId={"header"}
          disableCloseOnEsc
          styles={styles}
          isOpen={isOpen}
          onOpen={handleIsOpen}
          onClose={handleIsOpen}
        >
          <div id="reveal-container">
            <div className="flex flex-col gap-4">
              <Link
                onClick={closeSideBar}
                id="home"
                className="menu-item"
                href="/"
              >
                Feed
              </Link>
              <Link
                onClick={closeSideBar}
                id="home"
                className="menu-item"
                href="/"
              >
                New Post
              </Link>
              <Link
                onClick={closeSideBar}
                id="home"
                className="menu-item"
                href="/"
              >
                Friends
              </Link>
              <Link
                onClick={closeSideBar}
                id="home"
                className="menu-item"
                href={`/user/${session.user.id}`}
              >
                My Profile
              </Link>
            </div>
            <div>
              <AuthButtons />
            </div>
          </div>
        </Menu>
      ) : (
        <AuthButtons />
      )}
    </div>
  );
};

export default Header;
