# 🎬 NEXUS - Matriz de Entretenimento Avançada

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0+-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **Uma plataforma de entretenimento e streaming de ponta construída com React, com filmes, séries de TV e gerenciamento avançado de usuários.**

## 🌟 **Funcionalidades**

### 🎯 **Funcionalidade Principal**
- **🎬 Streaming de Filmes**: Reprodução de filmes de alta qualidade com integração VidSrc
- **📺 Suporte a Séries de TV**: Gerenciamento completo de episódios com navegação por temporadas
- **🔍 Pesquisa Avançada**: Pesquisa em tempo real de filmes e séries
- **🎨 Design Responsivo**: Design "mobile-first" que funciona em todos os dispositivos
- **⚡ Extremamente Rápido**: Desempenho otimizado com React 18 e APIs modernas

### 🔐 **Gerenciamento de Usuários**
- **🔥 Autenticação Firebase**: Sistema seguro de login/cadastro
- **👤 Perfis de Usuário**: Experiência de usuário personalizada
- **💾 Histórico de Exibição**: Acompanhe o progresso e retome a reprodução
- **🔒 Sistema de Cofre (Vault)**: Salve filmes e séries favoritos
- **🛡️ Rotas Protegidas**: Acesso seguro ao conteúdo

### 🎮 **Recursos do Player**
- **🖥️ Player de Vídeo Avançado**: Construído sob medida com integração de iframe
- **⚙️ Controles de Reprodução**: Controle de velocidade, seleção de qualidade, reprodução automática
- **📱 Otimizado para Celular**: Controles amigáveis ao toque e layout responsivo
- **⌨️ Atalhos de Teclado**: Navegação para usuários avançados
- **🎯 Navegação de Episódios**: Troca inteligente de episódios para séries de TV

### 🎨 **Interface do Usuário**
- **🌙 Tema Escuro**: Design elegante inspirado em cyberpunk
- **💫 Animações Suaves**: Scroll com Lenis e transições personalizadas
- **🎪 Elementos Interativos**: Efeitos de hover e microinterações
- **📊 Recomendações Inteligentes**: Sugestões de conteúdo com curadoria de IA
- **🔴 Indicadores ao Vivo**: Atualizações de status em tempo real

## 🚀 **Demonstração ao Vivo**

🌐 **[Visite o NEXUS ao Vivo](https://iamnexus.vercel.app)**

### **Frontend**
```bash
React 18.2.0          # React moderno com hooks e recursos concorrentes
Redux Toolkit          # Gerenciamento de estado com RTK Query
React Router v7        # Roteamento do lado do cliente
Tailwind CSS 3.4+     # Framework CSS "utility-first"
Lenis Scroll           # Experiência de rolagem suave
Lucide React           # Lindo sistema de ícones
```

### **Backend & Serviços**
```bash
Firebase Auth          # Autenticação de usuário
Firebase Firestore     # Banco de dados em tempo real
VidSrc API            # Integração de streaming de vídeo
TMDB API              # Metadados de filmes e séries
Vercel                # Implantação e hospedagem
```

Ferramentas de Desenvolvimento
```bash
Create React App      # Ferramentas de compilação
ESLint                # Análise estática de código (linting)
Git                   # Controle de versão
VS Code               # Ambiente de desenvolvimento
```

##⚡ **Início Rápido**

###**Pré-requisitos**
- Node.js 16+ instalado
- Git instalado
- Conta no Firebase
- Editor de código (VS Code recomendado)

### **Instalação**

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/whatsupsumit/The-Nexus.git](https://github.com/whatsupsumit/The-Nexus.git)
    cd The-Nexus
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente**
    ```bash
    cp .env.example .env
    ```
    
    Edite o `.env` com suas credenciais:
    ```env
    # Configuração do Firebase
    REACT_APP_FIREBASE_API_KEY=sua_chave_de_api_firebase
    REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=seu_id_de_projeto
    REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_id_de_remetente
    REACT_APP_FIREBASE_APP_ID=seu_id_de_app
    REACT_APP_FIREBASE_MEASUREMENT_ID=seu_id_de_medicao
    
    # Opcional: API do TMDB (para dados reais)
    REACT_APP_TMDB_API_KEY=sua_chave_de_api_tmdb
    REACT_APP_TMDB_ACCESS_TOKEN=seu_token_de_acesso_tmdb
    ```

4.  **Inicie o servidor de desenvolvimento**
    ```bash
    npm start
    ```

5.  **Abra seu navegador**
    ```
    http://localhost:3000
    ```

## 🔧 **Configuração**

### **Configuração do Firebase**

1.  **Crie um Projeto Firebase**
    - Acesse o [Console do Firebase](https://console.firebase.google.com/)
    - Crie um novo projeto
    - Habilite a Autenticação (Email/Senha)
    - Obtenha a configuração nas Configurações do Projeto

2.  **Configuração da Autenticação**
    ```javascript
    // Contas de demonstração funcionam com qualquer combinação de email/senha
    // A autenticação real requer a configuração do Firebase
    ```

### **Configuração da API do TMDB** (Opcional)

1.  **Obtenha a Chave da API**
    - Cadastre-se no [TMDB](https://www.themoviedb.org/)
    - Vá para Configurações → API
    - Copie a chave da API e o token de acesso

2.  **Sistema de Dados Falsos (Mock)**
    ```javascript
    // O NEXUS inclui dados falsos para séries de TV populares
    // Funciona sem a API do TMDB para demonstração
    ```

## 🏗️ **Estrutura do Projeto**
```
src/
├── components/         # Componentes React
│   ├── Body.js         # Área de conteúdo principal
│   ├── Browse.js       # Navegação de conteúdo
│   ├── header.js       # Cabeçalho de navegação
│   ├── Login.js        # Autenticação
│   ├── Movies.js       # Grade de filmes
│   ├── TVShows.js      # Grade de séries
│   ├── VideoPlayer.js  # Player de vídeo avançado
│   ├── MovieDetails.js # Informações do filme
│   ├── TVShowDetails.js# Informações da série
│   ├── Profile.js      # Perfil do usuário
│   └── Vault.js        # Conteúdo salvo
├── utils/              # Funções utilitárias
│   ├── firebase.js     # Configuração do Firebase
│   ├── vidsrcApi.js    # API de streaming de vídeo
│   ├── validate.js     # Validação de formulário
│   └── userSlice.js    # Slice de usuário do Redux
├── hooks/              # Hooks personalizados do React
│   └── useLenis.js     # Hook para rolagem suave
├── App.js              # Aplicação principal
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🎮 **Guia de Uso**

### **Navegação**
- **Navegar**: Explore filmes e séries
- **Pesquisar**: Encontre conteúdo específico
- **Perfil**: Gerencie sua conta
- **Cofre**: Acesse o conteúdo salvo

### **Player de Vídeo**
- **Espaço**: Reproduzir/Pausar
- **F**: Alternar tela cheia
- **Shift + ←/→**: Navegar entre episódios (séries)
- **Configurações**: Opções de qualidade, velocidade e reprodução automática

### **Recursos para Séries**
- **Seleção de Temporada**: Escolha diferentes temporadas
- **Navegação de Episódios**: Navegue por todos os episódios
- **Reprodução Automática**: Próximo episódio automático
- **Acompanhamento de Progresso**: Continue de onde parou

## 🚀 **Implantação (Deployment)**

### **Implantação com o Vercel**

1.  **Conecte o GitHub**
    - Acesse o [Vercel](https://vercel.com)
    - Importe seu repositório do GitHub
    - Configure as definições do projeto

2.  **Variáveis de Ambiente**
    ```bash
    # Adicione estas no painel da Vercel
    REACT_APP_FIREBASE_API_KEY
    REACT_APP_FIREBASE_AUTH_DOMAIN
    REACT_APP_FIREBASE_PROJECT_ID
    REACT_APP_FIREBASE_STORAGE_BUCKET
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID
    REACT_APP_FIREBASE_APP_ID
    REACT_APP_FIREBASE_MEASUREMENT_ID
    ```

3.  **Implantar**
    - A Vercel constrói e implanta automaticamente
    - Obtenha sua URL pública
    - Implantações automáticas a cada Git push

### **Build para Produção**
```bash
npm run build
# Cria uma build otimizada na pasta 'build'
```

## 🔍 **Documentação da API**
### **Integração VidSrc**
```javascript
/ Streaming de filme
getMovieEmbedUrl(movieId, options)

// Streaming de série
getTVEmbedUrl(tvId, season, episode, options)

// Opções de reprodução
{
  autoplay: true,
  primaryColor: 'ef4444',
  iconColor: 'ef4444',
  title: false,
  poster: false
}
```

### **Mock Data System**
```javascript
/ Séries populares com dados de episódios
const MOCK_TV_SHOWS = {
  1396: "Breaking Bad",
  1399: "Game of Thrones",
  2316: "The Office",
  1668: "Friends",
  66732: "Stranger Things"
}
```

## 🛡️ **Recursos de Segurança**

- **🔒 Autenticação Segura**: Integração com Firebase Auth
- **🛡️ Variáveis de Ambiente**: Proteção de dados sensíveis
- **🚫 Supressão de Erros**: Tratamento avançado de erros no console
- **🔐 Rotas Protegidas**: Acesso somente para autenticados
- **🧹 Prevenção de XSS**: Sanitização e validação de entradas

## 🎨 **Sistema de Design**

### **Paleta de Cores**
```css
Primária: #ef4444 (Vermelho)
Secundária: #991b1b (Vermelho Escuro)
Fundo: #000000 (Preto)
Superfície: #1a1a1a (Cinza Escuro)
Texto: #ffffff (Branco)
Destaque: #a855f7 (Roxo)

### **Typography**
```css
Família da Fonte: 'JetBrains Mono', monospace
Títulos: Negrito, destaque em Vermelho
Corpo: Regular, Branco/Cinza
Código: Monoespaçado, destaque em Verde
```

## 🤝 **Como Contribuir**

Contribuições são bem-vindas! Por favor, siga estes passos:

1.  **Faça um "fork" do repositório**
2.  **Crie uma branch para sua funcionalidade** (`git checkout -b feature/funcionalidade-incrivel`)
3.  **Faça o "commit" das suas alterações** (`git commit -m 'Adiciona funcionalidade incrível'`)
4.  **Faça "push" para a branch** (`git push origin feature/funcionalidade-incrivel`)
5.  **Abra um "Pull Request"**

### **Diretrizes de Desenvolvimento**
- Siga as boas práticas do React
- Use Tailwind CSS para estilização
- Escreva mensagens de commit significativas
- Teste em múltiplos dispositivos
- Atualize a documentação

## 📝 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙋‍♂️ **Suporte**

- **Issues no GitHub**: [Relatar bugs](https://github.com/whatsupsumit/The-Nexus/issues)
- **Email**: sksumitboss123@gmail.com
- **Discord**: Junte-se ao nosso servidor da comunidade

## 🎯 **Roteiro (Roadmap)**

### **Próximas Funcionalidades**
- [ ] Avaliações e notas dos usuários
- [ ] Compartilhamento de lista de interesses
- [ ] Suporte para visualização offline
- [ ] IA de recomendações inteligentes
- [ ] Funcionalidades sociais
- [ ] Aplicativo móvel (React Native)
- [ ] Painel de administrador
- [ ] Análise de conteúdo

### **Atualizações Recentes**
- ✅ Player de vídeo avançado com suporte a séries
- ✅ Sistema de dados falsos (mock) para demonstração confiável
- ✅ Design responsivo aprimorado
- ✅ Melhorias de segurança e tratamento de erros
- ✅ Gerenciamento abrangente de episódios

## 📊 **Desempenho**

- **Pontuação Lighthouse**: 95+ (Desempenho, Acessibilidade, SEO)
- **Tamanho do Pacote**: Otimizado com divisão de código (code splitting)
- **Tempo de Carregamento**: < 2s em redes 3G
- **Amigável para Dispositivos Móveis**: Design 100% responsivo

## 🔗 **Links**

- **Demonstração ao Vivo**: [https://iamnexus.vercel.app](https://iamnexus.vercel.app)
- **Repositório**: [https://github.com/whatsupsumit/The-Nexus](https://github.com/whatsupsumit/The-Nexus)
- **Issues**: [https://github.com/whatsupsumit/The-Nexus/issues](https://github.com/whatsupsumit/The-Nexus/issues)

---

<div align="center">
  <h3>🎬 Construído com ❤️ para os amantes de entretenimento</h3>
  <p>Experimente o futuro do streaming com o NEXUS</p>
  
  **[⭐ Marque com Estrela esse repositório](https://github.com/whatsupsumit/The-Nexus) | [🐛 Relatar Bug](https://github.com/whatsupsumit/The-Nexus/issues) | [✨ Solicitar Funcionalidade](https://github.com/whatsupsumit/The-Nexus/issues)**
</div>

