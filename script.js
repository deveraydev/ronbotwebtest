/* =========================================================
   RONBOT — INTERACTIVE CANVAS, LIVE HUD & MICRO-ANIMATIONS
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Yıl bilgisini otomatik ayarla
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     1. NAVBAR SCROLL & MOBİL MENÜ
     ------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------
     2. FARE TAKİPLİ SPOTLIGHT KART EFEKTİ
     ------------------------------------------------------- */
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  /* -------------------------------------------------------
     3. SCROLL REVEAL (INTERSECTION OBSERVER)
     ------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* -------------------------------------------------------
     4. ETKİLEŞİMLİ RONBOT CANLI HUD KONSOLU
     ------------------------------------------------------- */
  const gameProfiles = {
    mobile2: {
      client: 'Mobile2 [TR]',
      servers: 'Yakamoz • Alesta • Tuva',
      engine: 'v2.x Aktif / Stabil',
      perf: '99.4%',
      bar: '96%',
      logs: [
        { tag: 'SYS', type: 'info', msg: 'Mobile2 istemci bağlantısı doğrulandı.' },
        { tag: 'OK', type: 'ok', msg: 'Sunucu modülleri yüklendi: Yakamoz, Alesta, Tuva.' },
        { tag: 'BOT', type: '', msg: 'WaitHack, Akıllı Rota ve Pazar Tarama aktif.' },
        { tag: 'SHIELD', type: 'ok', msg: 'GM & PM koruma katmanı arka planda izlemede.' }
      ]
    },
    meta2: {
      client: 'Meta2 Online',
      servers: 'Tüm Sunucular Aktif',
      engine: 'Hızlı Tepki Modu',
      perf: '98.9%',
      bar: '93%',
      logs: [
        { tag: 'SYS', type: 'info', msg: 'Meta2 çekirdek imzaları başarıyla eşleşti.' },
        { tag: 'OK', type: 'ok', msg: 'Saldırı hızı ve hedef kilitleme kalibre edildi.' },
        { tag: 'BOT', type: '', msg: 'Özel Loot Filtresi ve Oto Farm döngüsü hazır.' },
        { tag: 'SHIELD', type: 'ok', msg: 'Güvenli oturum protokolü devreye alındı.' }
      ]
    },
    royale2: {
      client: 'Royale2 TR',
      servers: 'Tüm Sunucular Aktif',
      engine: 'Düşük CPU Mimarisi',
      perf: '99.1%',
      bar: '95%',
      logs: [
        { tag: 'SYS', type: 'info', msg: 'Royale2 istemci bellek haritası senkronize edildi.' },
        { tag: 'OK', type: 'ok', msg: 'Çoklu istemci performans optimizasyonu aktif.' },
        { tag: 'BOT', type: '', msg: 'Balık botu ve otomatik rota sistemi başlatıldı.' },
        { tag: 'SHIELD', type: 'ok', msg: 'Anlık koruma sensörleri sorunsuz çalışıyor.' }
      ]
    },
    tarantin2: {
      client: 'Tarantin2',
      servers: 'Tüm Sunucular Aktif',
      engine: 'Tam Otomasyon Modu',
      perf: '99.2%',
      bar: '94%',
      logs: [
        { tag: 'SYS', type: 'info', msg: 'Tarantin2 ortam taraması tamamlandı.' },
        { tag: 'OK', type: 'ok', msg: 'Güncel yama uyumluluğu doğrulandı.' },
        { tag: 'BOT', type: '', msg: 'Oto bağırma, farm rotası ve toplama filtresi aktif.' },
        { tag: 'SHIELD', type: 'ok', msg: 'Kesintisiz koruma ve stabilite kilidi aktif.' }
      ]
    }
  };

  const hudTabs = document.querySelectorAll('.hud-tab');
  const hudClient = document.getElementById('hud-client');
  const hudServers = document.getElementById('hud-servers');
  const hudEngine = document.getElementById('hud-engine');
  const hudPerf = document.getElementById('hud-perf');
  const hudBar = document.getElementById('hud-bar');
  const hudTerminal = document.getElementById('hud-terminal');

  let logTimers = [];

  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  }

  function renderHudProfile(key) {
    const data = gameProfiles[key];
    if (!data || !hudTerminal) return;

    logTimers.forEach((t) => clearTimeout(t));
    logTimers = [];

    hudClient.textContent = data.client;
    hudServers.textContent = data.servers;
    hudEngine.textContent = data.engine;
    hudPerf.textContent = data.perf;
    hudBar.style.width = data.bar;
    hudTerminal.innerHTML = '';

    data.logs.forEach((entry, idx) => {
      const timer = setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `
          <span class="log-time">[${getTimestamp()}]</span>
          <span class="log-tag ${entry.type}">[${entry.tag}]</span>
          <span class="log-msg">${entry.msg}</span>
        `;
        hudTerminal.appendChild(line);
      }, idx * 240);
      logTimers.push(timer);
    });
  }

  hudTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      hudTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderHudProfile(tab.dataset.game);
    });
  });

  // İlk yüklemede Mobile2 profilini başlat
  renderHudProfile('mobile2');

  /* -------------------------------------------------------
     5. DİNAMİK SİBER AĞ CANVAS ANİMASYONU
     ------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: null, y: null, radius: 150 };
    const particleCount = Math.min(72, Math.floor((width * height) / 20000));
    const particles = [];

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.size = Math.random() * 1.8 + 0.8;
        this.isCyan = Math.random() > 0.72;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 1.4;
            this.y += (dy / dist) * force * 1.4;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.isCyan
          ? 'rgba(0, 240, 255, 0.55)'
          : 'rgba(255, 30, 66, 0.65)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              particles[i].isCyan && particles[j].isCyan
                ? `rgba(0, 240, 255, ${alpha})`
                : `rgba(255, 30, 66, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    }

    animateCanvas();
  }
});
