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

### Tema

O site abre no **tema do seu computador**. O botão no topo alterna entre
Sistema → Claro → Escuro, e a escolha fica salva. Se o computador trocar de
tema com o site aberto, ele acompanha na hora.

A preferência usa a mesma chave da central do time (`auvp-theme`), e os dois
sites ficam no mesmo domínio — então quem escolher um tema em um deles
encontra o mesmo tema no outro.

## Seções

| Seção | Endereço | O que vai lá |
|---|---|---|
| Início | `#/` | Placar do acervo, frase do dia, últimos registros |
| Frases | `#/frases` | Todas as pérolas, com busca e filtro por pessoa |
| Galeria | `#/galeria` | Fotos, prints e vídeos, com lightbox |
| Momentos | `#/momentos` | Linha do tempo dos causos históricos |
| Hall da Fama | `#/hall` | Troféus honoríficos |
| O Time | `#/time` | Perfis, com ficha corrida de cada um |

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

- O subtítulo do topo troca sozinho de tempos em tempos.
- Existe um código Konami escondido. Boa sorte.
