import { getLanguageColor } from '../../utils';
import styles from './LanguageDot.module.css';

interface LanguageDotProps {
  language: string;
  showLabel?: boolean;
}

export function LanguageDot({ language, showLabel = true }: LanguageDotProps) {
  const color = getLanguageColor(language);

  return (
    <span className={styles.container}>
      <span
        className={styles.dot}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {showLabel && <span className={styles.label}>{language}</span>}
    </span>
  );
}

