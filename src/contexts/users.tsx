import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, database } from "@util/firebase";

import User from "@customTypes/users";

interface ContextProps {
  children: React.ReactNode;
}

export const UserContext = createContext<User | null>(null);

export default function UserContextProvider({ children }: ContextProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        onSnapshot(doc(database, "users", authUser.uid), (docu) => {
          const data = docu.data() as User;
          if (data && data.email && data.id && data.name) {
            setUser({
              email: data.email,
              id: data.id,
              name: data.name,
            });
          } else {
            setUser(null);
          }
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
