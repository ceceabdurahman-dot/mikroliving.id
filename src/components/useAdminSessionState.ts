import { FormEvent, useState } from "react";
import { api } from "../services/api";
import { type BusyState, type LoginForm } from "./adminPanelTypes";
import { getErrorMessage } from "./adminPanelUtils";

type UseAdminSessionStateArgs = {
  setBusy: (value: BusyState) => void;
  setIsAuthenticated: (value: boolean) => void;
};

export default function useAdminSessionState({
  setBusy,
  setIsAuthenticated,
}: UseAdminSessionStateArgs) {
  const [loginMessage, setLoginMessage] = useState("");
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });

  const handleLogin = async (event: FormEvent, onAfterLogin: () => Promise<void>) => {
    event.preventDefault();
    setBusy("loading");
    setLoginMessage("");

    try {
      await api.login(loginForm);
      setIsAuthenticated(true);
      setLoginForm({ username: "", password: "" });
      await onAfterLogin();
    } catch (error) {
      setLoginMessage(getErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setBusy("idle");
    }
  };

  const handleLogout = async (onConfirmLogout: () => boolean, onAfterLogout: () => void) => {
    if (!onConfirmLogout()) {
      return;
    }

    setBusy("loading");

    try {
      await api.logout();
    } finally {
      setIsAuthenticated(false);
      onAfterLogout();
      setBusy("idle");
    }
  };

  return {
    loginForm,
    loginMessage,
    setLoginForm,
    handleLogin,
    handleLogout,
  };
}
