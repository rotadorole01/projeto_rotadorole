import { Redirect } from "expo-router";

// =====================================================
// PÁGINA INICIAL - ROTA DO ROLÊ
// =====================================================

export default function Home() {
  // Redireciona automaticamente para a Dashboard
  return <Redirect href="/dashboard" />;
}
