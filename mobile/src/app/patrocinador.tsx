
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// =====================================================
// IDENTIDADE VISUAL
// =====================================================

const AZUL = "#07569a";
const LARANJA = "#ff6633";
const FUNDO = "#f5f6f8";

// =====================================================
// OPÇÕES DO FORMULÁRIO
// =====================================================

const areasAtuacao = [
  "Bares e Pubs",
  "Restaurantes",
  "Lanchonetes",
  "Gastronomia",
  "Entretenimento",
  "Eventos e Shows",
  "Comércio",
  "Turismo e Hotelaria",
  "Serviços",
  "Educação",
  "Saúde e Bem-estar",
  "Outros",
];

const interesses = [
  "Patrocinar Eventos",
  "Anunciar na Plataforma",
  "Divulgar meu Estabelecimento",
  "Divulgar Produtos e Serviços",
  "Parceria Comercial",
  "Outros",
];

// =====================================================
// COMPONENTE DE SELEÇÃO
// =====================================================

function CampoSelecao({
  valor,
  placeholder,
  opcoes,
  onChange,
}: {
  valor: string;
  placeholder: string;
  opcoes: string[];
  onChange: (valor: string) => void;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={styles.selectContainer}>
      <Pressable
        style={styles.select}
        onPress={() => setAberto(!aberto)}
      >
        <Text
          style={[
            styles.selectText,
            !valor && styles.placeholderText,
          ]}
        >
          {valor || placeholder}
        </Text>

        <Ionicons
          name={aberto ? "chevron-up" : "chevron-down"}
          size={19}
          color="#34506b"
        />
      </Pressable>

      {aberto && (
        <View style={styles.optionsContainer}>
          {opcoes.map((opcao) => (
            <Pressable
              key={opcao}
              style={styles.option}
              onPress={() => {
                onChange(opcao);
                setAberto(false);
              }}
            >
              <Text style={styles.optionText}>
                {opcao}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// =====================================================
// FORMATAR CNPJ
// =====================================================

function formatarCNPJ(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 14);

  return numeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

// =====================================================
// VALIDAR CNPJ
// =====================================================

function validarCNPJ(valor: string) {
  const numeros = valor.replace(/\D/g, "");

  if (numeros.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(numeros)) {
    return false;
  }

  function calcularDigito(base: string, pesos: number[]) {
    const soma = pesos.reduce(
      (total, peso, indice) =>
        total + Number(base[indice]) * peso,
      0
    );

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  }

  const primeiro = calcularDigito(
    numeros.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  const segundo = calcularDigito(
    numeros.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return (
    primeiro === Number(numeros[12]) &&
    segundo === Number(numeros[13])
  );
}

// =====================================================
// FORMATAR TELEFONE
// =====================================================

function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) {
    return numeros.length ? `(${numeros}` : "";
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(
      2,
      6
    )}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(
    2,
    7
  )}-${numeros.slice(7)}`;
}

// =====================================================
// PÁGINA PATROCINADOR
// =====================================================

export default function Patrocinador() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const mobile = width < 700;

  // ===================================================
  // MENU HAMBÚRGUER
  // ===================================================

  const [menuAberto, setMenuAberto] = useState(false);

  // ===================================================
  // CAMPOS DO FORMULÁRIO
  // ===================================================

  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [area, setArea] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [interesse, setInteresse] = useState("");
  const [mensagemAdicional, setMensagemAdicional] =
    useState("");

  // ===================================================
  // MENSAGENS
  // ===================================================

  function mostrarMensagem(titulo: string, mensagem: string) {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.alert(`${titulo}\n\n${mensagem}`);
      }
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  // ===================================================
  // NAVEGAÇÃO
  // ===================================================

  function irParaInicio() {
    setMenuAberto(false);
    router.navigate("/dashboard");
  }

  function irParaEventos() {
    setMenuAberto(false);
    router.navigate("/eventos");
  }

  function irParaCadastro() {
    setMenuAberto(false);
    router.navigate("/cadastro");
  }

  function irParaMinhaConta() {
    setMenuAberto(false);
    router.navigate("/perfil");
  }

  function irParaSobreNos() {
    setMenuAberto(false);
    router.navigate("/sobrenos");
  }

  function irParaQuiz() {
    setMenuAberto(false);
    router.navigate("/quiz");
  }

  // ===================================================
  // NOVO: BOTÃO SAIR
  // ===================================================

  function irParaLogin() {
    setMenuAberto(false);
    router.replace("/login");
  }

  // ===================================================
  // VALIDAR FORMULÁRIO
  // ===================================================

  function enviarSolicitacao() {
    if (!empresa.trim()) {
      mostrarMensagem(
        "Campo obrigatório",
        "Informe o nome da empresa ou negócio."
      );
      return;
    }

    if (cnpj.trim() && !validarCNPJ(cnpj)) {
      mostrarMensagem(
        "CNPJ inválido",
        "Informe um CNPJ válido ou deixe o campo em branco."
      );
      return;
    }

    if (!area) {
      mostrarMensagem(
        "Campo obrigatório",
        "Selecione a área de atuação."
      );
      return;
    }

    if (!responsavel.trim()) {
      mostrarMensagem(
        "Campo obrigatório",
        "Informe o nome do responsável."
      );
      return;
    }

    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (
      telefoneNumeros.length !== 10 &&
      telefoneNumeros.length !== 11
    ) {
      mostrarMensagem(
        "Telefone inválido",
        "Informe um telefone com DDD válido."
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email.trim())) {
      mostrarMensagem(
        "E-mail inválido",
        "Informe um e-mail corporativo válido."
      );
      return;
    }

    if (!interesse) {
      mostrarMensagem(
        "Campo obrigatório",
        "Selecione seu interesse principal."
      );
      return;
    }

    // DADOS PRONTOS PARA INTEGRAÇÃO COM API

    const dadosSolicitacao = {
      empresa: empresa.trim(),
      cnpj: cnpj.replace(/\D/g, ""),
      areaAtuacao: area,
      responsavel: responsavel.trim(),
      telefone: telefoneNumeros,
      email: email.trim().toLowerCase(),
      interessePrincipal: interesse,
      mensagemAdicional: mensagemAdicional.trim(),
    };

    // Ainda não existe integração com o servidor.
    // Os dados estão preparados para o envio futuro.

    mostrarMensagem(
      "Formulário validado",
      "Os dados foram preenchidos corretamente. A solicitação ainda não foi enviada porque a integração com o servidor precisa ser configurada."
    );
  }

  // ===================================================
  // INTERFACE
  // ===================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ==========================================
            CABEÇALHO ROTA DO ROLÊ
        ========================================== */}

        <LinearGradient
          colors={["#075b91", "#6b5a64", "#ff6633"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.header}
        >
          <Pressable
            style={styles.logoArea}
            onPress={irParaInicio}
          >
            <FontAwesome
              name="map-marker"
              size={30}
              color="#ffffff"
            />

            <Text style={styles.logo}>
              Rota do Rolê
            </Text>
          </Pressable>

          <Pressable
            style={styles.botaoMenu}
            onPress={() => setMenuAberto(!menuAberto)}
            accessibilityLabel="Abrir menu"
          >
            <Ionicons
              name={menuAberto ? "close" : "menu"}
              size={32}
              color="#ffffff"
            />
          </Pressable>
        </LinearGradient>

        {/* ==========================================
            MENU HAMBÚRGUER ATUALIZADO
        ========================================== */}

        {menuAberto && (
          <View style={styles.menu}>

            {/* INÍCIO */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaInicio}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
                Início
              </Text>
            </Pressable>

            {/* EVENTOS - DESTAQUE LARANJA */}

            <Pressable
              style={[
                styles.itemMenu,
                styles.itemMenuAtivo,
              ]}
              onPress={irParaEventos}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={LARANJA}
              />

              <Text
                style={[
                  styles.textoMenu,
                  styles.textoMenuAtivo,
                ]}
              >
                Eventos
              </Text>
            </Pressable>

            {/* CADASTRAR EVENTO */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaCadastro}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
                Cadastrar Evento
              </Text>
            </Pressable>

            {/* MINHA CONTA */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaMinhaConta}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
                Minha Conta
              </Text>
            </Pressable>

            {/* SOBRE NÓS */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaSobreNos}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
                Sobre Nós
              </Text>
            </Pressable>

            {/* QUIZ DO ROLÊ */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaQuiz}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
                Quiz do Rolê
              </Text>
            </Pressable>

            {/* NOVO: SAIR */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaLogin}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
                Sair
              </Text>
            </Pressable>

          </View>
        )}

        {/* ==========================================
            CONTEÚDO PRINCIPAL
        ========================================== */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* BANNER */}

          <LinearGradient
            colors={["#4d5a79", "#806064", "#c86749"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.banner,
              mobile && styles.bannerMobile,
            ]}
          >
            <Text
              style={[
                styles.bannerTitle,
                mobile && styles.bannerTitleMobile,
              ]}
            >
              Conecte sua marca à Rota do Rolê!
            </Text>

            <Text style={styles.bannerDescription}>
              Destaque o seu negócio para milhares de pessoas que
              buscam diversão, cultura e gastronomia na cidade.
            </Text>
          </LinearGradient>

          {/* ========================================
              FORMULÁRIO
          ======================================== */}

          <View
            style={[
              styles.formCard,
              mobile && styles.formCardMobile,
            ]}
          >

            {/* TÍTULO */}

            <View style={styles.titleArea}>
              <Text
                style={[
                  styles.formTitle,
                  mobile && styles.formTitleMobile,
                ]}
              >
                Solicitar Contato Comercial
              </Text>

              <View style={styles.titleLine} />
            </View>

            {/* EMPRESA */}

            <Text style={styles.label}>
              Nome da Empresa / Negócio *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Cervejaria Artesanal TQ"
              placeholderTextColor="#999999"
              value={empresa}
              onChangeText={setEmpresa}
              autoCapitalize="words"
            />

            {/* CNPJ E ÁREA */}

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <Text style={styles.label}>
                  CNPJ
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="00.000.000/0000-00"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  maxLength={18}
                  value={cnpj}
                  onChangeText={(valor) =>
                    setCnpj(formatarCNPJ(valor))
                  }
                />
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>
                  Área de Atuação *
                </Text>

                <CampoSelecao
                  valor={area}
                  placeholder="Selecione..."
                  opcoes={areasAtuacao}
                  onChange={setArea}
                />
              </View>
            </View>

            {/* RESPONSÁVEL E TELEFONE */}

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <Text style={styles.label}>
                  Nome do Responsável *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#999999"
                  value={responsavel}
                  onChangeText={setResponsavel}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>
                  Telefone / WhatsApp *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="(16) 99999-9999"
                  placeholderTextColor="#999999"
                  keyboardType="phone-pad"
                  maxLength={15}
                  value={telefone}
                  onChangeText={(valor) =>
                    setTelefone(formatarTelefone(valor))
                  }
                />
              </View>
            </View>

            {/* EMAIL */}

            <Text style={styles.label}>
              Email Corporativo *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="contato@suaempresa.com.br"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            {/* INTERESSE */}

            <Text style={styles.label}>
              Qual é o seu interesse principal? *
            </Text>

            <CampoSelecao
              valor={interesse}
              placeholder="Selecione..."
              opcoes={interesses}
              onChange={setInteresse}
            />

            {/* MENSAGEM ADICIONAL */}

            <Text style={styles.label}>
              Mensagem Adicional (Opcional)
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              placeholder="Conte um pouco sobre sua empresa e o que espera da parceria..."
              placeholderTextColor="#999999"
              value={mensagemAdicional}
              onChangeText={setMensagemAdicional}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            {/* BOTÃO ENVIAR */}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitPressed,
              ]}
              onPress={enviarSolicitacao}
            >
              <Ionicons
                name="paper-plane"
                size={18}
                color="#ffffff"
              />

              <Text style={styles.submitText}>
                Enviar Solicitação
              </Text>
            </Pressable>

          </View>

          {/* RODAPÉ */}

          <Text style={styles.footerText}>
            Rota do Rolê — Sua marca conectada às melhores
            experiências da cidade.
          </Text>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

  // ESTRUTURA

  safeArea: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 50,
  },

  // CABEÇALHO

  header: {
    height: 75,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  botaoMenu: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  // MENU HAMBÚRGUER

  menu: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingVertical: 5,
    elevation: 5,
    zIndex: 9,
  },

  itemMenu: {
    height: 50,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  // NOVO: ITEM SELECIONADO LARANJA

  itemMenuAtivo: {
    backgroundColor: "#fff0e8",
    borderLeftWidth: 4,
    borderLeftColor: LARANJA,
    paddingLeft: 21,
  },

  textoMenuAtivo: {
    color: LARANJA,
    fontWeight: "800",
  },

  // BANNER

  banner: {
    width: "100%",
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 50,
  },

  bannerMobile: {
    minHeight: 200,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 55,
  },

  bannerTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },

  bannerTitleMobile: {
    fontSize: 25,
  },

  bannerDescription: {
    color: "#ffffff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
    maxWidth: 660,
  },

  // FORMULÁRIO

  formCard: {
    width: "90%",
    maxWidth: 650,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingTop: 35,
    paddingBottom: 30,
    marginTop: -28,
    elevation: 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  formCardMobile: {
    width: "94%",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 25,
    marginTop: -25,
  },

  // TÍTULO DO FORMULÁRIO

  titleArea: {
    alignItems: "center",
    marginBottom: 30,
  },

  formTitle: {
    color: AZUL,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  formTitleMobile: {
    fontSize: 21,
  },

  titleLine: {
    width: 60,
    height: 4,
    backgroundColor: LARANJA,
    borderRadius: 5,
    marginTop: 13,
  },

  // CAMPOS

  label: {
    color: "#07569a",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
  },

  input: {
    width: "100%",
    minHeight: 51,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 7,
    paddingHorizontal: 13,
    color: "#123b63",
    fontSize: 14,
    marginBottom: 23,
  },

  textArea: {
    height: 120,
    paddingTop: 13,
    paddingBottom: 13,
    textAlignVertical: "top",
  },

  placeholderText: {
    color: "#999999",
  },

  // CAMPOS EM COLUNAS

  row: {
    width: "100%",
    flexDirection: "row",
    gap: 18,
  },

  rowMobile: {
    flexDirection: "column",
    gap: 0,
  },

  column: {
    flex: 1,
    minWidth: 0,
  },

  // SELECT

  selectContainer: {
    width: "100%",
    marginBottom: 23,
  },

  select: {
    minHeight: 51,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 7,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    color: "#123b63",
    fontSize: 14,
    flex: 1,
    paddingRight: 8,
  },

  optionsContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 7,
    marginTop: 4,
    overflow: "hidden",
    elevation: 4,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  optionText: {
    color: "#315b84",
    fontSize: 14,
  },

  // BOTÃO

  submitButton: {
    width: "100%",
    minHeight: 53,
    backgroundColor: LARANJA,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 2,
  },

  submitPressed: {
    backgroundColor: "#e94c2b",
  },

  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },

  // RODAPÉ

  footerText: {
    color: "#68788c",
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
});
