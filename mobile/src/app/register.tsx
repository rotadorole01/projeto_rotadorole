
import { Feather, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { cadastrar } from "./utils/api";

// =====================================================
// CADASTRO DE USUÁRIO - ROTA DO ROLÊ
// SEM MENU HAMBÚRGUER
// =====================================================

// Permite apenas números e no máximo 14 dígitos.
function formatarCNPJ(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 14);
}

export default function Register() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // DADOS DO CADASTRO
  const [namefull, setNamefull] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [senha2, setSenha2] = useState<string>("");
  const [usuario, setUsuario] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [nomeEmpresa, setNomeEmpresa] = useState<string>("");

  // TIPO DE CONTA
  const [tipoConta, setTipoConta] = useState<string>(
    "Apenas Usuário - Pessoa Física"
  );
  const [tipoAberto, setTipoAberto] = useState<boolean>(false);

  // RESPONSIVIDADE
  const telaPequena = width < 700;

  // CONTROLE DO CADASTRO
  const [carregando, setCarregando] = useState(false);

  async function onClickAcessar() {
    if (carregando) return;

    if (namefull.trim() === "") {
      Alert.alert(
        "Campo obrigatório",
        "O nome completo está em branco. Por favor, preencha o campo."
      );
      return;
    }

    if (usuario.trim() === "") {
      Alert.alert(
        "Campo obrigatório",
        "O e-mail está em branco. Por favor, preencha o campo."
      );
      return;
    }

    if (senha.trim() === "") {
      Alert.alert(
        "Campo obrigatório",
        "A senha está em branco. Por favor, preencha o campo."
      );
      return;
    }

    if (senha2.trim() === "") {
      Alert.alert(
        "Campo obrigatório",
        "Confirme sua senha."
      );
      return;
    }

    if (senha !== senha2) {
      Alert.alert(
        "Senhas diferentes",
        "As senhas informadas são diferentes. Por favor, corrija."
      );
      return;
    }

    const contaEmpresa =
      tipoConta === "Empresa ou Organizador - CNPJ";

    const cnpjLimpo = formatarCNPJ(cnpj);

    // EXIGE EXATAMENTE 14 NÚMEROS NO CNPJ
    if (contaEmpresa && cnpjLimpo.length !== 14) {
      Alert.alert(
        "CNPJ inválido",
        "O CNPJ deve conter exatamente 14 números."
      );
      return;
    }

    if (contaEmpresa && nomeEmpresa.trim().length < 2) {
      Alert.alert(
        "Cadastro empresarial",
        "Informe o nome da empresa."
      );
      return;
    }

    try {
      setCarregando(true);

      await cadastrar({
        name: namefull.trim(),
        email: usuario.trim(),
        password: senha,
        tipoConta: contaEmpresa ? "cnpj" : "usuario",
        ...(contaEmpresa
          ? {
              cnpj: cnpjLimpo,
              nomeEmpresa: nomeEmpresa.trim(),
            }
          : {}),
      });

      Alert.alert(
        "Cadastro realizado",
        "Sua conta foi criada. Agora você já pode entrar.",
        [
          {
            text: "Ir para o login",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Não foi possível cadastrar",
        error instanceof Error
          ? error.message
          : "Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* CABEÇALHO SEM MENU HAMBÚRGUER */}
        <LinearGradient
          colors={["#075b91", "#6b5a64", "#ff6633"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.header}
        >
          <View style={styles.logoArea}>
            <FontAwesome
              name="map-marker"
              size={30}
              color="#ffffff"
            />

            <Text style={styles.logo}>
              Rota do Rolê
            </Text>
          </View>
        </LinearGradient>

        {/* CONTEÚDO DA PÁGINA */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* TÍTULO */}
          <View style={styles.titleArea}>
            <Text
              style={[
                styles.titulo,
                telaPequena && styles.tituloMobile,
              ]}
            >
              Cadastro de Usuário
            </Text>

            <View style={styles.titleLine} />

            <Text style={styles.subtitle}>
              Crie sua conta para acessar todos os
              recursos da plataforma.
            </Text>
          </View>

          {/* CARD DO FORMULÁRIO */}
          <View
            style={[
              styles.main,
              telaPequena && styles.mainMobile,
            ]}
          >
            {/* TÍTULO DO FORMULÁRIO */}
            <View style={styles.sectionTitleArea}>
              <View style={styles.sectionTitleRow}>
                <Feather
                  name="user-plus"
                  size={25}
                  color="#07569a"
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    telaPequena && styles.sectionTitleMobile,
                  ]}
                >
                  Informações de Acesso
                </Text>
              </View>

              <View style={styles.sectionLine} />
            </View>

            {/* TIPO DE CONTA */}
            <Text style={styles.inputText}>
              Tipo de Conta *
            </Text>

            <Pressable
              style={styles.select}
              onPress={() => setTipoAberto(!tipoAberto)}
            >
              <Text style={styles.selectText}>
                {tipoConta}
              </Text>

              <Text style={styles.arrow}>
                {tipoAberto ? "▲" : "▼"}
              </Text>
            </Pressable>

            {/* OPÇÕES DO TIPO DE CONTA */}
            {tipoAberto && (
              <View style={styles.optionsContainer}>
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    setTipoConta(
                      "Apenas Usuário - Pessoa Física"
                    );
                    setTipoAberto(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    Apenas Usuário - Pessoa Física
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.option}
                  onPress={() => {
                    setTipoConta(
                      "Empresa ou Organizador - CNPJ"
                    );
                    setTipoAberto(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    Empresa ou Organizador - CNPJ
                  </Text>
                </Pressable>
              </View>
            )}

            {/* NOME COMPLETO */}
            <Text style={styles.inputText}>
              Nome Completo *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Informe o Nome Completo"
              placeholderTextColor="#999999"
              value={namefull}
              onChangeText={setNamefull}
            />

            {/* CAMPOS DE EMPRESA */}
            {tipoConta ===
              "Empresa ou Organizador - CNPJ" && (
              <>
                <Text style={styles.inputText}>
                  Nome da Empresa *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Informe o nome da empresa"
                  placeholderTextColor="#999999"
                  value={nomeEmpresa}
                  onChangeText={setNomeEmpresa}
                />

                {/* CNPJ: APENAS 14 NÚMEROS */}
                <Text style={styles.inputText}>
                  CNPJ *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Informe os 14 números do CNPJ"
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                  maxLength={14}
                  value={cnpj}
                  onChangeText={(valor) => {
                    setCnpj(formatarCNPJ(valor));
                  }}
                />
              </>
            )}

            {/* E-MAIL */}
            <Text style={styles.inputText}>
              E-mail *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Informe seu e-mail"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={usuario}
              onChangeText={setUsuario}
            />

            {/* SENHA */}
            <Text style={styles.inputText}>
              Senha *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Informe sua senha"
              placeholderTextColor="#999999"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            {/* REPETIR SENHA */}
            <Text style={styles.inputText}>
              Repetir senha *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Repita sua senha"
              placeholderTextColor="#999999"
              secureTextEntry
              value={senha2}
              onChangeText={setSenha2}
            />

            {/* BOTÃO CRIAR CONTA */}
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClickAcessar}
              disabled={carregando}
            >
              <Text style={styles.buttonText}>
                {carregando
                  ? "Cadastrando..."
                  : "Criar Conta"}
              </Text>
            </Pressable>

            {/* LINK PARA LOGIN */}
            <View style={styles.loginArea}>
              <Text style={styles.loginText}>
                Já possui cadastro?{" "}
              </Text>

              <Link href="/login" asChild>
                <Pressable>
                  <Text style={styles.textoLink}>
                    Faça o login!
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// =====================================================
// ESTILOS ORIGINAIS
// =====================================================

const styles = StyleSheet.create({
  // ESTRUTURA
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 50,
  },

  // CABEÇALHO SEM MENU
  header: {
    height: 75,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 10,
  },

  logoArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 9,
  },

  // TÍTULO DA PÁGINA
  titleArea: {
    alignItems: "center",
    paddingTop: 65,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  titulo: {
    color: "#07569a",
    fontSize: 38,
    fontWeight: "800",
    textAlign: "center",
  },

  tituloMobile: {
    fontSize: 29,
  },

  titleLine: {
    width: 70,
    height: 4,
    backgroundColor: "#ff5733",
    borderRadius: 5,
    marginTop: 19,
    marginBottom: 22,
  },

  subtitle: {
    color: "#68788c",
    fontSize: 15,
    textAlign: "center",
    maxWidth: 700,
  },

  // CARD DO FORMULÁRIO
  main: {
    width: "90%",
    maxWidth: 860,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 36,
    paddingVertical: 38,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  mainMobile: {
    width: "92%",
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderRadius: 14,
  },

  // TÍTULO DO CARD
  sectionTitleArea: {
    alignItems: "center",
    marginBottom: 30,
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    color: "#07569a",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginLeft: 9,
  },

  sectionTitleMobile: {
    fontSize: 20,
  },

  sectionLine: {
    width: 60,
    height: 4,
    backgroundColor: "#ff5733",
    borderRadius: 4,
    marginTop: 14,
  },

  // LABELS
  inputText: {
    width: "100%",
    color: "#123b63",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 9,
  },

  // INPUTS
  input: {
    width: "100%",
    height: 53,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 9,
    paddingHorizontal: 16,
    color: "#123b63",
    fontSize: 14,
    marginBottom: 24,
  },

  // SELECT - TIPO DE CONTA
  select: {
    width: "100%",
    height: 53,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 9,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  selectText: {
    flex: 1,
    color: "#315b84",
    fontSize: 14,
    paddingRight: 10,
  },

  arrow: {
    color: "#315b84",
    fontSize: 11,
  },

  // OPÇÕES DO SELECT
  optionsContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 9,
    overflow: "hidden",
    marginBottom: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },

  option: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  optionText: {
    color: "#315b84",
    fontSize: 14,
  },

  // BOTÃO CRIAR CONTA
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#ff5733",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  buttonPressed: {
    backgroundColor: "#e94c2b",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  // LINK LOGIN
  loginArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  loginText: {
    color: "#68788c",
    fontSize: 14,
  },

  textoLink: {
    color: "#07569a",
    fontSize: 14,
    fontWeight: "700",
  },
});
