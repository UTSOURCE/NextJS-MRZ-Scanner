import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h2>MRZ Scanner</h2>
      <button>Start Scanning</button>
    </main>
  );
}
