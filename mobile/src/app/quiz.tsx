
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./utils/authContext";

// =====================================================
// QUIZ DO ROLÊ - ROTA DO ROLÊ
// =====================================================

type Categoria = "shows" | "gastronomia" | "cultura" | "aventura";

type Alternativa = {
  texto: string;
  categoria: Categoria;
};

type Pergunta = {
  titulo: string;
  alternativas: Alternativa[];
};

const perguntas: Pergunta[] = [
  {
    titulo: "Qual é a sua vibe para hoje?",
    alternativas: [
      { texto: "Música alta e muita animação!", categoria: "shows" },
      { texto: "Comer bem e conversar.", categoria: "gastronomia" },
      { texto: "Conhecer algo novo.", categoria: "cultura" },
      { texto: "Sair da rotina e explorar.", categoria: "aventura" },
    ],
  },
  {
    titulo: "Qual lugar você escolheria para sair?",
    alternativas: [
      { texto: "Um show ou festival.", categoria: "shows" },
      { texto: "Um restaurante diferente.", categoria: "gastronomia" },
      { texto: "Um teatro ou exposição.", categoria: "cultura" },
      { texto: "Um lugar que nunca visitei.", categoria: "aventura" },
    ],
  },
  {
    titulo: "O que não pode faltar no seu rolê?",
    alternativas: [
      { texto: "Música e muita diversão.", categoria: "shows" },
      { texto: "Comida boa!", categoria: "gastronomia" },
      { texto: "Conhecimento e novidades.", categoria: "cultura" },
      { texto: "Uma experiência diferente.", categoria: "aventura" },
    ],
  },
  {
    titulo: "Como seria seu sábado perfeito?",
    alternativas: [
      { texto: "Curtindo uma festa com os amigos.", categoria: "shows" },
      { texto: "Conhecendo um restaurante.", categoria: "gastronomia" },
      { texto: "Visitando atrações culturais.", categoria: "cultura" },
      { texto: "Explorando lugares novos.", categoria: "aventura" },
    ],
  },
  {
    titulo: "Qual dessas frases combina com você?",
    alternativas: [
      { texto: "A vida é uma festa!", categoria: "shows" },
      { texto: "A felicidade também está na comida.", categoria: "gastronomia" },
      { texto: "Sempre existe algo novo para aprender.", categoria: "cultura" },
      { texto: "A melhor história começa com uma aventura.", categoria: "aventura" },
    ],
  },
];

const resultados: Record<
  Categoria,
  {
    titulo: string;
    descricao: string;
    icone: keyof typeof Ionicons.glyphMap;
  }
> = {
  shows: {
    titulo: "Shows e Festas!",
    descricao:
      "Você gosta de música, animação e momentos inesquecíveis! Seu rolê ideal envolve shows, festivais e muita diversão com os amigos.",
    icone: "musical-notes",
  },
  gastronomia: {
    titulo: "Rolê Gastronômico!",
    descricao:
      "Você adora experimentar sabores e conhecer lugares novos para comer! Restaurantes, bares e cafeterias combinam com você.",
    icone: "restaurant",
  },
  cultura: {
    titulo: "Rolê Cultural!",
    descricao:
      "Você gosta de descobrir coisas novas! Teatros, exposições, eventos culturais e experiências criativas são a sua cara.",
    icone: "color-palette",
  },
  aventura: {
    titulo: "Rolê de Exploração!",
    descricao:
      "Você gosta de sair da rotina e descobrir novos lugares! Seu rolê ideal é uma experiência diferente e cheia de novidades.",
    icone: "compass",
  },
};

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function Quiz() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [menuAberto, setMenuAberto] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Categoria[]>([]);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [finalizado, setFinalizado] = useState(false);

  // ===================================================
  // MENU HAMBÚRGUER
  // ===================================================

  function abrirMenu() {
    setMenuAberto((anterior) => !anterior);
  }

  function navegar(destino: string) {
    setMenuAberto(false);
    router.navigate(destino as any);
  }

  async function logout() {
    setMenuAberto(false);

    try {
      await auth.logOut();
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
    }
  }

  // ===================================================
  // CONTROLE DO QUIZ
  // ===================================================

  function iniciarQuiz() {
    setIniciado(true);
    setPerguntaAtual(0);
    setRespostas([]);
    setSelecionada(null);
    setFinalizado(false);
  }

  function responder(indice: number) {
    setSelecionada(indice);
  }

  function proximaPergunta() {
    if (selecionada === null) return;

    const categoria =
      perguntas[perguntaAtual].alternativas[selecionada].categoria;

    const novasRespostas = [...respostas, categoria];

    setRespostas(novasRespostas);
    setSelecionada(null);

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual((anterior) => anterior + 1);
    } else {
      setFinalizado(true);
    }
  }

  function voltarPergunta() {
    if (perguntaAtual === 0) return;

    const respostasAnteriores = respostas.slice(0, -1);
    const ultimaResposta = respostas[respostas.length - 1];

    const indiceAnterior = perguntas[
      perguntaAtual - 1
    ].alternativas.findIndex(
      (alternativa) => alternativa.categoria === ultimaResposta
    );

    setRespostas(respostasAnteriores);
    setPerguntaAtual((anterior) => anterior - 1);
    setSelecionada(indiceAnterior >= 0 ? indiceAnterior : null);
  }

  function calcularResultado(): Categoria {
    const pontos: Record<Categoria, number> = {
      shows: 0,
      gastronomia: 0,
      cultura: 0,
      aventura: 0,
    };

    respostas.forEach((categoria) => {
      pontos[categoria] += 1;
    });

    const categorias: Categoria[] = [
      "shows",
      "gastronomia",
      "cultura",
      "aventura",
    ];

    // Em caso de empate, prevalece a categoria
    // escolhida primeiro pelo usuário.
    let vencedor = respostas[0] || "shows";

    categorias.forEach((categoria) => {
      if (pontos[categoria] > pontos[vencedor]) {
        vencedor = categoria;
      }
    });

    return vencedor;
  }

  const resultadoFinal = resultados[calcularResultado()];
  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100;

  // ===================================================
  // INTERFACE
  // ===================================================

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
            <FontAwesome
              name="map-marker"
              size={30}
              color="#ffffff"
            />

            <Text style={styles.logo}>Rota do Rolê</Text>
          </View>

          <Pressable
            style={styles.botaoMenu}
            onPress={abrirMenu}
            accessibilityRole="button"
            accessibilityLabel={menuAberto ? "Fechar menu" : "Abrir menu"}
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
          <ScrollView
            style={styles.menu}
            contentContainerStyle={styles.menuConteudo}
            showsVerticalScrollIndicator={false}
          >

            <Pressable
              style={styles.itemMenu}
              onPress={() => navegar("/(auth)/dashboard")}
            >
              <Ionicons name="home-outline" size={20} color="#075b91" />
              <Text style={styles.textoMenu}>Início</Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={() => navegar("/eventos")}
            >
              <Ionicons name="calendar-outline" size={20} color="#075b91" />
              <Text style={styles.textoMenu}>Eventos</Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={() => navegar("/cadastro")}
            >
              <Ionicons name="add-circle-outline" size={20} color="#075b91" />
              <Text style={styles.textoMenu}>Cadastrar Evento</Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={() => navegar("/perfil")}
            >
              <Ionicons name="person-outline" size={20} color="#075b91" />
              <Text style={styles.textoMenu}>Minha Conta</Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={() => navegar("/sobrenos")}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#075b91"
              />
              <Text style={styles.textoMenu}>Sobre Nós</Text>
            </Pressable>

            <Pressable
              style={[styles.itemMenu, styles.itemMenuAtivo]}
              onPress={() => setMenuAberto(false)}
            >
              <Ionicons
                name="help-circle"
                size={20}
                color="#ff6633"
              />
              <Text style={styles.textoMenuAtivo}>Quiz do Rolê</Text>
            </Pressable>

            <Pressable
              style={styles.itemMenu}
              onPress={logout}
            >
              <Ionicons name="exit-outline" size={20} color="#ff6633" />
              <Text style={styles.textoSair}>Sair</Text>
            </Pressable>

          </ScrollView>
        )}

        {/* CONTEÚDO */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >

          {/* BANNER */}

          <LinearGradient
            colors={["#075b91", "#173b5e"]}
            style={styles.banner}
          >
            <Ionicons
              name="game-controller"
              size={48}
              color="#ff6633"
            />

            <Text style={styles.bannerTitulo}>
              Quiz do Rolê
            </Text>

            <View style={styles.linhaBanner} />

            <Text style={styles.bannerTexto}>
              Descubra qual tipo de rolê combina mais com você!
            </Text>
          </LinearGradient>

          {/* TELA INICIAL */}

          {!iniciado && (
            <View style={styles.cardPrincipal}>
              <Ionicons
                name="sparkles"
                size={48}
                color="#ff6633"
              />

              <Text style={styles.tituloCard}>
                Preparado para descobrir sua vibe?
              </Text>

              <Text style={styles.textoCard}>
                Responda 5 perguntas rápidas e descubra
                qual é o rolê perfeito para o seu estilo.
              </Text>

              <Text style={styles.textoCard}>
                Não existem respostas certas ou erradas.
                Escolha aquilo que mais combina com você!
              </Text>

              <Pressable
                style={styles.botaoPrincipal}
                onPress={iniciarQuiz}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={22}
                  color="#ffffff"
                />
                <Text style={styles.textoBotao}>
                  Começar Quiz
                </Text>
              </Pressable>
            </View>
          )}

          {/* PERGUNTAS */}

          {iniciado && !finalizado && (
            <View style={styles.cardQuiz}>

              <Text style={styles.contador}>
                Pergunta {perguntaAtual + 1} de {perguntas.length}
              </Text>

              <View style={styles.barraProgresso}>
                <View
                  style={[
                    styles.progresso,
                    { width: `${progresso}%` },
                  ]}
                />
              </View>

              <Text style={styles.tituloPergunta}>
                {perguntas[perguntaAtual].titulo}
              </Text>

              {perguntas[perguntaAtual].alternativas.map(
                (alternativa, indice) => (
                  <Pressable
                    key={indice}
                    style={[
                      styles.alternativa,
                      selecionada === indice &&
                        styles.alternativaSelecionada,
                    ]}
                    onPress={() => responder(indice)}
                  >
                    <Ionicons
                      name={
                        selecionada === indice
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={23}
                      color={
                        selecionada === indice
                          ? "#ff6633"
                          : "#075b91"
                      }
                    />

                    <Text
                      style={[
                        styles.textoAlternativa,
                        selecionada === indice &&
                          styles.textoAlternativaSelecionada,
                      ]}
                    >
                      {alternativa.texto}
                    </Text>
                  </Pressable>
                )
              )}

              <View style={styles.linhaBotoes}>

                {perguntaAtual > 0 && (
                  <Pressable
                    style={styles.botaoVoltar}
                    onPress={voltarPergunta}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={18}
                      color="#075b91"
                    />
                    <Text style={styles.textoVoltar}>
                      Voltar
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  style={[
                    styles.botaoProximo,
                    selecionada === null &&
                      styles.botaoDesativado,
                  ]}
                  onPress={proximaPergunta}
                  disabled={selecionada === null}
                >
                  <Text style={styles.textoBotao}>
                    {perguntaAtual === perguntas.length - 1
                      ? "Ver Resultado"
                      : "Próxima"}
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#ffffff"
                  />
                </Pressable>

              </View>
            </View>
          )}

          {/* RESULTADO FINAL */}

          {iniciado && finalizado && (
            <View style={styles.cardPrincipal}>
              <Ionicons
                name="trophy"
                size={52}
                color="#ff6633"
              />

              <Text style={styles.resultadoSubtitulo}>
                Seu resultado é...
              </Text>

              <View style={styles.iconeResultado}>
                <Ionicons
                  name={resultadoFinal.icone}
                  size={52}
                  color="#ff6633"
                />
              </View>

              <Text style={styles.resultadoTitulo}>
                {resultadoFinal.titulo}
              </Text>

              <Text style={styles.resultadoDescricao}>
                {resultadoFinal.descricao}
              </Text>

              <Pressable
                style={styles.botaoPrincipal}
                onPress={iniciarQuiz}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.textoBotao}>
                  Jogar Novamente
                </Text>
              </Pressable>

              <Pressable
                style={styles.botaoEventos}
                onPress={() => navegar("/eventos")}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#075b91"
                />
                <Text style={styles.textoEventos}>
                  Explorar Eventos
                </Text>
              </Pressable>
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

  pagina: {
    flex: 1,
    backgroundColor: "#f5f6f8",
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
    elevation: 5,
    zIndex: 9,
    maxHeight: "65%",
    flexGrow: 0,
  },

  menuConteudo: {
    paddingVertical: 5,
  },

  itemMenu: {
    minHeight: 50,
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
    color: "#ff6633",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 12,
  },

  textoSair: {
    color: "#ff6633",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 12,
  },

  // ROLAGEM

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 60,
  },

  // BANNER

  banner: {
    minHeight: 210,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  bannerTitulo: {
    color: "#ffffff",
    fontSize: 29,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },

  linhaBanner: {
    width: 55,
    height: 4,
    backgroundColor: "#ff6633",
    borderRadius: 5,
    marginVertical: 12,
  },

  bannerTexto: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },

  // CARD PRINCIPAL

  cardPrincipal: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 25,
    marginHorizontal: 15,
    marginTop: 28,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  tituloCard: {
    color: "#075b91",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 18,
    marginBottom: 15,
  },

  textoCard: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 15,
  },

  // BOTÕES

  botaoPrincipal: {
    minHeight: 52,
    backgroundColor: "#075b91",
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    alignSelf: "stretch",
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 8,
  },

  // QUIZ

  cardQuiz: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 22,
    marginHorizontal: 15,
    marginTop: 28,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  contador: {
    color: "#075b91",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },

  barraProgresso: {
    height: 9,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 25,
  },

  progresso: {
    height: "100%",
    backgroundColor: "#ff6633",
    borderRadius: 10,
  },

  tituloPergunta: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#075b91",
    textAlign: "center",
    marginBottom: 25,
  },

  alternativa: {
    minHeight: 65,
    borderWidth: 1,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  alternativaSelecionada: {
    borderColor: "#ff6633",
    borderWidth: 2,
    backgroundColor: "#fff4ef",
  },

  textoAlternativa: {
    flex: 1,
    color: "#173b5e",
    fontSize: 14,
    marginLeft: 12,
    lineHeight: 20,
  },

  textoAlternativaSelecionada: {
    fontWeight: "bold",
    color: "#075b91",
  },

  linhaBotoes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },

  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },

  textoVoltar: {
    color: "#075b91",
    fontWeight: "bold",
    marginLeft: 5,
  },

  botaoProximo: {
    backgroundColor: "#075b91",
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },

  botaoDesativado: {
    backgroundColor: "#a0a0a0",
  },

  // RESULTADO

  resultadoSubtitulo: {
    color: "#666666",
    fontSize: 16,
    marginTop: 18,
    marginBottom: 15,
  },

  iconeResultado: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff2ec",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  resultadoTitulo: {
    color: "#075b91",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  resultadoDescricao: {
    color: "#666666",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },

  botaoEventos: {
    minHeight: 50,
    borderWidth: 2,
    borderColor: "#075b91",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  textoEventos: {
    color: "#075b91",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
