import { SignUpForm } from "./SignUpForm";
import { PasswordSetupForm } from "./PasswordSetupForm";

type SignUpStep = "account" | "password";

type Props = {
  step: SignUpStep;
  setStep: React.Dispatch<React.SetStateAction<SignUpStep>>;
};

export const SignUpFlow: React.FC<Props> = ({ step, setStep }) => {

  return (
    <>
      {step === "account" && (
        <SignUpForm onContinue={() => setStep("password")} />
      )}

      {step === "password" && <PasswordSetupForm onBack={() => setStep("account")} />}
    </>
  );
};
