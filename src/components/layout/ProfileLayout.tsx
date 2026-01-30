import { ReactNode } from 'react';
import styles from './ProfileLayout.module.css';

interface ProfileLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function ProfileLayout({ sidebar, content }: ProfileLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        {sidebar}
      </aside>
      <main className={styles.content}>
        {content}
      </main>
    </div>
  );
}

