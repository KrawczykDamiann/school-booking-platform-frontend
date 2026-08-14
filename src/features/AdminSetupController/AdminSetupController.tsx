import { useState } from "react";
import { api } from "../../api/api";
import styles from "./styles.module.scss";

export const AdminSetupController: React.FC = () => {
  const handleSetup = async (s: number) => {
    const response = api.post(`/api/setup/examples/install?step=${s}`);

    console.log(response);
  };

  const steps = [0, 1, 2, 3, 4, 5, 6, 7];

  const [step, setStep] = useState(0);

  console.log(step);

  return (
    <div className={styles.setupController}>
      <h3>Setup controller</h3>
      <select
        value={step}
        onChange={(e) => setStep(+e.target.value)}
      >
        <option value="">Subjects:</option>
        {steps.map((s) => (
          <option value={s} key={s}>
            {s}
          </option>
        ))}
      </select>
      <button className={styles.btn} onClick={() => handleSetup(step)}>
        Setup
      </button>
    </div>
  );
};
