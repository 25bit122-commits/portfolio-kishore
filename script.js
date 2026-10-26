/**
 * KISHORE PORTFOLIO - JAVASCRIPT ENGINE
 * 100% Pure Vanilla JS: Interactive Effects, Theme Switcher,
 * Dynamic Typing, 3D Tilt, Gmail Toggle, and Canvas Particles.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update Copyright Year
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ===================================================================
     1. THEME PALETTE SWITCHER (Cyan, Violet, Emerald, Amber)
     =================================================================== */
  const paletteToggle = document.getElementById('palette-toggle');
  const paletteDropdown = document.getElementById('palette-dropdown');
  const colorChips = document.querySelectorAll('.color-chip');
  const savedTheme = localStorage.getItem('kishore_theme') || 'cyan';

  // Apply Initial Theme
  applyTheme(savedTheme);

  if (paletteToggle && paletteDropdown) {
    paletteToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      paletteDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!paletteDropdown.contains(e.target) && !paletteToggle.contains(e.target)) {
        paletteDropdown.classList.remove('show');
      }
    });
  }

  colorChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const themeColor = chip.getAttribute('data-color');
      applyTheme(themeColor);
      if (paletteDropdown) paletteDropdown.classList.remove('show');
      showToast(`Switched theme to ${themeColor.toUpperCase()}`);
    });
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('kishore_theme', theme);

    // Update active chip state
    colorChips.forEach((chip) => {
      if (chip.getAttribute('data-color') === theme) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  /* ===================================================================
     2. DYNAMIC TYPING EFFECT
     =================================================================== */
  const typingElement = document.getElementById('typing-element');
  const phrases = [
    'Second Year Student @ KGCAS',
    'Thoothukudi, Tamil Nadu, India',
    'Creator of Restaurant Management System',
    'Frontend & Web Architecture Explorer',
    'Passionate about Clean Code & UI/UX'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 90;

  function typeEffect() {
    if (!typingElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 45;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingDelay = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = 400; // Pause before typing next phrase
    }

    setTimeout(typeEffect, typingDelay);
  }

  typeEffect();

  /* ===================================================================
     3. INTERACTIVE CANVAS BACKGROUND PARTICLES
     =================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ===================================================================
     4. CURSOR GLOW EFFECT (Desktop)
     =================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  /* ===================================================================
     5. 3D TILT EFFECT ON PROFILE CARD
     =================================================================== */
  const profileCard = document.getElementById('profile-card');
  if (profileCard && window.matchMedia('(hover: hover)').matches) {
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ===================================================================
     6. NAVBAR SCROLL EFFECT & MOBILE DRAWER
     =================================================================== */
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('show');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('show');
      });
    });
  }

  /* ===================================================================
     7. SCROLL-SPY ACTIVE NAV HIGHLIGHT
     =================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links .nav-link');

  function highlightNavOnScroll() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        mobileNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  /* ===================================================================
     8. GMAIL TOGGLE & INTERACTIVE MESSAGING
     (Target email: kishoreaspk000@gmail.com)
     =================================================================== */
  const targetEmail = 'kishoreaspk000@gmail.com';
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const modePills = document.querySelectorAll('.mode-pill');
  const gmailPrimaryAction = document.getElementById('gmail-primary-action');
  const gmailActionText = document.getElementById('gmail-action-text');

  // Copy Email Address to Clipboard
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      copyToClipboard(targetEmail, 'Email address copied to clipboard!');
    });
  }

  // Gmail Mode Switcher Tabs
  modePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      modePills.forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const mode = pill.getAttribute('data-mode');

      if (mode === 'web-gmail') {
        gmailPrimaryAction.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}`;
        gmailPrimaryAction.target = '_blank';
        gmailActionText.textContent = 'Launch Gmail Compose Window';
        showToast('Gmail Mode: Open Web Gmail compose window');
      } else if (mode === 'client') {
        gmailPrimaryAction.href = `mailto:${targetEmail}`;
        gmailPrimaryAction.removeAttribute('target');
        gmailActionText.textContent = 'Launch Default Email Client';
        showToast('Mail Mode: Opens default system mail app');
      } else if (mode === 'copy-only') {
        copyToClipboard(targetEmail, 'Email address copied for manual dispatch!');
        gmailActionText.textContent = 'Email Copied (Ready to Paste)';
      }
    });
  });

  // Interactive Message Form Dispatcher
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('user-name')?.value.trim();
      const email = document.getElementById('user-email')?.value.trim();
      const subject = document.getElementById('user-subject')?.value.trim();
      const message = document.getElementById('user-message')?.value.trim();

      const method = document.querySelector('input[name="dispatchMethod"]:checked')?.value || 'gmail';

      const fullSubject = `[Portfolio Contact] ${subject} - from ${name}`;
      const fullBody = `Hello Kishore,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}`;

      const encodedSubject = encodeURIComponent(fullSubject);
      const encodedBody = encodeURIComponent(fullBody);

      if (method === 'gmail') {
        const webGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodedSubject}&body=${encodedBody}`;
        showToast('Opening Web Gmail with prefilled message...');
        window.open(webGmailUrl, '_blank');
      } else {
        const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
        showToast('Opening default mail client with message...');
        window.location.href = mailtoUrl;
      }
    });
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(successMsg);
  }

  /* ===================================================================
     9. TOAST NOTIFICATION UTILITY
     =================================================================== */
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ===================================================================
     10. RESTAURANT SYSTEM PREVIEW MODAL
     =================================================================== */
  const previewModal = document.getElementById('preview-modal');
  const previewTrigger = document.getElementById('preview-modal-trigger');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (previewTrigger && previewModal) {
    previewTrigger.addEventListener('click', () => {
      previewModal.classList.add('active');
      previewModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    const closeModal = () => {
      previewModal.classList.remove('active');
      previewModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && previewModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /* ===================================================================
     11. BACK TO TOP BUTTON
     =================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ===================================================================
     12. SCROLL REVEAL OBSERVER
     =================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }
});
