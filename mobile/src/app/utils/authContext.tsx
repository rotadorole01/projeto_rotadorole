import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import type { Usuario } from "./api";

type AuthContextProps = {
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  usuario: Usuario | null;
  logIn: (token: string, usuario: Usuario) => Promise<void>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  isLoading: true,
  token: null,
  usuario: null,
  logIn: async () => {},
  logOut: async () => {},
});

const STORAGE_KEY = "@rota_do_role/sessao";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const session = JSON.parse(saved);
          if (session.token && session.usuario) {
            setToken(session.token);
            setUsuario(session.usuario);
          }
        }
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
        await AsyncStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logIn = async (newToken: string, newUsuario: Usuario) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: newToken, usuario: newUsuario })
    );
    setToken(newToken);
    setUsuario(newUsuario);
  };

  const logOut = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: Boolean(token),
        isLoading,
        token,
        usuario,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
