import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../utils/authContext";
import { obterPainelPatrocinador, PainelPatrocinador } from "../utils/api";

const AZUL = "#07569a";
const LARANJA = "#ff6633";
const CINZA = "#68788c";

// VALORES ILUSTRATIVOS! Não são acessos reais nem dados de seguidores.
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
  const { width } = useWindowDimensions();
  const [painel, setPainel] = useState<PainelPatrocinador | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    async function buscar() {
      if (!auth.token) {
        if (ativo) { setErro("Faça login para continuar."); setCarregando(false); }
        return;
      }
      try {
        const resposta = await obterPainelPatrocinador(auth.token);
        if (ativo) {
          if (resposta.data) setPainel(resposta.data);
          else setErro("Painel indisponível.");
        }
      } catch (e) {
        if (ativo) setErro(e instanceof Error ? e.message : "Não foi possível consultar a aprovação.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    buscar();
    return () => { ativo = false; };
  }, [auth.token]);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#075b91", "#6b5a64", "#ff6633"]}
        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
        style={styles.header}
      >
        <Pressable style={styles.logo} onPress={() => router.replace("/dashboard")}>
          <FontAwesome name="map-marker" size={29} color="#fff" />
          <Text style={styles.nomeApp}>Rota do Rolê</Text>
        </Pressable>
        <Pressable onPress={() => router.replace("/dashboard")} style={styles.voltar}>
          <Ionicons name="arrow-back" color="#fff" size={24}/>
          <Text style={styles.voltarTxt}>Início</Text>
        </Pressable>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Painel do Patrocinador</Text>
        <View style={styles.linha}/>
        {carregando ? (
          <ActivityIndicator size="large" color={AZUL} style={{ marginTop: 45 }}/>
        ) : erro || !painel ? (
          <View style={styles.card}>
            <Ionicons name="lock-closed-outline" size={40} color={LARANJA}/>
            <Text style={styles.cardTitulo}>Acesso não autorizado</Text>
            <Text style={styles.descricao}>{erro || "Aguardando aprovação."}</Text>
            <Pressable style={styles.botao} onPress={() => router.replace("/dashboard")}>
              <Text style={styles.botaoTxt}>Voltar ao início</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.area, { maxWidth: 850, width: width < 700 ? "95%" : "90%" }]}>
            <View style={styles.card}>
              <Text style={styles.selo}>PATROCINADOR APROVADO</Text>
              <Text style={styles.empresa}>{painel.empresa}</Text>
              <Text style={styles.descricao}>
                Bem-vindo(a), {painel.responsavel}! Sua empresa faz parte dos parceiros da Rota do Rolê.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Visibilidade e divulgação</Text>
              <Text style={styles.descricao}>
                O patrocínio pode contribuir para ampliar o alcance da marca, gerar interesse e fortalecer a presença do negócio na região.
              </Text>
              <View style={styles.aviso}>
                <Ionicons name="information-circle-outline" size={21} color={AZUL}/>
                <Text style={styles.avisoTxt}>
                  Demonstração visual: os números abaixo são fictícios. O projeto ainda não registra acessos, novos seguidores nem visitas ao estabelecimento.
                </Text>
              </View>
              <View style={styles.legenda}>
                <View style={styles.chave}><View style={[styles.ponto, { backgroundColor: AZUL }]}/><Text style={styles.legendaTxt}>Referência (exemplo)</Text></View>
                <View style={styles.chave}><View style={[styles.ponto, { backgroundColor: LARANJA }]}/><Text style={styles.legendaTxt}>Com divulgação (exemplo)</Text></View>
              </View>
              <View style={styles.grafico}>
                {exemplo.map(d => (
                  <View key={d.mes} style={styles.grupo}>
                    <View style={styles.barras}>
                      <View style={[styles.barra, { height: `${d.antes}%`, backgroundColor: AZUL }]}/>
                      <View style={[styles.barra, { height: `${d.depois}%`, backgroundColor: LARANJA }]}/>
                    </View>
                    <Text style={styles.mes}>{d.mes}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.rodape}>Índice ilustrativo (escala de 0 a 100). Não representa desempenho medido.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitulo}>Próximos passos</Text>
              <Text style={styles.descricao}>
                Após integrar um contador de visualizações e dados de campanhas, este painel poderá mostrar resultados reais específicos da sua empresa.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6f8" },
  header: { height: 75, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { flexDirection: "row", alignItems: "center", gap: 9 },
  nomeApp: { color: "#fff", fontSize: 23, fontWeight: "bold" },
  voltar: { flexDirection: "row", alignItems: "center", gap: 6 },
  voltarTxt: { color: "#fff", fontSize: 14, fontWeight: "600" },
  conteudo: { alignItems: "center", paddingHorizontal: 12, paddingTop: 40, paddingBottom: 50 },
  titulo: { color: AZUL, fontSize: 27, fontWeight: "800", textAlign: "center" },
  linha: { backgroundColor: LARANJA, width: 65, height: 4, borderRadius: 4, marginTop: 15, marginBottom: 28 },
  area: { alignItems: "stretch", gap: 18 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 23, width: "100%", maxWidth: 850, marginBottom: 8, elevation: 3, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8 },
  selo: { fontSize: 12, color: AZUL, fontWeight: "800", backgroundColor: "#e8f2fa", alignSelf: "flex-start", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 7 },
  empresa: { fontSize: 25, color: "#123b63", fontWeight: "800", marginTop: 16, marginBottom: 8 },
  descricao: { fontSize: 14, color: CINZA, lineHeight: 22, marginTop: 7 },
  cardTitulo: { fontSize: 19, fontWeight: "800", color: AZUL, marginBottom: 8 },
  aviso: { backgroundColor: "#eef5fb", padding: 13, borderRadius: 9, flexDirection: "row", alignItems: "flex-start", gap: 9, marginTop: 17 },
  avisoTxt: { flex: 1, color: "#254e72", lineHeight: 19, fontSize: 12 },
  legenda: { flexDirection: "row", gap: 15, flexWrap: "wrap", marginTop: 22 },
  chave: { flexDirection: "row", alignItems: "center", gap: 6 },
  ponto: { width: 10, height: 10, borderRadius: 5 },
  legendaTxt: { color: CINZA, fontSize: 12 },
  grafico: { height: 200, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", borderBottomWidth: 1, borderBottomColor: "#d6dde5", marginTop: 25 },
  grupo: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end" },
  barras: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 3, height: "85%", width: "100%" },
  barra: { width: "27%", borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  mes: { marginTop: 7, fontSize: 12, color: CINZA, fontWeight: "600" },
  rodape: { fontSize: 11, color: CINZA, marginTop: 18 },
  botao: { backgroundColor: AZUL, padding: 13, borderRadius: 8, marginTop: 20, alignItems: "center" },
  botaoTxt: { color: "#fff", fontWeight: "700" },
});
