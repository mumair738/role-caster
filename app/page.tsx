"use client";
import { MintRoleNFT } from "../components/MintRoleNFT"; // Import the new component
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <button className={styles.closeButton} type="button">
        ✕
      </button>

      <div className={styles.content}>
        {/* The MintRoleNFT component will be rendered here */}
        <MintRoleNFT />
      </div>
    </div>
  );
}
