/* =========================================================================
   APLICAÇÃO
   Roteador por hash (#/frases, #/time/joao, ...), tema, busca, lightbox
   e as brincadeiras. Para adicionar conteúdo, mexa na pasta /data.
   ========================================================================= */

(function () {
  'use strict';

  var u = window.ACERVO.utils;
  var views = window.ACERVO.views;
  var app = document.getElementById('app');

  // Estado de busca/filtro de cada página (não recarrega o site)
  var estado = {
    frases: { busca: '', autor: '' },
    galeria: { busca: '' }
  };

  /* ---------------- Tema ----------------
     Três estados: Sistema (padrão), Claro e Escuro.

     O contrato de armazenamento é o mesmo da central do time
     ('auvp-theme' com 'light' | 'dark'; sem chave = seguir o sistema).
     Como os dois sites vivem no mesmo domínio, quem escolher um tema em
     um deles encontra o mesmo tema no outro.

     A classe .dark no <html> é a do Design System. O tema também é
     aplicado no <head>, antes da primeira pintura, para não piscar. */
  var CHAVE_TEMA = 'auvp-theme';
  var consultaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  function temaEscolhido() {
    try {
      var salvo = localStorage.getItem(CHAVE_TEMA);
      return (salvo === 'light' || salvo === 'dark') ? salvo : 'sistema';
    } catch (e) {
      return 'sistema';
    }
  }

  function aplicarTema() {
    var escolha = temaEscolhido();
    var escuro = escolha === 'dark' || (escolha === 'sistema' && consultaEscuro.matches);

    document.documentElement.classList.toggle('dark', escuro);

    var icone = document.getElementById('tema-icone');
    var label = document.getElementById('tema-label');
    var botao = document.getElementById('tema-botao');
    var rotulos = { sistema: ['🖥️', 'Sistema'], light: ['☀️', 'Claro'], dark: ['🌙', 'Escuro'] };

    if (icone) icone.textContent = rotulos[escolha][0];
    if (label) label.textContent = rotulos[escolha][1];
    if (botao) {
      botao.setAttribute('title',
        'Tema: ' + rotulos[escolha][1] +
        (escolha === 'sistema' ? ' (seguindo o seu computador)' : '') +
        ' — clique para alternar');
    }
  }

  function iniciarTema() {
    aplicarTema();

    var botao = document.getElementById('tema-botao');
    if (botao) {
      botao.addEventListener('click', function () {
        // Sistema → Claro → Escuro → Sistema
        var proximo = { sistema: 'light', light: 'dark', dark: 'sistema' }[temaEscolhido()];
        try {
          if (proximo === 'sistema') localStorage.removeItem(CHAVE_TEMA);
          else localStorage.setItem(CHAVE_TEMA, proximo);
        } catch (e) { /* modo anônimo: vale só para esta sessão */ }
        aplicarTema();
      });
    }

    // Se o computador trocar de tema com o site aberto, acompanha na hora
    var aoMudar = function () { if (temaEscolhido() === 'sistema') aplicarTema(); };
    if (consultaEscuro.addEventListener) consultaEscuro.addEventListener('change', aoMudar);
    else if (consultaEscuro.addListener) consultaEscuro.addListener(aoMudar);
  }

  /* ---------------- Cabeçalho ---------------- */
  function iniciarCabecalho() {
    var cfg = window.ACERVO.config || {};

    var slotNome = document.querySelector('[data-slot="nome-site"]');
    if (slotNome && cfg.nome) slotNome.textContent = cfg.nome;
    if (cfg.nome) document.title = cfg.nome;

    var slotSub = document.querySelector('[data-slot="subtitulo"]');
    var subs = cfg.subtitulos || [];
    if (slotSub && subs.length) {
      var indice = Math.floor(Math.random() * subs.length);
      slotSub.textContent = subs[indice];
      // Troca o subtítulo de tempos em tempos, só pela piada
      setInterval(function () {
        indice = (indice + 1) % subs.length;
        slotSub.style.opacity = '0';
        setTimeout(function () {
          slotSub.textContent = subs[indice];
          slotSub.style.opacity = '1';
        }, 250);
      }, 9000);
      slotSub.style.transition = 'opacity .25s';
    }

    var slotRodape = document.querySelector('[data-slot="rodape"]');
    if (slotRodape) slotRodape.textContent = cfg.rodape || '';

    var slotContagem = document.querySelector('[data-slot="contagem"]');
    if (slotContagem) {
      var total = (window.ACERVO.frases || []).length +
                  (window.ACERVO.momentos || []).length +
                  (window.ACERVO.galeria || []).length +
                  (window.ACERVO.premios || []).length;
      slotContagem.textContent = u.plural(total, 'registro no acervo', 'registros no acervo');
    }

    // Menu do celular
    var menuBotao = document.getElementById('menu-botao');
    var nav = document.getElementById('nav-principal');
    if (menuBotao && nav) {
      menuBotao.addEventListener('click', function () {
        var aberto = nav.classList.toggle('aberto');
        menuBotao.setAttribute('aria-expanded', String(aberto));
      });
      nav.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'A') {
          nav.classList.remove('aberto');
          menuBotao.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /* ---------------- Roteador ---------------- */
  function rotaAtual() {
    var hash = window.location.hash.replace(/^#/, '') || '/';
    return hash.split('?')[0];
  }

  function renderizar() {
    var rota = rotaAtual();
    var partes = rota.split('/').filter(Boolean); // '/time/joao' -> ['time','joao']
    var html;

    switch (partes[0]) {
      case undefined:      html = views.home(); break;
      case 'frases':       html = views.frases(estado.frases); break;
      case 'galeria':      html = views.galeria(estado.galeria); break;
      case 'momentos':     html = views.momentos(); break;
      case 'hall':         html = views.hall(); break;
      case 'time':         html = partes[1] ? views.perfil(partes[1]) : views.time(); break;
      case 'como-contribuir': html = views.comoContribuir(); break;
      default:             html = views.naoEncontrada();
    }

    app.innerHTML = html;
    app.style.animation = 'none';
    void app.offsetWidth;         // força o navegador a reiniciar a animação
    app.style.animation = '';

    marcarNavegacaoAtiva(partes[0]);
    u.tratarImagens(app);
    ligarEventosDaPagina();
  }

  function marcarNavegacaoAtiva(secao) {
    var links = document.querySelectorAll('.nav a');
    Array.prototype.forEach.call(links, function (a) {
      var rota = a.getAttribute('data-rota');
      var ativo = (!secao && rota === '/') || (secao && rota === '/' + secao);
      if (ativo) { a.setAttribute('aria-current', 'page'); }
      else { a.removeAttribute('aria-current'); }
    });
  }

  function irPara(rota) {
    window.location.hash = rota;
  }

  /* ---------------- Eventos das páginas ---------------- */
  function ligarEventosDaPagina() {
    // Busca de frases
    var buscaFrases = document.getElementById('busca-frases');
    if (buscaFrases) {
      buscaFrases.addEventListener('input', function () {
        estado.frases.busca = this.value;
        var posicao = this.selectionStart;
        renderizar();
        var novo = document.getElementById('busca-frases');
        if (novo) { novo.focus(); novo.setSelectionRange(posicao, posicao); }
      });
    }

    // Filtro por pessoa
    var chips = document.querySelectorAll('[data-filtro-autor]');
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function () {
        var id = this.getAttribute('data-filtro-autor');
        estado.frases.autor = (estado.frases.autor === id) ? '' : id;
        renderizar();
      });
    });

    // Busca da galeria
    var buscaGaleria = document.getElementById('busca-galeria');
    if (buscaGaleria) {
      buscaGaleria.addEventListener('input', function () {
        estado.galeria.busca = this.value;
        var posicao = this.selectionStart;
        renderizar();
        var novo = document.getElementById('busca-galeria');
        if (novo) { novo.focus(); novo.setSelectionRange(posicao, posicao); }
      });
    }

    // Abrir foto no lightbox
    var fotos = document.querySelectorAll('[data-foto]');
    Array.prototype.forEach.call(fotos, function (botao) {
      botao.addEventListener('click', function () {
        abrirLightbox(parseInt(this.getAttribute('data-foto'), 10));
      });
    });

    // Botões "me surpreenda" e "quero outra": ambos trocam a frase em
    // destaque na home, sem recarregar a página.
    function trocarFraseDoDia(rolar) {
      var f = u.aleatorio(window.ACERVO.frases || []);
      var caixa = document.getElementById('frase-dia');
      if (!f || !caixa) return false;

      var p = u.pessoa(f.autor);
      caixa.className = 'frase-dia ' + u.acento(p);   // o destaque segue quem falou
      caixa.innerHTML = '<blockquote>“' + u.esc(f.texto) + '”</blockquote>' +
        '<footer>' + u.avatar(p) + '<strong>' + u.esc(p.nome) + '</strong>' +
        '<span>· ' + u.esc(u.dataLegivel(f.data)) + '</span></footer>';
      u.tratarImagens(caixa);
      if (rolar) caixa.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }

    var sortear = document.querySelector('[data-acao="sortear"]');
    if (sortear) {
      sortear.addEventListener('click', function () {
        u.confete();
        // Sem frase cadastrada não há o que sortear: manda para a seção.
        if (!trocarFraseDoDia(true)) irPara('/frases');
      });
    }

    var outra = document.querySelector('[data-acao="outra-frase"]');
    if (outra) {
      outra.addEventListener('click', function () { trocarFraseDoDia(false); });
    }
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxMidia = document.getElementById('lightbox-midia');
  var lightboxLegenda = document.getElementById('lightbox-legenda');
  var focoAnterior = null;

  function abrirLightbox(indice) {
    var lista = window.ACERVO._galeriaAtual || [];
    var item = lista[indice];
    if (!item) return;

    focoAnterior = document.activeElement;

    // No lightbox o vídeo ganha controles e som — no card ele é só miniatura.
    if (item.src && u.ehVideo(item.src)) {
      lightboxMidia.innerHTML =
        '<video src="' + u.esc(item.src) + '" controls autoplay playsinline ' +
        'aria-label="' + u.esc(item.legenda || 'Vídeo do acervo') + '" data-fallback="🎬"></video>';
    } else if (item.src) {
      lightboxMidia.innerHTML =
        '<img src="' + u.esc(item.src) + '" alt="' + u.esc(item.legenda || '') + '" data-fallback="📷">';
    } else {
      lightboxMidia.innerHTML = '<div class="foto__ausente"><span>📷</span>arquivo ainda não subiu</div>';
    }

    var quem = (item.aparecem || []).map(function (id) { return u.pessoa(id).nome; }).join(', ');
    lightboxLegenda.innerHTML = u.esc(item.legenda || '') +
      '<br><small>' + u.esc(u.dataLegivel(item.data)) +
      (quem ? ' · ' + u.esc(quem) : '') +
      (item.creditos ? ' · registro de ' + u.esc(u.pessoa(item.creditos).nome) : '') + '</small>';

    u.tratarImagens(lightbox);
    lightbox.hidden = false;
    document.getElementById('lightbox-fechar').focus();
  }

  function fecharLightbox() {
    lightbox.hidden = true;
    lightboxMidia.innerHTML = '';
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
  }

  function iniciarLightbox() {
    document.getElementById('lightbox-fechar').addEventListener('click', fecharLightbox);
    lightbox.addEventListener('click', function (ev) {
      if (ev.target === lightbox) fecharLightbox();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !lightbox.hidden) fecharLightbox();
    });
  }

  /* ---------------- Easter egg: modo caos total ---------------- */
  function iniciarKonami() {
    var sequencia = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                     'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var posicao = 0;

    document.addEventListener('keydown', function (ev) {
      var tecla = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
      if (tecla === sequencia[posicao]) {
        posicao++;
        if (posicao === sequencia.length) {
          posicao = 0;
          document.documentElement.classList.toggle('caos-total');
          u.confete(['🤡', '🔥', '💀', '🎺', '🙈']);
        }
      } else {
        posicao = (tecla === sequencia[0]) ? 1 : 0;
      }
    });
  }

  /* ---------------- Início ---------------- */
  function iniciar() {
    iniciarTema();
    iniciarCabecalho();
    iniciarLightbox();
    iniciarKonami();

    window.addEventListener('hashchange', function () {
      renderizar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    renderizar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
