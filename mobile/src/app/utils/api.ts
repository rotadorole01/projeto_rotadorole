import { Platform } from "react-native";

// Cliente central da API do Rota do Rolê.
// IMPORTANTE: no celular, use o IPv4 do computador na mesma rede Wi-Fi,
// nunca "localhost". Configure EXPO_PUBLIC_API_URL no arquivo .env do mobile.
export const API_URL =
  (process.env.EXPO_PUBLIC_API_URL ||
    (Platform.OS === "web"
      ? "http://localhost:3600"
      : "http://192.168.10.42:3600")).replace(/\/$/, "");

type ApiResponse<T> = {
  message?: string;
  data?: T;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Não foi possível conectar à API em ${API_URL}. Confira se o servidor está ligado, se o celular e o computador estão no mesmo Wi-Fi e se o endereço IP está correto.`
    );
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || `Erro na API (${response.status}).`);
  }
  return body as T;
}

export type Usuario = {
  id: number;
  name: string;
  email: string;
  telefone?: string | null;
  cidade?: string | null;
  foto_perfil?: string | null;
  tipo_conta?: string;
  nome_empresa?: string | null;
};

export type LoginResult = {
  message: string;
  data: { token: string; usuario: Usuario };
};

export async function entrar(email: string, password: string) {
  return request<LoginResult>("/logins/entrar", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function cadastrar(dados: {
  name: string;
  email: string;
  password: string;
  tipoConta: "usuario" | "cnpj";
  cnpj?: string;
  nomeEmpresa?: string;
}) {
  return request<ApiResponse<Usuario>>("/logins/cadastro", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function listarEventos() {
  return request<ApiResponse<any[]>>("/eventos");
}

export async function listarCategorias() {
  return request<ApiResponse<any[]>>("/categorias");
}

export async function obterPerfil(token: string) {
  return request<ApiResponse<Usuario>>("/logins/perfil", {}, token);
}
