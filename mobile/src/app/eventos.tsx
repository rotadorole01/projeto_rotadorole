
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "./utils/api";

// =====================================================
// TIPOS DE DADOS
// =====================================================

type Evento = {
  id: number;
  titulo: string;
  categoria: string | null;
  data: string | null;
  horario: string | null;
  local: string | null;
  localizacao: string | null;
  descricao: string | null;
  imagem: string | null;
  foto: string | null;
  cidade: string | null;
  bairro: string | null;
  status: string | null;
};

type RespostaEventos = {
  message?: string;
  data?: Evento[];
  Error?: string;
};

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function formatarData(data: string | null): string {
  if (!data) return "Data não informada";

  const partes = data.slice(0, 10).split("-");

  if (partes.length === 3) {
    const [ano, mes, dia] = partes;

    if (ano && mes && dia) {
      return `${dia}/${mes}/${ano}`;
    }
  }

  return data;
}

function formatarHorario(horario: string | null): string {
  if (!horario) return "Horário não informado";

  return horario.slice(0, 5);
}

function obterImagem(evento: Evento): string | null {
  const imagem = evento.imagem || evento.foto;

  if (!imagem) return null;

  if (
    imagem.startsWith("http://") ||
    imagem.startsWith("https://")
  ) {
    return imagem;
  }

  const caminho = imagem.startsWith("/")
    ? imagem
    : `/uploads/${imagem}`;

  return `${API_URL.replace(/\/$/, "")}${caminho}`;
}

function normalizarTexto(valor: string | null | undefined): string {
  return (valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// =====================================================
// PÁGINA DE EVENTOS
// =====================================================

export default function Eventos() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const telaPequena = width < 700;

  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState("");

  // ===================================================
  // BUSCAR EVENTOS DA API
  // ===================================================

  const carregarEventos = useCallback(
    async (mostrarCarregamento = true) => {
      if (mostrarCarregamento) {
        setCarregando(true);
      }

      setErro("");

      try {
        const resposta = await fetch(`${API_URL}/eventos`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const resultado: RespostaEventos =
          await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado.Error ||
              resultado.message ||
              "Erro ao buscar eventos."
          );
        }

        if (!Array.isArray(resultado.data)) {
          throw new Error(
            "A API não retornou uma lista de eventos válida."
          );
        }

        const eventosAtivos = resultado.data.filter(
          (evento) =>
            !evento.status ||
            normalizarTexto(evento.status) === "ativo"
        );

        setEventos(eventosAtivos);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os eventos."
        );
      } finally {
        setCarregando(false);
        setAtualizando(false);
      }
    },
    []
  );

  // Recarrega sempre que a tela recebe foco.
  // Assim, novos eventos aparecem após o cadastro.
  useFocusEffect(
    useCallback(() => {
      carregarEventos();

      return () => {};
    }, [carregarEventos])
  );

  function atualizarEventos() {
    setAtualizando(true);
    carregarEventos(false);
  }

  // ===================================================
  // MENU HAMBÚRGUER
  // ===================================================

  function abrirMenu() {
    setMenuAberto((anterior) => !anterior);
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
  }

  function irParaCadastrarEvento() {
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

  function irParaLogin() {
    setMenuAberto(false);
    router.replace("/login");
  }

  // ===================================================
  // PESQUISA DE EVENTOS
  // ===================================================

  const eventosFiltrados = useMemo(() => {
    const texto = normalizarTexto(buscaAplicada.trim());

    if (!texto) {
      return eventos;
    }

    return eventos.filter((evento) => {
      const conteudo = [
        evento.titulo,
        evento.categoria,
        evento.local,
        evento.localizacao,
        evento.descricao,
        evento.cidade,
        evento.bairro,
      ]
        .map(normalizarTexto)
        .join(" ");

      return conteudo.includes(texto);
    });
  }, [eventos, buscaAplicada]);

  function pesquisarEventos() {
    setBuscaAplicada(busca);
  }

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
            accessibilityRole="button"
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
            <Pressable
              style={styles.itemMenu}
              onPress={irParaInicio}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>
                Início
              </Text>
            </Pressable>

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
                color="#ff5733"
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

            <Pressable
              style={styles.itemMenu}
              onPress={irParaCadastrarEvento}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>
                Cadastrar Evento
              </Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={irParaMinhaConta}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>
                Minha Conta
              </Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={irParaSobreNos}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>
                Sobre Nós
              </Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={irParaQuiz}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>
                Quiz do Rolê
              </Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={irParaLogin}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>
                Sair
              </Text>
            </Pressable>
          </View>
        )}

        {/* CONTEÚDO PRINCIPAL */}

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={atualizarEventos}
            />
          }
        >
          {/* TÍTULO */}

          <View
            style={[
              styles.titleArea,
              telaPequena && styles.titleAreaMobile,
            ]}
          >
            <Text
              style={[
                styles.titulo,
                telaPequena && styles.tituloMobile,
              ]}
            >
              Todos os Eventos
            </Text>

            <View style={styles.titleLine} />
          </View>

          {/* BUSCA */}

          <View
            style={[
              styles.searchArea,
              telaPequena && styles.searchAreaMobile,
            ]}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar eventos..."
              placeholderTextColor="#8a8a8a"
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={pesquisarEventos}
              returnKeyType="search"
            />

            <Pressable
              style={styles.searchButton}
              onPress={pesquisarEventos}
            >
              <Text style={styles.searchButtonText}>
                Buscar
              </Text>
            </Pressable>
          </View>

          {/* CARREGAMENTO */}

          {carregando && (
            <View style={styles.emptyArea}>
              <ActivityIndicator
                size="large"
                color="#07569a"
              />
              <Text style={styles.emptyText}>
                Carregando eventos...
              </Text>
            </View>
          )}

          {/* ERRO DE CONEXÃO */}

          {!carregando && erro !== "" && (
            <View style={styles.emptyArea}>
              <Ionicons
                name="alert-circle-outline"
                size={36}
                color="#ff5733"
              />

              <Text style={styles.emptyTitle}>
                Não foi possível carregar os eventos
              </Text>

              <Text style={styles.emptyText}>
                {erro}
              </Text>

              <Pressable
                style={styles.searchButton}
                onPress={() => carregarEventos()}
              >
                <Text style={styles.searchButtonText}>
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          )}

          {/* CARDS DOS EVENTOS */}

          {!carregando && !erro && (
            <View
              style={[
                styles.eventsGrid,
                telaPequena && styles.eventsGridMobile,
              ]}
            >
              {eventosFiltrados.map((evento) => {
                const imagemEvento = obterImagem(evento);

                const localEvento =
                  evento.localizacao ||
                  evento.local ||
                  "Local não informado";

                return (
                  <View
                    key={evento.id}
                    style={[
                      styles.eventCard,
                      telaPequena &&
                        styles.eventCardMobile,
                    ]}
                  >
                    {/* IMAGEM */}

                    <View
                      style={[
                        styles.imageArea,
                        telaPequena &&
                          styles.imageAreaMobile,
                      ]}
                    >
                      {imagemEvento ? (
                        <Image
                          source={{ uri: imagemEvento }}
                          style={styles.eventImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={styles.imagePlaceholder}
                        >
                          <Ionicons
                            name="image-outline"
                            size={48}
                            color="#9ba7b5"
                          />
                        </View>
                      )}

                      {/* CATEGORIA */}

                      <View style={styles.categoryBadge}>
                        <Text
                          style={styles.categoryBadgeText}
                        >
                          {evento.categoria ||
                            "Evento"}
                        </Text>
                      </View>
                    </View>

                    {/* CONTEÚDO */}

                    <View
                      style={[
                        styles.cardContent,
                        telaPequena &&
                          styles.cardContentMobile,
                      ]}
                    >
                      <Text style={styles.eventTitle}>
                        {evento.titulo}
                      </Text>

                      {/* DATA E HORÁRIO */}

                      <View style={styles.infoRow}>
                        <Feather
                          name="calendar"
                          size={16}
                          color="#68788c"
                        />

                        <Text style={styles.infoText}>
                          {formatarData(evento.data)}
                        </Text>

                        <Feather
                          name="clock"
                          size={16}
                          color="#68788c"
                        />

                        <Text style={styles.infoText}>
                          {formatarHorario(evento.horario)}
                        </Text>
                      </View>

                      {/* LOCAL */}

                      <View style={styles.infoRow}>
                        <Feather
                          name="map-pin"
                          size={16}
                          color="#68788c"
                        />

                        <Text style={styles.infoText}>
                          {localEvento}
                        </Text>
                      </View>

                      {/* DESCRIÇÃO */}

                      <Text style={styles.description}>
                        {evento.descricao ||
                          "Sem descrição disponível."}
                      </Text>

                      {/* BOTÃO ORIGINAL */}

                      <Pressable
                        style={styles.subscribeButton}
                      >
                        <Text style={styles.subscribeText}>
                          Inscrever-se
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}

              {/* NENHUM EVENTO */}

              {eventosFiltrados.length === 0 && (
                <View style={styles.emptyArea}>
                  <Ionicons
                    name="search-outline"
                    size={36}
                    color="#68788c"
                  />

                  <Text style={styles.emptyTitle}>
                    Nenhum evento encontrado
                  </Text>

                  <Text style={styles.emptyText}>
                    {buscaAplicada
                      ? "Tente pesquisar por outro nome, categoria ou local."
                      : "Nenhum evento ativo foi encontrado."}
                  </Text>
                </View>
              )}
            </View>
          )}
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
    backgroundColor: "#fff0e8",
    borderLeftWidth: 4,
    borderLeftColor: "#ff5733",
    paddingLeft: 21,
  },

  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  textoMenuAtivo: {
    color: "#ff5733",
    fontWeight: "800",
  },

  titleArea: {
    alignItems: "center",
    paddingTop: 65,
    paddingBottom: 30,
  },

  titleAreaMobile: {
    paddingTop: 35,
    paddingBottom: 22,
  },

  titulo: {
    color: "#07569a",
    fontSize: 38,
    fontWeight: "800",
    textAlign: "center",
  },

  tituloMobile: {
    fontSize: 30,
  },

  titleLine: {
    width: 60,
    height: 4,
    backgroundColor: "#ff5733",
    borderRadius: 5,
    marginTop: 18,
  },

  searchArea: {
    width: "70%",
    maxWidth: 860,
    alignSelf: "center",
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },

  searchAreaMobile: {
    width: "90%",
    gap: 10,
    marginBottom: 25,
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 8,
    paddingHorizontal: 14,
    color: "#123b63",
    fontSize: 15,
  },

  searchButton: {
    minWidth: 100,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: "#ff5733",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  searchButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  eventsGrid: {
    width: "70%",
    maxWidth: 860,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 30,
    marginTop: 5,
  },

  eventsGridMobile: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 15,
  },

  eventCard: {
    width: 390,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  eventCardMobile: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    borderRadius: 14,
  },

  imageArea: {
    height: 200,
    position: "relative",
  },

  imageAreaMobile: {
    height: 155,
  },

  eventImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e9edf2",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff5733",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  categoryBadgeText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 13,
  },

  cardContent: {
    padding: 20,
  },

  cardContentMobile: {
    padding: 16,
  },

  eventTitle: {
    color: "#07569a",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  infoText: {
    color: "#68788c",
    fontSize: 14,
    marginRight: 10,
  },

  description: {
    color: "#68788c",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },

  subscribeButton: {
    width: 110,
    height: 38,
    backgroundColor: "#ff5733",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  subscribeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },

  emptyArea: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 45,
    gap: 12,
  },

  emptyTitle: {
    color: "#07569a",
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 15,
  },

  emptyText: {
    color: "#68788c",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 12,
  },
});
