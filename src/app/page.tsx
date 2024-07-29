"use client"
import styles from "./page.module.css";
import { useState } from "react";
import MRZScanner from "@/components/MRZScanner";

export default function Home() {
  const [isScanning,setIsScanning] = useState(false);
  return (
    <main className={styles.main}>
      <h2>MRZ Scanner</h2>
      <button onClick={()=>setIsScanning(!isScanning)} >{isScanning?"Stop Scanning":"Start Scanning"}</button>
      <div className={styles.cameraContainer}>
        <MRZScanner isScanning={isScanning}></MRZScanner>
      </div>
    </main>
  );
}
