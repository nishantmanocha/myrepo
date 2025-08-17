import { LoginManager, AccessToken, Profile } from "react-native-fbsdk-next";
import { auth } from "./facebookFirebase";
import {
  FacebookAuthProvider,
  signInWithCredential,
  linkWithCredential,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

/**
 * Sign-in with Facebook (creates or returns Firebase user)
 */
export async function signInWithFacebook(): Promise<User> {
  // Ensure previous FB sessions are cleared (optional, prevents stuck state)
  try {
    await LoginManager.logOut();
  } catch {}

  // Request permissions
  const result = await LoginManager.logInWithPermissions([
    "public_profile",
    "email",
  ]);

  if (result.isCancelled) {
    throw new Error("Facebook login cancelled");
  }

  // Get FB access token
  const data = await AccessToken.getCurrentAccessToken();
  if (!data?.accessToken) {
    throw new Error("Failed to obtain Facebook access token");
  }

  // Build Firebase credential & sign in
  const credential = FacebookAuthProvider.credential(data.accessToken);
  const userCred = await signInWithCredential(auth, credential);
  return userCred.user;
}

/**
 * Link currently signed-in Firebase user with Facebook (optional)
 * Useful if user first signed up with email/password and later adds Facebook.
 */
export async function linkFacebook(): Promise<User> {
  const data = await AccessToken.getCurrentAccessToken();
  if (!data?.accessToken) {
    // If no token yet, trigger FB login
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);
    if (result.isCancelled) throw new Error("Facebook linking cancelled");
  }
  const token = (await AccessToken.getCurrentAccessToken())?.accessToken;
  if (!token) throw new Error("Missing Facebook access token");

  const cred = FacebookAuthProvider.credential(token);
  if (!auth.currentUser)
    throw new Error("No authenticated Firebase user to link");

  const res = await linkWithCredential(auth.currentUser, cred);
  return res.user;
}

/**
 * Logout (Firebase + FB SDK)
 */
export async function logout(): Promise<void> {
  try {
    await LoginManager.logOut();
  } catch {}
  await signOut(auth);
}

/**
 * Subscribe to auth changes
 */
export function listenAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
