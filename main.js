// ===== partial include (fetch nav/footer from /partials/, then run main) =====
(async () => {

async function setupPartials() {
  const placeholders = [...document.querySelectorAll('[data-partial]')];
  await Promise.all(placeholders.map(async (el) => {
    const url = el.dataset.partial;
    try {
      const r = await fetch(url, { cache: 'no-cache' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      el.innerHTML = await r.text();
      el.classList.remove('nav-placeholder', 'footer-placeholder');
    } catch (e) {
      console.warn('[partial] failed to load', url, e.message);
    }
  }));
}

await setupPartials();

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

document.querySelectorAll('.card, .major-card, .impact-card, .beyond-card, .deep-section, .section-header, .about-grid, .contact-title').forEach(el => {
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
    // Impact metrics
    'impact.eyebrow': 'BY THE NUMBERS',
    'impact.title': '숫자로 보면.',
    'impact.youtube.label': 'YouTube 구독자',
    'impact.youtube.meta': 'Minecraft 채널 · since 2019',
    'impact.projects.label': '출시한 프로젝트',
    'impact.projects.meta': '5+ 년의 빌드 기록',
    'impact.vulns.label': '발견한 취약점',
    'impact.vulns.meta': '친구 사이트 풀 보안 감사',
    'impact.cube.label': 'KCA 공식 입상',
    'impact.cube.meta': '3×3 · 2×2 큐브',
    'impact.years.label': '스스로 만든 시간',
    'impact.years.meta': '아이디어 → 코드 → 출시',
    // Major projects section
    'major.eyebrow': 'MAJOR PROJECTS',
    'major.title': '깊게 파고 있는 네 가지.',
    'major.sub': '각 프로젝트는 별도 페이지에서 자세히.',
    'major.deepdive': 'Deep dive',
    'major.echo.tagline': 'Every Chairman Has One — JARVIS를 진짜로 만드는 중.',
    'major.echo.desc': 'Brilliant Labs Halo AR 안경에서 돌아가는 AI 에이전트. 시야 안에서 동작하는 다음 컴퓨팅 인터페이스.',
    'major.orion.tagline': 'V1 → C2+ 아홉 번의 iteration.',
    'major.orion.desc': '맥에서 돌아가는 멀티모달 데스크탑 AI. 음성·제스처·얼굴 인식 + 캘린더·웹 자동화 통합.',
    'major.cyber.tagline': '15 vulnerabilities · 28-page bilingual report · responsible disclosure.',
    'major.cyber.desc': '학교 친구 사이트 풀 감사 + OWASP / TryHackMe 훈련 + educational botnet simulator.',
    'major.hardware.tagline': 'Iron Man 리펄서, 계산기 속 라즈베리파이, 초음파 레이더, 로봇 강아지.',
    'major.hardware.desc': 'Arduino · Raspberry Pi · 3D 모델링까지. 머릿속 아이디어를 손으로 만드는 작업장.',
    // Experiments header
    'experiments.eyebrow': 'EXPERIMENTS & GAMES',
    'experiments.title': '재미로 만든 것들.',
    'experiments.sub': '주말 빌드, 작은 도구, 게임.',
    // Content & Beyond
    'beyond.eyebrow': 'CONTENT & BEYOND',
    'beyond.title': '코드 바깥의 작업.',
    'beyond.sub': '카메라, 음악, 그리고 큐브.',
    'beyond.youtube.title': 'YouTube · 원소15 ↗',
    'beyond.youtube.tagline': '마인크래프트 콘텐츠 채널. 300K+ 구독자, 2019년부터 운영.',
    'beyond.youtube.desc': '콘텐츠 제작뿐 아니라 협찬 협상, 콜라보 섭외, 광고 캠페인 운영까지 직접.',
    'beyond.music.title': 'Music Production',
    'beyond.music.tagline': 'FL Studio로 만든 Brazilian phonk + 일렉트로닉.',
    'beyond.music.desc': '자작 비트를 위한 자작 트랙. 사운드 디자인부터 믹스까지 직접.',
    'beyond.cube.title': 'Speedcubing',
    'beyond.cube.tagline': 'Korea Cube Association 공식 입상.',
    'beyond.cube.desc': '3×3, 2×2 종목. 손가락 빠르고 머리 빠르면 OK.',
    'cube.modal.caption': 'KOREA CUBE ASSOCIATION · 14TH JJANGSAEM',
    'cube.modal.title': '공인 대회 우승',
    'cube.tab.3x3': '3×3 · 1st',
    'cube.tab.2x2': '2×2 · 1st',
    'card.echo': 'Halo 스마트 글래스에 올라가는 AI 에이전트. 시야에 들어오는 모든 걸 이해하는 동반자.',
    'card.easymac': '맥 사용을 더 쉽게. 밝기, 입력 컨트롤부터 시선 추적까지 한곳에서.',
    'card.kimsrhythm': '손가락이 춤추게 만드는 리듬 게임. 김씨 스타일로.',
    'card.spellaword': '영단어 타이핑 게임. 손가락 빠른 사람 유리.',
    'card.handy': '웹캠으로 손을 추적해서 그림 그리고, 퐁 치고, 피아노까지 친다.',
    'card.geonspace': '건희만의 공간. 깃허브 스타일로 꾸민 개인 프로필 페이지. 지금은 kimkim.io로 대체됨.',
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
    'about.ambition': '지금은 학생이지만 진짜 회사로 만들고 싶은 게 있다. AI 에이전트, AR 글래스, 그리고 그 사이의 컴퓨팅 인터페이스. 다음 단계는 더 <em>큰 lab</em>, 더 <em>깊은 research</em>, 그리고 더 <em>무거운 빌드</em>.',
    'about.builderOperator': '회사를 만들려면 두 가지가 필요하다고 본다. <em>만드는 능력</em>과 <em>운영하는 능력</em>. 빌더 쪽은 Orion, ECHO, 그리고 하드웨어 lab에서 훈련 중이고, 운영 쪽은 2019년부터 운영해온 30만 마인크래프트 채널에서 — 협찬 협상, 타 크리에이터 콜라보 섭외, MCN 협상, 광고 캠페인 운영을 직접 하면서 배웠다.',
    'about.stats.label.since': 'BUILDER WORK',
    'about.stats.value.since': 'Orion since 2026, ECHO incoming',
    'about.stats.label.operator': 'OPERATOR WORK',
    'about.stats.value.operator': 'YouTube channel since 2019 · 300K+',
    'about.stats.label.based': 'BASED IN',
    'about.stats.value.based': 'Incheon, KR',
    'about.stats.label.currently': 'CURRENTLY',
    'about.stats.value.currently': 'Chadwick International · MYP',
    'about.stats.label.next': 'NEXT',
    'about.stats.value.next': 'ECHO hardware arrival',
    'contact.title': '같이 뭔가<br /><span class="gradient">만들고 싶다면.</span>',
    'contact.sub': '아이디어, 협업, 그냥 인사 — 다 좋습니다.',
    'contact.mailPlaceholder': '이메일은 잠시 후 공개',
    'footer.tag': 'Built with curiosity · since whenever',
    'footer.copy': '© 2026 Kim Geonhee. 뭐든지 만들고 있음.',
    // deep-dive shared
    'deep.back': '홈으로',
    // ECHO page
    'echo.caption': 'MAJOR PROJECT · IN DEVELOPMENT · HARDWARE INCOMING',
    'echo.subtitle': 'Every Chairman Has One. AR 글래스 위의 EDITH 스타일 AI 동반자.',
    'echo.overview': 'Brilliant Labs Halo AR 글래스를 위한 EDITH 스타일 AI 에이전트. 시야 안의 사람과 환경을 이해하고, 음성으로 대화하며, 필요한 정보를 HUD에 띄워주는 컴퓨팅 인터페이스의 다음 형태. 안경 도착 대기 중이며 noa-playground 시뮬레이터로 SDK 개발 진행.',
    'echo.why': '기존 음성 어시스턴트는 시야 맥락을 모른다. EDITH가 피터 파커한테 준 그 경험 — 시야 안에서 정보가 뜨고 음성으로 명령하는 — 이 다음 컴퓨팅 인터페이스라고 본다. Orion이 JARVIS 같은 데스크탑 prototype이었다면 ECHO는 wearable, 즉 EDITH로의 진화.',
    'echo.feature1': 'Halo HUD에 컨텍스트 정보 표시',
    'echo.feature2': 'Halo 카메라로 시야 객체 인식 → Claude Vision 연계',
    'echo.feature3': 'Halo 본 컨덕션 스피커로 음성 응답',
    'echo.feature4': 'Orion 백엔드 재활용 (이미 검증된 코드)',
    'echo.timeline1': 'IPD 측정 (셀프 55.3 → 검안 64mm, Halo 호환 범위 58-72mm 안)',
    'echo.timeline2': 'Halo $349 주문 완료, 배송 대기',
    'echo.timeline3': 'noa-playground 시뮬레이터로 SDK 학습 시작',
    'echo.timeline4': 'Orion 코드 리팩토링 (입출력 레이어 분리해서 글래스 어댑터 끼우기 쉽게)',
    'echo.next1': 'Halo 박싱·첫 부팅 시퀀스 영상화',
    'echo.next2': 'Halo SDK Python/Flutter/Lua 중 결정',
    'echo.next3': 'HUD 레이아웃 설계 (IPD 64mm 기준)',
    'echo.next4': '글래스 ↔ 데스크탑 Orion cross-device handoff',
    // ECHO hero grid
    'echo.hero.cell1.alt': 'Brilliant Labs Halo AR 글래스',
    'echo.hero.cell2.alt': 'Fly.io에 ECHO 배포 중',
    'echo.hero.cell2.caption': 'ECHO → Fly.io',
    'echo.hero.placeholder': 'IMAGE COMING SOON',
    // ORION page
    'orion.caption': 'MAJOR PROJECT · 11 VERSIONS · V1 → O1',
    'orion.subtitle': '맥에서 돌아가는 JARVIS 스타일 데스크탑 AI 비서. 11번 다시 짰다.',
    'orion.overview': 'JARVIS 스타일 데스크탑 AI 비서. macOS 네이티브로 돌아가며 240×240 HUD를 별도 PyQt6 클라이언트로 띄운다 (HUD 자체의 시안/초록 비주얼은 EDITH 레퍼런스). \'Hey Orion\'으로 깨우고, Claude API로 대화하고, 캘린더/음악/배달 자동화/Chrome 작업 자동화까지 처리. 마지막 메이저 리라이트 O1(2026-02-18)에서 HUD, WebSocket, Self-Development Engine, Work Assistant 통합.',
    'orion.why': '내가 매일 쓰는 컴퓨터부터 JARVIS화하고 싶었다. 글래스(ECHO, EDITH 계열)로 가기 전 데스크탑에서 한 번 끝까지 풀어보는 사전 단계. Orion에서 검증한 패턴이 그대로 ECHO 백엔드로 이어진다.',
    'orion.feature1': 'Voice Assistant — "Hey Orion" 웨이크 워드',
    'orion.feature2': '240×240 HUD — 시안/초록 디스플레이 (EDITH 비주얼 레퍼런스, 시간/날씨/캘린더/AI 응답 표시)',
    'orion.feature3': 'Calendar Integration — macOS Calendar.app 연동, 일정 조회/요약',
    'orion.feature4': 'Music Player — 음성으로 음악 재생/정지/볼륨 조절',
    'orion.feature5': 'Delivery Automation — 음성으로 LotteEatz 배달 주문',
    'orion.feature6': 'Self-Development Engine — idle 시 자동 코드 개선, 적용 전 2중 확인',
    'orion.feature7': 'Work Assistant — Chrome에서 `hhheeelllppp` 입력 시 페이지 분석 & 자동 입력 (수학 풀이, 에세이 작성, 폼 채우기)',
    'orion.feature8': 'Schedule Reminder — 매일 오전 8시 브리핑 + 이벤트 15분 전 알림',
    'orion.feature9': 'Hallucination Filter — Whisper STT 환청 다단계 필터링',
    'orion.tl.v1': 'Core: Claude API, Tavily, Notifications',
    'orion.tl.v2': 'Screen capture analysis',
    'orion.tl.v3': 'Camera input analysis',
    'orion.tl.v4': 'ElevenLabs TTS',
    'orion.tl.v5': 'Gesture control',
    'orion.tl.v6': 'Music player',
    'orion.tl.c1': 'Assistant identity',
    'orion.tl.c2': 'Voice recognition',
    'orion.tl.c3': 'Calendar integration',
    'orion.tl.c4': 'Delivery automation',
    'orion.tl.o1': 'Full rewrite: HUD, WebSocket, Self-Dev, Work Assistant',
    'orion.next1': 'ECHO와 통합 (데스크탑 ↔ 글래스 cross-device handoff)',
    'orion.next2': '로컬 LLM fallback 옵션',
    // CYBERSECURITY page
    'cyber.caption': 'MAJOR PROJECT · SECURITY RESEARCH',
    'cyber.subtitle': '취약점을 찾고, 책임 있게 알린다.',
    'cyber.overview': '보안은 시스템을 빌더의 관점이 아니라 공격자의 관점에서 보는 일. 실제 배포된 시스템을 감사하고, 발견한 취약점을 책임 있게 disclosure 하는 end-to-end 과정을 통해 배운다. 학교 동료의 사이트 cisixers.org에 대한 28페이지 한영 bilingual 보안 감사 보고서를 작성, HackerOne/Bugcrowd 포맷으로 정리해 직접 disclosure.',
    'cyber.why': '내가 만든 것이 깨지지 않으려면 깨는 법을 알아야 한다. 그리고 보안은 \'잘 모르고 만든 사람\'을 비난하는 게 아니라 같이 고치는 일이라는 걸 disclosure 과정에서 배웠다.',
    'cyber.disclosure.target.label': '대상',
    'cyber.disclosure.target.value': '학교 동료의 배포 사이트 (cisixers.org)',
    'cyber.disclosure.findings.label': '발견 사항',
    'cyber.disclosure.findings.value': '15개 (Critical 3 · High 3 · Medium 4 · Low 4 · Info 1)',
    'cyber.disclosure.report.label': '보고서',
    'cyber.disclosure.report.value': '28페이지 EN/KR bilingual, CVSS 3.1 + CWE tags, HackerOne 포맷',
    'cyber.disclosure.handoff.label': 'Disclosure',
    'cyber.disclosure.handoff.value': '비공개 채널로 사이트 소유자에게 먼저 전달, 72시간 책임 공개 방침',
    'cyber.finding1': 'Google OAuth Client Secret이 .env를 통해 public 레포지토리에 커밋',
    'cyber.finding2': 'Firestore & Storage Rules (test mode → deny-by-default 권고)',
    'cyber.finding3': 'Google OAuth `hd` 파라미터 누락 (도메인 제한 없음)',
    'cyber.finding4': 'localStorage에 사용자 신원 중복 저장',
    'cyber.finding5': '`.DS_Store` git 커밋',
    'cyber.train1': 'OWASP Juice Shop — DOM XSS, JWT None Attack, IDOR (basket access)',
    'cyber.train2': 'TryHackMe — Upload Vulnerabilities room, reverse shell + flag 획득',
    'cyber.train3': 'JWT 토큰 분석 및 권한 상승 실습',
    'cyber.research1': 'Zero-day vs N-day 취약점 분류',
    'cyber.research2': 'Web application security',
    'cyber.research3': 'Authentication / authorization 패턴',
    'cyber.ethics': '모든 보안 작업은 비공개 disclosure 채널로 진행됨. Public 정보(공개 레포지토리, 배포된 사이트의 클라이언트 코드)에 한정. Responsible disclosure 원칙 준수.',
    // CYBER report card (PDF)
    'cyber.report.header': '보고서',
    'cyber.report.eyebrow': '독립 보안 연구',
    'cyber.report.title': 'Security Audit Report',
    'cyber.report.subtitle': '보안 취약점 점검 보고서',
    'cyber.report.meta.target': '[redacted].org',
    'cyber.report.meta.repo': 'github.com/[peer]/[redacted]',
    'cyber.report.meta.researcher': 'Geonhee (건희)',
    'cyber.report.meta.date': 'April 18, 2026',
    'cyber.report.meta.findings': '15',
    'cyber.report.meta.severity': '3C · 3H · 4M · 4L · 1I',
    'cyber.report.confidential': 'CONFIDENTIAL · REDACTED',
    'cyber.report.btn.view': '보고서 보기 →',
    'cyber.report.btn.download': '다운로드',
    'cyber.report.disclaimer': '공개용 버전. 민감 식별자 가림 처리. 원본은 리포지토리 소유자에게 비공개로 전달됨.',
    // HARDWARE page
    'hw.caption': 'MAJOR PROJECT · ONGOING BUILDS',
    'hw.subtitle': '소프트웨어가 물리 세계와 만나는 지점.',
    'hw.overview': '화면 안에서만 동작하는 게 아니라 손에 잡히는 걸 만들고 싶다. Arduino, Raspberry Pi, 알루미늄 판재, 3D 프린팅, 임베디드 디스플레이를 조합해서 매번 다른 형태로 풀어보는 중. SHIPPED와 IN PROGRESS와 PLANNING이 공존하는 살아있는 작업장.',
    'hw.why': 'Iron Man을 보고 자란 세대로서 화면 안에서 끝나는 프로젝트로는 부족했다. 손으로 만지고, 작동하고, 망가지면 다시 고치는 게 진짜다.',
    'hw.sub.hengbot.title': 'Hengbot Sirius Robot Dog Locomotion',
    'hw.sub.hengbot.desc': 'Hengbot Sirius 로봇 강아지에 생체역학 기반 4족 보행(trot gait) Python 스크립트 작성. hengbot_api의 sparky 모듈, WebSocket 통신 (172.30.1.60:8765), Creator Studio Gait Debug panel로 제어.',
    'hw.sub.radar.title': 'Arduino Ultrasonic Radar',
    'hw.sub.radar.desc': '회전하는 거리 감지 레이더. Processing으로 시각화.',
    'hw.sub.bristle.title': 'DIY Bristlebot',
    'hw.sub.bristle.desc': '칫솔모와 진동 모터로 굴러가는 미니 봇.',
    'hw.sub.casio.title': 'Casio SL-310UC Terminal Mod',
    'hw.sub.casio.desc': '계산기 속을 통째로 갈아 끼워 휴대용 zsh 터미널로 변환. 부품 확보 중.',
    'hw.sub.repulsor.title': 'Iron Man Repulsor Gauntlet',
    'hw.sub.repulsor.desc': '실제 알루미늄 판재로 만드는 LED + 힘 증강 리펄서 장갑. 설계 단계.',
    'hw.shipped': 'SHIPPED',
    'hw.planning': 'PLANNING / IN PROGRESS',
    'hw.next1': 'ECHO 케이스 직접 3D 프린트',
    'hw.next2': 'Repulsor 완성 후 ECHO 글래스와 연동 (시선 방향 + 손동작 인식)',
    // EDITING STUDIO page
    'editing.caption': 'MAJOR PROJECT · ONGOING · SINCE 2020s',
    'editing.subtitle': '픽셀과 주파수, 둘 다 직접 자른다.',
    'editing.overview': '영상 편집과 음악 production이 만나는 지점에서 작업. After Effects, Premiere Pro, Illustrator, Photoshop, Blender를 메인으로, FL Studio와 Reaper로 음원 작업까지 직접. 학교 공식 영상 제작과 키네틱 타이포그래피 전문 팀 심사위원 활동을 병행.',
    'editing.why': '내가 코드로 만드는 것들이 화면에 어떻게 나올지, 그리고 어떤 소리로 들릴지까지 직접 디자인하고 싶다. ECHO 글래스의 HUD도, ORION의 음성도 결국은 <em>visual + audio</em>. 같은 craft.',
    'editing.school1': '추석 공식 기념 영상 (Chadwick International)',
    'editing.school2': '중학교 뮤지컬 공식 홍보 영상 ×2',
    'editing.school3': '초등학교 졸업 셀러브레이션 공식 영상 ×4',
    'editing.kinetic1': '키네틱 타이포그래피 전문 팀 멤버',
    'editing.kinetic2': '입단 과정: 1차 심사 탈락 → 실력 보강 → 재심사 합격',
    'editing.kinetic3': '현재 포지션: 심사위원 (Judge), 신규 멤버 평가',
    'editing.kinetic4': '팀 구성: 중고등학생 + 성인 + 프로 편집자 혼합',
    'editing.otomad1': 'Niconico 출신 글로벌 remix culture',
    'editing.otomad2': 'Sample-based composition: pitch-shift, time-stretch micro-samples',
    'editing.otomad3': '글로벌 community와 같은 lineage 위에서 작업',
    'editing.otomad4': '작업 채널: 원소에딧즈 (메인 Minecraft 채널과 분리)',
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
    'impact.eyebrow': 'BY THE NUMBERS',
    'impact.title': 'In numbers.',
    'impact.youtube.label': 'YouTube subscribers',
    'impact.youtube.meta': 'Minecraft channel · since 2019',
    'impact.projects.label': 'Shipped projects',
    'impact.projects.meta': '5+ years of building',
    'impact.vulns.label': 'Vulnerabilities found',
    'impact.vulns.meta': 'full audit on a peer site',
    'impact.cube.label': 'KCA competition winner',
    'impact.cube.meta': '3×3 · 2×2 cube',
    'impact.years.label': 'Years self-directed',
    'impact.years.meta': 'idea → code → ship',
    'major.eyebrow': 'MAJOR PROJECTS',
    'major.title': 'Four I\'m going deep on.',
    'major.sub': 'Each one has its own deep-dive page.',
    'major.deepdive': 'Deep dive',
    'major.echo.tagline': 'Every Chairman Has One — building JARVIS, for real.',
    'major.echo.desc': 'AI agent on Brilliant Labs Halo AR glasses. The next computing interface, running inside your field of view.',
    'major.orion.tagline': 'Nine iterations from V1 to C2+.',
    'major.orion.desc': 'Multimodal desktop AI on macOS — voice, gestures, face recognition + calendar and web automation integrated.',
    'major.cyber.tagline': '15 vulnerabilities · 28-page bilingual report · responsible disclosure.',
    'major.cyber.desc': 'Full security audit of a peer\'s site + OWASP / TryHackMe training + an educational botnet simulator.',
    'major.hardware.tagline': 'Iron Man Repulsor, RPi inside a calculator, ultrasonic radar, robot dog.',
    'major.hardware.desc': 'Arduino, Raspberry Pi, and 3D modeling. The workshop where ideas in my head become things in my hand.',
    'experiments.eyebrow': 'EXPERIMENTS & GAMES',
    'experiments.title': 'Built for fun.',
    'experiments.sub': 'Weekend builds, tiny tools, games.',
    'beyond.eyebrow': 'CONTENT & BEYOND',
    'beyond.title': 'Work beyond code.',
    'beyond.sub': 'Camera, music, and the cube.',
    'beyond.youtube.title': 'YouTube · 원소15 ↗',
    'beyond.youtube.tagline': 'Minecraft content channel. 300K+ subscribers since 2019.',
    'beyond.youtube.desc': 'Beyond content: sponsorship negotiations, collab bookings, and YouTube ad campaign operations — all hands-on.',
    'beyond.music.title': 'Music Production',
    'beyond.music.tagline': 'Brazilian phonk and electronic in FL Studio.',
    'beyond.music.desc': 'Original beats for original work. Sound design through mix, all hands-on.',
    'beyond.cube.title': 'Speedcubing',
    'beyond.cube.tagline': 'Korea Cube Association winner.',
    'beyond.cube.desc': '3×3 and 2×2. Fast fingers, fast head, and you\'re good.',
    'cube.modal.caption': 'KOREA CUBE ASSOCIATION · 14TH JJANGSAEM',
    'cube.modal.title': 'Sanctioned win',
    'cube.tab.3x3': '3×3 · 1st',
    'cube.tab.2x2': '2×2 · 1st',
    'card.echo': 'An AI agent that lives on Halo smart glasses. A companion that understands everything in your view.',
    'card.easymac': 'Making Mac easier — brightness, input controls, and eye tracking all in one place.',
    'card.kimsrhythm': 'A rhythm game that makes your fingers dance. Kim-style.',
    'card.spellaword': 'An English vocab typing game. Fast fingers win.',
    'card.handy': 'Track your hand with a webcam to draw, play pong, and even play piano.',
    'card.geonspace': 'Geonhee\'s little corner — a personal profile page in GitHub style. Replaced by kimkim.io.',
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
    'about.ambition': 'Currently a student, with one thing I want to turn into a real company — AI agents, AR glasses, and the computing interface between them. Next step: <em>bigger lab</em>, <em>deeper research</em>, <em>heavier builds</em>.',
    'about.builderOperator': 'Building a company takes two things: <em>making</em>, and <em>operating</em>. The making side I\'m training through Orion, ECHO, and the hardware lab. The operating side I\'ve been learning since 2019 — running a 300K Minecraft channel, negotiating sponsorships, booking collabs, working with MCNs, and running paid YouTube campaigns end-to-end.',
    'about.stats.label.since': 'BUILDER WORK',
    'about.stats.value.since': 'Orion since 2026, ECHO incoming',
    'about.stats.label.operator': 'OPERATOR WORK',
    'about.stats.value.operator': 'YouTube channel since 2019 · 300K+',
    'about.stats.label.based': 'BASED IN',
    'about.stats.value.based': 'Incheon, KR',
    'about.stats.label.currently': 'CURRENTLY',
    'about.stats.value.currently': 'Chadwick International · MYP',
    'about.stats.label.next': 'NEXT',
    'about.stats.value.next': 'ECHO hardware arrival',
    'contact.title': 'Want to build<br /><span class="gradient">something together?</span>',
    'contact.sub': 'Ideas, collabs, or just a hi — all welcome.',
    'contact.mailPlaceholder': 'Email coming soon',
    'footer.tag': 'Built with curiosity · since whenever',
    'footer.copy': '© 2026 Kim Geonhee. Always building.',
    // deep-dive shared
    'deep.back': 'Back to home',
    // ECHO page
    'echo.caption': 'MAJOR PROJECT · IN DEVELOPMENT · HARDWARE INCOMING',
    'echo.subtitle': 'Every Chairman Has One — EDITH-style AI companion for AR glasses.',
    'echo.overview': 'EDITH-style AI agent for Brilliant Labs Halo AR glasses. Designed to understand the wearer\'s visual context, converse via voice, and surface information through the HUD — a prototype for the next computing interface. Currently developing against the noa-playground simulator while awaiting hardware delivery.',
    'echo.why': 'Existing voice assistants don\'t see what you see. EDITH gave Peter Parker the experience I think is the next computing interface — information surfacing in your field of view, commands by voice. If Orion was the JARVIS-style desktop prototype, ECHO is the wearable evolution — EDITH.',
    'echo.feature1': 'Surface contextual information on the Halo HUD',
    'echo.feature2': 'Use Halo\'s camera to recognize objects in view → pipe to Claude Vision',
    'echo.feature3': 'Voice responses via Halo\'s bone-conduction speakers',
    'echo.feature4': 'Reuse the Orion backend (already-validated code)',
    'echo.timeline1': 'IPD measurement (self 55.3 → optometrist 64mm, within Halo\'s 58-72mm range)',
    'echo.timeline2': 'Halo $349 order placed, awaiting shipment',
    'echo.timeline3': 'Started learning the SDK against the noa-playground simulator',
    'echo.timeline4': 'Refactoring Orion code (separating I/O layers so a glasses adapter slots in)',
    'echo.next1': 'Unboxing and first-boot sequence documentation',
    'echo.next2': 'Pick Halo SDK target — Python / Flutter / Lua',
    'echo.next3': 'Design HUD layout (anchored on 64mm IPD)',
    'echo.next4': 'Glasses ↔ desktop-Orion cross-device handoff',
    // ECHO hero grid
    'echo.hero.cell1.alt': 'Brilliant Labs Halo AR glasses',
    'echo.hero.cell2.alt': 'Deploying ECHO to Fly.io',
    'echo.hero.cell2.caption': 'ECHO → Fly.io',
    'echo.hero.placeholder': 'IMAGE COMING SOON',
    // ORION page
    'orion.caption': 'MAJOR PROJECT · 11 VERSIONS · V1 → O1',
    'orion.subtitle': 'JARVIS-style macOS desktop AI assistant. Iterated 11 times from V1 to O1.',
    'orion.overview': 'JARVIS-style desktop AI assistant for macOS. Native voice loop (\'Hey Orion\') with Claude API brain, plus a separate PyQt6 HUD client rendering at 240×240 (the cyan/green HUD aesthetic itself nods to EDITH). Handles calendar, music playback, food delivery automation, and Chrome work assistance. Latest major rewrite O1 (2026-02-18) unified HUD, WebSocket server, Self-Development Engine, and Work Assistant.',
    'orion.why': 'I wanted to JARVIS-ify the computer I use every day. A desktop-first dry run before moving to glasses (ECHO, the EDITH-family build). The patterns I validated in Orion become the ECHO backend.',
    'orion.feature1': 'Voice Assistant — "Hey Orion" wake word',
    'orion.feature2': '240×240 HUD — cyan/green display (EDITH visual reference; time, weather, calendar, AI responses)',
    'orion.feature3': 'Calendar Integration — macOS Calendar.app, schedule queries and summaries',
    'orion.feature4': 'Music Player — voice control for playback, pause, volume',
    'orion.feature5': 'Delivery Automation — voice-driven LotteEatz order flow',
    'orion.feature6': 'Self-Development Engine — auto-improves code while idle, double-confirms before applying',
    'orion.feature7': 'Work Assistant — type `hhheeelllppp` in Chrome to analyze the page and auto-fill (math, essays, forms)',
    'orion.feature8': 'Schedule Reminder — 8am daily briefing + 15-minute pre-event nudge',
    'orion.feature9': 'Hallucination Filter — multi-stage filtering of Whisper STT phantom audio',
    'orion.tl.v1': 'Core: Claude API, Tavily, Notifications',
    'orion.tl.v2': 'Screen capture analysis',
    'orion.tl.v3': 'Camera input analysis',
    'orion.tl.v4': 'ElevenLabs TTS',
    'orion.tl.v5': 'Gesture control',
    'orion.tl.v6': 'Music player',
    'orion.tl.c1': 'Assistant identity',
    'orion.tl.c2': 'Voice recognition',
    'orion.tl.c3': 'Calendar integration',
    'orion.tl.c4': 'Delivery automation',
    'orion.tl.o1': 'Full rewrite: HUD, WebSocket, Self-Dev, Work Assistant',
    'orion.next1': 'Integrate with ECHO (desktop ↔ glasses cross-device handoff)',
    'orion.next2': 'Local LLM fallback option',
    // CYBERSECURITY page
    'cyber.caption': 'MAJOR PROJECT · SECURITY RESEARCH',
    'cyber.subtitle': 'Finding vulnerabilities. Disclosing responsibly.',
    'cyber.overview': 'Learning security by auditing real deployed systems and practicing end-to-end responsible disclosure. Authored a 28-page bilingual (EN/KR) security audit report on a peer\'s deployed website (cisixers.org), formatted to HackerOne/Bugcrowd standards and personally disclosed.',
    'cyber.why': 'To keep what I build from breaking, I need to know how to break it. And through the disclosure process I learned security isn\'t about blaming people who didn\'t know better — it\'s about fixing things together.',
    'cyber.disclosure.target.label': 'Target',
    'cyber.disclosure.target.value': 'A peer\'s deployed website (cisixers.org)',
    'cyber.disclosure.findings.label': 'Findings',
    'cyber.disclosure.findings.value': '15 total (Critical 3 · High 3 · Medium 4 · Low 4 · Info 1)',
    'cyber.disclosure.report.label': 'Report',
    'cyber.disclosure.report.value': '28 pages, EN/KR bilingual, CVSS 3.1 + CWE tags, HackerOne format',
    'cyber.disclosure.handoff.label': 'Disclosure',
    'cyber.disclosure.handoff.value': 'Delivered privately to the site owner first; 72-hour responsible-disclosure policy',
    'cyber.finding1': 'Google OAuth Client Secret committed to a public repository via .env',
    'cyber.finding2': 'Firestore & Storage Rules (test mode → recommended deny-by-default)',
    'cyber.finding3': 'Google OAuth `hd` parameter missing (no domain restriction)',
    'cyber.finding4': 'Duplicate user identity stored in localStorage',
    'cyber.finding5': '`.DS_Store` committed to git',
    'cyber.train1': 'OWASP Juice Shop — DOM XSS, JWT None Attack, IDOR (basket access)',
    'cyber.train2': 'TryHackMe — Upload Vulnerabilities room, reverse shell + flag capture',
    'cyber.train3': 'JWT token analysis and privilege escalation drills',
    'cyber.research1': 'Zero-day vs N-day vulnerability taxonomy',
    'cyber.research2': 'Web application security',
    'cyber.research3': 'Authentication / authorization patterns',
    'cyber.ethics': 'All security work is conducted through private disclosure channels. Scoped to public information (open repositories, client-side code of deployed sites). Responsible disclosure principles strictly followed.',
    // CYBER report card (PDF)
    'cyber.report.header': 'The Report',
    'cyber.report.eyebrow': 'INDEPENDENT SECURITY RESEARCH',
    'cyber.report.title': 'Security Audit Report',
    'cyber.report.subtitle': 'Security Audit Report',
    'cyber.report.meta.target': '[redacted].org',
    'cyber.report.meta.repo': 'github.com/[peer]/[redacted]',
    'cyber.report.meta.researcher': 'Geonhee (건희)',
    'cyber.report.meta.date': 'April 18, 2026',
    'cyber.report.meta.findings': '15',
    'cyber.report.meta.severity': '3C · 3H · 4M · 4L · 1I',
    'cyber.report.confidential': 'CONFIDENTIAL · REDACTED',
    'cyber.report.btn.view': 'View Report →',
    'cyber.report.btn.download': 'Download',
    'cyber.report.disclaimer': 'Public-release version. Sensitive identifiers redacted. Original report delivered privately to the repository owner.',
    // HARDWARE page
    'hw.caption': 'MAJOR PROJECT · ONGOING BUILDS',
    'hw.subtitle': 'Where software meets the physical world.',
    'hw.overview': 'Building things that exist outside the screen. Combinations of Arduino, Raspberry Pi, aluminum sheet metal, 3D printing, and embedded displays. A working lab with shipped, in-progress, and planning builds coexisting.',
    'hw.why': 'Growing up on Iron Man, projects that ended inside a screen weren\'t enough. The real thing is what you can hold, watch run, and fix when it breaks.',
    'hw.sub.hengbot.title': 'Hengbot Sirius Robot Dog Locomotion',
    'hw.sub.hengbot.desc': 'Biomechanics-based quadruped trot-gait Python scripts for the Hengbot Sirius. Uses the sparky module of hengbot_api, WebSocket (172.30.1.60:8765), and Creator Studio\'s Gait Debug panel for control.',
    'hw.sub.radar.title': 'Arduino Ultrasonic Radar',
    'hw.sub.radar.desc': 'A rotating distance-detection radar. Visualized in Processing.',
    'hw.sub.bristle.title': 'DIY Bristlebot',
    'hw.sub.bristle.desc': 'A tiny bot that rolls on a toothbrush head + vibration motor.',
    'hw.sub.casio.title': 'Casio SL-310UC Terminal Mod',
    'hw.sub.casio.desc': 'Gutting a calculator and embedding a portable zsh terminal. Currently sourcing parts.',
    'hw.sub.repulsor.title': 'Iron Man Repulsor Gauntlet',
    'hw.sub.repulsor.desc': 'A real-aluminum, LED + force-assisted repulsor gauntlet. In the design phase.',
    'hw.shipped': 'SHIPPED',
    'hw.planning': 'PLANNING / IN PROGRESS',
    'hw.next1': '3D-print the ECHO case myself',
    'hw.next2': 'After Repulsor is done, link it with the ECHO glasses (gaze direction + hand gestures)',
    // EDITING STUDIO page
    'editing.caption': 'MAJOR PROJECT · ONGOING · SINCE 2020s',
    'editing.subtitle': 'Cutting pixels and frequencies — both by hand.',
    'editing.overview': 'Working at the intersection of video and audio production. Adobe stack (After Effects, Premiere, Illustrator, Photoshop) plus Blender for 3D, FL Studio and Reaper for sound. School-commissioned work alongside judging role at a kinetic typography production team.',
    'editing.why': 'I want to design what my code looks like on screen — and what it sounds like — by my own hand. ECHO\'s HUD, ORION\'s voice — they all come down to <em>visual + audio</em>. Same craft.',
    'editing.school1': 'Chuseok official commemorative video (Chadwick International)',
    'editing.school2': 'Middle-school musical official promo videos ×2',
    'editing.school3': 'Elementary-school graduation celebration official videos ×4',
    'editing.kinetic1': 'Member of a kinetic typography production team',
    'editing.kinetic2': 'Path in: failed first audition → leveled up → passed re-audition',
    'editing.kinetic3': 'Current role: judge — evaluates new member submissions',
    'editing.kinetic4': 'Team composition: middle/high schoolers + adults + pro editors',
    'editing.otomad1': 'A global remix culture rooted in Niconico',
    'editing.otomad2': 'Sample-based composition: pitch-shift and time-stretch on micro-samples',
    'editing.otomad3': 'Working on the same lineage as the global community',
    'editing.otomad4': 'Channel: 원소에딧즈 (separate from the main Minecraft channel)',
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
    'card.geonspace': 'ゴニだけの空間。GitHubスタイルの個人プロフィールページ。今は kimkim.io に置き換わった。',
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
    'cube.modal.caption': 'KOREA CUBE ASSOCIATION · 14TH JJANGSAEM',
    'cube.modal.title': '公認大会優勝',
    'cube.tab.3x3': '3×3 · 1st',
    'cube.tab.2x2': '2×2 · 1st',
  },
};

const LANG_LABELS = { en: 'EN', ko: 'KO', ja: 'JA' };
const STORAGE_KEY = 'kimkim-lang';

function applyLang(lang) {
  if (!I18N[lang]) lang = 'ko';
  const dict = I18N[lang];
  const fallback = I18N.ko;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = dict[key] !== undefined ? dict[key] : fallback[key];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    const value = dict[key] !== undefined ? dict[key] : fallback[key];
    if (value !== undefined) el.setAttribute('alt', value);
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

// ===== cube modal (Speedcubing video player) =====
const cubeModal = document.getElementById('cubeModal');
const cubeTrigger = document.querySelector('[data-modal-trigger="cube"]');
if (cubeModal && cubeTrigger) {
  const video = cubeModal.querySelector('.cube-modal-video');
  const tabs = [...cubeModal.querySelectorAll('.cube-modal-tab')];
  const closeBtns = [...cubeModal.querySelectorAll('[data-close]')];
  // dev (localhost) → local files (offline OK), prod → Cloudflare R2 (videos.kimkim.io)
  const isLocalDev = ['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname);
  const VIDEO_SRC = isLocalDev ? {
    '3x3': '/assets/videos/cube-3x3-winner.mp4',
    '2x2': '/assets/videos/cube-2x2-winner.mp4',
  } : {
    '3x3': 'https://videos.kimkim.io/cube-3x3-winner.mp4',
    '2x2': 'https://videos.kimkim.io/cube-2x2-winner.mp4',
  };
  let lastFocused = null;
  let trapHandler = null;

  const setTab = (eventKey, { swap = true } = {}) => {
    tabs.forEach(t => {
      const active = t.dataset.event === eventKey;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    if (!swap) return;
    // cross-fade swap: pause current, fade out, change src, fade in
    video.classList.add('is-swapping');
    setTimeout(() => {
      try { video.pause(); } catch (e) {}
      video.currentTime = 0;
      video.src = VIDEO_SRC[eventKey];
      video.load();
      video.classList.remove('is-swapping');
    }, 150);
  };

  const openModal = () => {
    lastFocused = document.activeElement;
    cubeModal.classList.remove('is-closing');
    cubeModal.hidden = false;
    document.body.classList.add('cube-modal-open');
    // initial tab: 3x3
    setTab('3x3', { swap: false });
    video.src = VIDEO_SRC['3x3'];
    video.load();
    // focus trap
    const focusable = cubeModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"]), video');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    requestAnimationFrame(() => first?.focus());
    trapHandler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    cubeModal.addEventListener('keydown', trapHandler);
  };

  const closeModal = () => {
    cubeModal.classList.add('is-closing');
    try { video.pause(); } catch (e) {}
    if (trapHandler) cubeModal.removeEventListener('keydown', trapHandler);
    setTimeout(() => {
      cubeModal.hidden = true;
      cubeModal.classList.remove('is-closing');
      document.body.classList.remove('cube-modal-open');
      video.removeAttribute('src');
      video.load();
      lastFocused?.focus?.();
    }, 180);
  };

  // open: click + Enter/Space
  cubeTrigger.addEventListener('click', openModal);
  cubeTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
  });

  // tabs
  tabs.forEach(t => t.addEventListener('click', () => setTab(t.dataset.event)));

  // close: X / backdrop / ESC
  closeBtns.forEach(b => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cubeModal.hidden) closeModal();
  });

  // video error logging (no UI noise, just warn for debug)
  video.addEventListener('error', () => {
    console.warn('[cube-modal] video failed to load:', video.currentSrc || video.src);
  });
}

})(); // end IIFE
