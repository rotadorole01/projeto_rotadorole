
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
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
// TIPOS E DADOS INICIAIS
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
// IDENTIFICAR USUÁRIO LOGADO
// =====================================================

function extrairUsuario(valor: unknown): Record<string, any> | null {
  if (!valor) return null;

  if (typeof valor === "string") {
    try {
      return extrairUsuario(JSON.parse(valor));
    } catch {
      return null;
    }
  }

  if (typeof valor !== "object" || Array.isArray(valor)) {
    return null;
  }

  const obj = valor as Record<string, any>;

  if (obj.user) return extrairUsuario(obj.user);
  if (obj.usuario) return extrairUsuario(obj.usuario);
  if (obj.data) return extrairUsuario(obj.data);

  return obj;
}

function montarPerfil(usuario: Record<string, any>): DadosPerfil {
  const texto = (valor: unknown) =>
    valor === null || valor === undefined ? "" : String(valor);

  const nascimento = texto(
    usuario.nascimento ??
    usuario.data_nascimento ??
    usuario.dataNascimento
  );

  const nascimentoBR = /^\d{4}-\d{2}-\d{2}/.test(nascimento)
    ? `${nascimento.slice(8, 10)}/${nascimento.slice(5, 7)}/${nascimento.slice(0, 4)}`
    : nascimento;

  return {
    nome: texto(usuario.nome ?? usuario.nome_completo ?? usuario.name),
    email: texto(usuario.email),
    telefone: texto(usuario.telefone ?? usuario.celular),
    nascimento: nascimentoBR,
    cidade: texto(usuario.cidade),
    bairro: texto(usuario.bairro),
    biografia: texto(usuario.biografia ?? usuario.bio),
    foto: usuario.foto ?? usuario.foto_perfil ?? null,
    notificacoes:
      usuario.notificacoes === undefined
        ? true
        : Boolean(usuario.notificacoes),
    novidades:
      usuario.novidades === undefined
        ? true
        : Boolean(usuario.novidades),
  };
}

// =====================================================
// COMPONENTE TÍTULO DA SEÇÃO
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
// COMPONENTE CAMPO DE PERFIL
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
// TELA MINHA CONTA
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
  const [perfil, setPerfil] = useState<DadosPerfil>(perfilInicial);
  const [perfilSalvo, setPerfilSalvo] =
    useState<DadosPerfil>(perfilInicial);

  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // ===================================================
  // CARREGAR DADOS DO USUÁRIO LOGADO
  // ===================================================

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const contexto = auth as unknown as
          Record<string, any> | null;

        let usuario = extrairUsuario(
          contexto?.user ??
          contexto?.usuario ??
          contexto?.userData ??
          contexto?.currentUser ??
          contexto?.dadosUsuario
        );

        // Busca na sessão salva se os dados
        // não estiverem disponíveis no contexto.

        if (
          !usuario ||
          (!usuario.nome && !usuario.email && !usuario.name)
        ) {
          const salvo = await AsyncStorage.getItem("my-key");
          const dados = extrairUsuario(salvo);

          if (
            dados &&
            (dados.nome || dados.name || dados.email)
          ) {
            usuario = dados;
          }
        }

        if (!ativo) return;

        if (usuario) {
          const dadosPerfil = montarPerfil(usuario);

          setPerfil(dadosPerfil);
          setPerfilSalvo(dadosPerfil);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, [auth]);

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
  // NAVEGAÇÃO
  // ===================================================

  function navegar(rota: string) {
    setMenuAberto(false);
    router.navigate(rota as any);
  }

  async function sair() {
    try {
      setMenuAberto(false);
      await auth.logOut();
      setPerfil(perfilInicial);
      setPerfilSalvo(perfilInicial);
      router.replace("/login");
    } catch (erro) {
      console.error("Erro ao sair:", erro);
      mensagem("Erro", "Não foi possível sair da conta.");
    }
  }

  // ===================================================
  // EDIÇÃO DO PERFIL
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
  // FOTO DE PERFIL
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
        "Erro",
        "Não foi possível selecionar a imagem."
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
        "Informe um e-mail válido."
      );
      return;
    }

    if (perfil.nascimento.trim()) {
      const formato = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const partes = perfil.nascimento.match(formato);

      if (!partes) {
        mensagem(
          "Data inválida",
          "Use o formato DD/MM/AAAA."
        );
        return;
      }

      const dia = Number(partes[1]);
      const mes = Number(partes[2]);
      const ano = Number(partes[3]);

      const data = new Date(ano, mes - 1, dia);

      if (
        ano < 1900 ||
        data.getDate() !== dia ||
        data.getMonth() !== mes - 1 ||
        data.getFullYear() !== ano ||
        data > new Date()
      ) {
        mensagem(
          "Data inválida",
          "Informe uma data de nascimento válida."
        );
        return;
      }
    }

    const novosDados = {
      ...perfil,
      nome: perfil.nome.trim(),
      email: perfil.email.trim(),
      telefone: perfil.telefone.trim(),
      cidade: perfil.cidade.trim(),
      bairro: perfil.bairro.trim(),
      biografia: perfil.biografia.trim(),
    };

    // Salva apenas no estado da tela.
    // A persistência no MySQL depende de uma
    // rota autenticada de atualização na API.

    setPerfilSalvo(novosDados);
    setPerfil(novosDados);
    setEditando(false);

    mensagem(
      "Alterações aplicadas",
      "As informações foram atualizadas nesta tela. A integração com o banco ainda é necessária para salvá-las definitivamente."
    );
  }

  // ===================================================
  // MENU
  // ===================================================

  const itensMenu = [
    {
      titulo: "Início",
      icone: "home-outline" as const,
      rota: "/dashboard",
    },
    {
      titulo: "Eventos",
      icone: "calendar-outline" as const,
      rota: "/eventos",
    },
    {
      titulo: "Cadastrar Evento",
      icone: "add-circle-outline" as const,
      rota: "/cadastro",
    },
    {
      titulo: "Minha Conta",
      icone: "person" as const,
      rota: "/perfil",
    },
    {
      titulo: "Sobre Nós",
      icone: "information-circle-outline" as const,
      rota: "/sobrenos",
    },
    {
      titulo: "Quiz do Rolê",
      icone: "help-circle-outline" as const,
      rota: "/quiz",
    },
  ];

  // ===================================================
  // INTERFACE
  // ===================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* CABEÇALHO */}

        <LinearGradient
          colors={["#075b91", "#6b5a64", "#ff6633"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.header}
        >
          <Pressable
            style={styles.logoArea}
            onPress={() => navegar("/dashboard")}
          >
            <FontAwesome
              name="map-marker"
              size={30}
              color="#ffffff"
            />
            <Text style={styles.logo}>Rota do Rolê</Text>
          </Pressable>

          <Pressable
            style={styles.botaoMenu}
            onPress={() => setMenuAberto(!menuAberto)}
          >
            <Ionicons
              name={menuAberto ? "close" : "menu"}
              size={32}
              color="#ffffff"
            />
          </Pressable>
        </LinearGradient>

        {/* MENU HAMBÚRGUER */}

        {menuAberto && (
          <View style={styles.menu}>
            {itensMenu.map((item) => {
              const ativo = item.rota === "/perfil";

              return (
                <Pressable
                  key={item.rota}
                  style={[
                    styles.itemMenu,
                    ativo && styles.itemMenuAtivo,
                  ]}
                  onPress={() =>
                    ativo
                      ? setMenuAberto(false)
                      : navegar(item.rota)
                  }
                >
                  <Ionicons
                    name={item.icone}
                    size={20}
                    color={ativo ? LARANJA : AZUL}
                  />
                  <Text
                    style={[
                      styles.textoMenu,
                      ativo && styles.textoMenuAtivo,
                    ]}
                  >
                    {item.titulo}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              style={styles.itemMenu}
              onPress={sair}
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={LARANJA}
              />
              <Text style={styles.textoSair}>Sair</Text>
            </Pressable>
          </View>
        )}

        {/* CONTEÚDO */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

          <View
            style={[
              styles.main,
              mobile && styles.mainMobile,
            ]}
          >

            {/* PERFIL DO USUÁRIO */}

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
                {carregando
                  ? "Carregando..."
                  : perfil.nome || "Meu Perfil"}
              </Text>

              <Text style={styles.profileEmail}>
                {perfil.email ||
                  "Informações não disponíveis"}
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
                  disabled={carregando}
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

            {/* INFORMAÇÕES PESSOAIS */}

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
                  onChange={(v) =>
                    atualizarCampo("nome", v)
                  }
                  placeholder="Nome completo"
                  editando={editando}
                />
              </View>

              <View style={styles.column}>
                <CampoPerfil
                  titulo="Data de Nascimento"
                  valor={perfil.nascimento}
                  onChange={(v) =>
                    atualizarCampo("nascimento", v)
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
                  onChange={(v) =>
                    atualizarCampo("email", v)
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
                  onChange={(v) =>
                    atualizarCampo("telefone", v)
                  }
                  placeholder="(16) 99999-9999"
                  editando={editando}
                  tipo="phone-pad"
                />
              </View>
            </View>

            {/* LOCALIZAÇÃO */}

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
                  onChange={(v) =>
                    atualizarCampo("cidade", v)
                  }
                  placeholder="Ex: Taquaritinga"
                  editando={editando}
                />
              </View>

              <View style={styles.column}>
                <CampoPerfil
                  titulo="Bairro"
                  valor={perfil.bairro}
                  onChange={(v) =>
                    atualizarCampo("bairro", v)
                  }
                  placeholder="Informe seu bairro"
                  editando={editando}
                />
              </View>
            </View>

            {/* BIOGRAFIA */}

            <TituloSecao
              titulo="Sobre Mim"
              icone="document-text"
            />

            <CampoPerfil
              titulo="Biografia"
              valor={perfil.biografia}
              onChange={(v) =>
                atualizarCampo("biografia", v)
              }
              placeholder="Conte um pouco sobre você..."
              editando={editando}
              multiline
            />

            {/* PREFERÊNCIAS */}

            <TituloSecao
              titulo="Minhas Preferências"
              icone="settings"
            />

            <View style={styles.preferencesArea}>
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
                  onValueChange={(v) =>
                    atualizarCampo("notificacoes", v)
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
                  onValueChange={(v) =>
                    atualizarCampo("novidades", v)
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

            {/* SEGURANÇA */}

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
                  A alteração de senha depende da
                  integração com a autenticação.
                </Text>
              </View>
            </View>

            {/* BOTÕES DE EDIÇÃO */}

            {editando && (
              <View
                style={[
                  styles.buttonsRow,
                  mobile && styles.buttonsMobile,
                ]}
              >
                <Pressable
                  style={styles.saveButton}
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

  itemMenuAtivo: {
    backgroundColor: "#fff4ef",
  },

  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  textoMenuAtivo: {
    color: LARANJA,
    fontWeight: "bold",
  },

  textoSair: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 12,
  },

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

  footerText: {
    color: CINZA,
    fontSize: 12,
    textAlign: "center",
    marginTop: 28,
    paddingHorizontal: 20,
  },
});
