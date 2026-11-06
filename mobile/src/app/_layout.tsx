import { Stack } from "expo-router";
import AuthProvider from "./utils/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="eventos" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
  );
}