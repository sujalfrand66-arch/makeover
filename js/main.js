/* ============================================================
   GLAMOUR BEAUTY PARLOUR — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar Scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Nav ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const mobileClose = document.querySelector('.mobile-close');

  const openNav = () => {
    mobileNav?.classList.add('open');
    navOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    mobileNav?.classList.remove('open');
    navOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger?.addEventListener('click', openNav);
  navOverlay?.addEventListener('click', closeNav);
  mobileClose?.addEventListener('click', closeNav);

  /* ── Active Nav Link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Hero Slider ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let sliderInterval;

  const goToSlide = (index) => {
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  };

  const startSlider = () => {
    sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
  };

  if (slides.length > 0) {
    goToSlide(0);
    startSlider();

    document.querySelector('.hero-prev')?.addEventListener('click', () => {
      clearInterval(sliderInterval);
      goToSlide(currentSlide - 1);
      startSlider();
    });
    document.querySelector('.hero-next')?.addEventListener('click', () => {
      clearInterval(sliderInterval);
      goToSlide(currentSlide + 1);
      startSlider();
    });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(sliderInterval);
        goToSlide(i);
        startSlider();
      });
    });
  }

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Gallery Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.opacity = show ? '1' : '0';
        item.style.pointerEvents = show ? 'auto' : 'none';
        item.style.display = show ? 'block' : 'none';
      });
    });
  });

  /* ── Lightbox ── */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-masonry-item img, .gallery-item img').forEach(img => {
    img.parentElement.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  lightboxClose?.addEventListener('click', () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  });
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── Contact Form ── */
  const contactForm = document.querySelector('.contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ Message Sent!</span>';
    btn.style.background = '#2d6a4f';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  /* ── Chatbot ── */
  const chatbotBtn = document.querySelector('.chatbot-btn');
  const chatbotWindow = document.querySelector('.chatbot-window');
  const chatbotClose = document.querySelector('.chatbot-close');
  const chatbotInput = document.querySelector('.chatbot-input');
  const chatbotSend = document.querySelector('.chatbot-send');
  const chatMessages = document.querySelector('.chatbot-messages');
  const quickBtns = document.querySelectorAll('.quick-btn');

  const botReplies = {
    'services': `Our premium services include:\n✨ Bridal Makeup\n💆 Facial Treatments\n💇 Hair Styling\n🎨 Hair Coloring\n🌿 Skin Care\n💅 Nail Art\n\nVisit our Services page for full details!`,
    'contact': `📞 Call us: +91 86194 13476\n📍 Ward No 23, Opp. Neelkanth Hospital,\nSwami Vivekananda Nagar, Suratgarh\n\nWe'd love to hear from you! 💛`,
    'location': `📍 Glamour Beauty Parlour\nWard No 23, Opposite Neelkanth Hospital\nSwami Vivekananda Nagar\nSuratgarh, Rajasthan 335804\n\nEasy to find us! 🗺️`,
    'booking': `To book an appointment:\n📞 Call: +91 86194 13476\n💬 WhatsApp us at the same number\n📝 Or fill our Contact form\n\nWe look forward to seeing you! 💄`,
  };

  const addMessage = (text, type) => {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.style.whiteSpace = 'pre-line';
    msg.textContent = text;
    chatMessages?.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const handleInput = (val) => {
    const text = val.trim().toLowerCase();
    if (!text) return;
    addMessage(val, 'user');
    setTimeout(() => {
      const key = Object.keys(botReplies).find(k => text.includes(k));
      const reply = key
        ? botReplies[key]
        : `I'm not sure about that 🙏\nTry asking about:\n• services\n• contact\n• location\n• booking`;
      addMessage(reply, 'bot');
    }, 600);
  };

  chatbotBtn?.addEventListener('click', () => {
    chatbotWindow?.classList.toggle('open');
  });
  chatbotClose?.addEventListener('click', () => {
    chatbotWindow?.classList.remove('open');
  });
  chatbotSend?.addEventListener('click', () => {
    if (chatbotInput) { handleInput(chatbotInput.value); chatbotInput.value = ''; }
  });
  chatbotInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { handleInput(chatbotInput.value); chatbotInput.value = ''; }
  });
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => handleInput(btn.dataset.msg));
  });

  /* Auto open chatbot after 2.5s on homepage */
  if (currentPath === 'index.html' || currentPath === '') {
    setTimeout(() => chatbotWindow?.classList.add('open'), 2500);
  }

  /* ── Smooth counter animation ── */
  const counters = document.querySelectorAll('.count-up');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        let count = 0;
        const increment = target / 60;
        const update = () => {
          count += increment;
          if (count < target) {
            entry.target.textContent = Math.ceil(count) + (entry.target.dataset.suffix || '');
            requestAnimationFrame(update);
          } else {
            entry.target.textContent = target + (entry.target.dataset.suffix || '');
          }
        };
        update();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

});
const galleryImages = {
  bridal: 10,
  makeup: 10,
  hair: 10,
  skin: 10
};

const galleryGrid = document.getElementById("galleryGrid");

if (galleryGrid) {
  Object.keys(galleryImages).forEach(category => {

    for (let i = 1; i <= galleryImages[category]; i++) {

      const item = document.createElement("div");
      item.className = "gallery-masonry-item reveal";
      item.dataset.category = category;

      item.innerHTML = `
        <img src="images/gallery/${category}/${i}.png" alt="${category}">
        <div class="gallery-masonry-item-overlay"><span>✦</span></div>
      `;

      galleryGrid.appendChild(item);

    }

  });
}
/* ============================================================
   GLAMOUR BEAUTY PARLOUR — Feature Extensions
   Advanced Chatbot · Booking Modal · Micro-interactions
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     UTILITY
     ────────────────────────────────────────────── */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  /* ──────────────────────────────────────────────
     1. PRELOADER WITH SUBTLE SOUND
     ────────────────────────────────────────────── */
  (function initPreloader() {
    // Generate a tiny luxury chime with Web Audio API — no external file needed
    function playLuxuryChime() {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.06, ctx.currentTime); // very subtle
        master.connect(ctx.destination);

        const notes = [
          { freq: 880, start: 0,   dur: 0.6 },
          { freq: 1108, start: 0.18, dur: 0.5 },
          { freq: 1318, start: 0.36, dur: 0.7 },
        ];

        notes.forEach(({ freq, start, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
          gain.gain.setValueAtTime(0, ctx.currentTime + start);
          gain.gain.linearRampToValueAtTime(1, ctx.currentTime + start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
          osc.connect(gain);
          gain.connect(master);
          osc.start(ctx.currentTime + start);
          osc.stop(ctx.currentTime + start + dur + 0.1);
        });

        // Close context after sounds finish
        setTimeout(() => ctx.close(), 1500);
      } catch (e) {
        // Web Audio not available – silently ignore
      }
    }

    // Inject sound trigger icon into existing preloader if present
    const preloader = document.getElementById('glamour-preloader');
    if (preloader) {
      const soundIcon = document.createElement('div');
      soundIcon.className = 'preloader-sound-icon';
      soundIcon.innerHTML = `
        <div class="preloader-sound-bars">
          <span></span><span></span><span></span><span></span>
        </div>`;
      soundIcon.title = 'Ambient sound';
      preloader.appendChild(soundIcon);

      // Play chime on first user interaction with page (gesture required)
      let soundPlayed = false;
      const triggerSound = () => {
        if (soundPlayed) return;
        soundPlayed = true;
        playLuxuryChime();
      };
      document.addEventListener('click', triggerSound, { once: true });
      document.addEventListener('touchstart', triggerSound, { once: true });

      // Auto-attempt sound (will work if page already had user interaction)
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'running') { triggerSound(); }
        ctx.close();
      } catch (e) {}
    }
  })();


  /* ──────────────────────────────────────────────
     2. ADVANCED CHATBOT — FULL SCREEN + SMART REPLIES
     ────────────────────────────────────────────── */
  (function initAdvancedChatbot() {
    const btn = document.getElementById('chatbotBtn');
    const win = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const messagesEl = document.getElementById('chatMessages');
    const inputEl = document.querySelector('.chatbot-input');
    const sendBtn = document.querySelector('.chatbot-send');
    if (!btn || !win) return;

    // ── Smart responses map ──
    const responses = {
      services: `Our luxury services include:\n\n✨ Bridal Makeup — from ₹2,500\n💆 Facial Treatments — from ₹500\n💇 Hair Styling — from ₹300\n🎨 Hair Coloring — from ₹800\n🌿 Skin Care — from ₹200\n💅 Nail Art — from ₹250\n\nWould you like details on any service?`,
      bridal: `Our Bridal Makeup packages:\n\n• Basic Bridal — ₹2,500\n• Premium Bridal — ₹4,500\n• Airbrush Bridal — ₹6,000\n• HD Bridal Package — ₹8,000\n• Full Bridal (makeup + hair + saree) — ₹12,000+\n\nBook a consultation today! 👰`,
      hair: `Our Hair Services:\n\n💇 Wash & Blowdry — ₹300\n✂️ Haircut (Ladies) — ₹400\n🌈 Global Color — ₹800\n✨ Balayage/Ombre — ₹3,000+\n💫 Smoothening — ₹3,500+\n\nCall us to book: +91 86194 13476`,
      facial: `Our Facial Treatments:\n\n🌟 Basic Facial — ₹500\n✨ Gold Facial — ₹900\n💎 Diamond Facial — ₹1,400\n🌿 D-Tan Facial — ₹800\n🌸 Anti-Aging Facial — ₹1,800\n\nAll facials include a relaxing head massage!`,
      nail: `Our Nail Art Services:\n\n💅 Classic Manicure — ₹250\n💫 Gel Manicure — ₹450\n🎨 Nail Art (Simple) — ₹100 extra\n✨ Designer Nail Art — ₹250 extra\n🦶 Classic Pedicure — ₹300\n👰 Bridal Nail Package — ₹1,200`,
      skin: `Our Skin Care Treatments:\n\n✨ Face Bleach — ₹200\n🌿 D-Tan Treatment — ₹400\n💆 Full Body Waxing — ₹600\n🌸 Eyebrow Threading — ₹50\n💫 Upper Lip Threading — ₹30`,
      booking: `To book your appointment:\n\n📞 Call: +91 86194 13476\n💬 WhatsApp: +91 86194 13476\n📝 Online Booking Form\n\nOr type BOOK to open our luxury booking form! ✨`,
      book: 'OPEN_BOOKING',
      location: `📍 Glamour Beauty Parlour\nWard No 23, Opposite Neelkanth Hospital\nSwami Vivekananda Nagar\nSuratgarh, Rajasthan 335804\n\nEasy to find — right opposite Neelkanth Hospital! 🗺️`,
      contact: `📞 Phone: +91 86194 13476\n💬 WhatsApp: +91 86194 13476\n📍 Ward No 23, Opp. Neelkanth Hospital, Suratgarh\n\n🕐 Mon–Sat: 9AM–8PM\n🕐 Sunday: 10AM–6PM`,
      hours: `Our working hours:\n\n🕐 Monday – Saturday: 9:00 AM – 8:00 PM\n🕐 Sunday: 10:00 AM – 6:00 PM\n\nWe're open 7 days a week! 💛`,
      price: `We offer services starting from just ₹30.\n\nPopular choices:\n• Bridal Makeup from ₹2,500\n• Facials from ₹500\n• Hair Coloring from ₹800\n\nType the service name for exact pricing!`,
      hello: `Hello! Welcome to Glamour Beauty Parlour ✨\n\nHow can I help you today? Ask me about:\n• Services & Prices\n• Booking\n• Location\n• Working Hours`,
    };

    // Keyword matching
    function getReply(text) {
      const t = text.toLowerCase().trim();
      if (t.match(/\b(hi|hello|hey|namaste|hola)\b/)) return responses.hello;
      if (t.match(/\bbridal|bride|wedding|shaadi\b/)) return responses.bridal;
      if (t.match(/\bhair\b/)) return responses.hair;
      if (t.match(/\bfacial|face|skin\b/) && !t.match(/\bbleach|tan|wax\b/)) return responses.facial;
      if (t.match(/\bnail\b/)) return responses.nail;
      if (t.match(/\bskin|bleach|tan|wax|thread\b/)) return responses.skin;
      if (t.match(/\bbook|appointment|appoint\b/)) return responses.booking;
      if (t.match(/\blocation|where|address|map|find\b/)) return responses.location;
      if (t.match(/\bcontact|phone|call|whatsapp\b/)) return responses.contact;
      if (t.match(/\bhours|timing|time|open|close\b/)) return responses.hours;
      if (t.match(/\bprice|cost|rate|charge|how much\b/)) return responses.price;
      if (t.match(/^book$/)) return responses.book;
      if (t.match(/\bservice\b/)) return responses.services;
      return `I'm here to help! ✨\n\nTry asking about:\n• Services & Prices\n• Bridal Packages\n• Book Appointment\n• Location & Hours\n• Contact Info`;
    }

    // Add message to chat
    function addMsg(text, type, skipTyping) {
      if (!messagesEl) return;
      if (type === 'bot' && !skipTyping) {
        // Show typing indicator first
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        setTimeout(() => {
          typing.remove();
          const msg = document.createElement('div');
          msg.className = `chat-msg ${type}`;
          msg.style.whiteSpace = 'pre-line';
          msg.textContent = text;
          messagesEl.appendChild(msg);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 900);
      } else {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.style.whiteSpace = 'pre-line';
        msg.textContent = text;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }

    // Handle user input
    function handleInput(val) {
      const text = val.trim();
      if (!text) return;
      addMsg(text, 'user', true);
      if (inputEl) inputEl.value = '';

      setTimeout(() => {
        const reply = getReply(text);
        if (reply === 'OPEN_BOOKING') {
          addMsg('Opening our luxury booking form for you! ✨', 'bot', false);
          setTimeout(() => openBookingModal(), 1200);
        } else {
          addMsg(reply, 'bot', false);
        }
      }, 300);
    }

    // ── Wire existing quick buttons ──
    $$('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.dataset.msg;
        const textMap = {
          services: 'Services',
          booking:  'Book Appointment',
          location: 'Location',
          contact:  'Contact',
        };
        addMsg(textMap[msg] || msg, 'user', true);
        setTimeout(() => {
          const reply = getReply(msg);
          if (reply === 'OPEN_BOOKING') {
            addMsg('Opening booking form ✨', 'bot', false);
            setTimeout(() => openBookingModal(), 1000);
          } else {
            addMsg(reply, 'bot', false);
          }
        }, 300);
      });
    });

    // ── New quick action buttons (Call & WhatsApp) injected into chatbot ──
    function injectChatbotActions() {
      const qBtns = $('.chatbot-quick-btns');
      if (!qBtns || qBtns.dataset.enhanced) return;
      qBtns.dataset.enhanced = '1';

      const callBtn = document.createElement('button');
      callBtn.className = 'quick-btn';
      callBtn.textContent = '📞 Call Salon';
      callBtn.addEventListener('click', () => {
        addMsg('📞 Call Salon', 'user', true);
        setTimeout(() => {
          addMsg('You can call or tap to dial:\n📞 +91 86194 13476', 'bot', false);
          // After a moment show a clickable number
          setTimeout(() => {
            const link = document.createElement('div');
            link.className = 'chat-msg bot';
            link.innerHTML = '<a href="tel:+918619413476" style="color:var(--gold);font-weight:600;font-size:1.05rem;letter-spacing:1px;">Tap to Call: +91 86194 13476</a>';
            if (messagesEl) {
              messagesEl.appendChild(link);
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }
          }, 1000);
        }, 400);
      });

      const waBtn = document.createElement('button');
      waBtn.className = 'quick-btn';
      waBtn.textContent = '💬 WhatsApp';
      waBtn.addEventListener('click', () => {
        addMsg('💬 WhatsApp', 'user', true);
        setTimeout(() => {
          addMsg('Chat with us on WhatsApp! We typically reply within minutes.', 'bot', false);
          setTimeout(() => {
            const link = document.createElement('div');
            link.className = 'chat-msg bot';
            link.innerHTML = '<a href="https://wa.me/918619413476" target="_blank" style="color:#25D366;font-weight:600;">Open WhatsApp →</a>';
            if (messagesEl) {
              messagesEl.appendChild(link);
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }
          }, 900);
        }, 400);
      });

      const bookBtn = document.createElement('button');
      bookBtn.className = 'quick-btn';
      bookBtn.textContent = '📅 Book Now';
      bookBtn.addEventListener('click', () => {
        win.classList.remove('open', 'fullscreen');
        openBookingModal();
      });

      qBtns.appendChild(callBtn);
      qBtns.appendChild(waBtn);
      qBtns.appendChild(bookBtn);
    }

    // Open chatbot in full-screen mode
    function openChatFullscreen() {
      win.classList.add('open', 'fullscreen');
      injectChatbotActions();
      document.body.style.overflow = 'hidden';

      // Inject close button if not present
      const hdr = $('.chatbot-header', win);
      if (hdr && !$('.chatbot-fullscreen-close', hdr)) {
        const cls = document.createElement('button');
        cls.className = 'chatbot-fullscreen-close';
        cls.textContent = '✕';
        cls.addEventListener('click', closeChatbot);
        hdr.appendChild(cls);
        // Also update the original close button
        const origClose = $('#chatbotClose', hdr);
        if (origClose) origClose.style.display = 'none';
      }
    }

    function closeChatbot() {
      win.classList.remove('open', 'fullscreen');
      document.body.style.overflow = '';
    }

    // Override existing open/close with fullscreen behaviour
    btn.addEventListener('click', () => {
      if (win.classList.contains('open')) {
        closeChatbot();
      } else {
        openChatFullscreen();
      }
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', closeChatbot);
    }

    // Wire input
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (inputEl) { handleInput(inputEl.value); }
      });
    }
    if (inputEl) {
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput(inputEl.value);
      });
    }

    // ── Toast popup ──
    function showToast() {
      // Don't show if chatbot was already interacted with
      if (sessionStorage.getItem('glm_chat_seen')) return;

      const toast = document.createElement('div');
      toast.className = 'chatbot-toast';
      toast.innerHTML = `Hi Beauty ✨<br/><span style="font-size:0.75rem;opacity:0.7;">How can I help you today?</span>`;

      // Close on click
      toast.addEventListener('click', () => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 350);
      });

      document.body.appendChild(toast);
      sessionStorage.setItem('glm_chat_seen', '1');

      // Auto-dismiss after 6 seconds
      setTimeout(() => {
        if (toast.parentNode) {
          toast.classList.add('hiding');
          setTimeout(() => toast.remove(), 350);
        }
      }, 6000);
    }

    // Show toast 2s after page load
    setTimeout(showToast, 2000);
  })();


  /* ──────────────────────────────────────────────
     3. LUXURY BOOKING MODAL
     ────────────────────────────────────────────── */

  // Inject the booking modal HTML into the page
  function createBookingModal() {
    if (document.getElementById('glamourBookingModal')) return;

    const modal = document.createElement('div');
    modal.className = 'booking-modal-overlay';
    modal.id = 'glamourBookingModal';
    modal.innerHTML = `
      <div class="booking-modal" role="dialog" aria-modal="true" aria-labelledby="bookModalTitle">
        <div class="booking-modal-header">
          <span class="eyebrow">Reserve Your Experience</span>
          <h2 id="bookModalTitle">Book Your <em>Appointment</em></h2>
          <button class="booking-modal-close" id="bookingModalClose" aria-label="Close">✕</button>
        </div>

        <div class="booking-modal-body" id="bookingModalBody">
          <form id="glamourBookingForm" novalidate autocomplete="off">
            <div class="booking-form-grid">
              <div class="booking-form-group">
                <label for="bk_name">Full Name *</label>
                <input type="text" id="bk_name" name="name" placeholder="Your name" required />
              </div>
              <div class="booking-form-group">
                <label for="bk_phone">Phone / WhatsApp *</label>
                <input type="tel" id="bk_phone" name="phone" placeholder="+91 98765 43210" required />
              </div>
              <div class="booking-form-group full">
                <label for="bk_service">Service Required *</label>
                <select id="bk_service" name="service" required>
                  <option value="">— Select a Service —</option>
                  <option>Bridal Makeup</option>
                  <option>Facial Treatment</option>
                  <option>Hair Styling</option>
                  <option>Hair Coloring</option>
                  <option>Skin Care</option>
                  <option>Nail Art</option>
                  <option>Party Makeup</option>
                  <option>Mehendi</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="booking-form-group">
                <label for="bk_date">Preferred Date *</label>
                <input type="date" id="bk_date" name="date" required />
              </div>
              <div class="booking-form-group">
                <label>Preferred Time</label>
                <div class="time-grid" id="timeGrid">
                  <button type="button" class="time-slot" data-time="9:00 AM">9:00 AM</button>
                  <button type="button" class="time-slot" data-time="10:00 AM">10:00 AM</button>
                  <button type="button" class="time-slot" data-time="11:00 AM">11:00 AM</button>
                  <button type="button" class="time-slot" data-time="12:00 PM">12:00 PM</button>
                  <button type="button" class="time-slot" data-time="2:00 PM">2:00 PM</button>
                  <button type="button" class="time-slot" data-time="3:00 PM">3:00 PM</button>
                  <button type="button" class="time-slot" data-time="4:00 PM">4:00 PM</button>
                  <button type="button" class="time-slot" data-time="5:00 PM">5:00 PM</button>
                  <button type="button" class="time-slot" data-time="6:00 PM">6:00 PM</button>
                </div>
              </div>
              <div class="booking-form-group full">
                <label for="bk_msg">Additional Notes</label>
                <textarea id="bk_msg" name="message" placeholder="Any special requests or details…"></textarea>
              </div>
            </div>
            <button type="submit" class="booking-submit-btn">
              <span>✦ Confirm Booking via WhatsApp</span>
            </button>
          </form>
        </div>

        <div class="booking-success" id="bookingSuccess">
          <div class="success-icon">✨</div>
          <h3>Booking Sent!</h3>
          <p>Your booking details have been sent to WhatsApp.<br/>We'll confirm your appointment shortly.</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Set minimum date to today
    const dateInput = document.getElementById('bk_date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    // Time slot selection
    let selectedTime = '';
    $$('.time-slot', modal).forEach(slot => {
      slot.addEventListener('click', () => {
        $$('.time-slot', modal).forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = slot.dataset.time;
      });
    });

    // Close button
    document.getElementById('bookingModalClose').addEventListener('click', closeBookingModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeBookingModal();
    });

    // Form submit → WhatsApp
    const form = document.getElementById('glamourBookingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('bk_name')?.value.trim()    || '';
        const phone   = document.getElementById('bk_phone')?.value.trim()   || '';
        const service = document.getElementById('bk_service')?.value.trim() || '';
        const date    = document.getElementById('bk_date')?.value.trim()     || '';
        const message = document.getElementById('bk_msg')?.value.trim()      || '';

        if (!name || !phone || !service || !date) {
          // Highlight empty required fields
          [
            { id: 'bk_name',    val: name },
            { id: 'bk_phone',   val: phone },
            { id: 'bk_service', val: service },
            { id: 'bk_date',    val: date },
          ].forEach(({ id, val }) => {
            const el = document.getElementById(id);
            if (el && !val) {
              el.style.borderColor = '#ef4444';
              el.addEventListener('input', () => (el.style.borderColor = ''), { once: true });
            }
          });
          return;
        }

        // Format date nicely
        let prettyDate = date;
        try {
          prettyDate = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
          });
        } catch (err) {}

        const text = [
          '✨ *New Appointment Request*',
          '━━━━━━━━━━━━━━━━━━━━━━',
          `👤 *Name:* ${name}`,
          `📞 *Phone:* ${phone}`,
          `💄 *Service:* ${service}`,
          `📅 *Date:* ${prettyDate}`,
          selectedTime ? `🕐 *Time:* ${selectedTime}` : '',
          message ? `📝 *Notes:* ${message}` : '',
          '━━━━━━━━━━━━━━━━━━━━━━',
          '_Sent via Glamour Beauty Parlour Website_',
        ].filter(Boolean).join('\n');

        const waURL = `https://wa.me/918619413476?text=${encodeURIComponent(text)}`;
        window.open(waURL, '_blank');

        // Show success
        document.getElementById('bookingModalBody').style.display = 'none';
        const successEl = document.getElementById('bookingSuccess');
        if (successEl) successEl.classList.add('show');

        // Reset after 5s
        setTimeout(() => {
          closeBookingModal();
          document.getElementById('bookingModalBody').style.display = '';
          if (successEl) successEl.classList.remove('show');
          form.reset();
          selectedTime = '';
          $$('.time-slot', modal).forEach(s => s.classList.remove('selected'));
        }, 5000);
      });
    }
  }

  function openBookingModal() {
    createBookingModal();
    const modal = document.getElementById('glamourBookingModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    const modal = document.getElementById('glamourBookingModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Expose globally so other scripts / HTML can call it
  window.openGlamourBooking = openBookingModal;

  // ── Wire all "Book Appointment" / "Book Your Appointment" buttons ──
  document.addEventListener('DOMContentLoaded', () => {
    // Any element with data-book="true" or class "open-booking-modal"
    $$('[data-book], .open-booking-modal').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openBookingModal();
      });
    });

    // Inject floating book button on mobile
    const floatBtn = document.createElement('button');
    floatBtn.className = 'floating-book-btn';
    floatBtn.textContent = '📅 Book Appointment';
    floatBtn.addEventListener('click', openBookingModal);
    document.body.appendChild(floatBtn);
  });


  /* ──────────────────────────────────────────────
     4. INSTAGRAM SECTION — Caption Enhancement
        (Adds hover caption to existing insta-items)
     ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const captions = [
      'Bridal Bliss ✨',
      'Hair Goals 💇',
      'Glow Up 🌸',
      'Luxury Facials 💆',
      'Nail Artistry 💅',
      'Skin Radiance 🌿',
    ];

    $$('.insta-item').forEach((item, i) => {
      if ($('.insta-caption', item)) return; // already enhanced
      const cap = document.createElement('div');
      cap.className = 'insta-caption';
      cap.textContent = captions[i % captions.length];
      item.appendChild(cap);
    });
  });


  /* ──────────────────────────────────────────────
     5. MICRO INTERACTIONS — Ripple on buttons
     ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    function addRipple(el) {
      el.style.position = el.style.position || 'relative';
      el.style.overflow = 'hidden';
      el.addEventListener('click', function (e) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          width: 10px; height: 10px;
          background: rgba(255,255,255,0.25);
          transform: scale(0);
          left: ${x - 5}px; top: ${y - 5}px;
          pointer-events: none;
          animation: glamRipple 0.55s ease-out forwards;
          z-index: 10;
        `;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    }

    // Inject ripple animation keyframes
    if (!document.getElementById('glamRippleKF')) {
      const style = document.createElement('style');
      style.id = 'glamRippleKF';
      style.textContent = `
        @keyframes glamRipple {
          to { transform: scale(28); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    $$('.btn-primary, .btn-dark, .btn-outline, .btn-whatsapp, .btn-call, .quick-btn, .filter-btn').forEach(addRipple);
  });


  /* ──────────────────────────────────────────────
     6. SMOOTH IMAGE LAZY LOADING
        (Adds fade-in when images load)
     ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    $$('img:not([data-no-lazy])').forEach(img => {
      if (img.complete) return;
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      img.addEventListener('error', () => {
        img.style.opacity = '0.3';
      });
    });
  });

})();
