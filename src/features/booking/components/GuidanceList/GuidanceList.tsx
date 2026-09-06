import styles from "./GuidanceList.module.scss";

const guidanceList = [
  { id: 1, text: "Pick a subject from the list above." },
  { id: 2, text: "Browse available teachers and timeslots." },
  { id: 3, text: "Confirm your booking details." },
];

export const GuidanceList: React.FC = () => {
  return (
    <div className={styles.guidanceContainer}>
      <h4 className={styles.title}>How booking works</h4>
      <ul className={styles.list}>
        {guidanceList.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.itemStep}>{item.id}</span>
            <span className={styles.itemText}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
