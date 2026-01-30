import styles from './Avatar.module.css';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Avatar({ src, alt, size = 'medium', className = '' }: AvatarProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.avatar} ${styles[size]} ${className}`}
      loading="lazy"
    />
  );
}

