import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function useAuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword(password)) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      if (isSignUp) {
        await api.signUp({
          email,
          password,
          options: {
            data: { full_name: formData.get("fullName") },
          },
        });
      } else {
        await api.signIn({ email, password });
      }
      navigate("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    loading,
    error,
    password,
    setPassword,
    passwordError,
    validatePassword,
    handleSubmit,
  };
}
