/* =========================================================================
   MODO EDIÇÃO (ícone ✏️ no topo)

   Como isto funciona:

   O acervo é um site estático no GitHub Pages, sem servidor próprio. O
   fluxo é:

     1. você edita aqui e vê o resultado na hora;
     2. "Publicar no GitHub" commita os arquivos alterados direto pela API,
        num único commit, usando um token que você fornece;
     3. o GitHub Pages reconstrói o site e o time passa a ver a alteração.

   Não existe rascunho salvo no navegador: a alteração vive só na aba aberta.
   Ou vira commit, ou não aconteceu — assim ninguém fica com uma versão
   particular do acervo achando que o time está vendo o mesmo. Recarregar ou
   fechar com alteração pendente dispara o aviso do navegador.

   Sem token dá para seguir pelo caminho manual: "Baixar" ou "Copiar" entrega
   o data/<arquivo>.js pronto para commitar na mão.

   A senha (data/config.js) tranca o painel contra edição acidental. Ela não
   é segurança: o código roda no navegador e o repositório é público. O token
   do GitHub, esse sim, é sensível — leia os avisos no painel.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.editor = (function () {
  'use strict';

  var u = window.ACERVO.utils;

  var CHAVE_SESSAO = 'acervo:editor-liberado';

  /* ---------------------------------------------------------------------
     Esquema de cada coleção: o que o painel sabe editar.
     tipo: texto | area | data | numero | pessoa | pessoas | lista
     --------------------------------------------------------------------- */
  var COLECOES = {
    frases: {
      rotulo: 'Frases',
      icone: '💬',
      lista: true,
      titulo: function (i) { return i.texto || '(sem texto)'; },
      novo: function () {
        return { texto: '', autor: '', contexto: '', data: hoje(), tags: [], nota: 0 };
      },
      campos: [
        { nome: 'texto', rotulo: 'A frase, como foi dita', tipo: 'area' },
        { nome: 'autor', rotulo: 'Quem disse', tipo: 'pessoa' },
        { nome: 'contexto', rotulo: 'Contexto (metade da piada)', tipo: 'area' },
        { nome: 'data', rotulo: 'Data', tipo: 'data' },
        { nome: 'tags', rotulo: 'Tags (separadas por vírgula)', tipo: 'lista' },
        { nome: 'nota', rotulo: 'Pimentas de absurdo (0 a 5)', tipo: 'numero', min: 0, max: 5 }
      ]
    },

    galeria: {
      rotulo: 'Galeria',
      icone: '🖼️',
      lista: true,
      titulo: function (i) { return i.legenda || i.src || '(sem legenda)'; },
      novo: function () {
        return { src: '', legenda: '', aparecem: [], data: '', tags: [], creditos: '' };
      },
      campos: [
        { nome: 'src', rotulo: 'Arquivo (assets/img/galeria/…)', tipo: 'texto' },
        { nome: 'legenda', rotulo: 'Legenda', tipo: 'area' },
        { nome: 'aparecem', rotulo: 'Quem aparece', tipo: 'pessoas' },
        { nome: 'data', rotulo: 'Data (deixe vazio se não souber)', tipo: 'data' },
        { nome: 'tags', rotulo: 'Tags', tipo: 'lista' },
        { nome: 'creditos', rotulo: 'Quem registrou', tipo: 'pessoa' }
      ]
    },

    premios: {
      rotulo: 'Hall da Fama',
      icone: '🏆',
      lista: true,
      titulo: function (i) { return i.titulo || '(sem título)'; },
      novo: function () {
        return { titulo: '', emoji: '🏆', descricao: '', ganhador: '', edicao: '', motivo: '' };
      },
      campos: [
        { nome: 'titulo', rotulo: 'Nome do prêmio', tipo: 'texto' },
        { nome: 'emoji', rotulo: 'Troféu (emoji)', tipo: 'texto' },
        { nome: 'descricao', rotulo: 'Para que serve este prêmio', tipo: 'area' },
        { nome: 'ganhador', rotulo: 'Ganhador', tipo: 'pessoa' },
        { nome: 'edicao', rotulo: 'Edição (2026, Q3/2026, Vitalício…)', tipo: 'texto' },
        { nome: 'motivo', rotulo: 'O feito que garantiu a vitória', tipo: 'area' }
      ]
    },

    time: {
      rotulo: 'O Time',
      icone: '👥',
      lista: true,
      titulo: function (i) { return i.nome || '(sem nome)'; },
      novo: function () {
        return { id: '', nome: '', cargo: '', bio: '', emoji: '👤', foto: '', bordoes: [] };
      },
      campos: [
        { nome: 'nome', rotulo: 'Nome', tipo: 'texto' },
        { nome: 'id', rotulo: 'Id (sem espaço nem acento — usado nos outros arquivos)', tipo: 'texto' },
        { nome: 'cargo', rotulo: 'Cargo', tipo: 'texto' },
        { nome: 'bio', rotulo: 'Bio', tipo: 'area' },
        { nome: 'emoji', rotulo: 'Emoji de reserva', tipo: 'texto' },
        { nome: 'foto', rotulo: 'Foto (assets/img/pessoas/…)', tipo: 'texto' },
        { nome: 'entrouEm', rotulo: 'No time desde', tipo: 'texto' },
        { nome: 'bordoes', rotulo: 'Bordões (separados por vírgula)', tipo: 'lista' }
      ]
    },

    config: {
      rotulo: 'Ajustes',
      icone: '⚙️',
      lista: false,
      campos: [
        { nome: 'nome', rotulo: 'Nome do site', tipo: 'texto' },
        { nome: 'time', rotulo: 'Time', tipo: 'texto' },
        { nome: 'subtitulos', rotulo: 'Subtítulos que se revezam (um por linha)', tipo: 'linhas' },
        { nome: 'rodape', rotulo: 'Rodapé', tipo: 'texto' },
        { nome: 'vazio', rotulo: 'Texto de seção vazia', tipo: 'texto' }
      ]
    }
  };

  /* Cabeçalho que vai no topo de cada arquivo gerado */
  var CABECALHOS = {
    frases: 'FRASES ICÔNICAS — toda pérola dita no time.\n     Campos: texto, autor (id em data/time.js), contexto, data (AAAA-MM-DD),\n     tags, nota (1 a 5 pimentas de absurdo).',
    galeria: 'GALERIA — fotos, prints e vídeos (mp4/webm).\n     Campos: src, legenda, aparecem (ids), data, tags, creditos.\n     Nomes de arquivo sem espaço, parêntese ou acento.',
    premios: 'HALL DA FAMA — troféus por mérito duvidoso.\n     Campos: titulo, emoji, descricao, ganhador (id), edicao, motivo.',
    time: 'INTEGRANTES DO TIME.\n     O "id" amarra a pessoa às frases, fotos, momentos e prêmios.\n     A cor de cada um sai da paleta do Design System pela posição nesta lista.',
    config: 'CONFIGURAÇÕES GERAIS — nome do site, subtítulos e textos.'
  };

  var estado = { aberto: false, liberado: false, colecao: 'frases', abertoItem: null };
  var painel = null;

  // Retrato do que veio dos arquivos data/*.js. É a referência para saber
  // o que mudou nesta aba e, portanto, o que precisa ser publicado.
  var PUBLICADO = {};
  Object.keys(COLECOES).forEach(function (k) {
    PUBLICADO[k] = JSON.parse(JSON.stringify(window.ACERVO[k] || (COLECOES[k].lista ? [] : {})));
  });

  /* ---------------------------------------------------------------------
     Alterações pendentes

     Vivem só em memória, nesta aba. Não gravamos rascunho no navegador de
     propósito: ou a alteração vira commit, ou se perde ao recarregar. Sem
     isso, alguém acabaria navegando numa versão particular do acervo
     acreditando que o time vê a mesma coisa.
     --------------------------------------------------------------------- */
  function colecoesAlteradas() {
    return Object.keys(COLECOES).filter(function (k) {
      return JSON.stringify(window.ACERVO[k]) !== JSON.stringify(PUBLICADO[k]);
    });
  }

  function temAlteracao() {
    return colecoesAlteradas().length > 0;
  }

  function descartarAlteracoes() {
    Object.keys(COLECOES).forEach(function (k) {
      window.ACERVO[k] = JSON.parse(JSON.stringify(PUBLICADO[k]));
    });
    if (window.ACERVO.renderizar) window.ACERVO.renderizar();
  }

  // O navegador avisa antes de a alteração se perder
  window.addEventListener('beforeunload', function (ev) {
    if (!temAlteracao()) return;
    ev.preventDefault();
    ev.returnValue = '';
  });

  /* ---------------------------------------------------------------------
     Senha
     --------------------------------------------------------------------- */
  function digerir(texto) {
    if (!window.crypto || !window.crypto.subtle) return Promise.resolve(null);
    var bytes = new TextEncoder().encode(texto);
    return window.crypto.subtle.digest('SHA-256', bytes).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('00' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  function conferirSenha(texto) {
    var esperado = (window.ACERVO.config || {}).senhaHash || '';
    return digerir(texto).then(function (hash) {
      if (hash === null) return 'sem-crypto';
      return hash === esperado;
    });
  }

  /* ---------------------------------------------------------------------
     Geração dos arquivos
     --------------------------------------------------------------------- */
  function serializar(chave) {
    var dados = window.ACERVO[chave];
    var cabecalho = '/* =========================================================================\n' +
      '   ' + (CABECALHOS[chave] || '') + '\n\n' +
      '   Gerado pelo modo edição do acervo. Pode editar na mão também —\n' +
      '   é JavaScript comum, só uma lista de blocos separados por vírgula.\n' +
      '   ========================================================================= */\n\n' +
      'window.ACERVO = window.ACERVO || {};\n\n';

    return cabecalho + 'window.ACERVO.' + chave + ' = ' +
      JSON.stringify(dados, null, 2) + ';\n';
  }

  function baixar(chave) {
    var texto = serializar(chave);
    var blob = new Blob([texto], { type: 'text/javascript;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = chave + '.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function copiar(chave, botao) {
    var texto = serializar(chave);
    var aviso = function (msg) {
      var original = botao.textContent;
      botao.textContent = msg;
      setTimeout(function () { botao.textContent = original; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(
        function () { aviso('copiado ✓'); },
        function () { aviso('não deu — use "Baixar"'); }
      );
    } else {
      aviso('não deu — use "Baixar"');
    }
  }

  /* ---------------------------------------------------------------------
     Publicação direta no GitHub

     Commita os arquivos alterados pela API do GitHub, num único commit,
     usando a Git Data API: cria uma árvore com base na atual, faz o commit
     e move a branch. Um PUT por arquivo seria mais simples, mas geraria um
     commit e uma reconstrução do Pages para cada arquivo.
     --------------------------------------------------------------------- */
  var CHAVE_TOKEN = 'acervo:token-github';

  function lerToken() {
    try {
      return sessionStorage.getItem(CHAVE_TOKEN) || localStorage.getItem(CHAVE_TOKEN) || '';
    } catch (e) {
      return '';
    }
  }

  function guardarToken(token, lembrar) {
    try {
      sessionStorage.removeItem(CHAVE_TOKEN);
      localStorage.removeItem(CHAVE_TOKEN);
      (lembrar ? localStorage : sessionStorage).setItem(CHAVE_TOKEN, token);
    } catch (e) { /* modo anônimo: vale só nesta aba */ }
  }

  function esquecerToken() {
    try {
      sessionStorage.removeItem(CHAVE_TOKEN);
      localStorage.removeItem(CHAVE_TOKEN);
    } catch (e) { /* ignora */ }
  }

  function repo() {
    var g = (window.ACERVO.config || {}).github || {};
    return {
      owner: g.owner || '',
      repo: g.repo || '',
      branch: g.branch || 'main',
      base: 'https://api.github.com/repos/' + (g.owner || '') + '/' + (g.repo || '')
    };
  }

  function chamarGitHub(url, token, opcoes) {
    opcoes = opcoes || {};
    return fetch(url, {
      method: opcoes.metodo || 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (corpo) {
        if (r.ok) return corpo;

        // Mensagens por causa provável, em vez do texto cru da API
        var msg;
        if (r.status === 401) msg = 'Token inválido ou expirado.';
        else if (r.status === 403) msg = 'O token não tem permissão de escrita neste repositório.';
        else if (r.status === 404) msg = 'Repositório não encontrado — ou o token não enxerga ele. ' +
          'Confira se o token foi criado com acesso a ' + repo().owner + '/' + repo().repo + '.';
        else if (r.status === 409 || r.status === 422) msg = 'Alguém commitou antes de você. ' +
          'Recarregue a página e refaça a alteração.';
        else msg = 'GitHub respondeu ' + r.status + ': ' + (corpo.message || 'erro desconhecido');

        var erro = new Error(msg);
        erro.status = r.status;
        throw erro;
      });
    });
  }

  function publicarNoGitHub(token, aoAndar) {
    var r = repo();
    var chaves = colecoesAlteradas();
    if (!chaves.length) return Promise.reject(new Error('Não há nada alterado para publicar.'));
    if (!r.owner || !r.repo) return Promise.reject(new Error('Faltam owner/repo em data/config.js.'));

    var refUrl = r.base + '/git/ref/heads/' + encodeURIComponent(r.branch);
    var shaBase, shaArvoreBase, quem;

    aoAndar('Conferindo o token…');
    return chamarGitHub('https://api.github.com/user', token)
      .then(function (u) {
        quem = u.login;
        aoAndar('Lendo a branch ' + r.branch + '…');
        return chamarGitHub(refUrl, token);
      })
      .then(function (ref) {
        shaBase = ref.object.sha;
        return chamarGitHub(r.base + '/git/commits/' + shaBase, token);
      })
      .then(function (commit) {
        shaArvoreBase = commit.tree.sha;
        aoAndar('Montando o commit com ' + chaves.length + ' arquivo(s)…');
        return chamarGitHub(r.base + '/git/trees', token, {
          metodo: 'POST',
          corpo: {
            base_tree: shaArvoreBase,
            tree: chaves.map(function (k) {
              return { path: 'data/' + k + '.js', mode: '100644', type: 'blob', content: serializar(k) };
            })
          }
        });
      })
      .then(function (arvore) {
        var lista = chaves.map(function (k) { return 'data/' + k + '.js'; }).join(', ');
        return chamarGitHub(r.base + '/git/commits', token, {
          metodo: 'POST',
          corpo: {
            message: 'Atualiza o acervo pelo modo edição\n\nArquivos: ' + lista +
                     '\nPublicado por: ' + quem,
            tree: arvore.sha,
            parents: [shaBase]
          }
        });
      })
      .then(function (commit) {
        aoAndar('Publicando…');
        return chamarGitHub(r.base + '/git/refs/heads/' + encodeURIComponent(r.branch), token, {
          metodo: 'PATCH',
          corpo: { sha: commit.sha }
        }).then(function () { return { sha: commit.sha, quem: quem, arquivos: chaves }; });
      });
  }

  /* ---------------------------------------------------------------------
     Desenho do painel
     --------------------------------------------------------------------- */
  function hoje() {
    var d = new Date();
    var mm = ('0' + (d.getMonth() + 1)).slice(-2);
    var dd = ('0' + d.getDate()).slice(-2);
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  function campoHtml(campo, valor, caminho) {
    var id = 'ed-' + caminho.join('-');
    var v = valor === undefined || valor === null ? '' : valor;
    var attr = 'data-campo="' + u.esc(caminho.join('|')) + '" id="' + u.esc(id) + '"';
    var html = '<label class="ed-campo"><span class="ed-campo__rotulo">' + u.esc(campo.rotulo) + '</span>';

    if (campo.tipo === 'area') {
      html += '<textarea ' + attr + ' rows="3">' + u.esc(v) + '</textarea>';

    } else if (campo.tipo === 'data') {
      html += '<input type="date" ' + attr + ' value="' + u.esc(v) + '">';

    } else if (campo.tipo === 'numero') {
      html += '<input type="number" ' + attr + ' value="' + u.esc(v) + '" ' +
              'min="' + (campo.min || 0) + '" max="' + (campo.max || 99) + '">';

    } else if (campo.tipo === 'pessoa') {
      html += '<select ' + attr + '><option value="">— ninguém —</option>' +
        (window.ACERVO.time || []).map(function (p) {
          return '<option value="' + u.esc(p.id) + '"' + (p.id === v ? ' selected' : '') + '>' +
                 u.esc(p.nome) + '</option>';
        }).join('') + '</select>';

    } else if (campo.tipo === 'pessoas') {
      var marcados = Array.isArray(v) ? v : [];
      html += '<div class="ed-pessoas" ' + attr + '>' +
        (window.ACERVO.time || []).map(function (p) {
          var on = marcados.indexOf(p.id) !== -1;
          return '<label class="ed-check"><input type="checkbox" value="' + u.esc(p.id) + '"' +
                 (on ? ' checked' : '') + '> ' + u.esc(p.nome.split(' ')[0]) + '</label>';
        }).join('') + '</div>';

    } else if (campo.tipo === 'opcoes') {
      html += '<select ' + attr + '>' + campo.opcoes.map(function (o) {
        return '<option value="' + u.esc(o) + '"' + (o === v ? ' selected' : '') + '>' + u.esc(o) + '</option>';
      }).join('') + '</select>';

    } else if (campo.tipo === 'lista') {
      html += '<input type="text" ' + attr + ' value="' + u.esc((v || []).join(', ')) + '">';

    } else if (campo.tipo === 'linhas') {
      html += '<textarea ' + attr + ' rows="5">' + u.esc((v || []).join('\n')) + '</textarea>';

    } else {
      html += '<input type="text" ' + attr + ' value="' + u.esc(v) + '">';
    }

    return html + '</label>';
  }

  function itemHtml(colecao, item, indice) {
    var def = COLECOES[colecao];
    var aberto = estado.abertoItem === indice;
    var titulo = def.lista ? def.titulo(item) : def.rotulo;

    var html = '<div class="ed-item' + (aberto ? ' ed-item--aberto' : '') + '">';

    if (def.lista) {
      html += '<button class="ed-item__topo" type="button" data-abrir="' + indice + '">' +
                '<span class="ed-item__titulo">' + u.esc(String(titulo).slice(0, 70)) + '</span>' +
                '<span class="ed-item__seta" aria-hidden="true">' + (aberto ? '▾' : '▸') + '</span>' +
              '</button>';
    }

    if (aberto || !def.lista) {
      html += '<div class="ed-item__corpo">' +
        def.campos.map(function (c) {
          return campoHtml(c, item[c.nome], [colecao, String(indice), c.nome]);
        }).join('');

      if (def.lista) {
        html += '<button class="ed-apagar" type="button" data-apagar="' + indice + '">' +
                'Apagar este item</button>';
      }
      html += '</div>';
    }

    return html + '</div>';
  }

  function desenhar() {
    if (!painel) return;

    if (!estado.liberado) {
      painel.querySelector('.ed-corpo').innerHTML =
        '<form class="ed-senha" id="ed-form-senha">' +
          '<p class="ed-senha__titulo">Modo edição</p>' +
          '<p class="ed-aviso">' +
            'Esta senha evita edição por engano — <strong>não é segurança</strong>. ' +
            'O site é estático e o repositório é público: quem abrir o código-fonte ' +
            'acha o hash dela. Nada aqui é privado.' +
          '</p>' +
          '<label class="ed-campo"><span class="ed-campo__rotulo">Senha</span>' +
            '<input type="password" id="ed-senha" autocomplete="current-password"></label>' +
          '<p class="ed-erro" id="ed-erro" hidden></p>' +
          '<button class="botao" type="submit">Entrar</button>' +
        '</form>';
      var form = painel.querySelector('#ed-form-senha');
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var erro = painel.querySelector('#ed-erro');
        conferirSenha(painel.querySelector('#ed-senha').value).then(function (ok) {
          if (ok === 'sem-crypto') {
            erro.hidden = false;
            erro.textContent = 'O navegador só libera a verificação em https ou localhost. ' +
              'Abra pelo site publicado ou rode um servidor local.';
            return;
          }
          if (!ok) {
            erro.hidden = false;
            erro.textContent = 'Senha errada.';
            return;
          }
          estado.liberado = true;
          try { sessionStorage.setItem(CHAVE_SESSAO, '1'); } catch (e) { /* ignora */ }
          desenhar();
        });
      });
      painel.querySelector('#ed-senha').focus();
      return;
    }

    var def = COLECOES[estado.colecao];
    var dados = window.ACERVO[estado.colecao];
    var itens = def.lista ? (dados || []) : [dados || {}];

    var abas = Object.keys(COLECOES).map(function (k) {
      return '<button class="ed-aba" type="button" data-colecao="' + k + '" aria-pressed="' +
        (k === estado.colecao) + '">' + COLECOES[k].icone + ' ' + u.esc(COLECOES[k].rotulo) + '</button>';
    }).join('');

    painel.querySelector('.ed-corpo').innerHTML =
      '<div class="ed-abas">' + abas + '</div>' +
      '<p class="ed-rascunho" id="ed-rascunho"' + (temAlteracao() ? '' : ' hidden') + '>' +
        'Alteração pendente, viva só nesta aba. Publique para o time ver — ' +
        'recarregar a página <strong>descarta</strong> o que não foi publicado.</p>' +
      '<div class="ed-itens">' +
        itens.map(function (it, i) { return itemHtml(estado.colecao, it, i); }).join('') +
      '</div>' +
      (def.lista ? '<button class="botao botao--fantasma ed-novo" type="button">+ Novo item</button>' : '') +
      blocoPublicar();

    ligarEventos();
  }

  function textoAlteradas() {
    var alteradas = colecoesAlteradas();
    if (!alteradas.length) return 'Nada alterado por enquanto.';
    return 'Vai num commit só: <code>' +
      alteradas.map(function (k) { return 'data/' + k + '.js'; }).join('</code> <code>') + '</code>';
  }

  function blocoPublicar() {
    var alteradas = colecoesAlteradas();
    var temToken = !!lerToken();
    var r = repo();

    return '' +
      '<div class="ed-publicar">' +
        '<p class="ed-publicar__titulo">Publicar para o time</p>' +

        '<p class="ed-aviso" id="ed-alteradas">' + textoAlteradas() + '</p>' +

        (temToken
          ? '<div class="ed-publicar__acoes">' +
              '<button class="botao" type="button" data-acao="publicar"' +
                (alteradas.length ? '' : ' disabled') + '>⬆ Publicar no GitHub</button>' +
              '<button class="chip" type="button" data-acao="esquecer-token">Esquecer token</button>' +
            '</div>'
          : '<details class="ed-token">' +
              '<summary>Conectar ao GitHub para publicar daqui</summary>' +
              '<p class="ed-aviso">' +
                'Um <strong>token com permissão de escrita</strong> neste repositório fica guardado ' +
                'no seu navegador. Quem puser a mão nele consegue publicar no site. ' +
                'Crie um <em>fine-grained token</em> restrito: ' +
                '<strong>só o repositório ' + u.esc(r.owner + '/' + r.repo) + '</strong>, ' +
                '<strong>só Contents: Read and write</strong>, e com validade curta.' +
              '</p>' +
              '<p class="ed-aviso">' +
                '<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" ' +
                'rel="noopener">Criar o token no GitHub →</a>' +
              '</p>' +
              '<label class="ed-campo"><span class="ed-campo__rotulo">Token</span>' +
                '<input type="password" id="ed-token" autocomplete="off" ' +
                'placeholder="github_pat_…"></label>' +
              '<label class="ed-check"><input type="checkbox" id="ed-lembrar"> ' +
                'Lembrar neste computador</label>' +
              '<p class="ed-aviso">Sem marcar, o token some quando você fechar o navegador — ' +
                'que é o mais seguro em máquina compartilhada.</p>' +
              '<button class="botao" type="button" data-acao="salvar-token">Guardar token</button>' +
            '</details>') +

        '<p class="ed-status" id="ed-status" hidden></p>' +

        '<p class="ed-aviso ed-publicar__manual">Ou faça na mão: gere o arquivo e commite você mesmo.</p>' +
        '<div class="ed-publicar__acoes">' +
          '<button class="chip" type="button" data-acao="baixar">Baixar ' + estado.colecao + '.js</button>' +
          '<button class="chip" type="button" data-acao="copiar">Copiar conteúdo</button>' +
          '<button class="chip" type="button" data-acao="trocar-senha">Trocar senha</button>' +
          '<button class="chip" type="button" data-acao="descartar">Descartar alteração</button>' +
        '</div>' +
      '</div>';
  }

  function ligarEventos() {
    var q = function (sel) { return painel.querySelectorAll(sel); };

    Array.prototype.forEach.call(q('[data-colecao]'), function (b) {
      b.addEventListener('click', function () {
        estado.colecao = this.getAttribute('data-colecao');
        estado.abertoItem = COLECOES[estado.colecao].lista ? null : 0;
        desenhar();
      });
    });

    Array.prototype.forEach.call(q('[data-abrir]'), function (b) {
      b.addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-abrir'), 10);
        estado.abertoItem = (estado.abertoItem === i) ? null : i;
        desenhar();
      });
    });

    Array.prototype.forEach.call(q('[data-apagar]'), function (b) {
      b.addEventListener('click', function () {
        var i = parseInt(this.getAttribute('data-apagar'), 10);
        var def = COLECOES[estado.colecao];
        var nome = def.titulo(window.ACERVO[estado.colecao][i]);
        if (!window.confirm('Apagar "' + String(nome).slice(0, 60) + '"?')) return;
        window.ACERVO[estado.colecao].splice(i, 1);
        estado.abertoItem = null;
        aplicar();
      });
    });

    var novo = painel.querySelector('.ed-novo');
    if (novo) {
      novo.addEventListener('click', function () {
        var def = COLECOES[estado.colecao];
        window.ACERVO[estado.colecao].unshift(def.novo());
        estado.abertoItem = 0;
        aplicar();
      });
    }

    // Campos: aplicam ao sair do campo (change), não a cada tecla — assim a
    // página não se redesenha embaixo de quem está digitando.
    Array.prototype.forEach.call(q('[data-campo]'), function (el) {
      var evento = el.classList.contains('ed-pessoas') ? 'change' : 'change';
      el.addEventListener(evento, function () {
        var partes = el.getAttribute('data-campo').split('|');
        var colecao = partes[0], indice = parseInt(partes[1], 10), campo = partes[2];
        var def = COLECOES[colecao];
        var alvo = def.lista ? window.ACERVO[colecao][indice] : window.ACERVO[colecao];
        var esquema = null;
        def.campos.forEach(function (c) { if (c.nome === campo) esquema = c; });

        if (esquema.tipo === 'pessoas') {
          alvo[campo] = Array.prototype.filter.call(
            el.querySelectorAll('input[type="checkbox"]'), function (c) { return c.checked; }
          ).map(function (c) { return c.value; });
        } else if (esquema.tipo === 'lista') {
          alvo[campo] = el.value.split(',').map(function (s) { return s.trim(); })
            .filter(function (s) { return s; });
        } else if (esquema.tipo === 'linhas') {
          alvo[campo] = el.value.split('\n').map(function (s) { return s.trim(); })
            .filter(function (s) { return s; });
        } else if (esquema.tipo === 'numero') {
          alvo[campo] = el.value === '' ? 0 : parseInt(el.value, 10);
        } else {
          alvo[campo] = el.value;
        }

        aplicar(true);
      });
    });

    var acao = function (nome, fn) {
      var b = painel.querySelector('[data-acao="' + nome + '"]');
      if (b) b.addEventListener('click', function () { fn(b); });
    };
    acao('baixar', function () { baixar(estado.colecao); });
    acao('copiar', function (b) { copiar(estado.colecao, b); });
    acao('descartar', function () {
      if (window.confirm('Descartar as alterações não publicadas e voltar ao que está no ar?')) {
        descartarAlteracoes();
        desenhar();
      }
    });
    acao('salvar-token', function () {
      var campo = painel.querySelector('#ed-token');
      var valor = (campo.value || '').trim();
      if (!valor) return;
      guardarToken(valor, painel.querySelector('#ed-lembrar').checked);
      campo.value = '';
      desenhar();
    });

    acao('esquecer-token', function () {
      esquecerToken();
      desenhar();
    });

    acao('publicar', function (botao) {
      var status = painel.querySelector('#ed-status');
      var andar = function (texto, classe) {
        status.hidden = false;
        status.className = 'ed-status' + (classe ? ' ed-status--' + classe : '');
        status.innerHTML = texto;
      };

      botao.disabled = true;
      publicarNoGitHub(lerToken(), function (t) { andar(t); })
        .then(function (res) {
          var url = 'https://github.com/' + repo().owner + '/' + repo().repo +
                    '/commit/' + res.sha;
          andar('✅ <strong>Publicado.</strong> ' +
                '<a href="' + url + '" target="_blank" rel="noopener">Ver o commit</a>. ' +
                'O site leva cerca de um minuto para reconstruir.', 'ok');
          u.confete(['🚀', '✅', '🎉']);
        })
        .catch(function (e) {
          andar('❌ ' + u.esc(e.message), 'erro');
          botao.disabled = false;
        });
    });

    acao('trocar-senha', function () {
      var nova = window.prompt('Nova senha do modo edição:');
      if (!nova) return;
      digerir(nova).then(function (hash) {
        if (!hash) { window.alert('Só funciona em https ou localhost.'); return; }
        window.prompt(
          'Cole este valor em data/config.js, no campo senhaHash, e commite:', hash);
      });
    });
  }

  // Aplica as mudanças ao site. `manterFoco` evita redesenhar o painel
  // inteiro enquanto a pessoa passeia pelos campos.
  function aplicar(manterFoco) {
    if (window.ACERVO.renderizar) window.ACERVO.renderizar();
    if (!manterFoco) desenhar();
    else marcarAlteracao();
  }

  // Tudo que depende de "existe alteração não publicada" é atualizado aqui,
  // sem redesenhar o painel — senão o estado só mudaria ao trocar de aba, e
  // quem editasse um campo veria o botão Publicar seguir desabilitado.
  function marcarAlteracao() {
    var tem = temAlteracao();

    var botao = document.getElementById('editor-botao');
    if (botao) botao.classList.toggle('tem-rascunho', tem);

    var banner = document.getElementById('ed-rascunho');
    if (banner) banner.hidden = !tem;

    var lista = document.getElementById('ed-alteradas');
    if (lista) lista.innerHTML = textoAlteradas();

    var publicar = document.querySelector('[data-acao="publicar"]');
    if (publicar) publicar.disabled = !tem;
  }

  /* ---------------------------------------------------------------------
     Abrir e fechar
     --------------------------------------------------------------------- */
  function montar() {
    painel = document.createElement('aside');
    painel.className = 'ed-painel';
    painel.id = 'ed-painel';
    painel.hidden = true;
    painel.setAttribute('aria-label', 'Modo edição');
    painel.innerHTML =
      '<header class="ed-topo">' +
        '<strong>✏️ Modo edição</strong>' +
        '<button class="ed-fechar" type="button" aria-label="Fechar">✕</button>' +
      '</header>' +
      '<div class="ed-corpo"></div>';
    document.body.appendChild(painel);
    painel.querySelector('.ed-fechar').addEventListener('click', fechar);
  }

  // A classe no <html> desloca a página no desktop, para o painel não cobrir
  // o conteúdo nem o próprio botão que o abriu. No celular ele ocupa a tela
  // inteira de propósito, e o ✕ é a saída.
  function abrir() {
    if (!painel) montar();
    painel.hidden = false;
    estado.aberto = true;
    document.documentElement.classList.add('ed-aberto');
    document.getElementById('editor-botao').setAttribute('aria-expanded', 'true');
    desenhar();
  }

  function fechar() {
    if (!painel) return;
    painel.hidden = true;
    estado.aberto = false;
    document.documentElement.classList.remove('ed-aberto');
    document.getElementById('editor-botao').setAttribute('aria-expanded', 'false');
  }

  function alternar() {
    if (estado.aberto) fechar(); else abrir();
  }

  function iniciar() {
    try { estado.liberado = sessionStorage.getItem(CHAVE_SESSAO) === '1'; } catch (e) { /* ignora */ }

    var botao = document.getElementById('editor-botao');
    if (botao) botao.addEventListener('click', alternar);

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && estado.aberto) fechar();
    });

    marcarAlteracao();
  }

  return { iniciar: iniciar, abrir: abrir, fechar: fechar, temAlteracao: temAlteracao };
})();
