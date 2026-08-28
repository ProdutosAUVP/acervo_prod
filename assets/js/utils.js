/* =========================================================================
   UTILITÁRIOS
   Funções pequenas usadas pelo resto do site. Normalmente você não precisa
   mexer aqui para adicionar conteúdo — para isso, vá na pasta /data.
   ========================================================================= */

window.ACERVO = window.ACERVO || {};

window.ACERVO.utils = (function () {
  'use strict';

  /* --- Segurança: escapa texto antes de jogar no HTML --- */
  function esc(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* --- Datas --- */
  var MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
               'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  function dataLegivel(iso) {
    if (!iso) return 'data desconhecida';
    var partes = String(iso).split('-');
    if (partes.length < 3) return iso;
    var dia = parseInt(partes[2], 10);
    var mes = parseInt(partes[1], 10) - 1;
    if (isNaN(dia) || isNaN(mes) || !MESES[mes]) return iso;
    return dia + ' de ' + MESES[mes] + ' de ' + partes[0];
  }

  function ordenarPorData(lista) {
    return lista.slice().sort(function (a, b) {
      return String(b.data || '').localeCompare(String(a.data || ''));
    });
  }

  /* --- Pessoas --- */
  function pessoa(id) {
    var time = window.ACERVO.time || [];
    for (var i = 0; i < time.length; i++) {
      if (time[i].id === id) return time[i];
    }
    // Pessoa citada em algum conteúdo mas que não está em data/time.js
    return { id: id, nome: id || 'Anônimo', cargo: '', bio: '', cor: 'roxo', emoji: '👤', foto: '' };
  }

  function avatar(p, grande) {
    var classe = 'avatar' + (grande ? ' avatar--grande' : '');
    if (p.foto) {
      return '<span class="' + classe + '">' +
             '<img src="' + esc(p.foto) + '" alt="Foto de ' + esc(p.nome) + '" ' +
             'data-fallback="' + esc(p.emoji || '👤') + '">' +
             '</span>';
    }
    return '<span class="' + classe + '" aria-hidden="true">' + esc(p.emoji || '👤') + '</span>';
  }

  function linkPessoa(id) {
    var p = pessoa(id);
    return '<a class="selo cor-' + esc(p.cor || 'roxo') + '" href="#/time/' + esc(p.id) + '">' +
           esc(p.emoji || '👤') + ' ' + esc(p.nome) + '</a>';
  }

  /* --- Diversos --- */
  function pimenta(nota) {
    var n = Math.max(0, Math.min(5, parseInt(nota, 10) || 0));
    return new Array(n + 1).join('🌶️');
  }

  function plural(n, singular, pluralForma) {
    return n + ' ' + (n === 1 ? singular : pluralForma);
  }

  // Escolhe um item de forma estável para o dia de hoje: todo mundo do time
  // vê a mesma "frase do dia" no mesmo dia.
  function doDia(lista) {
    if (!lista.length) return null;
    var hoje = new Date();
    var semente = hoje.getFullYear() * 372 + hoje.getMonth() * 31 + hoje.getDate();
    return lista[semente % lista.length];
  }

  function aleatorio(lista) {
    if (!lista.length) return null;
    return lista[Math.floor(Math.random() * lista.length)];
  }

  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  /* --- Estado vazio padrão --- */
  function vazio(mensagem, dica) {
    return '<div class="vazio">' +
           '<strong>' + esc(mensagem || (window.ACERVO.config || {}).vazio || 'Nada aqui ainda.') + '</strong>' +
           (dica ? '<p>' + esc(dica) + '</p>' : '') +
           '</div>';
  }

  /* --- Confete (usado nos botões cômicos) --- */
  function confete(emojis) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var lista = emojis || ['🎉', '🎊', '✨', '🏆', '😂', '🔥'];
    for (var i = 0; i < 22; i++) {
      (function (indice) {
        var el = document.createElement('span');
        el.className = 'confete';
        el.textContent = lista[Math.floor(Math.random() * lista.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
        el.style.animationDelay = (indice * 0.03) + 's';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 3600);
      })(i);
    }
  }

  /* --- Troca imagens quebradas por um placeholder simpático --- */
  function tratarImagens(raiz) {
    var imgs = (raiz || document).querySelectorAll('img[data-fallback]');
    Array.prototype.forEach.call(imgs, function (img) {
      img.addEventListener('error', function () {
        var pai = img.parentNode;
        if (!pai) return;
        var emoji = img.getAttribute('data-fallback') || '📷';
        if (pai.classList.contains('avatar')) {
          pai.textContent = emoji;
        } else {
          pai.innerHTML = '<div class="foto__ausente"><span>' + esc(emoji) + '</span>' +
                          'imagem ainda não subiu<br><code>' + esc(img.getAttribute('src') || '') + '</code></div>';
        }
      });
    });
  }

  return {
    esc: esc,
    dataLegivel: dataLegivel,
    ordenarPorData: ordenarPorData,
    pessoa: pessoa,
    avatar: avatar,
    linkPessoa: linkPessoa,
    pimenta: pimenta,
    plural: plural,
    doDia: doDia,
    aleatorio: aleatorio,
    normalizar: normalizar,
    vazio: vazio,
    confete: confete,
    tratarImagens: tratarImagens
  };
})();
