import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../utils/authContext";

export default function AuthLayout() {
  const auth = useContext(AuthContext);

  if (!auth.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
