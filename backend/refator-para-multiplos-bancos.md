
Para mudar do MySQL (que é um servidor) para o **SQLite** (que é um arquivo local), você precisará trocar a biblioteca, já que o protocolo de comunicação é completamente diferente. O SQLite não utiliza host, usuário ou porta; ele utiliza apenas um caminho de arquivo.

Aqui estão os passos e o código necessário:

### 1. Instalar a biblioteca do SQLite

No terminal, dentro da pasta do projeto, você (ou os alunos) precisarão rodar:

```bash
npm install sqlite3 sqlite

```

### 2. Novo arquivo de conexão (`database.js` ou similar)

Substitua o código atual por este. Note que o SQLite é baseado em arquivo, então não precisamos de `pool` da mesma forma que o MySQL:

```javascript
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Esta função abre a conexão com o arquivo local 'database.db'
export const getDbConnection = async () => {
    return open({
        filename: './database.db', // O arquivo será criado na raiz do projeto
        driver: sqlite3.Database
    });
};

```

---

### Principais diferenças que você deve observar:

* **Instalação Local:** Como eles estarão sem internet, certifique-se de que a pasta `node_modules` já contenha o `sqlite3` e o `sqlite` antes de cortá-la, ou peça para que baixem antes do início da prova.
* **Driver de Conexão:** O `mysql2` usa o método `.execute()` ou `.query()` diretamente no pool. Com a biblioteca `sqlite`, a sintaxe é ligeiramente diferente (geralmente `db.all()`, `db.get()` ou `db.run()`).
* **Tipos de Dados:** O SQLite é mais flexível (e às vezes limitado). Por exemplo, ele não tem um tipo `DATETIME` real (usa strings ou inteiros) e não suporta `AUTO_INCREMENT` da mesma forma (usa-se `INTEGER PRIMARY KEY AUTOINCREMENT`).

### Dica para a Prova:

Se você quiser facilitar a transição sem que eles precisem mudar todos os comandos `pool.query` no código, você pode criar um "wrapper", mas o mais educativo para uma turma é que eles entendam que a troca de um banco relacional cliente-servidor (MySQL) para um banco embarcado (SQLite) exige essa pequena adaptação na camada de acesso a dados.