import styles from "./Loader.module.css";

type Props = {
  className?: string;
};

export default function Loader({ className }: Props) {
  return (
    <span
      className={[styles.loader, className].filter(Boolean).join(" ")}
      aria-label="Loading"
      role="status"
    />
  );
}
