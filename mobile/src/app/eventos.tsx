
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
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
// DADOS DOS EVENTOS
// =====================================================

const eventos = [
  {
    id: 1,
    titulo: "Festival de Jazz na Praça",
    categoria: "Shows",
    data: "15 de Maio",
    horario: "18:00",
    local: "Praça Central",
    descricao:
      "Um evento cultural incrível com os melhores músicos da região. Entrada gratuita para todos!",
    imagem: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  },
  {
    id: 2,
    titulo: "Noite de Samba com Raízes",
    categoria: "Shows",
    data: "22 de Maio",
    horario: "20:00",
    local: "Espaço Cultural Downtown",
    descricao:
      "Samba ao vivo com as melhores escolas da região. Venha dançar e se divertir!",
    imagem: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
  },
  {
    id: 3,
    titulo: "Festival Gastronômico da Cidade",
    categoria: "Gastronomia",
    data: "28 de Maio",
    horario: "12:00",
    local: "Parque Municipal",
    descricao:
      "Uma grande experiência gastronômica com pratos especiais, comidas típicas e atrações para toda a família.",
    imagem: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
  },
  {
    id: 4,
    titulo: "Feira Cultural ao Ar Livre",
    categoria: "Cultura",
    data: "02 de Junho",
    horario: "10:00",
    local: "Praça da Estação",
    descricao:
      "Artesanato, arte, música, apresentações culturais e diversos expositores reunidos em um só lugar.",
    imagem: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
  },
  {
    id: 5,
    titulo: "Corrida e Caminhada da Cidade",
    categoria: "Esportes",
    data: "08 de Junho",
    horario: "07:00",
    local: "Avenida Principal",
    descricao:
      "Evento esportivo aberto ao público com corrida, caminhada e atividades para participantes de diferentes idades.",
    imagem: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5",
  },
  {
    id: 6,
    titulo: "Festival de Música ao Pôr do Sol",
    categoria: "Música",
    data: "15 de Junho",
    horario: "17:00",
    local: "Mirante Central",
    descricao:
      "Uma tarde especial com música ao vivo, apresentações locais e um belo pôr do sol.",
    imagem: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  },
];

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

  // NOVO: BOTÃO SAIR
  function irParaLogin() {
    setMenuAberto(false);
    router.replace("/login");
  }

  // ===================================================
  // PESQUISA DE EVENTOS
  // ===================================================

  const eventosFiltrados = useMemo(() => {
    const texto = buscaAplicada.trim().toLowerCase();

    if (!texto) {
      return eventos;
    }

    return eventos.filter((evento) => {
      return (
        evento.titulo.toLowerCase().includes(texto) ||
        evento.categoria.toLowerCase().includes(texto) ||
        evento.local.toLowerCase().includes(texto) ||
        evento.descricao.toLowerCase().includes(texto)
      );
    });
  }, [buscaAplicada]);

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
                color="#075b91"
              />

              <Text style={styles.textoMenu}>
                Início
              </Text>
            </Pressable>

            {/* EVENTOS - DESTACADO EM LARANJA */}

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

            {/* CADASTRAR EVENTO */}

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

            {/* MINHA CONTA */}

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

            {/* SOBRE NÓS */}

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

            {/* QUIZ DO ROLÊ */}

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

            {/* NOVO: SAIR */}

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

        {/* ==========================================
            CONTEÚDO
        ========================================== */}

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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

          {/* ========================================
              CARDS DOS EVENTOS
          ======================================== */}

          <View
            style={[
              styles.eventsGrid,
              telaPequena && styles.eventsGridMobile,
            ]}
          >
            {eventosFiltrados.map((evento) => (
              <View
                key={evento.id}
                style={[
                  styles.eventCard,
                  telaPequena && styles.eventCardMobile,
                ]}
              >

                {/* IMAGEM */}

                <View
                  style={[
                    styles.imageArea,
                    telaPequena && styles.imageAreaMobile,
                  ]}
                >
                  <Image
                    source={{ uri: evento.imagem }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />

                  {/* CATEGORIA */}

                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {evento.categoria}
                    </Text>
                  </View>
                </View>

                {/* CONTEÚDO DO CARD */}

                <View
                  style={[
                    styles.cardContent,
                    telaPequena && styles.cardContentMobile,
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
                      {evento.data}
                    </Text>

                    <Feather
                      name="clock"
                      size={16}
                      color="#68788c"
                    />

                    <Text style={styles.infoText}>
                      {evento.horario}
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
                      {evento.local}
                    </Text>
                  </View>

                  {/* DESCRIÇÃO */}

                  <Text style={styles.description}>
                    {evento.descricao}
                  </Text>

                  {/* BOTÃO INSCREVER-SE */}

                  <Pressable style={styles.subscribeButton}>
                    <Text style={styles.subscribeText}>
                      Inscrever-se
                    </Text>
                  </Pressable>

                </View>
              </View>
            ))}

            {/* NENHUM EVENTO ENCONTRADO */}

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
                  Tente pesquisar por outro nome,
                  categoria ou local.
                </Text>
              </View>
            )}

          </View>
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

  // NOVO: EVENTOS SELECIONADO EM LARANJA

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

  // TÍTULO

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

  // BUSCA

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
    width: 100,
    height: 48,
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

  // GRID DE EVENTOS

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

  // CARD

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

  // IMAGEM

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

  // CATEGORIA

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

  // CONTEÚDO DO CARD

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

  // BOTÃO INSCREVER-SE

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

  // BUSCA SEM RESULTADOS

  emptyArea: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 45,
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
  },
});
