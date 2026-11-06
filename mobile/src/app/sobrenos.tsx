
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
// SOBRE NÓS - ROTA DO ROLÊ
// =====================================================

export default function SobreNos() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [menuAberto, setMenuAberto] = useState(false);

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
    router.navigate("/(auth)/dashboard");
  }

  function irParaEventos() {
    setMenuAberto(false);
    router.navigate("/eventos");
  }

  function irParaCadastrarEvento() {
    setMenuAberto(false);
    router.navigate("/cadastro");
  }

  function irParaMinhaConta() {
    setMenuAberto(false);
    router.navigate("/perfil");
  }

  function irParaQuiz() {
    setMenuAberto(false);
    router.navigate("/quiz");
  }

  // ===================================================
  // LOGOUT
  // ===================================================

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
  // INTERFACE
  // ===================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.pagina}>

        {/* ============================================
            CABEÇALHO
        ============================================ */}

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

          <Pressable
            style={styles.botaoMenu}
            onPress={abrirMenu}
            accessibilityRole="button"
            accessibilityLabel={
              menuAberto ? "Fechar menu" : "Abrir menu"
            }
          >
            <Ionicons
              name={menuAberto ? "close" : "menu"}
              size={32}
              color="#ffffff"
            />
          </Pressable>
        </LinearGradient>

        {/* ============================================
            MENU HAMBÚRGUER
        ============================================ */}

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

            {/* EVENTOS */}

            <Pressable
              style={styles.itemMenu}
              onPress={irParaEventos}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#075b91"
              />

              <Text style={styles.textoMenu}>
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
              style={[
                styles.itemMenu,
                styles.itemMenuAtivo,
              ]}
              onPress={() => setMenuAberto(false)}
            >
              <Ionicons
                name="information-circle"
                size={20}
                color="#ff6633"
              />

              <Text style={styles.textoMenuAtivo}>
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

            {/* SAIR */}

            <Pressable
              style={styles.itemMenu}
              onPress={logout}
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color="#ff6633"
              />

              <Text style={styles.textoSair}>
                Sair
              </Text>
            </Pressable>

          </View>
        )}

        {/* ============================================
            CONTEÚDO SOBRE NÓS
        ============================================ */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >

          {/* BANNER PRINCIPAL */}

          <LinearGradient
            colors={["#075b91", "#173b5e"]}
            style={styles.bannerPrincipal}
          >
            <View style={styles.iconeBanner}>
              <Ionicons
                name="location"
                size={48}
                color="#ff6633"
              />
            </View>

            <Text style={styles.bannerTitulo}>
              Sobre Nós
            </Text>

            <View style={styles.linhaBanner} />

            <Text style={styles.bannerTexto}>
              Conectando pessoas, lugares e experiências
              inesquecíveis.
            </Text>
          </LinearGradient>

          {/* ============================================
              QUEM SOMOS
          ============================================ */}

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>
              Quem Somos?
            </Text>

            <View style={styles.linhaTitulo} />

            <View style={styles.cardPrincipal}>
              <View style={styles.iconeCard}>
                <Ionicons
                  name="people"
                  size={35}
                  color="#ff6633"
                />
              </View>

              <Text style={styles.tituloCard}>
                Muito mais que eventos!
              </Text>

              <Text style={styles.textoCard}>
                O Rota do Rolê é uma plataforma criada
                para facilitar a descoberta de eventos,
                shows, bares, restaurantes e experiências
                incríveis na sua cidade.
              </Text>

              <Text style={styles.textoCard}>
                Nosso objetivo é reunir as melhores
                opções de entretenimento em um só lugar,
                permitindo que você encontre seu próximo
                rolê de maneira simples, rápida e prática.
              </Text>
            </View>
          </View>

          {/* ============================================
              NOSSA MISSÃO
          ============================================ */}

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>
              Nossa Missão
            </Text>

            <View style={styles.linhaTitulo} />

            <View style={styles.cardPrincipal}>
              <View style={styles.iconeCard}>
                <Ionicons
                  name="rocket-outline"
                  size={38}
                  color="#ff6633"
                />
              </View>

              <Text style={styles.tituloCard}>
                Aproximar você das melhores experiências
              </Text>

              <Text style={styles.textoCard}>
                Queremos tornar a busca por lazer e
                entretenimento mais acessível, conectando
                pessoas aos eventos e estabelecimentos
                da região.
              </Text>

              <Text style={styles.textoCard}>
                Também buscamos dar mais visibilidade
                aos organizadores, comerciantes e
                parceiros locais.
              </Text>
            </View>
          </View>

          {/* ============================================
              O QUE OFERECEMOS
          ============================================ */}

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>
              O Que Oferecemos?
            </Text>

            <View style={styles.linhaTitulo} />

            <View style={styles.cardsContainer}>

              {/* EVENTOS */}

              <View style={styles.cardPequeno}>
                <Ionicons
                  name="calendar"
                  size={38}
                  color="#ff6633"
                />

                <Text style={styles.cardPequenoTitulo}>
                  Eventos
                </Text>

                <Text style={styles.cardPequenoTexto}>
                  Descubra shows, festas e eventos
                  próximos de você.
                </Text>
              </View>

              {/* GASTRONOMIA */}

              <View style={styles.cardPequeno}>
                <Ionicons
                  name="restaurant"
                  size={38}
                  color="#ff6633"
                />

                <Text style={styles.cardPequenoTitulo}>
                  Gastronomia
                </Text>

                <Text style={styles.cardPequenoTexto}>
                  Conheça bares e restaurantes
                  para aproveitar.
                </Text>
              </View>

              {/* DIVULGAÇÃO */}

              <View style={styles.cardPequeno}>
                <Ionicons
                  name="megaphone"
                  size={38}
                  color="#ff6633"
                />

                <Text style={styles.cardPequenoTitulo}>
                  Divulgação
                </Text>

                <Text style={styles.cardPequenoTexto}>
                  Ajude seu evento a alcançar
                  mais pessoas.
                </Text>
              </View>

              {/* CONEXÕES */}

              <View style={styles.cardPequeno}>
                <Ionicons
                  name="people"
                  size={38}
                  color="#ff6633"
                />

                <Text style={styles.cardPequenoTitulo}>
                  Conexões
                </Text>

                <Text style={styles.cardPequenoTexto}>
                  Conecte-se com novas experiências
                  e oportunidades.
                </Text>
              </View>

            </View>
          </View>

          {/* ============================================
              NOSSO PROPÓSITO
          ============================================ */}

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>
              Nosso Propósito
            </Text>

            <View style={styles.linhaTitulo} />

            <View style={styles.cardPrincipal}>
              <Ionicons
                name="heart"
                size={40}
                color="#ff6633"
                style={styles.iconeProposito}
              />

              <Text style={styles.textoCard}>
                Acreditamos que os melhores momentos
                acontecem quando encontramos os lugares
                certos e as pessoas certas.
              </Text>

              <Text style={styles.textoCard}>
                Por isso, o Rota do Rolê nasceu para
                ajudar você a descobrir novas
                possibilidades e aproveitar tudo
                o que sua cidade tem a oferecer.
              </Text>
            </View>
          </View>

          {/* ============================================
              CHAMADA FINAL
          ============================================ */}

          <View style={styles.chamadaFinal}>
            <Ionicons
              name="navigate-circle-outline"
              size={48}
              color="#ff6633"
            />

            <Text style={styles.chamadaTitulo}>
              Seu próximo rolê começa aqui!
            </Text>

            <Text style={styles.chamadaTexto}>
              Explore eventos e descubra novas
              experiências com o Rota do Rolê.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.botaoExplorar,
                pressed && styles.botaoExplorarAtivo,
              ]}
              onPress={irParaEventos}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#ffffff"
              />

              <Text style={styles.textoBotao}>
                Explorar Eventos
              </Text>
            </Pressable>
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

  // ===================================================
  // ESTRUTURA
  // ===================================================

  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  pagina: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  // ===================================================
  // CABEÇALHO
  // ===================================================

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

  // ===================================================
  // MENU HAMBÚRGUER
  // ===================================================

  menu: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingVertical: 5,
    elevation: 5,
    zIndex: 9,
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

  // ===================================================
  // ROLAGEM
  // ===================================================

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 50,
  },

  // ===================================================
  // BANNER PRINCIPAL
  // ===================================================

  bannerPrincipal: {
    minHeight: 220,
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 30,
    elevation: 3,
  },

  iconeBanner: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  bannerTitulo: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },

  linhaBanner: {
    width: 55,
    height: 4,
    backgroundColor: "#ff6633",
    borderRadius: 5,
    marginTop: 12,
    marginBottom: 15,
  },

  bannerTexto: {
    color: "#ffffff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 23,
  },

  // ===================================================
  // SEÇÕES
  // ===================================================

  secao: {
    paddingHorizontal: 15,
    marginTop: 40,
  },

  tituloSecao: {
    color: "#075b91",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  linhaTitulo: {
    width: 55,
    height: 4,
    backgroundColor: "#ff6633",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  // ===================================================
  // CARDS PRINCIPAIS
  // ===================================================

  cardPrincipal: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  iconeCard: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff2ec",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  tituloCard: {
    color: "#075b91",
    fontSize: 19,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  textoCard: {
    color: "#666666",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 12,
  },

  // ===================================================
  // CARDS PEQUENOS
  // ===================================================

  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardPequeno: {
    width: "48%",
    minHeight: 185,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  cardPequenoTitulo: {
    color: "#075b91",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  cardPequenoTexto: {
    color: "#666666",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },

  // ===================================================
  // PROPÓSITO
  // ===================================================

  iconeProposito: {
    marginBottom: 15,
  },

  // ===================================================
  // CHAMADA FINAL
  // ===================================================

  chamadaFinal: {
    marginHorizontal: 15,
    marginTop: 45,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  chamadaTitulo: {
    color: "#075b91",
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
  },

  chamadaTexto: {
    color: "#666666",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 22,
  },

  botaoExplorar: {
    minHeight: 50,
    backgroundColor: "#075b91",
    borderRadius: 6,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoExplorarAtivo: {
    backgroundColor: "#ff6633",
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
