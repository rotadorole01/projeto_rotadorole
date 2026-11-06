import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthContext } from "./utils/authContext";
import { entrar } from "./utils/api";

export default function Login() {
  const router = useRouter();

  // Estados seguindo o padrão utilizado na aula
  const [senha, setSenha] = useState<string>("");
  const [usuario, setUsuario] = useState<string>("");

  // Contexto de autenticação utilizado na aula
  const auth = useContext(AuthContext);

  const [carregando, setCarregando] = useState(false);

  async function onClickAcessar() {
    if (!usuario.trim() || !senha) {
      Alert.alert("Atenção", "Informe seu e-mail e sua senha.");
      return;
    }
    try {
      setCarregando(true);
      const resposta = await entrar(usuario.trim(), senha);
      await auth.logIn(resposta.data.token, resposta.data.usuario);
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert(
        "Não foi possível entrar",
        error instanceof Error ? error.message : "Verifique seus dados e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pagina}>
        {/* CABEÇALHO */}
        <LinearGradient
          colors={["#075b91", "#6b5a64", "#ff6633"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.header}
        >
          <View style={styles.logoArea}>
            <FontAwesome name="map-marker" size={32} color="#ffffff" />

            <Text style={styles.logo}>Rota do Rolê</Text>
          </View>
        </LinearGradient>

        {/* CONTEÚDO PRINCIPAL */}
        <View style={styles.main}>
          {/* CARD DE LOGIN */}
          <View style={styles.card}>
            {/* TÍTULO */}
            <View style={styles.tituloArea}>
              <View style={styles.tituloLinha}>
                <Feather name="log-in" size={28} color="#075b91" />

                <Text style={styles.titulo}>Entrar na Conta</Text>
              </View>

              <View style={styles.detalheTitulo} />
            </View>

            {/* CAMPO E-MAIL */}
            <Text style={styles.inputText}>E-mail *</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail cadastrado"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) => {
                setUsuario(value);
              }}
            />

            {/* CAMPO SENHA */}
            <Text style={styles.inputText}>Senha *</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={(value) => {
                setSenha(value);
              }}
            />

            {/* BOTÃO ENTRAR */}
            <Pressable
              style={styles.botao}
              onPress={() => {
                onClickAcessar();
              }}
            >
              <Text style={styles.textoBotao}>{carregando ? "Conectando..." : "Entrar"}</Text>
            </Pressable>

            {/* LINK PARA CADASTRO */}
            <View style={styles.cadastroArea}>
              <Text style={styles.cadastroTexto}>
                Ainda não tem uma conta?{" "}
              </Text>

              <Link href={"/register"}>
                <Text style={styles.textoLink}>Cadastre-se aqui</Text>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  pagina: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  // CABEÇALHO
  header: {
    height: 80,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logoArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    marginLeft: 10,
  },

  // CONTEÚDO PRINCIPAL
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  // CARD
  card: {
    width: "100%",
    maxWidth: 550,

    backgroundColor: "#ffffff",

    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,

    paddingHorizontal: 25,
    paddingVertical: 35,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.12,
    shadowRadius: 7,

    elevation: 5,
  },

  // TÍTULO
  tituloArea: {
    alignItems: "center",
    marginBottom: 30,
  },

  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  titulo: {
    color: "#075b91",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 9,
  },

  detalheTitulo: {
    width: 48,
    height: 4,
    backgroundColor: "#ff6633",
    borderRadius: 5,
    marginTop: 13,
  },

  // TEXTOS DOS CAMPOS
  inputText: {
    color: "#173b5e",
    fontWeight: "600",
    fontSize: 14,
    width: "100%",
    marginBottom: 8,
  },

  // CAMPOS
  input: {
    width: "100%",
    height: 50,

    backgroundColor: "#f7f8f9",

    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 5,

    paddingHorizontal: 14,

    color: "#222222",
    fontSize: 14,

    marginBottom: 20,
  },

  // BOTÃO ENTRAR
  botao: {
    width: "100%",
    height: 50,

    backgroundColor: "#ff6633",

    borderRadius: 6,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ÁREA DE CADASTRO
  cadastroArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  cadastroTexto: {
    color: "#333333",
    fontSize: 14,
  },

  textoLink: {
    color: "#ff6633",
    fontSize: 14,
    fontWeight: "bold",
  },
});
