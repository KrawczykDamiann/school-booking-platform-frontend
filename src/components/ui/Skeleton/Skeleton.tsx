import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
}) => {
  const style = {
    width,
    height,
    "border-radius": borderRadius,
  };
  return <div className={styles.skeleton} style={style} />;
};
