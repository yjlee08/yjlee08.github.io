document.addEventListener('DOMContentLoaded', function() {
  // Variables
  const codeSnippets = document.querySelectorAll('.code-example-body');
  const nav = document.querySelector('.navbar');
  const body = document.body;
  const popoverLinks = document.querySelectorAll('[data-popover]');
  let navOffsetTop = nav ? nav.offsetTop : 0;
  
  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function init() {
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', resize);
    
    popoverLinks.forEach(link => {
      link.addEventListener('click', openPopover);
    });
    
    document.addEventListener('click', closePopover);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', smoothScroll);
    });

    buildSnippets();
    initTypewriter();
    initFilterNav();
    initLightbox();
    initScrollReveal();
    initActiveNav();
  }

  function smoothScroll(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();
    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 40;
    
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    
    // Update hash after scroll without jumping
    if(history.pushState) {
      history.pushState(null, null, targetId);
    } else {
      window.location.hash = targetId;
    }
  }

  function openPopover(e) {
    e.preventDefault();
    closePopover();
    const popoverSelector = this.getAttribute('data-popover');
    if (!popoverSelector) return;
    
    const popover = document.querySelector(popoverSelector);
    if (popover) {
      popover.classList.toggle('open');
    }
    e.stopPropagation();
  }

  function closePopover() {
    const openPopovers = document.querySelectorAll('.popover.open');
    openPopovers.forEach(p => p.classList.remove('open'));
  }

  function resize() {
    body.classList.remove('has-docked-nav');
    navOffsetTop = nav ? nav.offsetTop : 0;
    onScroll();
  }

  function onScroll() {
    if (!nav) return;
    if (navOffsetTop < window.pageYOffset && !body.classList.contains('has-docked-nav')) {
      body.classList.add('has-docked-nav');
    }
    if (navOffsetTop > window.pageYOffset && body.classList.contains('has-docked-nav')) {
      body.classList.remove('has-docked-nav');
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    codeSnippets.forEach(snippet => {
      snippet.innerHTML = escapeHtml(snippet.innerHTML);
    });
  }

  function initTypewriter() {
    const phrases = [
      "How do we push the limits of AI, design it around human needs, and ensure our purpose remains ethical?"
    ];
    
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    const textEl = document.getElementById("typewriter-text");
    
    if (!textEl) return;

    function type() {
      const currentPhrase = phrases[phraseIndex];
      let text = currentPhrase.substring(0, characterIndex);
      
      if (isDeleting) {
        characterIndex--;
        text = currentPhrase.substring(0, characterIndex);
        if (text.endsWith(' ')) {
          text = text.slice(0, -1) + '&nbsp;';
        }
        textEl.innerHTML = text;
        
        if (characterIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, 30);
        }
      } else {
        characterIndex++;
        text = currentPhrase.substring(0, characterIndex);
        if (text.endsWith(' ')) {
          text = text.slice(0, -1) + '&nbsp;';
        }
        textEl.innerHTML = text;
        
        if (characterIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, 2500);
        } else {
          setTimeout(type, 75);
        }
      }
    }
    
    type();
  }

  function initFilterNav() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const customCards = document.querySelectorAll('.custom-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        customCards.forEach(card => {
          if (filterValue === 'all') {
            card.classList.remove('hidden');
          } else {
            if (card.classList.contains(filterValue)) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          }
        });
      });
    });
  }

  function initLightbox() {
    const certCards = document.querySelectorAll('.custom-card.cert-card .card-img-container');
    const lightboxModal = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    if (!lightboxModal) return;

    certCards.forEach(container => {
      container.addEventListener('click', function(e) {
        e.preventDefault();
        const img = this.querySelector('img');
        const src = img ? img.getAttribute('src') : null;
        
        // Navigate DOM safely
        const cardTitleEl = this.parentElement.querySelector('.card-title');
        const cardMetaEl = this.parentElement.querySelector('.card-meta');
        const title = cardTitleEl ? cardTitleEl.textContent : '';
        const org = cardMetaEl ? cardMetaEl.textContent : '';
        
        if (src) {
          if(lightboxImg) lightboxImg.setAttribute('src', src);
          if(lightboxCaption) lightboxCaption.innerHTML = '<strong>' + title + '</strong><br/><span style="font-size:0.85em;color:#ccc;">' + org + '</span>';
          lightboxModal.classList.add('active');
        }
      });
    });

    lightboxModal.addEventListener('click', function(e) {
      if (e.target.classList.contains('lightbox-img') || 
          e.target.classList.contains('lightbox-caption') || 
          (e.target.closest('.lightbox-content') && !e.target.classList.contains('lightbox-close'))) {
        return;
      }
      lightboxModal.classList.remove('active');
    });
    
    const closeBtns = document.querySelectorAll('.lightbox-close');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    });
  }

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('.docs-section');
    const navLinks = document.querySelectorAll('.navbar-link');
    if (sections.length === 0 || navLinks.length === 0) return;

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to the intersecting section's corresponding link
          const activeId = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.navbar-link[href="#${activeId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the screen
      threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));
  }

  init();

  // Seoul Time Widget Logic
  function updateSeoulTime() {
    const clockEl = document.getElementById('seoul-clock');
    if (!clockEl) return;
    
    const now = new Date();
    // Format options for Seoul time
    const options = { 
      timeZone: 'Asia/Seoul', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    
    clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  }

  setInterval(updateSeoulTime, 1000);
  updateSeoulTime();

  // Widget Click Animation
  const seoulWidget = document.getElementById('seoul-time-widget');
  if (seoulWidget) {
    seoulWidget.addEventListener('click', function() {
      // Reset animation if clicked rapidly
      this.classList.remove('jump');
      void this.offsetWidth; // Trigger reflow
      this.classList.add('jump');
      
      // Remove class after animation completes (500ms)
      setTimeout(() => {
        this.classList.remove('jump');
      }, 500);
    });
  }
});
