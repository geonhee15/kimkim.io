// card hover spotlight
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// nav shadow on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  else nav.style.boxShadow = 'none';
});

// reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.card, .section-header, .about-grid, .contact-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.2,.7,.3,1)';
  io.observe(el);
});

// filter: 체험 가능한 것들만 보기
const filterBtn = document.querySelector('.filter-toggle');
const worksGrid = document.querySelector('.grid');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// FLIP-based reorder animation for cards (works everywhere, View Transitions or not)
function animateCardsFLIP(applyChange) {
  const cards = [...worksGrid.querySelectorAll('.card')];
  // FIRST: measure
  const firstRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
  // CHANGE: toggle the class
  applyChange();
  // LAST: measure after layout
  const lastRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
  // INVERT + PLAY
  cards.forEach((c, idx) => {
    const f = firstRects.get(c);
    const l = lastRects.get(c);
    const dx = f.left - l.left;
    const dy = f.top - l.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    // staggered delay for playable cards rising — non-playable move with no delay
    const isPlayable = c.dataset.playable === 'true';
    const playableIdx = isPlayable
      ? cards.filter(x => x.dataset.playable === 'true').indexOf(c)
      : -1;
    const delay = playableIdx >= 0 ? playableIdx * 50 : 0;
    c.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: 'translate(0, 0)' },
      ],
      {
        duration: 650,
        easing: 'cubic-bezier(.2,.7,.3,1)',
        delay,
        fill: 'both',
      }
    );
  });
}

if (filterBtn && worksGrid) {
  filterBtn.addEventListener('click', () => {
    const pressed = filterBtn.getAttribute('aria-pressed') === 'true';
    const next = !pressed;
    filterBtn.setAttribute('aria-pressed', String(next));
    const apply = () => worksGrid.classList.toggle('filter-playable', next);
    if (prefersReducedMotion) { apply(); return; }
    animateCardsFLIP(apply);
  });
}

// ===== i18n =====
const I18N = {
  ko: {
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.eyebrow': '지금도 뭔가 만들고 있는 중',
    'hero.title1': '뭐든지 만든다.',
    'hero.title2': '킴킴아이오.',
    'hero.sub': 'AI 에이전트부터 스마트 글래스, 데스크탑 앱, 게임까지 —<br />머릿속에 떠오른 건 일단 만들어보는 김건희의 작업실.',
    'hero.cta1': '작업 보러가기',
    'hero.cta2': '같이 만들기',
    'hero.stat1': 'Projects',
    'hero.stat2': '아이디어',
    'hero.stat3': '사람',
    'works.title': '만든 것들',
    'works.sub': '머리에 떠오를 때마다 하나씩.',
    'works.filter': '체험 가능한 것들만 보기',
    'works.moreSoon': '또 만들 거임',
    'card.echo': 'Halo 스마트 글래스에 올라가는 AI 에이전트. 시야에 들어오는 모든 걸 이해하는 동반자.',
    'card.easymac': '맥 사용을 더 쉽게. 밝기, 입력 컨트롤부터 시선 추적까지 한곳에서.',
    'card.kimsrhythm': '손가락이 춤추게 만드는 리듬 게임. 김씨 스타일로.',
    'card.spellaword': '영단어 타이핑 게임. 손가락 빠른 사람 유리.',
    'card.handy': '웹캠으로 손을 추적해서 그림 그리고, 퐁 치고, 피아노까지 친다.',
    'card.geonspace': '건희만의 공간. 깃허브 스타일로 꾸민 개인 프로필 페이지.',
    'card.dockfolders': '맥 독을 폴더처럼 정리. 자주 쓰는 앱들을 카테고리별로 묶어 한 칸에 깔끔하게.',
    'card.connecthalast': '끝말잇기 게임. 단어 끊기면 패배.',
    'card.worldsimul': '파이썬으로 짠 복셀 월드 시뮬레이터. 청크 단위로 쌓이는 세계, OpenGL로 직접 굴린다.',
    'card.tryonme': '사진 한 장 올리고 실제 브랜드 제품을 골라 그대로 입어보는 가상 피팅. 프롬프트 말고 카탈로그.',
    'card.kimnews': '매일 오전 9시, RSS와 유튜브 22곳에서 AI·테크·개발 뉴스를 모아주는 일간지.',
    'card.orion': '맥에서 돌아가는 데스크탑 AI 어시스턴트. 음성으로 부르면 뭐든 해주는 친구.',
    'card.evilpassword': '비밀번호 만드는 게 이렇게 힘든 일이었나. 규칙이 점점 미쳐간다.',
    'card.geonsrng': '크롬 확장으로 만든 RNG 게임. 운빨 한판 어때요.',
    'card.youtube': '만드는 과정 그대로 카메라에. 김건희의 작업실 라이브.',
    'about.title': '한 명이 다 만든다.',
    'about.p1': '김건희. 학생이자, 만드는 사람이자, 가끔 영상도 찍는 사람. 머리에 아이디어가 떠오르면 일단 코드부터 친다. 안되면 다시 친다. 될 때까지.',
    'about.p2': 'AI 에이전트, 스마트 글래스, 데스크탑 앱, 게임, ROM 해킹 — 뭐가 됐든 "이거 만들 수 있을까?"가 시작점. 결과물은 보통 두 부류: <em>잘 동작하는 것</em>, 그리고 <em>다음에 잘 만들기 위한 것</em>.',
    'about.p3': '진심으로 좋아서 만든다. 그래서 멈추지 않는다.',
    'contact.title': '같이 뭔가<br /><span class="gradient">만들고 싶다면.</span>',
    'contact.sub': '아이디어, 협업, 그냥 인사 — 다 좋습니다.',
    'contact.mailPlaceholder': '이메일은 잠시 후 공개',
    'footer.tag': 'Built with curiosity · since whenever',
    'footer.copy': '© 2026 Kim Geonhee. 뭐든지 만들고 있음.',
  },
  en: {
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.eyebrow': 'Building something right now',
    'hero.title1': 'Build anything.',
    'hero.title2': 'Kimkim.io.',
    'hero.sub': 'From AI agents to smart glasses, desktop apps and games —<br />Kim Geonhee\'s workshop where every idea gets built.',
    'hero.cta1': 'See works',
    'hero.cta2': 'Build together',
    'hero.stat1': 'Projects',
    'hero.stat2': 'Ideas',
    'hero.stat3': 'Person',
    'works.title': 'Built',
    'works.sub': 'One at a time, as they come to mind.',
    'works.filter': 'Show only playable ones',
    'works.moreSoon': 'More coming',
    'card.echo': 'An AI agent that lives on Halo smart glasses. A companion that understands everything in your view.',
    'card.easymac': 'Making Mac easier — brightness, input controls, and eye tracking all in one place.',
    'card.kimsrhythm': 'A rhythm game that makes your fingers dance. Kim-style.',
    'card.spellaword': 'An English vocab typing game. Fast fingers win.',
    'card.handy': 'Track your hand with a webcam to draw, play pong, and even play piano.',
    'card.geonspace': 'Geonhee\'s little corner — a personal profile page in GitHub style.',
    'card.dockfolders': 'Organize your Mac dock like folders. Group frequently used apps into one slot for a cleaner dock.',
    'card.connecthalast': 'Korean word-chain game. Break the chain and you lose.',
    'card.worldsimul': 'A voxel world simulator written in Python. Chunked worlds, rendered straight in OpenGL.',
    'card.tryonme': 'Upload one photo and try on real brand products as-is. Catalog, not prompts.',
    'card.kimnews': 'A daily that gathers AI, tech, and dev news from 22 RSS feeds and YouTube channels — every 9 AM KST.',
    'card.orion': 'A desktop AI assistant on Mac. Call its name and it does whatever you ask.',
    'card.evilpassword': 'Who knew making a password could be this hard. The rules slowly lose their mind.',
    'card.geonsrng': 'An RNG game built as a Chrome extension. Wanna roll the dice?',
    'card.youtube': 'The whole build process, straight to camera. Kim Geonhee\'s workshop live.',
    'about.title': 'One person builds it all.',
    'about.p1': 'Kim Geonhee. Student, builder, occasional filmmaker. When an idea hits, I start coding. If it doesn\'t work, I code again. Until it does.',
    'about.p2': 'AI agents, smart glasses, desktop apps, games, ROM hacks — whatever it is, the starting point is always "could I build this?" The results land in two buckets: <em>things that work</em>, and <em>things that teach me how to build the next one better</em>.',
    'about.p3': 'I build because I genuinely love it. That\'s why I don\'t stop.',
    'contact.title': 'Want to build<br /><span class="gradient">something together?</span>',
    'contact.sub': 'Ideas, collabs, or just a hi — all welcome.',
    'contact.mailPlaceholder': 'Email coming soon',
    'footer.tag': 'Built with curiosity · since whenever',
    'footer.copy': '© 2026 Kim Geonhee. Always building.',
  },
  ja: {
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'hero.eyebrow': '今、何かを作っている最中',
    'hero.title1': 'なんでも作る。',
    'hero.title2': 'キムキム アイオー。',
    'hero.sub': 'AIエージェントからスマートグラス、デスクトップアプリ、ゲームまで —<br />思いついたらまず作ってみるキム・ゴニの作業室。',
    'hero.cta1': '作品を見る',
    'hero.cta2': '一緒に作る',
    'hero.stat1': 'Projects',
    'hero.stat2': 'アイデア',
    'hero.stat3': '人',
    'works.title': '作ったもの',
    'works.sub': '頭に浮かぶたびに一つずつ。',
    'works.filter': '体験できるものだけ表示',
    'works.moreSoon': 'まだまだ作る',
    'card.echo': 'Haloスマートグラスに載るAIエージェント。視界に入るすべてを理解する相棒。',
    'card.easymac': 'Macをもっと簡単に。明るさ、入力コントロールから視線追跡まで一箇所で。',
    'card.kimsrhythm': '指が踊り出すリズムゲーム。キム流で。',
    'card.spellaword': '英単語タイピングゲーム。指が速い人が有利。',
    'card.handy': 'ウェブカメラで手を追跡。絵を描いたり、ポンしたり、ピアノまで弾く。',
    'card.geonspace': 'ゴニだけの空間。GitHubスタイルの個人プロフィールページ。',
    'card.dockfolders': 'Macのドックをフォルダ感覚で整理。よく使うアプリをカテゴリ別にまとめて一枠にすっきり。',
    'card.connecthalast': 'しりとりゲーム。単語が止まったら負け。',
    'card.worldsimul': 'Pythonで書いたボクセル世界シミュレーター。チャンク単位で広がる世界をOpenGLで直接動かす。',
    'card.tryonme': '写真を一枚アップして、実在ブランドの商品をそのまま試着。プロンプトじゃなくてカタログ。',
    'card.kimnews': '毎朝9時(KST)、RSSとYouTubeの22ソースからAI・テック・開発ニュースを集める日刊紙。',
    'card.orion': 'Macで動くデスクトップAIアシスタント。声をかければ何でもやってくれる相棒。',
    'card.evilpassword': 'パスワードを作るのがこんなに大変だったとは。ルールがだんだん狂っていく。',
    'card.geonsrng': 'Chrome拡張で作ったRNGゲーム。運試し、一勝負どう?',
    'card.youtube': '作る過程をそのままカメラに。キム・ゴニの作業室ライブ。',
    'about.title': '一人で全部作る。',
    'about.p1': 'キム・ゴニ。学生で、作り手で、たまに動画も撮る人。アイデアが浮かんだら、まずコードを書く。動かなかったらまた書く。動くまで。',
    'about.p2': 'AIエージェント、スマートグラス、デスクトップアプリ、ゲーム、ROMハック — 何であれ「これ作れるかな?」が始まり。結果はだいたい二種類: <em>ちゃんと動くもの</em>、そして<em>次に上手く作るための糧</em>。',
    'about.p3': '本気で好きだから作る。だから止まらない。',
    'contact.title': '一緒に何か<br /><span class="gradient">作りたいなら。</span>',
    'contact.sub': 'アイデア、コラボ、ただの挨拶 — 何でも歓迎です。',
    'contact.mailPlaceholder': 'メールは近日公開',
    'footer.tag': 'Built with curiosity · since whenever',
    'footer.copy': '© 2026 Kim Geonhee. いつも何かを作ってます。',
  },
};

const LANG_LABELS = { en: 'EN', ko: 'KO', ja: 'JA' };
const STORAGE_KEY = 'kimkim-lang';

function applyLang(lang) {
  if (!I18N[lang]) lang = 'ko';
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  // update switcher label
  const cur = document.querySelector('.lang-current');
  if (cur) cur.textContent = LANG_LABELS[lang] || lang.toUpperCase();
  // mark current option
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.setAttribute('aria-current', String(opt.dataset.lang === lang));
  });
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
}

const langSwitcher = document.querySelector('.lang-switcher');
const langBtn = document.querySelector('.lang-btn');
const langMenu = document.querySelector('.lang-menu');
if (langSwitcher && langBtn && langMenu) {
  // initial state — saved lang or fall back to ko
  let savedLang = null;
  try { savedLang = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyLang(savedLang && I18N[savedLang] ? savedLang : 'ko');
  // ensure menu becomes visible via opacity transition (remove the hidden attribute)
  langMenu.removeAttribute('hidden');

  const closeMenu = () => {
    langSwitcher.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    langSwitcher.classList.add('open');
    langBtn.setAttribute('aria-expanded', 'true');
  };

  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (langSwitcher.classList.contains('open')) closeMenu();
    else openMenu();
  });

  langMenu.addEventListener('click', e => {
    const opt = e.target.closest('.lang-option');
    if (!opt) return;
    applyLang(opt.dataset.lang);
    closeMenu();
  });

  document.addEventListener('click', e => {
    if (!langSwitcher.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}
