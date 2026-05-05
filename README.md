# MTG Catalog - Modern MTG Collection Viewer

[**Português**](#português) | [**English**](#english)

---

<a name="english"></a>

## 🇺🇸 English

### 1. Overview
MTG Catalog is a high-performance web application designed to showcase your Magic: The Gathering collection with a premium, responsive interface. It integrates with the Scryfall API to provide high-quality card images and metadata.

### 2. Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/JVBicalho/mtg-catalog.git
   cd mtg-catalog
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```

### 3. Personalizing Your Collection
The project is built to consume CSV exports specifically from **LigaMagic**.

#### 3.1 Exporting from LigaMagic
1. Go to your collection on LigaMagic.
2. Export your collection as a **CSV** file.
3. Ensure the CSV contains columns like `Card (PT)`, `Card (EN)`, `Edicao (Sigla)`, and `Quantidade`.

#### 3.2 Importing into the Project
1. Copy your CSV file(s) into the directory: `src/assets/data/`.
2. The application will automatically detect any `.csv` file in this folder and list it in the "Select Collection" dropdown.

#### 3.3 Fetching Card Data (Metadata Cache)
To avoid excessive API calls and ensure fast loading, the project uses a local cache for card identity and types.
Whenever you add new cards to your CSV:
1. Run the update script:
   ```bash
   npm run fetch-data
   ```
2. This script will scan your CSV files, find new cards, and fetch their metadata from Scryfall.

### 4. Advanced Mapping Configuration
Sometimes LigaMagic set codes do not match Scryfall official codes. You can fix this in `src/utils/mapper.ts`.

#### 4.1 Set Mappings (`SET_MAP`)
Add entries to the `SET_MAP` constant to translate LigaMagic codes (keys) to Scryfall codes (values).
```typescript
const SET_MAP: Record<string, string> = {
  'prmkm': 'mkm', // LigaMagic Code -> Scryfall Code
};
```

#### 4.2 Card Overrides (`CARD_OVERRIDES`)
If a specific card is showing the wrong art or version, use `CARD_OVERRIDES`.
Format: `"English Name|LigaMagic Code": { set: "official_set", number: "card_number" }`
```typescript
const CARD_OVERRIDES: Record<string, { set?: string, number?: string }> = {
  "Arcane Signet|pr30": { set: "p30a", number: "1" },
};
```

---

<a name="português"></a>

## 🇧🇷 Português

### 1. Visão Geral
O MTG Catalog é uma aplicação web de alta performance projetada para exibir sua coleção de Magic: The Gathering com uma interface premium e responsiva. Ele se integra à API do Scryfall para fornecer imagens de alta qualidade e metadados das cartas.

### 2. Início Rápido
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/JVBicalho/mtg-catalog.git
   cd mtg-catalog
   ```
2. **Instale as dependências**:
   ```bash
   npm install
   ```
3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

### 3. Personalizando Sua Coleção
O projeto foi construído para consumir exportações CSV especificamente da **LigaMagic**.

#### 3.1 Exportando da LigaMagic
1. Vá até sua coleção na LigaMagic.
2. Exporte sua coleção como um arquivo **CSV**.
3. Certifique-se de que o CSV contenha colunas como `Card (PT)`, `Card (EN)`, `Edicao (Sigla)` e `Quantidade`.

#### 3.2 Importando para o Projeto
1. Copie seu(s) arquivo(s) CSV para o diretório: `src/assets/data/`.
2. A aplicação detectará automaticamente qualquer arquivo `.csv` nesta pasta e o listará no menu "Selecionar Coleção".

#### 3.3 Sincronizando Dados (Cache de Metadados)
Para evitar chamadas excessivas à API e garantir um carregamento rápido, o projeto utiliza um cache local para identidade de cor e tipos.
Sempre que você adicionar novas cartas aos seus arquivos CSV:
1. Execute o script de atualização:
   ```bash
   npm run fetch-data
   ```
2. Este script analisará seus arquivos CSV, encontrará novas cartas e buscará seus metadados no Scryfall.

### 4. Configuração de Mapeamento Avançado
Às vezes, as siglas de edição da LigaMagic não coincidem com as oficiais do Scryfall. Você pode corrigir isso em `src/utils/mapper.ts`.

#### 4.1 Mapeamento de Edições (`SET_MAP`)
Adicione entradas à constante `SET_MAP` para traduzir códigos da LigaMagic (chaves) para códigos do Scryfall (valores).
```typescript
const SET_MAP: Record<string, string> = {
  'prmkm': 'mkm', // Código LigaMagic -> Código Scryfall
};
```

#### 4.2 Overrides de Cartas (`CARD_OVERRIDES`)
Se uma carta específica estiver exibindo a arte ou versão errada, use `CARD_OVERRIDES`.
Formato: `"Nome em Inglês|Sigla LigaMagic": { set: "set_oficial", number: "numero_da_carta" }`
```typescript
const CARD_OVERRIDES: Record<string, { set?: string, number?: string }> = {
  "Arcane Signet|pr30": { set: "p30a", number: "1" },
};
```

---
Developed with ❤️ for the MTG Community.
