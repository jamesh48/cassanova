// components/page-container.tsx
import styles from "./page-container.module.css";

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
