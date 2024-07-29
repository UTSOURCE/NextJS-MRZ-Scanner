"use client"
import styles from "./page.module.css";
import { useState } from "react";
import MRZScanner from "@/components/MRZScanner";

export default function Home() {
  const [isScanning,setIsScanning] = useState(false);
  const [initialized,setInitialized] = useState(false);
  return (
    <main className={styles.main}>
      <h2>MRZ Scanner</h2>
      {!initialized &&(
        <button disabled>Initializing...</button>  
      )}
      {initialized &&(
        <button onClick={()=>setIsScanning(!isScanning)} >{isScanning?"Stop Scanning":"Start Scanning"}</button>
      )}
      <div className={styles.scanner}>
        <div className={styles.cameracontainer + ((initialized && isScanning) ? "" : " "+styles.hidden)}>
          <MRZScanner 
            isScanning={isScanning}
            initialized={()=>{setInitialized(true)}}
          ></MRZScanner>
        </div>
      </div>
      
    </main>
  );
}
