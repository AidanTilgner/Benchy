import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>Main</main>
      <footer className={styles.footer}>Footer</footer>
    </div>
  );
}
