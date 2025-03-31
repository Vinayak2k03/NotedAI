"use client"

import { account } from "@/lib/appwrite";
import { ID, Models, OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";
import {createContext, useContext, useEffect, useState} from "react";

// Define the shape of our context
interface UserContextType {
  current: Models.Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  current: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  loginWithGoogle: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export function useUser() {
  return useContext(UserContext);
}

// Fix the empty object type cor by using a proper React component type
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.Session | null>(null);
  const router = useRouter();

  async function login(email: string, password: string) {
    const loggedIn: Models.Session = await account.createEmailPasswordSession(email, password);
    setUser(loggedIn);
    router.push("/dashboard");
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    router.push("/");
  }

  async function loginWithGoogle() {
    await account.createOAuth2Session(OAuthProvider.Google,
      new URL("/dashboard", window.location.origin).toString()
    );
  }

  async function register(email: string, password: string, name: string) {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  }

  async function init() {
    try {
      const user = await (account.get()) as unknown as Models.Session;
      setUser(user);
    } catch(err) {
      setUser(null);
      console.log(err);
    }
  }

  useEffect(() => {
    init();
  }, []);
  
  return (
    <UserContext.Provider value={{
      current: user,
      login,
      logout,
      loginWithGoogle,
      register
    }}>
      {children}
    </UserContext.Provider>
  );
}