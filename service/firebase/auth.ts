import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

export async function signUp(params: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: User }> {
  const { name, email, password } = params;

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name });
  }

  return { user: cred.user };
}

export async function signIn(params: {
  email: string;
  password: string;
}): Promise<{ user: User }> {
  const { email, password } = params;

  const cred = await signInWithEmailAndPassword(auth, email, password);
  return { user: cred.user };
}

export async function logout(): Promise<void> {
  await signOut(auth);
}
