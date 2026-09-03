# 🏛️ Acervo do Time

O museu oficial das pérolas, fotos e momentos cômicos do time de produtos.
Tudo que é dito, feito e fotografado por aqui fica guardado — para sempre.

> **Estado atual:** site no ar, time cadastrado e as primeiras frases
> registradas. Os blocos em `data/momentos.js`, `galeria.js` e `premios.js`
> ainda são modelos marcados com `EXEMPLO` — ninguém fez nada daquilo.
> Apague-os conforme registrar o material de verdade.

---

## Como funciona

Site estático puro: HTML, CSS e JavaScript. **Sem build, sem dependências,
sem `npm install`.** Para ver rodando, basta abrir o `index.html` no navegador.

Todo o conteúdo mora na pasta `data/` — arquivos de texto simples que qualquer
pessoa do time consegue editar, mesmo sem saber programar.

## Visual

As cores, fontes, cantos e sombras seguem o
[Design System AUVP](https://produtosauvp.github.io/central/design-system):
paleta Capital (verde), tokens em HSL no `:root` e no `.dark`, tipografia
Anek Latin / Roboto / Sora e raio de `0.75rem`. A paleta categórica
(`--chart-1` a `--chart-8`) identifica cada pessoa — a cor sai automaticamente
da posição em `data/time.js`, ninguém precisa escolher.

O design system é a base, não uma camisa de força: onde o acervo se afasta
dele (o easter egg, o confete, as pimentas de absurdo), há um comentário no
CSS explicando por quê.

### Layout da home

A home segue o formato de site de índice/catálogo: tipografia grande na
abertura, malha assimétrica em vez de fileiras iguais de cards, seções
numeradas (01, 02, 03…), letreiro rolante com as frases e blocos de tamanhos
diferentes. As peças novas são `.abertura`, `.letreiro`, `.bento` e
`.mosaico`, todas comentadas no CSS.

O conteúdo entra conforme se rola. A classe que esconde as seções antes da
hora (`.pode-revelar`) só é aplicada pelo JavaScript: se o script falhar, a
página aparece inteira em vez de ficar em branco. Com `prefers-reduced-motion`
o letreiro para e tudo já nasce visível.

### Tema

O site abre no **tema do seu computador**. O ícone no topo alterna entre
Sistema → Claro → Escuro (o estado atual aparece ao passar o mouse), e a
escolha fica salva. Se o computador trocar de tema com o site aberto, ele
acompanha na hora.

A preferência usa a mesma chave da central do time (`auvp-theme`), e os dois
sites ficam no mesmo domínio — então quem escolher um tema em um deles
encontra o mesmo tema no outro.

## Modo edição (✏️)

O segundo ícone do topo abre um painel para alterar textos, datas, autores e
o resto, sem abrir editor de código. Ele cobre todas as seções: frases,
momentos, galeria, prêmios, o time e os ajustes gerais.

**Senha atual: `corDaniel*`** (trocável — veja abaixo).

### Publicando de verdade

O acervo é um site estático, sem servidor próprio. Mesmo assim o painel
publica para o time em um clique: ele commita os arquivos alterados direto
pela API do GitHub.

1. você edita no painel e vê o resultado na página na hora;
2. o rascunho fica salvo **só no seu navegador** — ninguém mais vê;
3. **⬆ Publicar no GitHub** manda todos os arquivos alterados num **único
   commit**;
4. o Pages reconstrói e, em cerca de um minuto, o time vê a alteração.

Enquanto o site publicado não alcança o seu rascunho, um ponto amarelo fica
no ✏️ e um aviso aparece no painel. **Você não precisa limpar nada**: no
primeiro carregamento em que o arquivo publicado bater com o rascunho, ele
se apaga sozinho e o aviso some. *Descartar rascunho* volta tudo ao que está
no ar imediatamente.

Sem token, o caminho manual continua: **Baixar** ou **Copiar conteúdo**
entrega o `data/<arquivo>.js` pronto para commitar na mão.

### O token do GitHub

Para publicar daqui, o painel pede um token que fica guardado no seu
navegador. **Ele é sensível de verdade** — diferente da senha do painel,
quem puser a mão nele publica no site.

Crie um **fine-grained token** o mais restrito possível:

- **Repository access:** apenas `ProdutosAUVP/acervo_prod`
- **Permissions → Contents:** `Read and write` (só isso)
- **Expiration:** curta

[Criar o token](https://github.com/settings/personal-access-tokens/new)

Por padrão ele fica só na sessão e **some quando você fecha o navegador** —
o certo em máquina compartilhada. Marcando *Lembrar neste computador* ele
passa para o `localStorage` e sobrevive; use só na sua máquina. *Esquecer
token* apaga dos dois lugares.

Cada pessoa que for publicar precisa do próprio token. Se um dia o time
inteiro for editar, o caminho melhor é login com GitHub (OAuth), que exige
um back-end pequeno — hoje não temos isso.

### Sobre a senha

⚠️ **A senha não é segurança.** O site roda inteiro no navegador e o
repositório é público: quem abrir o código-fonte acha o hash dela em
`data/config.js`. Ela serve para ninguém editar sem querer — nada mais.

Não use aqui uma senha que você usa em outro lugar, e não trate o acervo
como se fosse privado: qualquer pessoa com o link vê tudo.

Guardamos o SHA-256 em vez do texto puro só para a senha não ficar
escancarada para quem passa os olhos pelo repositório. Para trocar, use
*Trocar senha* dentro do painel: ele calcula o novo hash para você colar em
`data/config.js` e commitar.

A verificação usa a Web Crypto, que o navegador só libera em `https` ou
`localhost` — pelo site publicado funciona; abrindo o `index.html` por
`file://` o painel avisa e não destranca.

## Seções

| Seção | Endereço | O que vai lá |
|---|---|---|
| Início | `#/` | Abertura editorial, letreiro de frases, placar em bento, frase do dia, quiz, mosaico de fotos e últimos registros |
| Frases | `#/frases` | Todas as pérolas, com busca e filtro por pessoa |
| Galeria | `#/galeria` | Fotos, prints e vídeos, com lightbox |
| Momentos | `#/momentos` | Linha do tempo dos causos históricos |
| Hall da Fama | `#/hall` | Troféus honoríficos |
| O Time | `#/time` | Perfis com cargo oficial, cargo honorífico e ficha corrida |

## Adicionando conteúdo

1. Abra o arquivo certo dentro de `data/`:
   - `time.js` — as pessoas do time (já cadastradas, com foto)
   - `frases.js` — as pérolas ditas
   - `momentos.js` — os causos da linha do tempo
   - `galeria.js` — fotos e prints
   - `premios.js` — troféus do Hall da Fama
   - `config.js` — nome do site, subtítulos, textos gerais
2. Copie um bloco que já existe, cole logo abaixo e edite o conteúdo.
   A única regra: **vírgula entre um bloco e outro**.
3. Salve, abra o `index.html` para conferir, e faça commit.

Prefere não mexer em arquivo? Use o **modo edição** (✏️ no topo) — ele faz o
mesmo pela tela e entrega o arquivo pronto para commitar.

Exemplo de uma frase nova em `data/frases.js`:

```js
{
  texto: 'Se ninguém reclamar em produção, é porque funcionou.',
  autor: 'joao',            // o id da pessoa lá em data/time.js
  contexto: 'Sexta-feira, 17h50. Ele estava sorrindo.',
  data: '2026-03-14',       // sempre AAAA-MM-DD
  tags: ['deploy'],
  nota: 5                   // 1 a 5 pimentas de absurdo
},
```

### Fotos, prints e vídeos

Suba os arquivos em `assets/img/galeria/` e aponte o caminho no campo `src`.
Vale imagem (jpg, png, gif, webp) e vídeo (mp4, webm): o vídeo aparece como
miniatura no mural, com um selo ▶, e toca com som e controles ao abrir no
lightbox. Se o arquivo ainda não existir, o site mostra um card avisando qual
falta — nada quebra.

Use nomes sem espaço, sem parêntese e sem acento: eles viram `%20` e `%28` na
URL. E prefira `.mp4` a `.mov` — o mesmo vídeo com a extensão errada é servido
com o tipo errado e alguns navegadores se recusam a tocar.

As fotos de perfil já estão em `assets/img/pessoas/`, vindas da central do
time, e são apontadas pelo campo `foto` de `data/time.js`.

Dica: comprima as imagens antes de subir (algo em torno de 1200px de largura já
está ótimo). O repositório agradece.

## Rodando localmente

```bash
# Opção 1 — abrir direto
open index.html          # macOS
xdg-open index.html      # Linux

# Opção 2 — servidor local (recomendado se quiser testar em outro dispositivo)
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Publicando

O site é publicado pelo **GitHub Pages** a cada push na branch principal
(veja `.github/workflows/pages.yml`).

Para ligar na primeira vez: **Settings → Pages → Source: GitHub Actions**.

## Estrutura

```
.
├── index.html              # a casca do site
├── assets/
│   ├── css/style.css       # todos os estilos
│   ├── js/
│   │   ├── utils.js        # funções auxiliares
│   │   ├── views.js        # o HTML de cada página
│   │   └── app.js          # roteador, tema, busca, lightbox
│   └── img/
│       ├── galeria/        # fotos e prints
│       └── pessoas/        # fotos de perfil
└── data/                   # 👈 o conteúdo do acervo mora aqui
    ├── config.js
    ├── time.js
    ├── frases.js
    ├── momentos.js
    ├── galeria.js
    └── premios.js
```

## Regras não escritas do acervo

- Frase editada para ficar melhor perde a graça. Registre como foi dita.
- O contexto é metade da piada. Sempre preencha.
- Rimos **com**, não **de**. Se a pessoa não achou graça, sai do ar sem discussão.
- Print sem data é boato.
- O acervo é sobre o time, feito pelo time: ninguém entra no site sem saber.

## Extras escondidos

- A foto grande da home sai de `destaque` em `data/config.js` (ou da aba Ajustes no modo edição).
- O quiz da home sorteia entre as frases cadastradas: quanto mais pérolas, melhor ele fica.
- O subtítulo do topo troca sozinho de tempos em tempos.
- Existe um código Konami escondido. Boa sorte.
- No modo edição, `Esc` fecha o painel.
