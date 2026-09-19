import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height }) => {
  const style = {
    width,
    height,
  };
  return <div className={styles.skeleton} style={style} />;
};
