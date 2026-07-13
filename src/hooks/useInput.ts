import { useState } from "react";

type UseInputProps = {
  initialValue?: string;
  validator: (value: string) => string;
};

export function useInput({ initialValue = "", validator }: UseInputProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const validationError = validator(value) ?? "";

  const isValid = value.length > 0 && validationError === "";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (error) {
      setError("");
    }
  };

  const onBlur = () => {
    setError(validationError);
  };

  return {
    value,
    error,
    isValid,
    onChange,
    onBlur,
    setValue,
    setError,
  };
}
