'use strict';
(() => {
  const HASH = '88dfced00f06fbfda9508a1d57d3380418209cede84b51d58afaa6eaf1f1ae4b';
  const KEY = 'tradingdeskpro-marketing-language';
  const strings = [...document.querySelectorAll('[data-en]')];
  const images = [...document.querySelectorAll('[data-alt-en]')];
  strings.forEach(node => { node.dataset.ko = node.innerHTML; });
  images.forEach(node => { node.dataset.altKo = node.alt; });
  let lang = 'ko';
  let currentLayout = 5;
  let toastTimer;
  const layouts = {
    2: {ko: ['두 개의 시선, 하나의 흐름', '같은 크기의 두 차트로 종목과 시간 주기를 비교하세요. Free에서 사용할 수 있습니다.'], en: ['Two perspectives, one flow', 'Compare instruments and timeframes in two equal panes. Available on Free.']},
    3: {ko: ['분석의 중심을 더 선명하게', '큰 메인 차트와 두 개의 비교 차트. 핵심 분석을 중심에 두세요.'], en: ['Keep the main idea in focus', 'A large primary chart with two comparisons. Keep your main analysis at the center.']},
    4: {ko: ['네 개의 차트, 균형 잡힌 시야', '2 × 2 구성으로 네 개의 관점을 비교하세요. 각각의 종목과 시간 주기는 독립적입니다.'], en: ['Four charts, a balanced view', 'Compare four perspectives in a 2 × 2 grid, each with an independent instrument and timeframe.']},
    5: {ko: ['하나의 중심, 네 개의 관점', '큰 메인 차트 옆에 4개의 비교 차트. 넓은 화면을 더 풍부하게 활용하세요.'], en: ['One focus, four perspectives', 'Four comparison charts beside a large main chart. Make more of a wider display.']}
  };

  function updateLayout(count) {
    currentLayout = count;
    const image = document.getElementById('workspace-image');
    image.src = `assets/workspace-${count}.png`;
    image.alt = lang === 'ko' ? `실제 TradingDeskPro 앱의 ${count}개 차트 구성 — 모의 시세, 주문 비활성` : `${count}-chart layout in the actual TradingDeskPro app — simulated data, orders disabled`;
    document.getElementById('layout-count').textContent = String(count).padStart(2, '0');
    document.getElementById('layout-title').textContent = layouts[count][lang][0];
    document.getElementById('layout-description').textContent = layouts[count][lang][1];
    document.querySelectorAll('[data-layout]').forEach(button => {
      const active = Number(button.dataset.layout) === count;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function setLanguage(next, persist = true) {
    lang = next;
    document.documentElement.lang = lang;
    strings.forEach(node => { node.innerHTML = node.dataset[lang]; });
    images.forEach(node => { node.alt = lang === 'ko' ? node.dataset.altKo : node.dataset.altEn; });
    const button = document.getElementById('language-switch');
    button.innerHTML = `${lang === 'ko' ? 'EN' : '한국어'} <span aria-hidden="true">↗</span>`;
    button.setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 전환');
    document.getElementById('menu-toggle').setAttribute('aria-label', lang === 'ko' ? '메뉴 열기' : 'Open navigation');
    document.title = lang === 'ko' ? 'TradingDeskPro — 더 넓게 보고, 더 명확하게.' : 'TradingDeskPro — A wider view. A clearer perspective.';
    document.querySelector('meta[name="description"]').content = lang === 'ko' ? '차트 분석부터 모의 거래와 거래 기록까지. TradingDeskPro 1.8.2 — Free 2개, PLUS 4개, Max 5개 차트와 50개 언어를 지원하는 Windows 트레이딩 워크스페이스.' : 'From analysis to paper trading and review. TradingDeskPro 1.8.2 for Windows — 2 charts on Free, 4 on PLUS, 5 on Max, and 50 interface languages.';
    document.querySelectorAll('[data-checkout-plan]').forEach(link => { const url = new URL(link.href); url.searchParams.set('lang', lang); link.href = url.href; });
    updateLayout(currentLayout);
    if (persist) { try { localStorage.setItem(KEY, lang); } catch {} }
  }

  try { const saved = localStorage.getItem(KEY); if (saved === 'en' || saved === 'ko') lang = saved; } catch {}
  setLanguage(lang, false);
  document.getElementById('language-switch').addEventListener('click', () => setLanguage(lang === 'ko' ? 'en' : 'ko'));
  document.querySelectorAll('[data-layout]').forEach(button => button.addEventListener('click', () => updateLayout(Number(button.dataset.layout))));

  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); nav.hidden = true; }
  menuButton.addEventListener('click', () => {
    const opened = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!opened));
    nav.hidden = opened;
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  function toast(message) {
    clearTimeout(toastTimer);
    const element = document.getElementById('toast');
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => { element.hidden = true; }, 4000);
  }
  document.getElementById('copy-checksum').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(HASH);
      toast(lang === 'ko' ? '일반판 SHA-256을 복사했습니다.' : 'Standard SHA-256 copied.');
    } catch {
      const dialog = document.getElementById('checksum-dialog');
      dialog.showModal();
      const value = document.getElementById('checksum-value');
      value.focus();
      value.select();
    }
  });
})();
