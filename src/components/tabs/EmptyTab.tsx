import { Icon } from '../common';
import styles from './EmptyTab.module.css';

interface EmptyTabProps {
  title: string;
  description: string;
  icon: string;
}

export function EmptyTab({ title, description, icon }: EmptyTabProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Icon name={icon} size={24} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

