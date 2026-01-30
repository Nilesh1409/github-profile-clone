import styles from './Counter.module.css';

interface CounterProps {
  count: number;
}

export function Counter({ count }: CounterProps) {
  const displayCount = count > 999 ? '999+' : count.toString();
  
  return (
    <span className={styles.counter}>
      {displayCount}
    </span>
  );
}

