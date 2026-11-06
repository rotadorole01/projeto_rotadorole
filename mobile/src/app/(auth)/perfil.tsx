
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../utils/authContext";

// =====================================================
// IDENTIDADE VISUAL
// =====================================================

const AZUL = "#07569a";
const AZUL_ESCURO = "#123b63";
const LARANJA = "#ff6633";
const FUNDO = "#f5f6f8";
const CINZA = "#68788c";

// =====================================================
// DADOS DO PERFIL
// =====================================================

type DadosPerfil = {
  nome: string;
  email: string;
  telefone: string;
  nascimento: string;
  cidade: string;
  bairro: string;
  biografia: string;
  foto: string | null;
  notificacoes: boolean;
  novidades: boolean;
};

const perfilInicial: DadosPerfil = {
  nome: "",
  email: "",
  telefone: "",
  nascimento: "",
  cidade: "",
  bairro: "",
  biografia: "",
  foto: null,
  notificacoes: true,
  novidades: true,
};

// =====================================================
// COMPONENTE TÍTULO
// =====================================================

function TituloSecao({
  titulo,
  icone,
}: {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icone} size={21} color={AZUL} />
      <Text style={styles.sectionTitle}>{titulo}</Text>
    </View>
  );
}

// =====================================================
// COMPONENTE CAMPO
// =====================================================

function CampoPerfil({
  titulo,
  valor,
  onChange,
  placeholder,
  editando,
  tipo = "default",
  multiline = false,
}: {
  titulo: string;
  valor: string;
  onChange: (texto: string) => void;
  placeholder: string;
  editando: boolean;
  tipo?: "default" | "email-address" | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <View style={styles.campoArea}>
      <Text style={styles.inputLabel}>{titulo}</Text>

      <TextInput
        style={[
          styles.input,
          !editando && styles.inputBloqueado,
          multiline && styles.textArea,
        ]}
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9aa4ad"
        editable={editando}
        keyboardType={tipo}
        autoCapitalize={
          tipo === "email-address" ? "none" : "sentences"
        }
        autoCorrect={tipo !== "email-address"}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

// =====================================================
// PÁGINA MINHA CONTA
// =====================================================

export default function Perfil() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const mobile = width < 700;

  // ===================================================
  // ESTADOS
  // ===================================================

  const [menuAberto, setMenuAberto] = useState(false);

  const [perfilSalvo, setPerfilSalvo] =
    useState<DadosPerfil>(perfilInicial);

  const [perfil, setPerfil] =
    useState<DadosPerfil>(perfilInicial);

  const [editando, setEditando] = useState(false);

  // ===================================================
  // MENU HAMBÚRGUER
  // ===================================================

  function abrirMenu() {
    setMenuAberto((anterior) => !anterior);
  }

  // ===================================================
  // ATUALIZAR CAMPOS
  // ===================================================

  function atualizarCampo<K extends keyof DadosPerfil>(
    campo: K,
    valor: DadosPerfil[K]
  ) {
    setPerfil((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  // ===================================================
  // MENSAGENS
  // ===================================================

  function mensagem(titulo: string, descricao: string) {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.alert(`${titulo}\n\n${descricao}`);
      }
    } else {
      Alert.alert(titulo, descricao);
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
  // SAIR DA CONTA
  // ===================================================

  async function sair() {
    setMenuAberto(false);

    try {
      await auth.logOut();
      router.replace("/login");
    } catch (erro) {
      console.error("Erro ao sair:", erro);
    }
  }

  // ===================================================
  // EDITAR PERFIL
  // ===================================================

  function iniciarEdicao() {
    setPerfil({ ...perfilSalvo });
    setEditando(true);
  }

  function cancelarEdicao() {
    setPerfil({ ...perfilSalvo });
    setEditando(false);
  }

  // ===================================================
  // ESCOLHER FOTO
  // ===================================================

  async function escolherFoto() {
    if (!editando) return;

    try {
      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (resultado.canceled) return;

      const arquivo = resultado.assets[0];

      if (!arquivo?.uri) return;

      if (
        arquivo.fileSize &&
        arquivo.fileSize > 5 * 1024 * 1024
      ) {
        mensagem(
          "Imagem muito grande",
          "Escolha uma foto de até 5 MB."
        );
        return;
      }

      atualizarCampo("foto", arquivo.uri);
    } catch (erro) {
      mensagem(
        "Erro ao selecionar imagem",
        "Não foi possível acessar a galeria."
      );
    }
  }

  // ===================================================
  // SALVAR PERFIL
  // ===================================================

  function salvarPerfil() {
    if (!perfil.nome.trim()) {
      mensagem(
        "Campo obrigatório",
        "Informe seu nome completo."
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(perfil.email.trim())) {
      mensagem(
        "E-mail inválido",
        "Informe um endereço de e-mail válido."
      );
      return;
    }

    if (perfil.nascimento.trim()) {
      const formato = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const partes = perfil.nascimento.match(formato);

      if (!partes) {
        mensagem(
          "Data inválida",
          "Informe a data no formato DD/MM/AAAA."
        );
        return;
      }

      const dia = Number(partes[1]);
      const mes = Number(partes[2]);
      const ano = Number(partes[3]);

      const data = new Date(ano, mes - 1, dia);
      const hoje = new Date();

      if (
        ano < 1900 ||
        data.getDate() !== dia ||
        data.getMonth() !== mes - 1 ||
        data.getFullYear() !== ano ||
        data > hoje
      ) {
        mensagem(
          "Data inválida",
          "Informe uma data de nascimento válida."
        );
        return;
      }
    }

    const novosDados: DadosPerfil = {
      ...perfil,
      nome: perfil.nome.trim(),
      email: perfil.email.trim(),
      telefone: perfil.telefone.trim(),
      cidade: perfil.cidade.trim(),
      bairro: perfil.bairro.trim(),
      biografia: perfil.biografia.trim(),
    };

    // Salvamento local temporário.
    // Integração com API ainda não implementada.

    setPerfilSalvo(novosDados);
    setPerfil(novosDados);
    setEditando(false);

    mensagem(
      "Alterações aplicadas",
      "Os dados foram atualizados nesta tela. Para mantê-los após fechar o aplicativo, será necessário conectar o banco de dados."
    );
  }

  // ===================================================
  // INTERFACE PRINCIPAL
  // ===================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ==========================================
            CABEÇALHO
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
            onPress={abrirMenu}
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
            MENU HAMBÚRGUER
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

            {/* EVENTOS */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaEventos}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={AZUL}
              />

              <Text style={styles.textoMenu}>
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

            {/* ========================================
                MINHA CONTA - SELECIONADO EM LARANJA
            ======================================== */}

            <Pressable
              style={[
                styles.itemMenu,
                styles.itemMenuAtivo,
              ]}
              onPress={irParaMinhaConta}
            >
              <Ionicons
                name="person"
                size={20}
                color={LARANJA}
              />

              <Text style={styles.textoMenuAtivo}>
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

            {/* SAIR */}

            <Pressable
              style={styles.itemMenu}
              onPress={sair}
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={LARANJA}
              />

              <Text style={styles.textoSair}>
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* TÍTULO PRINCIPAL */}

          <View style={styles.titleArea}>
            <Text
              style={[
                styles.titulo,
                mobile && styles.tituloMobile,
              ]}
            >
              Minha Conta
            </Text>

            <View style={styles.titleLine} />

            <Text style={styles.subtitle}>
              Gerencie suas informações pessoais,
              atualize seus dados e personalize sua
              experiência na Rota do Rolê.
            </Text>
          </View>

          {/* CARD PRINCIPAL */}

          <View
            style={[
              styles.main,
              mobile && styles.mainMobile,
            ]}
          >

            {/* ========================================
                FOTO E IDENTIFICAÇÃO
            ======================================== */}

            <View style={styles.profileHeader}>
              <Pressable
                style={styles.avatarArea}
                onPress={escolherFoto}
                disabled={!editando}
              >
                {perfil.foto ? (
                  <Image
                    source={{ uri: perfil.foto }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons
                      name="person"
                      size={53}
                      color={AZUL}
                    />
                  </View>
                )}

                {editando && (
                  <View style={styles.cameraBadge}>
                    <Feather
                      name="camera"
                      size={17}
                      color="#ffffff"
                    />
                  </View>
                )}
              </Pressable>

              <Text style={styles.profileName}>
                {perfil.nome || "Meu Perfil"}
              </Text>

              <Text style={styles.profileEmail}>
                {perfil.email ||
                  "Adicione suas informações pessoais"}
              </Text>

              <View style={styles.statusArea}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={AZUL}
                />

                <Text style={styles.statusText}>
                  Área do usuário
                </Text>
              </View>

              {!editando && (
                <Pressable
                  style={styles.editButton}
                  onPress={iniciarEdicao}
                >
                  <Feather
                    name="edit-2"
                    size={17}
                    color="#ffffff"
                  />

                  <Text style={styles.editButtonText}>
                    Editar Perfil
                  </Text>
                </Pressable>
              )}

              {editando && perfil.foto && (
                <Pressable
                  style={styles.removePhoto}
                  onPress={() =>
                    atualizarCampo("foto", null)
                  }
                >
                  <Text style={styles.removePhotoText}>
                    Remover foto
                  </Text>
                </Pressable>
              )}
            </View>

            {/* ========================================
                INFORMAÇÕES PESSOAIS
            ======================================== */}

            <TituloSecao
              titulo="Informações Pessoais"
              icone="person-circle"
            />

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <CampoPerfil
                  titulo="Nome Completo *"
                  valor={perfil.nome}
                  onChange={(valor) =>
                    atualizarCampo("nome", valor)
                  }
                  placeholder="Informe seu nome completo"
                  editando={editando}
                />
              </View>

              <View style={styles.column}>
                <CampoPerfil
                  titulo="Data de Nascimento"
                  valor={perfil.nascimento}
                  onChange={(valor) =>
                    atualizarCampo("nascimento", valor)
                  }
                  placeholder="DD/MM/AAAA"
                  editando={editando}
                />
              </View>
            </View>

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <CampoPerfil
                  titulo="E-mail *"
                  valor={perfil.email}
                  onChange={(valor) =>
                    atualizarCampo("email", valor)
                  }
                  placeholder="seuemail@exemplo.com"
                  editando={editando}
                  tipo="email-address"
                />
              </View>

              <View style={styles.column}>
                <CampoPerfil
                  titulo="Telefone"
                  valor={perfil.telefone}
                  onChange={(valor) =>
                    atualizarCampo("telefone", valor)
                  }
                  placeholder="(16) 99999-9999"
                  editando={editando}
                  tipo="phone-pad"
                />
              </View>
            </View>

            {/* ========================================
                LOCALIZAÇÃO
            ======================================== */}

            <TituloSecao
              titulo="Minha Localização"
              icone="location"
            />

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <CampoPerfil
                  titulo="Cidade"
                  valor={perfil.cidade}
                  onChange={(valor) =>
                    atualizarCampo("cidade", valor)
                  }
                  placeholder="Ex: Taquaritinga"
                  editando={editando}
                />
              </View>

              <View style={styles.column}>
                <CampoPerfil
                  titulo="Bairro"
                  valor={perfil.bairro}
                  onChange={(valor) =>
                    atualizarCampo("bairro", valor)
                  }
                  placeholder="Informe seu bairro"
                  editando={editando}
                />
              </View>
            </View>

            {/* ========================================
                SOBRE MIM
            ======================================== */}

            <TituloSecao
              titulo="Sobre Mim"
              icone="document-text"
            />

            <CampoPerfil
              titulo="Biografia"
              valor={perfil.biografia}
              onChange={(valor) =>
                atualizarCampo("biografia", valor)
              }
              placeholder="Conte um pouco sobre você, seus interesses e os tipos de rolê que mais gosta..."
              editando={editando}
              multiline
            />

            {/* ========================================
                PREFERÊNCIAS
            ======================================== */}

            <TituloSecao
              titulo="Minhas Preferências"
              icone="settings"
            />

            <View style={styles.preferencesArea}>

              {/* NOTIFICAÇÕES */}

              <View style={styles.preferenceRow}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceTitle}>
                    Notificações de Eventos
                  </Text>

                  <Text style={styles.preferenceDescription}>
                    Preferência para receber avisos
                    sobre eventos e atividades.
                  </Text>
                </View>

                <Switch
                  value={perfil.notificacoes}
                  onValueChange={(valor) =>
                    atualizarCampo("notificacoes", valor)
                  }
                  disabled={!editando}
                  trackColor={{
                    false: "#d0d4d9",
                    true: "#8fb9db",
                  }}
                  thumbColor={
                    perfil.notificacoes
                      ? AZUL
                      : "#ffffff"
                  }
                />
              </View>

              {/* NOVIDADES */}

              <View style={styles.preferenceRow}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceTitle}>
                    Novidades e Recomendações
                  </Text>

                  <Text style={styles.preferenceDescription}>
                    Preferência para receber novidades
                    da Rota do Rolê.
                  </Text>
                </View>

                <Switch
                  value={perfil.novidades}
                  onValueChange={(valor) =>
                    atualizarCampo("novidades", valor)
                  }
                  disabled={!editando}
                  trackColor={{
                    false: "#d0d4d9",
                    true: "#8fb9db",
                  }}
                  thumbColor={
                    perfil.novidades
                      ? AZUL
                      : "#ffffff"
                  }
                />
              </View>

            </View>

            {/* ========================================
                SEGURANÇA
            ======================================== */}

            <TituloSecao
              titulo="Segurança da Conta"
              icone="shield-checkmark"
            />

            <View style={styles.securityArea}>
              <Ionicons
                name="lock-closed-outline"
                size={25}
                color={AZUL}
              />

              <View style={styles.securityInfo}>
                <Text style={styles.securityTitle}>
                  Senha de Acesso
                </Text>

                <Text style={styles.securityDescription}>
                  A troca de senha deverá ser conectada
                  ao sistema de autenticação do aplicativo.
                </Text>
              </View>
            </View>

            {/* ========================================
                BOTÕES SALVAR E CANCELAR
            ======================================== */}

            {editando && (
              <View
                style={[
                  styles.buttonsRow,
                  mobile && styles.buttonsMobile,
                ]}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={salvarPerfil}
                >
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#ffffff"
                  />

                  <Text style={styles.saveButtonText}>
                    Salvar Alterações
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.cancelButton}
                  onPress={cancelarEdicao}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={LARANJA}
                  />

                  <Text style={styles.cancelButtonText}>
                    Cancelar
                  </Text>
                </Pressable>
              </View>
            )}

          </View>

          {/* RODAPÉ */}

          <Text style={styles.footerText}>
            Rota do Rolê — Sua cidade, seus eventos,
            sua experiência.
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
    paddingBottom: 55,
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

  // =====================================================
  // MENU HAMBÚRGUER
  // =====================================================

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

  // ITEM SELECIONADO EM LARANJA

  itemMenuAtivo: {
    backgroundColor: "#fff4ef",
  },

  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  // TEXTO SELECIONADO EM LARANJA

  textoMenuAtivo: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 12,
  },

  textoSair: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 12,
  },

  // TÍTULO PRINCIPAL

  titleArea: {
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  titulo: {
    color: AZUL,
    fontSize: 35,
    fontWeight: "800",
    textAlign: "center",
  },

  tituloMobile: {
    fontSize: 28,
  },

  titleLine: {
    width: 65,
    height: 4,
    backgroundColor: LARANJA,
    borderRadius: 5,
    marginTop: 18,
    marginBottom: 22,
  },

  subtitle: {
    color: CINZA,
    fontSize: 15,
    textAlign: "center",
    maxWidth: 700,
    lineHeight: 23,
  },

  // CARD PRINCIPAL

  main: {
    width: "90%",
    maxWidth: 850,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 35,
    paddingVertical: 35,
    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  mainMobile: {
    width: "94%",
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 14,
  },

  // CABEÇALHO DO PERFIL

  profileHeader: {
    alignItems: "center",
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginBottom: 20,
  },

  avatarArea: {
    width: 118,
    height: 118,
    position: "relative",
    marginBottom: 16,
  },

  avatarPlaceholder: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#e6f0f8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#d4e6f3",
  },

  avatarImage: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 3,
    borderColor: "#d4e6f3",
  },

  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: LARANJA,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
  },

  profileName: {
    color: AZUL_ESCURO,
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 5,
  },

  profileEmail: {
    color: CINZA,
    fontSize: 14,
    textAlign: "center",
  },

  statusArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef5fb",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
    marginTop: 15,
  },

  statusText: {
    color: AZUL,
    fontSize: 12,
    fontWeight: "700",
  },

  // BOTÃO EDITAR

  editButton: {
    backgroundColor: AZUL,
    minHeight: 43,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 20,
  },

  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  removePhoto: {
    marginTop: 12,
    padding: 8,
  },

  removePhotoText: {
    color: "#e74c3c",
    fontSize: 13,
    fontWeight: "700",
  },

  // SEÇÕES

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 23,
    gap: 9,
  },

  sectionTitle: {
    color: AZUL,
    fontSize: 19,
    fontWeight: "800",
  },

  // CAMPOS

  campoArea: {
    width: "100%",
    marginBottom: 23,
  },

  inputLabel: {
    color: AZUL_ESCURO,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
  },

  input: {
    width: "100%",
    minHeight: 53,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 8,
    paddingHorizontal: 14,
    color: AZUL_ESCURO,
    fontSize: 14,
  },

  inputBloqueado: {
    backgroundColor: "#f4f6f8",
    borderColor: "#e4e7ea",
  },

  textArea: {
    minHeight: 115,
    paddingTop: 13,
    paddingBottom: 13,
    textAlignVertical: "top",
  },

  // COLUNAS RESPONSIVAS

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

  // PREFERÊNCIAS

  preferencesArea: {
    borderWidth: 1,
    borderColor: "#e4e7ea",
    borderRadius: 10,
    overflow: "hidden",
  },

  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    gap: 10,
  },

  preferenceInfo: {
    flex: 1,
  },

  preferenceTitle: {
    color: AZUL_ESCURO,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  preferenceDescription: {
    color: CINZA,
    fontSize: 12,
    lineHeight: 18,
  },

  // SEGURANÇA

  securityArea: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e4e7ea",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 17,
    gap: 15,
    marginBottom: 25,
  },

  securityInfo: {
    flex: 1,
  },

  securityTitle: {
    color: AZUL_ESCURO,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 5,
  },

  securityDescription: {
    color: CINZA,
    fontSize: 12,
    lineHeight: 18,
  },

  // BOTÕES

  buttonsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 15,
    marginTop: 15,
  },

  buttonsMobile: {
    flexDirection: "column",
    gap: 12,
  },

  saveButton: {
    flex: 1,
    minHeight: 55,
    backgroundColor: LARANJA,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },

  buttonPressed: {
    backgroundColor: "#e94c2b",
  },

  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  cancelButton: {
    flex: 1,
    minHeight: 55,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: LARANJA,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
  },

  cancelButtonText: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "700",
  },

  // RODAPÉ

  footerText: {
    color: CINZA,
    fontSize: 12,
    textAlign: "center",
    marginTop: 28,
    paddingHorizontal: 20,
  },

});
