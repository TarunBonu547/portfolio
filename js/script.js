(function () {
  'use strict';

  const body = document.body;
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const heroVisual = document.querySelector('.hero__visual');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const scrollProgress = document.querySelector('.scroll-progress');
  const statsSection = document.querySelector('.stats');
  const themeToggle = document.getElementById('themeToggle');

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(min-width: 769px)').matches;

  /* ===== Theme Controller ===== */
  const THEME_KEY = 'portfolio-theme';
  const THEME_ATTR = 'data-theme';
  const THEME_LABEL = 'LIGHT / DARK';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    const initial = stored || getSystemTheme();
    applyTheme(initial);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute(THEME_ATTR) || getSystemTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  }

  if (themeToggle) {
    initTheme();
    themeToggle.addEventListener('click', toggleTheme);
  }

  /* ===== Navigation ===== */
  function toggleMenu() {
    const isOpen = navLinks.classList.contains('is-open');
    if (isOpen) {
      navLinks.classList.remove('is-open');
      menuBtn.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    } else {
      navLinks.classList.add('is-open');
      menuBtn.classList.add('is-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  /* ===== Smooth Scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== Page Load ===== */
  if (!prefersReducedMotion) {
    window.addEventListener('load', function () {
      body.classList.add('is-loaded');
    });
  } else {
    body.classList.add('is-loaded');
  }

  /* ===== Hero 3D Stage Parallax ===== */
  const stage = document.getElementById('stage');

  if (stage && isDesktop && !prefersReducedMotion) {
    const touchDevice = window.matchMedia('(hover: none)').matches;

    if (!touchDevice) {
      window.addEventListener('mousemove', function (event) {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        const rotateY = x * 7;
        const rotateX = -y * 5;
        const moveX = x * 7;
        const moveY = y * 7;

        stage.style.transform =
          'translate3d(' + moveX + 'px, ' + moveY + 'px, 0) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      document.addEventListener('mouseleave', function () {
        stage.style.transform = 'translate3d(0,0,0) rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  /* ===== Magnetic Buttons ===== */
  if (isDesktop && !prefersReducedMotion) {
    const magneticTargets = document.querySelectorAll('.btn--primary, .footer__cta');

    magneticTargets.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const maxMove = 4;
        const moveX = (x / rect.width) * maxMove * 2;
        const moveY = (y / rect.height) * maxMove * 2;

        btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ===== Scroll Progress ===== */
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }, { passive: true });
  }

  /* ===== Scroll Indicator ===== */
  if (scrollIndicator) {
    setTimeout(function () {
      scrollIndicator.style.opacity = '1';
    }, 800);

    if (statsSection) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            scrollIndicator.style.opacity = entry.isIntersecting ? '0' : '1';
          });
        },
        { rootMargin: '0px', threshold: 0.1 }
      );

      observer.observe(statsSection);
    }
  }

  /* ===== Stats Strip Reveal ===== */
  if (statsSection) {
    const statsItems = statsSection.querySelectorAll('.stats__item');
    statsItems.forEach(function (item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(12px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.stats__item');
            items.forEach(function (item, index) {
              setTimeout(function () {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, index * 80);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.2 }
    );

    statsObserver.observe(statsSection);
  }

  /* ===== Active Navigation on Scroll ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('is-active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ===== Reveal Animations on Scroll ===== */
  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ===== Copy Email Interaction ===== */
  const copyEmailBtn = document.querySelector('.contact__copy-email');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      const email = 'tarunbonu547@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          const originalText = copyEmailBtn.textContent;
          copyEmailBtn.textContent = 'COPIED ✓';
          setTimeout(function () {
            copyEmailBtn.textContent = originalText;
          }, 2000);
        });
      }
    });
  }

  /* ===== About Visual Mouse Interaction ===== */
  const aboutVisual = document.getElementById('aboutVisual');
  const system = document.getElementById('system');

  if (aboutVisual && system && isDesktop && !prefersReducedMotion) {
    const touchDevice = window.matchMedia('(hover: none)').matches;

    if (!touchDevice) {
      aboutVisual.addEventListener('mousemove', function (event) {
        const rect = aboutVisual.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        const rotateX = -y * 8;
        const rotateY = x * 8;
        const moveX = x * 10;
        const moveY = y * 10;

        system.style.transform =
          'translate(calc(-50% + ' + moveX + 'px), calc(-50% + ' + moveY + 'px)) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      aboutVisual.addEventListener('mouseleave', function () {
        system.style.transform = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg)';
      });
    }
  }

  /* ===== Smooth Hover Interactions ===== */
  function initSmoothHover(config) {
    const container = typeof config.container === 'string' ? document.querySelector(config.container) : config.container;
    if (!container || !isDesktop || prefersReducedMotion) return;

    const touchDevice = window.matchMedia('(hover: none)').matches;
    if (touchDevice) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let rafId = null;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function update() {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);

      const deltaX = currentX - targetX;
      const deltaY = currentY - targetY;

      if (Math.abs(deltaX) > 0.0005 || Math.abs(deltaY) > 0.0005 || isHovering) {
        config.onUpdate(currentX, currentY);
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    }

    function startLoop() {
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    }

    container.addEventListener('mouseenter', function () {
      isHovering = true;
      container.classList.add('is-hovered');
      startLoop();
    });

    container.addEventListener('mousemove', function (event) {
      const rect = container.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;
      startLoop();
    });

    container.addEventListener('mouseleave', function () {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      container.classList.remove('is-hovered');
      startLoop();
    });
  }

  /* Credentials certificate hover */
  const certAnimation = document.querySelector('.credentials-certificate-animation');
  if (certAnimation) {
    const certSystem = certAnimation.querySelector('.system');

    initSmoothHover({
      container: certAnimation,
      onUpdate: function (x, y) {
        if (!certSystem) return;

        const rotateX = 4 - y * 3;
        const rotateY = -5 + x * 4;

        certSystem.style.transform = 'translate(-50%, -50%) perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      }
    });
  }

  /* ===== Resume Visual Interaction ===== */
  const resumeVisual = document.getElementById('resumeVisual');
  if (resumeVisual && isDesktop && !prefersReducedMotion) {
    const touchDevice = window.matchMedia('(hover: none)').matches;
    if (!touchDevice) {
      let running = false;
      let timeoutOne;
      let timeoutTwo;
      let timeoutThree;

      resumeVisual.addEventListener('mouseenter', function () {
        if (running) return;
        running = true;

        clearTimeout(timeoutOne);
        clearTimeout(timeoutTwo);
        clearTimeout(timeoutThree);

        resumeVisual.classList.remove('approved-state', 'reset');
        resumeVisual.classList.add('active');

        timeoutOne = setTimeout(function () {
          resumeVisual.classList.add('scanning');
        }, 750);

        timeoutTwo = setTimeout(function () {
          resumeVisual.classList.remove('scanning');
          resumeVisual.classList.add('approved-state');
        }, 2700);
      });

      resumeVisual.addEventListener('mouseleave', function () {
        clearTimeout(timeoutOne);
        clearTimeout(timeoutTwo);
        clearTimeout(timeoutThree);

        resumeVisual.classList.remove('scanning', 'approved-state', 'active');
        resumeVisual.classList.add('reset');

        timeoutThree = setTimeout(function () {
          resumeVisual.classList.remove('reset');
          running = false;
        }, 600);
      });
    }
  }

  /* ===== Contact Animation Interaction ===== */
  const cvVisual = document.getElementById('cvVisual');
  const cvTalk = document.getElementById('cvTalk');

  if (cvVisual && cvTalk) {
    cvTalk.addEventListener('mouseenter', function () {
      cvVisual.classList.add('talk-active');
    });

    cvTalk.addEventListener('mouseleave', function () {
      cvVisual.classList.remove('talk-active');
    });

    cvTalk.addEventListener('focus', function () {
      cvVisual.classList.add('talk-active');
    });

    cvTalk.addEventListener('blur', function () {
      cvVisual.classList.remove('talk-active');
    });
  }

  /* ===== Project Showcase Slider ===== */
  const projectTrack = document.getElementById('projectTrack');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const slideInfo = document.getElementById('slideInfo');

  if (projectTrack && prev && next) {
    let current = 0;
    const projectNames = ['CINEJUNCTION', 'OFFROAD SEMANTIC SEGMENTATION'];

    function updateSlider() {
      projectTrack.style.transform = 'translateX(-' + (current * 50) + '%)';
      prev.disabled = current === 0;
      next.disabled = current === projectNames.length - 1;
      slideInfo.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(projectNames.length).padStart(2, '0') + ' — ' + projectNames[current];
    }

    next.addEventListener('click', function () {
      if (current < projectNames.length - 1) {
        current++;
        updateSlider();
      }
    });

    prev.addEventListener('click', function () {
      if (current > 0) {
        current--;
        updateSlider();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' && current < projectNames.length - 1) {
        current++;
        updateSlider();
      }
      if (event.key === 'ArrowLeft' && current > 0) {
        current--;
        updateSlider();
      }
    });

    let touchStartX = 0;
    projectTrack.addEventListener('touchstart', function (event) {
      touchStartX = event.touches[0].clientX;
    }, { passive: true });

    projectTrack.addEventListener('touchend', function (event) {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;
      if (Math.abs(distance) < 60) return;
      if (distance < 0 && current < projectNames.length - 1) {
        current++;
      } else if (distance > 0 && current > 0) {
        current--;
      }
      updateSlider();
    }, { passive: true });

    updateSlider();
  }
})();
