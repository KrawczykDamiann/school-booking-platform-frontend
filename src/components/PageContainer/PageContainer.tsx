import styles from './PageContainer.module.scss';

type Props = {
    children: React.ReactNode;
}

export const PageContainer: React.FC<Props> = ({ children }) => {
  return <div className={styles.pageContainer}>{children}</div>;
};
