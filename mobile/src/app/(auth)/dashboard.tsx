
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
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
import { AuthContext } from "../utils/authContext";

// =====================================================
// DASHBOARD - ROTA DO ROLÊ
// =====================================================

export default function DashBoard() {
  const route = useRouter();
  const auth = useContext(AuthContext);

  const [menuAberto, setMenuAberto] = useState(false);

  // Controla a cor do botão patrocinador
  const [patrocinadorHover, setPatrocinadorHover] = useState(false);

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
    // Já estamos na Dashboard.
  }

  function irParaEventos() {
    setMenuAberto(false);
    route.navigate("/eventos");
  }

  function irParaCadastrarEvento() {
    setMenuAberto(false);
    route.navigate("/cadastro");
  }

  function irParaMinhaConta() {
    setMenuAberto(false);
    route.navigate("/perfil");
  }

  function irParaSobreNos() {
    setMenuAberto(false);
    route.navigate("/sobrenos");
  }

  function irParaQuiz() {
    setMenuAberto(false);
    route.navigate("/quiz");
  }

  function irParaPatrocinador() {
    setMenuAberto(false);
    setPatrocinadorHover(false);
    route.navigate("/patrocinador");
  }

  // ===================================================
  // LOGOUT
  // ===================================================

  function logout() {
    setMenuAberto(false);
    auth.logOut();
    route.replace("/login");
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
          {/* LOGO */}

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

          {/* BOTÃO HAMBÚRGUER */}

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

        {/* ============================================
            MENU HAMBÚRGUER
        ============================================ */}

        {menuAberto && (
          <View style={styles.menu}>

            {/* INÍCIO - SELECIONADO EM LARANJA */}

            <Pressable
              style={[
                styles.itemMenu,
                styles.itemMenuAtivo,
              ]}
              onPress={irParaInicio}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color="#ff6633"
              />

              <Text
                style={[
                  styles.textoMenu,
                  styles.textoMenuAtivo,
                ]}
              >
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
            CONTEÚDO DA DASHBOARD
        ============================================ */}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >

          {/* ==========================================
              BANNER PRINCIPAL
          ========================================== */}

          <View style={styles.bannerPrincipal}>

            <Pressable style={styles.setaBanner}>
              <Ionicons
                name="chevron-back"
                size={28}
                color="#ffffff"
              />
            </Pressable>

            <View style={styles.bannerConteudo}>
              <Ionicons
                name="calendar"
                size={45}
                color="#ff6633"
              />

              <Text style={styles.bannerTitulo}>
                Descubra seu próximo rolê
              </Text>

              <Text style={styles.bannerTexto}>
                Encontre eventos, shows, bares e muito mais.
              </Text>
            </View>

            <Pressable style={styles.setaBanner}>
              <Ionicons
                name="chevron-forward"
                size={28}
                color="#ffffff"
              />
            </Pressable>

          </View>

          {/* ==========================================
              EXPLORE POR CATEGORIA
          ========================================== */}

          <View style={styles.secao}>
            <Text style={styles.tituloSecao}>
              Explore por Categoria
            </Text>

            <View style={styles.linhaTitulo} />

            <View style={styles.categorias}>

              {/* SHOWS */}

              <Pressable style={styles.cardCategoria}>
                <Ionicons
                  name="musical-notes"
                  size={42}
                  color="#ff6633"
                />

                <Text style={styles.nomeCategoria}>
                  Shows
                </Text>
              </Pressable>

              {/* BARES */}

              <Pressable style={styles.cardCategoria}>
                <Ionicons
                  name="beer"
                  size={42}
                  color="#ff6633"
                />

                <Text style={styles.nomeCategoria}>
                  Bares
                </Text>
              </Pressable>

              {/* RESTAURANTES */}

              <Pressable style={styles.cardCategoria}>
                <Ionicons
                  name="restaurant"
                  size={42}
                  color="#ff6633"
                />

                <Text style={styles.nomeCategoria}>
                  Restaurantes
                </Text>
              </Pressable>

              {/* CULTURAL */}

              <Pressable style={styles.cardCategoria}>
                <FontAwesome5
                  name="theater-masks"
                  size={38}
                  color="#ff6633"
                />

                <Text style={styles.nomeCategoria}>
                  Cultural
                </Text>
              </Pressable>

            </View>
          </View>

          {/* ==========================================
              NOSSOS PARCEIROS
          ========================================== */}

          <View style={styles.secaoParceiros}>
            <Text style={styles.tituloSecao}>
              Nossos Parceiros
            </Text>

            <View style={styles.linhaTitulo} />

            {/* BANNER DOS PARCEIROS */}

            <View style={styles.bannerParceiros}>

              <Pressable style={styles.setaParceiro}>
                <Ionicons
                  name="chevron-back"
                  size={25}
                  color="#ffffff"
                />
              </Pressable>

              <View style={styles.parceiroConteudo}>
                <FontAwesome5
                  name="handshake"
                  size={45}
                  color="#ff6633"
                />

                <Text style={styles.parceiroTitulo}>
                  Espaço para Parceiros
                </Text>
              </View>

              <Pressable style={styles.setaParceiro}>
                <Ionicons
                  name="chevron-forward"
                  size={25}
                  color="#ffffff"
                />
              </Pressable>

            </View>

            <Text style={styles.textoParceiro}>
              Tem um negócio e quer mais visibilidade na cidade?
            </Text>

            {/* ========================================
                BOTÃO PATROCINADOR COM HOVER
            ======================================== */}

            <Pressable
              style={({ pressed }) => [
                styles.botaoParceiro,
                (pressed || patrocinadorHover) &&
                  styles.botaoParceiroAtivo,
              ]}
              onHoverIn={() => setPatrocinadorHover(true)}
              onHoverOut={() => setPatrocinadorHover(false)}
              onPress={irParaPatrocinador}
              accessibilityRole="button"
              accessibilityLabel="Seja um Parceiro ou Patrocinador"
            >
              <FontAwesome5
                name="handshake"
                size={17}
                color="#ffffff"
              />

              <Text style={styles.textoBotaoParceiro}>
                Seja um Parceiro / Patrocinador
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
    height: 50,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  // NOVO: DESTAQUE LARANJA NO ITEM SELECIONADO

  itemMenuAtivo: {
    backgroundColor: "#fff0e8",
    borderLeftWidth: 4,
    borderLeftColor: "#ff6633",
    paddingLeft: 21,
  },

  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  textoMenuAtivo: {
    color: "#ff6633",
    fontWeight: "800",
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
    height: 210,
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },

  bannerConteudo: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  bannerTitulo: {
    color: "#075b91",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },

  bannerTexto: {
    color: "#666666",
    fontSize: 13,
    textAlign: "center",
    marginTop: 7,
  },

  setaBanner: {
    width: 42,
    height: 55,
    backgroundColor: "#888888",
    alignItems: "center",
    justifyContent: "center",
  },

  // ===================================================
  // SEÇÕES
  // ===================================================

  secao: {
    paddingHorizontal: 15,
    marginTop: 45,
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
  // CATEGORIAS
  // ===================================================

  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardCategoria: {
    width: "48%",
    height: 135,
    backgroundColor: "#ffffff",
    borderRadius: 10,
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

  nomeCategoria: {
    color: "#075b91",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },

  // ===================================================
  // PARCEIROS
  // ===================================================

  secaoParceiros: {
    paddingHorizontal: 15,
    marginTop: 45,
    alignItems: "center",
  },

  bannerParceiros: {
    width: "100%",
    height: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },

  parceiroConteudo: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  parceiroTitulo: {
    color: "#075b91",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },

  setaParceiro: {
    width: 40,
    height: 50,
    backgroundColor: "#888888",
    alignItems: "center",
    justifyContent: "center",
  },

  textoParceiro: {
    color: "#173b5e",
    fontSize: 14,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 15,
  },

  // ===================================================
  // BOTÃO PATROCINADOR
  // ===================================================

  botaoParceiro: {
    minHeight: 50,
    backgroundColor: "#075b91",
    borderRadius: 6,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoParceiroAtivo: {
    backgroundColor: "#ff6633",
  },

  textoBotaoParceiro: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
