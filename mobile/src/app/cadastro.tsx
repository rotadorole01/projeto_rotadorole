
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "./utils/authContext";

// =====================================================
// IDENTIDADE VISUAL
// =====================================================

const AZUL = "#07569a";
const LARANJA = "#ff6633";
const CINZA = "#68788c";

const categorias = [
  "Shows",
  "Festas",
  "Gastronomia",
  "Esportes",
  "Cultura",
  "Teatro",
  "Feiras",
  "Eventos Acadêmicos",
  "Outros",
];

const entradas = ["Gratuito", "Pago"];

// =====================================================
// COMPONENTES AUXILIARES
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
      <Ionicons name={icone} size={20} color={AZUL} />
      <Text style={styles.sectionTitle}>{titulo}</Text>
    </View>
  );
}

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
            !valor && styles.placeholder,
          ]}
        >
          {valor || placeholder}
        </Text>

        <Ionicons
          name={aberto ? "chevron-up" : "chevron-down"}
          size={20}
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
// FUNÇÕES DE DATA E HORA
// =====================================================

function formatarData(data: Date) {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");

  return `${dia}/${mes}/${data.getFullYear()}`;
}

function formatarHora(data: Date) {
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");

  return `${hora}:${minuto}`;
}

function converterData(valor: string): Date | null {
  const partes = valor.split("/");

  if (partes.length !== 3) return null;

  const [dia, mes, ano] = partes.map(Number);

  if (!dia || !mes || !ano || ano < 1900) {
    return null;
  }

  const data = new Date(ano, mes - 1, dia);

  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return null;
  }

  return data;
}

// =====================================================
// PÁGINA CADASTRAR EVENTO
// =====================================================

export default function CadastrarEvento() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const { width } = useWindowDimensions();

  const mobile = width < 700;

  // ===================================================
  // MENU HAMBÚRGUER
  // ===================================================

  const [menuAberto, setMenuAberto] = useState(false);

  // ===================================================
  // INFORMAÇÕES BÁSICAS
  // ===================================================

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");

  // ===================================================
  // DATA E HORA
  // ===================================================

  const [dataEvento, setDataEvento] =
    useState<Date | null>(null);

  const [horario, setHorario] =
    useState<Date | null>(null);

  const [dataWeb, setDataWeb] = useState("");
  const [horaWeb, setHoraWeb] = useState("");

  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);

  const [duracao, setDuracao] = useState("");

  // ===================================================
  // LOCALIZAÇÃO
  // ===================================================

  const [localEvento, setLocalEvento] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");

  // ===================================================
  // INFORMAÇÕES ADICIONAIS
  // ===================================================

  const [tipoEntrada, setTipoEntrada] = useState("");
  const [valorIngresso, setValorIngresso] = useState("");

  const [imagem, setImagem] =
    useState<string | null>(null);

  const [nomeImagem, setNomeImagem] = useState("");
  const [tipoImagem, setTipoImagem] = useState("image/jpeg");

  const [enviando, setEnviando] = useState(false);
  const [link, setLink] = useState("");

  // ===================================================
  // DADOS DO ORGANIZADOR
  // ===================================================

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // ===================================================
  // MENSAGENS
  // ===================================================

  function mensagem(tituloMsg: string, conteudo: string) {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        window.alert(`${tituloMsg}\n\n${conteudo}`);
      }
    } else {
      Alert.alert(tituloMsg, conteudo);
    }
  }

  // ===================================================
  // NAVEGAÇÃO DO MENU HAMBÚRGUER
  // ===================================================

  function irParaInicio() {
    setMenuAberto(false);
    router.navigate("/dashboard");
  }

  function irParaEventos() {
    setMenuAberto(false);
    router.navigate("/eventos");
  }

  function irParaCadastrarEvento() {
    setMenuAberto(false);
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
  // SAIR - LOGOUT E RETORNO AO LOGIN
  // ===================================================

  async function sair() {
    setMenuAberto(false);

    try {
      await auth.logOut();
      router.replace("/login");
    } catch (erro) {
      console.error("Erro ao sair da conta:", erro);
    }
  }

  function cancelarCadastro() {
    setMenuAberto(false);
    router.navigate("/eventos");
  }

  // ===================================================
  // DATA E HORA
  // ===================================================

  function alterarData(
    event: DateTimePickerEvent,
    selecionada?: Date
  ) {
    if (Platform.OS === "android") {
      setMostrarData(false);
    }

    if (event.type === "set" && selecionada) {
      setDataEvento(selecionada);
    }
  }

  function alterarHora(
    event: DateTimePickerEvent,
    selecionada?: Date
  ) {
    if (Platform.OS === "android") {
      setMostrarHora(false);
    }

    if (event.type === "set" && selecionada) {
      setHorario(selecionada);
    }
  }

  // ===================================================
  // SELECIONAR IMAGEM
  // ===================================================

  async function escolherImagem() {
    try {
      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 1,
        });

      if (resultado.canceled || !resultado.assets.length) {
        return;
      }

      const arquivo = resultado.assets[0];

      if (
        arquivo.mimeType &&
        !["image/jpeg", "image/png"].includes(arquivo.mimeType)
      ) {
        mensagem(
          "Formato inválido",
          "Selecione uma imagem JPG ou PNG."
        );
        return;
      }

      if (
        arquivo.fileSize &&
        arquivo.fileSize > 2 * 1024 * 1024
      ) {
        mensagem(
          "Imagem muito grande",
          "O tamanho máximo permitido é 2 MB."
        );
        return;
      }

      setImagem(arquivo.uri);
      setNomeImagem(
        arquivo.fileName || "Imagem selecionada"
      );
      setTipoImagem(arquivo.mimeType || "image/jpeg");

    } catch (erro) {
      mensagem(
        "Erro",
        "Não foi possível selecionar a imagem."
      );
    }
  }

  // ===================================================
  // CADASTRAR EVENTO NA API
  // ===================================================

  async function cadastrarEvento() {
    if (enviando) return;

    // VALIDAR TÍTULO

    if (!titulo.trim()) {
      mensagem(
        "Campo obrigatório",
        "Informe o título do evento."
      );
      return;
    }

    // VALIDAR CATEGORIA

    if (!categoria) {
      mensagem(
        "Campo obrigatório",
        "Selecione a categoria."
      );
      return;
    }

    // VALIDAR DESCRIÇÃO

    if (!descricao.trim()) {
      mensagem(
        "Campo obrigatório",
        "Informe a descrição do evento."
      );
      return;
    }

    // VALIDAR DATA

    const dataFinal =
      Platform.OS === "web"
        ? converterData(dataWeb)
        : dataEvento;

    if (!dataFinal) {
      mensagem(
        "Data inválida",
        "Informe uma data válida no formato DD/MM/AAAA."
      );
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataFinal < hoje) {
      mensagem(
        "Data inválida",
        "A data do evento não pode estar no passado."
      );
      return;
    }

    // VALIDAR HORÁRIO

    const horarioFinal =
      Platform.OS === "web"
        ? horaWeb.trim()
        : horario
          ? formatarHora(horario)
          : "";

    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(horarioFinal)
    ) {
      mensagem(
        "Horário inválido",
        "Informe o horário no formato HH:MM."
      );
      return;
    }

    // VALIDAR DURAÇÃO

    const duracaoNumero =
      Number(duracao.replace(",", "."));

    if (
      duracao.trim() &&
      (
        !Number.isFinite(duracaoNumero) ||
        duracaoNumero <= 0
      )
    ) {
      mensagem(
        "Duração inválida",
        "Informe uma duração maior que zero."
      );
      return;
    }

    // VALIDAR LOCAL

    if (!localEvento.trim()) {
      mensagem(
        "Campo obrigatório",
        "Informe o local do evento."
      );
      return;
    }

    // VALIDAR CIDADE

    if (!cidade.trim()) {
      mensagem(
        "Campo obrigatório",
        "Informe a cidade."
      );
      return;
    }

    // VALIDAR ENTRADA

    if (!tipoEntrada) {
      mensagem(
        "Campo obrigatório",
        "Selecione o tipo de entrada."
      );
      return;
    }

    if (tipoEntrada === "Pago") {
      const preco = Number(
        valorIngresso.replace(",", ".")
      );

      if (
        !valorIngresso.trim() ||
        !Number.isFinite(preco) ||
        preco <= 0
      ) {
        mensagem(
          "Valor inválido",
          "Informe um valor de ingresso válido."
        );
        return;
      }
    }

    // VALIDAR IMAGEM

    if (!imagem) {
      mensagem(
        "Campo obrigatório",
        "Selecione uma imagem do evento."
      );
      return;
    }

    // VALIDAR LINK

    if (
      link.trim() &&
      !/^https?:\/\/[^\s]+\.[^\s]+/i.test(link.trim())
    ) {
      mensagem(
        "Link inválido",
        "Informe um link HTTP ou HTTPS válido."
      );
      return;
    }

    // VALIDAR ORGANIZADOR

    if (!nomeCompleto.trim()) {
      mensagem(
        "Campo obrigatório",
        "Informe seu nome completo."
      );
      return;
    }

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email.trim())) {
      mensagem(
        "E-mail inválido",
        "Informe um e-mail válido."
      );
      return;
    }

    // VALIDAR TERMOS

    if (!aceitouTermos) {
      mensagem(
        "Termos e condições",
        "Você precisa aceitar os termos e condições."
      );
      return;
    }

    // =================================================
    // FORMULÁRIO PARA API EXPRESS / MULTER
    // =================================================

    const formulario = new FormData();

    const campos: Record<string, string> = {
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      data_evento: formatarData(dataFinal),
      horario: horarioFinal,
      duracao: duracao.trim()
        ? String(duracaoNumero)
        : "",
      local: localEvento.trim(),
      cidade: cidade.trim(),
      bairro: bairro.trim(),
      tipo_entrada: tipoEntrada,
      valor_ingresso:
        tipoEntrada === "Gratuito"
          ? "0"
          : String(
              Number(valorIngresso.replace(",", "."))
            ),
      link: link.trim(),
      nome_organizador: nomeCompleto.trim(),
      email_organizador: email.trim(),
      telefone_organizador: telefone.trim(),
      aceitou_termos: "true",
    };

    Object.entries(campos).forEach(([chave, valor]) => {
      formulario.append(chave, valor);
    });

    setEnviando(true);

    try {
      if (Platform.OS === "web") {
        const respostaImagem = await fetch(imagem);
        const blob = await respostaImagem.blob();

        const tipo =
          blob.type === "image/png"
            ? "image/png"
            : tipoImagem;

        const extensao =
          tipo === "image/png"
            ? ".png"
            : ".jpg";

        const nome =
          nomeImagem &&
          /\.(png|jpe?g)$/i.test(nomeImagem)
            ? nomeImagem
            : `evento${extensao}`;

        formulario.append(
          "imagem",
          blob,
          nome
        );

      } else {
        const tipo =
          tipoImagem === "image/png"
            ? "image/png"
            : "image/jpeg";

        const nome =
          nomeImagem &&
          /\.(png|jpe?g)$/i.test(nomeImagem)
            ? nomeImagem
            : tipo === "image/png"
              ? "evento.png"
              : "evento.jpg";

        formulario.append(
          "imagem",
          {
            uri: imagem,
            name: nome,
            type: tipo,
          } as any
        );
      }

      // =================================================
      // ENDEREÇO DA API
      // =================================================

      const enderecoAPI =
        Platform.OS === "web"
          ? "http://localhost:3600"
          : "http://192.168.0.111:3600";

      const resposta = await fetch(
        `${enderecoAPI}/eventos`,
        {
          method: "POST",
          body: formulario,
        }
      );

      const resultado = await resposta.json();

      if (
        !resposta.ok ||
        resultado.message !== "Success"
      ) {
        throw new Error(
          resultado.Error ||
          "Não foi possível cadastrar o evento."
        );
      }

      mensagem(
        "Evento cadastrado!",
        "Seu evento foi enviado e está aguardando aprovação."
      );

      router.navigate("/eventos");

    } catch (erro) {
      const detalhe =
        erro instanceof Error
          ? erro.message
          : "Erro desconhecido";

      mensagem(
        "Erro no cadastro",
        detalhe === "Network request failed" ||
        detalhe === "Failed to fetch"
          ? "Não foi possível acessar a API. Confira se o servidor está ligado e se o endereço está correto."
          : detalhe
      );

    } finally {
      setEnviando(false);
    }
  }

  // ===================================================
  // INTERFACE
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
            onPress={() =>
              setMenuAberto(!menuAberto)
            }
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

            {/* ========================================
                CADASTRAR EVENTO - LARANJA
            ======================================== */}

            <Pressable
              style={[
                styles.itemMenu,
                styles.itemMenuAtivo,
              ]}
              onPress={irParaCadastrarEvento}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color={LARANJA}
              />

              <Text style={styles.textoMenuAtivo}>
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

            {/* ========================================
                SAIR - VOLTAR PARA LOGIN
            ======================================== */}

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

          {/* ========================================
              TÍTULO
          ======================================== */}

          <View style={styles.titleArea}>
            <Text
              style={[
                styles.titulo,
                mobile && styles.tituloMobile,
              ]}
            >
              Cadastrar um Novo Evento
            </Text>

            <View style={styles.titleLine} />

            <Text style={styles.subtitle}>
              Compartilhe seu evento com a comunidade!
              Preencha os dados abaixo e seu evento
              será publicado em breve após análise.
            </Text>
          </View>

          {/* ========================================
              FORMULÁRIO
          ======================================== */}

          <View
            style={[
              styles.main,
              mobile && styles.mainMobile,
            ]}
          >

            {/* INFORMAÇÕES BÁSICAS */}

            <TituloSecao
              titulo="Informações Básicas"
              icone="information-circle"
            />

            <Text style={styles.label}>
              Título do Evento *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Festival de Jazz na Praça"
              placeholderTextColor="#999999"
              value={titulo}
              onChangeText={setTitulo}
            />

            <Text style={styles.label}>
              Categoria *
            </Text>

            <CampoSelecao
              valor={categoria}
              placeholder="Selecione a categoria"
              opcoes={categorias}
              onChange={setCategoria}
            />

            <Text style={styles.label}>
              Descrição do Evento *
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              placeholder="Descreva o evento, atrações e informações importantes..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={descricao}
              onChangeText={setDescricao}
            />

            {/* ======================================
                DATA E HORA
            ====================================== */}

            <TituloSecao
              titulo="Data e Hora"
              icone="calendar"
            />

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              {/* DATA */}

              <View style={styles.column}>
                <Text style={styles.label}>
                  Data do Evento *
                </Text>

                {Platform.OS === "web" ? (
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#999999"
                    value={dataWeb}
                    onChangeText={setDataWeb}
                  />
                ) : (
                  <Pressable
                    style={styles.dateInput}
                    onPress={() =>
                      setMostrarData(true)
                    }
                  >
                    <Text
                      style={
                        dataEvento
                          ? styles.dateText
                          : styles.placeholder
                      }
                    >
                      {dataEvento
                        ? formatarData(dataEvento)
                        : "DD/MM/AAAA"}
                    </Text>

                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={AZUL}
                    />
                  </Pressable>
                )}
              </View>

              {/* HORÁRIO */}

              <View style={styles.column}>
                <Text style={styles.label}>
                  Horário de Início *
                </Text>

                {Platform.OS === "web" ? (
                  <TextInput
                    style={styles.input}
                    placeholder="18:00"
                    placeholderTextColor="#999999"
                    value={horaWeb}
                    onChangeText={setHoraWeb}
                  />
                ) : (
                  <Pressable
                    style={styles.dateInput}
                    onPress={() =>
                      setMostrarHora(true)
                    }
                  >
                    <Text
                      style={
                        horario
                          ? styles.dateText
                          : styles.placeholder
                      }
                    >
                      {horario
                        ? formatarHora(horario)
                        : "HH:MM"}
                    </Text>

                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={AZUL}
                    />
                  </Pressable>
                )}
              </View>
            </View>

            {/* CALENDÁRIO NATIVO */}

            {mostrarData &&
              Platform.OS !== "web" && (
                <View>
                  <DateTimePicker
                    value={
                      dataEvento || new Date()
                    }
                    mode="date"
                    minimumDate={new Date()}
                    display="default"
                    onChange={alterarData}
                  />

                  {Platform.OS === "ios" && (
                    <Pressable
                      style={styles.pickerDone}
                      onPress={() =>
                        setMostrarData(false)
                      }
                    >
                      <Text style={styles.pickerDoneText}>
                        Concluir
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}

            {/* SELETOR DE HORÁRIO */}

            {mostrarHora &&
              Platform.OS !== "web" && (
                <View>
                  <DateTimePicker
                    value={horario || new Date()}
                    mode="time"
                    is24Hour
                    display="default"
                    onChange={alterarHora}
                  />

                  {Platform.OS === "ios" && (
                    <Pressable
                      style={styles.pickerDone}
                      onPress={() =>
                        setMostrarHora(false)
                      }
                    >
                      <Text style={styles.pickerDoneText}>
                        Concluir
                      </Text>
                    </Pressable>
                  )}
                </View>
              )}

            <Text style={styles.label}>
              Duração Estimada (em horas)
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: 4"
              placeholderTextColor="#999999"
              keyboardType="decimal-pad"
              value={duracao}
              onChangeText={setDuracao}
            />

            {/* ======================================
                LOCALIZAÇÃO
            ====================================== */}

            <TituloSecao
              titulo="Localização"
              icone="location"
            />

            <Text style={styles.label}>
              Local do Evento *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Praça Central"
              placeholderTextColor="#999999"
              value={localEvento}
              onChangeText={setLocalEvento}
            />

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <Text style={styles.label}>
                  Cidade *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ex: Taquaritinga"
                  placeholderTextColor="#999999"
                  value={cidade}
                  onChangeText={setCidade}
                />
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>
                  Bairro
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ex: Portal da Serra"
                  placeholderTextColor="#999999"
                  value={bairro}
                  onChangeText={setBairro}
                />
              </View>
            </View>

            {/* ======================================
                INFORMAÇÕES ADICIONAIS
            ====================================== */}

            <TituloSecao
              titulo="Informações Adicionais"
              icone="add-circle"
            />

            <Text style={styles.label}>
              Tipo de Entrada *
            </Text>

            <CampoSelecao
              valor={tipoEntrada}
              placeholder="Selecione o tipo de entrada"
              opcoes={entradas}
              onChange={(valor) => {
                setTipoEntrada(valor);

                if (valor === "Gratuito") {
                  setValorIngresso("");
                }
              }}
            />

            <Text style={styles.label}>
              Valor do Ingresso (se aplicável)
            </Text>

            <TextInput
              style={[
                styles.input,
                tipoEntrada === "Gratuito" &&
                  styles.inputDisabled,
              ]}
              placeholder={
                tipoEntrada === "Gratuito"
                  ? "Entrada gratuita"
                  : "Ex: 50.00"
              }
              placeholderTextColor="#999999"
              keyboardType="decimal-pad"
              editable={
                tipoEntrada !== "Gratuito"
              }
              value={valorIngresso}
              onChangeText={setValorIngresso}
            />

            {/* ======================================
                IMAGEM
            ====================================== */}

            <Text style={styles.label}>
              Imagem do Evento *
            </Text>

            <Pressable
              style={styles.uploadArea}
              onPress={escolherImagem}
            >
              <Feather
                name="upload"
                size={20}
                color={AZUL}
              />

              <Text
                style={styles.uploadText}
                numberOfLines={1}
              >
                {nomeImagem || "Escolher Arquivo"}
              </Text>

              <Ionicons
                name="image-outline"
                size={20}
                color={CINZA}
              />
            </Pressable>

            <Text style={styles.helperText}>
              Formatos aceitos: JPG, PNG.
              Tamanho máximo: 2MB.
            </Text>

            {imagem && (
              <View style={styles.imagePreviewArea}>
                <Image
                  source={{ uri: imagem }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />

                <Pressable
                  style={styles.removeImage}
                  onPress={() => {
                    setImagem(null);
                    setNomeImagem("");
                    setTipoImagem("image/jpeg");
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={17}
                    color="#ffffff"
                  />

                  <Text style={styles.removeImageText}>
                    Remover imagem
                  </Text>
                </Pressable>
              </View>
            )}

            {/* ======================================
                LINK
            ====================================== */}

            <Text style={styles.label}>
              Link para Mais Informações
            </Text>

            <TextInput
              style={styles.input}
              placeholder="https://www.seusite.com"
              placeholderTextColor="#999999"
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              value={link}
              onChangeText={setLink}
            />

            {/* ======================================
                SEUS DADOS
            ====================================== */}

            <TituloSecao
              titulo="Seus Dados"
              icone="person"
            />

            <View
              style={[
                styles.row,
                mobile && styles.rowMobile,
              ]}
            >
              <View style={styles.column}>
                <Text style={styles.label}>
                  Nome Completo *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#999999"
                  value={nomeCompleto}
                  onChangeText={setNomeCompleto}
                />
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>
                  Email *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="teste@fatectq.edu.br"
                  placeholderTextColor="#999999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <Text style={styles.label}>
              Telefone
            </Text>

            <TextInput
              style={styles.input}
              placeholder="(16) 99999-9999"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            {/* ======================================
                TERMOS E CONDIÇÕES
            ====================================== */}

            <View style={styles.termsContainer}>
              <Pressable
                style={styles.checkboxArea}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: aceitouTermos,
                }}
                onPress={() =>
                  setAceitouTermos(!aceitouTermos)
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    aceitouTermos &&
                      styles.checkboxChecked,
                  ]}
                >
                  {aceitouTermos && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color="#ffffff"
                    />
                  )}
                </View>
              </Pressable>

              <Text style={styles.termsText}>
                Concordo com os{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() =>
                    mensagem(
                      "Termos e condições",
                      "O link oficial dos termos de uso ainda precisa ser configurado."
                    )
                  }
                >
                  termos e condições da Rota do Rolê
                </Text>
                {" *"}
              </Text>
            </View>

            {/* ======================================
                BOTÕES
            ====================================== */}

            <View
              style={[
                styles.buttonsRow,
                mobile && styles.buttonsMobile,
              ]}
            >
              {/* CADASTRAR EVENTO */}

              <Pressable
                style={({ pressed }) => [
                  styles.buttonCadastrar,
                  pressed && styles.buttonPressed,
                ]}
                onPress={cadastrarEvento}
                disabled={enviando}
              >
                <Ionicons
                  name="checkmark"
                  size={19}
                  color="#ffffff"
                />

                <Text style={styles.buttonText}>
                  {enviando
                    ? "Enviando..."
                    : "Cadastrar Evento"}
                </Text>
              </Pressable>

              {/* CANCELAR */}

              <Pressable
                style={styles.buttonCancelar}
                onPress={cancelarCadastro}
              >
                <Ionicons
                  name="close"
                  size={19}
                  color={LARANJA}
                />

                <Text style={styles.buttonCancelText}>
                  Cancelar
                </Text>
              </Pressable>
            </View>

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

  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 55,
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

  // FUNDO LARANJA-CLARO DO ITEM SELECIONADO

  itemMenuAtivo: {
    backgroundColor: "#fff4ef",
  },

  textoMenu: {
    color: "#173b5e",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 12,
  },

  // TEXTO LARANJA DO ITEM SELECIONADO

  textoMenuAtivo: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 12,
  },

  // BOTÃO SAIR

  textoSair: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 12,
  },

  // ===================================================
  // TÍTULO PRINCIPAL
  // ===================================================

  titleArea: {
    alignItems: "center",
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  titulo: {
    color: AZUL,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
  },

  tituloMobile: {
    fontSize: 26,
  },

  titleLine: {
    width: 70,
    height: 4,
    backgroundColor: "#ff5733",
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

  // ===================================================
  // CARD PRINCIPAL
  // ===================================================

  main: {
    width: "90%",
    maxWidth: 800,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 36,
    paddingVertical: 38,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  mainMobile: {
    width: "94%",
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 14,
  },

  // ===================================================
  // SEÇÕES
  // ===================================================

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 23,
  },

  sectionTitle: {
    color: AZUL,
    fontSize: 19,
    fontWeight: "800",
    marginLeft: 8,
  },

  // ===================================================
  // CAMPOS
  // ===================================================

  label: {
    color: "#123b63",
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
    color: "#123b63",
    fontSize: 14,
    marginBottom: 23,
  },

  inputDisabled: {
    backgroundColor: "#f3f4f5",
    color: "#999999",
  },

  textArea: {
    height: 115,
    paddingTop: 13,
    paddingBottom: 13,
    textAlignVertical: "top",
  },

  placeholder: {
    color: "#999999",
    fontSize: 14,
  },

  // ===================================================
  // COLUNAS
  // ===================================================

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

  // ===================================================
  // SELEÇÃO
  // ===================================================

  selectContainer: {
    width: "100%",
    marginBottom: 23,
  },

  select: {
    width: "100%",
    minHeight: 53,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectText: {
    flex: 1,
    color: "#123b63",
    fontSize: 14,
    paddingRight: 10,
  },

  optionsContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 4,
    elevation: 3,
  },

  option: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  optionText: {
    color: "#315b84",
    fontSize: 14,
  },

  // ===================================================
  // DATA E HORA
  // ===================================================

  dateInput: {
    width: "100%",
    height: 53,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 23,
  },

  dateText: {
    color: "#123b63",
    fontSize: 14,
  },

  pickerDone: {
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  pickerDoneText: {
    color: AZUL,
    fontWeight: "700",
    fontSize: 15,
  },

  // ===================================================
  // IMAGEM
  // ===================================================

  uploadArea: {
    width: "100%",
    minHeight: 53,
    borderWidth: 1,
    borderColor: "#d0d4d9",
    borderStyle: "dashed",
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  uploadText: {
    flex: 1,
    color: "#315b84",
    fontSize: 14,
  },

  helperText: {
    color: CINZA,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 23,
  },

  imagePreviewArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },

  imagePreview: {
    width: "100%",
    maxWidth: 400,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#eeeeee",
  },

  removeImage: {
    marginTop: 12,
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  removeImageText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  // ===================================================
  // TERMOS
  // ===================================================

  termsContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 32,
  },

  checkboxArea: {
    padding: 5,
    marginRight: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#a9b1ba",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  checkboxChecked: {
    backgroundColor: AZUL,
    borderColor: AZUL,
  },

  termsText: {
    flex: 1,
    color: "#123b63",
    fontSize: 13,
    lineHeight: 20,
  },

  termsLink: {
    color: AZUL,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  // ===================================================
  // BOTÕES
  // ===================================================

  buttonsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 15,
  },

  buttonsMobile: {
    flexDirection: "column",
    gap: 12,
  },

  buttonCadastrar: {
    flex: 1,
    minHeight: 55,
    backgroundColor: LARANJA,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
  },

  buttonPressed: {
    backgroundColor: "#e94c2b",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  buttonCancelar: {
    flex: 1,
    minHeight: 55,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: LARANJA,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
  },

  buttonCancelText: {
    color: LARANJA,
    fontSize: 15,
    fontWeight: "700",
  },

});
