import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { obterPainelPatrocinador, type PainelPatrocinador } from "../utils/api";
import { AuthContext } from "../utils/authContext";

const AZUL = "#07569a";
const AZUL_MENU = "#075b91";
const LARANJA = "#ff6633";
const CINZA = "#68788c";

const linksMenu = [
  { titulo: "Início", rota: "/dashboard", icone: "home-outline" },
  { titulo: "Eventos", rota: "/eventos", icone: "calendar-outline" },
  { titulo: "Cadastrar Evento", rota: "/cadastro", icone: "add-circle-outline" },
  { titulo: "Minha Conta", rota: "/perfil", icone: "person-outline" },
  { titulo: "Sobre Nós", rota: "/sobrenos", icone: "information-circle-outline" },
  { titulo: "Quiz do Rolê", rota: "/quiz", icone: "help-circle-outline" },
] as const;

// Valores ilustrativos usados na demonstração do gráfico.
const exemplo = [
  { mes: "Jan", antes: 38, depois: 40 },
  { mes: "Fev", antes: 40, depois: 50 },
  { mes: "Mar", antes: 37, depois: 64 },
  { mes: "Abr", antes: 43, depois: 72 },
  { mes: "Mai", antes: 41, depois: 83 },
  { mes: "Jun", antes: 45, depois: 90 },
];

export default function PainelPatrocinadorScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const token = auth.token;
  const { width, height } = useWindowDimensions();
  const [menuAberto, setMenuAberto] = useState(false);
  const [consulta, setConsulta] = useState<{
    token: string;
    painel: PainelPatrocinador | null;
    erro: string;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    let ativo = true;
    setConsulta(null);

    async function buscar(tokenAtual: string) {
      try {
        const resposta = await obterPainelPatrocinador(tokenAtual);
        if (ativo) {
          setConsulta({
            token: tokenAtual,
            painel: resposta.data ?? null,
            erro: resposta.data ? "" : "Painel indisponível.",
          });
        }
      } catch (e) {
        if (ativo) {
          setConsulta({
            token: tokenAtual,
            painel: null,
            erro:
              e instanceof Error
                ? e.message
                : "Não foi possível consultar a aprovação.",
          });
        }
      }
    }

    buscar(token);

    return () => {
      ativo = false;
    };
  }, [token]);

  const consultaAtual = consulta?.token === token ? consulta : null;
  const carregando = Boolean(token) && consultaAtual === null;
  const painel = consultaAtual?.painel;
  const erro = token ? consultaAtual?.erro : "Faça login para continuar.";

  function sair() {
    setMenuAberto(false);
    auth.logOut();
    router.replace("/login");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[AZUL_MENU, "#6b5a64", LARANJA]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.header}
      >
        <Pressable
          style={styles.logoArea}
          onPress={() => {
            setMenuAberto(false);
            router.navigate("/dashboard");
          }}
          accessibilityRole="button"
          accessibilityLabel="Voltar ao início"
        >
          <FontAwesome name="map-marker" size={30} color="#ffffff" />
          <Text style={styles.logo}>Rota do Rolê</Text>
        </Pressable>

        <Pressable
          style={styles.botaoMenu}
          onPress={() => setMenuAberto((anterior) => !anterior)}
          accessibilityRole="button"
          accessibilityLabel={menuAberto ? "Fechar menu" : "Abrir menu"}
          accessibilityState={{ expanded: menuAberto }}
        >
          <Ionicons
            name={menuAberto ? "close" : "menu"}
            size={32}
            color="#ffffff"
          />
        </Pressable>
      </LinearGradient>

      {menuAberto && (
        <ScrollView
          style={[styles.menu, { maxHeight: height * 0.7 }]}
          contentContainerStyle={styles.conteudoMenu}
        >
          {linksMenu.map(({ titulo, rota, icone }) => (
            <Pressable
              key={rota}
              style={styles.itemMenu}
              accessibilityRole="button"
              onPress={() => {
                setMenuAberto(false);
                router.navigate(rota);
              }}
            >
              <Ionicons name={icone} size={20} color={AZUL_MENU} />
              <Text style={styles.textoMenu}>{titulo}</Text>
            </Pressable>
          ))}

          {painel && (
            <Pressable
              style={[styles.itemMenu, styles.itemMenuAtivo]}
              onPress={() => setMenuAberto(false)}
              accessibilityRole="button"
              accessibilityState={{ selected: true }}
            >
              <Ionicons name="stats-chart-outline" size={20} color={LARANJA} />
              <Text style={[styles.textoMenu, styles.textoMenuAtivo]}>
                Painel do Patrocinador
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.itemMenu}
            onPress={sair}
            accessibilityRole="button"
          >
            <Ionicons name="exit-outline" size={20} color={LARANJA} />
            <Text style={styles.textoSair}>Sair</Text>
          </Pressable>
        </ScrollView>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Painel do Patrocinador</Text>
        <View style={styles.linha} />

        {carregando ? (
          <ActivityIndicator
            size="large"
            color={AZUL}
            style={{ marginTop: 45 }}
          />
        ) : erro || !painel ? (
          <View style={styles.card}>
            <Ionicons name="lock-closed-outline" size={40} color={LARANJA} />
            <Text style={styles.cardTitulo}>Acesso não autorizado</Text>
            <Text style={styles.descricao}>{erro || "Aguardando aprovação."}</Text>
            <Pressable
              style={styles.botao}
              onPress={() => router.replace("/dashboard")}
            >
              <Text style={styles.botaoTxt}>Voltar ao início</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.area, { width: width < 700 ? "95%" : "90%" }]}>
            <View style={styles.card}>
              <Text style={styles.selo}>PATROCINADOR APROVADO</Text>
              <Text style={styles.empresa}>{painel.empresa}</Text>
              <Text style={styles.descricao}>
                Bem-vindo(a), {painel.responsavel}! Sua empresa faz parte dos
                parceiros da Rota do Rolê.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Visibilidade e divulgação</Text>
              <Text style={styles.descricao}>
                O patrocínio pode contribuir para ampliar o alcance da marca,
                gerar interesse e fortalecer a presença do negócio na região.
              </Text>

              <View style={styles.aviso}>
                <Ionicons name="information-circle-outline" size={21} color={AZUL} />
                <Text style={styles.avisoTxt}>
                  Demonstração visual: os números abaixo são fictícios. O projeto
                  ainda não registra acessos, novos seguidores nem visitas ao
                  estabelecimento.
                </Text>
              </View>

              <View style={styles.legenda}>
                <View style={styles.chave}>
                  <View style={[styles.ponto, { backgroundColor: AZUL }]} />
                  <Text style={styles.legendaTxt}>Referência (exemplo)</Text>
                </View>
                <View style={styles.chave}>
                  <View style={[styles.ponto, { backgroundColor: LARANJA }]} />
                  <Text style={styles.legendaTxt}>Com divulgação (exemplo)</Text>
                </View>
              </View>

              <View style={styles.grafico}>
                {exemplo.map(({ mes, antes, depois }) => (
                  <View key={mes} style={styles.grupo}>
                    <View style={styles.barras}>
                      <View
                        style={[
                          styles.barra,
                          { height: `${antes}%`, backgroundColor: AZUL },
                        ]}
                      />
                      <View
                        style={[
                          styles.barra,
                          { height: `${depois}%`, backgroundColor: LARANJA },
                        ]}
                      />
                    </View>
                    <Text style={styles.mes}>{mes}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.rodape}>
                Índice ilustrativo (escala de 0 a 100). Não representa desempenho
                medido.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Próximos passos</Text>
              <Text style={styles.descricao}>
                Após integrar um contador de visualizações e dados de campanhas,
                este painel poderá mostrar resultados reais específicos da sua
                empresa.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f6f8",
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
    flexGrow: 0,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    elevation: 5,
    zIndex: 9,
  },
  conteudoMenu: {
    paddingVertical: 5,
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
    borderLeftColor: LARANJA,
    paddingLeft: 21,
  },
  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },
  textoMenuAtivo: {
    color: LARANJA,
    fontWeight: "800",
  },
  textoSair: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 12,
  },
  scroll: {
    flex: 1,
  },
  conteudo: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 50,
  },
  titulo: {
    color: AZUL,
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
  },
  linha: {
    backgroundColor: LARANJA,
    width: 65,
    height: 4,
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 28,
  },
  area: {
    maxWidth: 850,
    alignItems: "stretch",
    gap: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 23,
    width: "100%",
    maxWidth: 850,
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  selo: {
    fontSize: 12,
    color: AZUL,
    fontWeight: "800",
    backgroundColor: "#e8f2fa",
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 7,
  },
  empresa: {
    fontSize: 25,
    color: "#123b63",
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: CINZA,
    lineHeight: 22,
    marginTop: 7,
  },
  cardTitulo: {
    fontSize: 19,
    fontWeight: "800",
    color: AZUL,
    marginBottom: 8,
  },
  aviso: {
    backgroundColor: "#eef5fb",
    padding: 13,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginTop: 17,
  },
  avisoTxt: {
    flex: 1,
    color: "#254e72",
    lineHeight: 19,
    fontSize: 12,
  },
  legenda: {
    flexDirection: "row",
    gap: 15,
    flexWrap: "wrap",
    marginTop: 22,
  },
  chave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ponto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendaTxt: {
    color: CINZA,
    fontSize: 12,
  },
  grafico: {
    height: 200,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#d6dde5",
    marginTop: 25,
  },
  grupo: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  barras: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
    height: "85%",
    width: "100%",
  },
  barra: {
    width: "27%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  mes: {
    marginTop: 7,
    fontSize: 12,
    color: CINZA,
    fontWeight: "600",
  },
  rodape: {
    fontSize: 11,
    color: CINZA,
    marginTop: 18,
  },
  botao: {
    backgroundColor: AZUL,
    padding: 13,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  botaoTxt: {
    color: "#fff",
    fontWeight: "700",
  },
});