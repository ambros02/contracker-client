import React from "react";
import styles from "@/styles/setup/usernameDrawer.module.css"


interface DrawerProps{
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const UsernameDrawer: React.FC<DrawerProps> = ({ open, onClose, children }) => (
  <div>
    {open && <div className={styles.drawerOverlay} onClick={onClose} />}
    <div
      className={`${styles.drawerPanel} ${open ? styles.drawerOpen : ""}`}
    >
      <h1>hello world</h1>
      {children}
    </div>
  </div>
);

export default UsernameDrawer;

