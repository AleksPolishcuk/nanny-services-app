"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "@/components/Modal/Modal";
import styles from "./AuthModal.module.css";
import { useAuth } from "@/context/AuthContext";
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/utils/validationSchema";

type Props = {
  isOpen: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "register") => void;
};

function mapFirebaseError(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "Email is already in use.";
    case "auth/weak-password":
      return "Password is too weak.";
    case "auth/too-many-requests":
      return "Too many requests. Try later.";
    default:
      return "Something went wrong. Try again.";
  }
}

function getErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const v = (err as { code?: unknown }).code;
    return typeof v === "string" ? v : undefined;
  }
  return undefined;
}

export default function AuthModal({
  isOpen,
  mode,
  onClose,
  onSwitchMode,
}: Props) {
  const { signIn, signUp } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: { name: "", email: "", password: "" },
  });

  const title = mode === "login" ? "Log In" : "Registration";
  const subtitle =
    mode === "login"
      ? "Welcome back! Please enter your credentials to access your account and continue your babysitter search."
      : "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.";

  const isSubmitting = useMemo(() => {
    return mode === "login"
      ? loginForm.formState.isSubmitting
      : registerForm.formState.isSubmitting;
  }, [
    mode,
    loginForm.formState.isSubmitting,
    registerForm.formState.isSubmitting,
  ]);

  const resetUiState = () => {
    setServerError(null);
    setShowPassword(false);
  };

  const resetForms = () => {
    loginForm.reset({ email: "", password: "" });
    registerForm.reset({ name: "", email: "", password: "" });
  };

  const handleClose = () => {
    resetUiState();
    resetForms();
    onClose();
  };

  const handleSwitchMode = (m: "login" | "register") => {
    resetUiState();
    resetForms();
    onSwitchMode(m);
  };

  const onSubmitLogin = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await signIn({ email: values.email, password: values.password });
      handleClose();
    } catch (err: unknown) {
      setServerError(mapFirebaseError(getErrorCode(err)));
    }
  };

  const onSubmitRegister = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      handleClose();
    } catch (err: unknown) {
      setServerError(mapFirebaseError(getErrorCode(err)));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel={title}>
      <div className={styles.wrap}>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="32" height="32" aria-hidden="true">
            <use href="/sprite.svg#icon-x" />
          </svg>
        </button>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        {mode === "login" ? (
          <form
            className={styles.form}
            onSubmit={loginForm.handleSubmit(onSubmitLogin)}
            noValidate
          >
            <div className={styles.field}>
              <input
                className={[
                  styles.input,
                  loginForm.formState.errors.email ? styles.inputError : "",
                ].join(" ")}
                placeholder="Email"
                type="email"
                autoComplete="email"
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email?.message && (
                <p className={styles.error}>
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.passwordBox}>
                <input
                  className={[
                    styles.input,
                    styles.inputPassword,
                    loginForm.formState.errors.password
                      ? styles.inputError
                      : "",
                  ].join(" ")}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...loginForm.register("password")}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg width="20" height="20" aria-hidden="true">
                    <use
                      href={`/sprite.svg#${
                        showPassword ? "icon-eye" : "icon-eye-off"
                      }`}
                    />
                  </svg>
                </button>
              </div>

              {loginForm.formState.errors.password?.message && (
                <p className={styles.error}>
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {serverError && <p className={styles.serverError}>{serverError}</p>}

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting}
            >
              Log In
            </button>

            <div className={styles.switchRow}>
              <span className={styles.switchText}>No account?</span>
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => handleSwitchMode("register")}
              >
                Registration
              </button>
            </div>
          </form>
        ) : (
          <form
            className={styles.form}
            onSubmit={registerForm.handleSubmit(onSubmitRegister)}
            noValidate
          >
            <div className={styles.field}>
              <input
                className={[
                  styles.input,
                  registerForm.formState.errors.name ? styles.inputError : "",
                ].join(" ")}
                placeholder="Name"
                type="text"
                autoComplete="name"
                {...registerForm.register("name")}
              />
              {registerForm.formState.errors.name?.message && (
                <p className={styles.error}>
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <input
                className={[
                  styles.input,
                  registerForm.formState.errors.email ? styles.inputError : "",
                ].join(" ")}
                placeholder="Email"
                type="email"
                autoComplete="email"
                {...registerForm.register("email")}
              />
              {registerForm.formState.errors.email?.message && (
                <p className={styles.error}>
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.passwordBox}>
                <input
                  className={[
                    styles.input,
                    styles.inputPassword,
                    registerForm.formState.errors.password
                      ? styles.inputError
                      : "",
                  ].join(" ")}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  {...registerForm.register("password")}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3l18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.5 6.5C4.2 8.2 2.8 10.7 2 12c1.2 2 4.5 7 10 7 1.4 0 2.6-.3 3.7-.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14.2 5.1c5.1 1.4 7.8 6.9 7.8 6.9-.4.7-1.1 1.8-2.1 2.9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {registerForm.formState.errors.password?.message && (
                <p className={styles.error}>
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {serverError && <p className={styles.serverError}>{serverError}</p>}

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting}
            >
              Sign Up
            </button>

            <div className={styles.switchRow}>
              <span className={styles.switchText}>
                Already have an account?
              </span>
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => handleSwitchMode("login")}
              >
                Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
