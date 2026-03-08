/* VKS — Interactions v5 | 2026 */
(function(){
  'use strict';

  /* ── IMAGE PROTECTION ── */
  document.addEventListener('contextmenu', e=>{ if(e.target.tagName==='IMG') e.preventDefault(); });
  document.addEventListener('dragstart', e=>{ if(e.target.tagName==='IMG') e.preventDefault(); });

  /* ── NAV SCROLL ── */
  const nav = document.querySelector('.nav');
  const stt = document.querySelector('.stt');

  window.addEventListener('scroll', ()=>{
    const s = window.scrollY;
    nav?.classList.toggle('scrolled', s > 40);
    stt?.classList.toggle('show', s > 500);
    updateSvcNav();
  }, {passive:true});

  /* ── SCROLL TO TOP ── */
  stt?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  /* ── HAMBURGER DRAWER ── */
  const ham = document.querySelector('.ham');
  const drawer = document.querySelector('.drawer');
  ham?.addEventListener('click', ()=>{
    const open = ham.classList.toggle('open');
    drawer?.classList.toggle('open', open);
    document.body.classList.toggle('no-scroll', open);
  });
  drawer?.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      ham?.classList.remove('open');
      drawer?.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });

  /* ── REVEAL ON SCROLL ── */
  const rvEls = document.querySelectorAll('.rv, .rv-scale');
  if(rvEls.length){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, {threshold:0.06, rootMargin:'0px 0px -30px 0px'});
    rvEls.forEach(el => io.observe(el));
  }

  /* ── TYPEWRITER (home hero) ── */
  const tw = document.querySelector('.hero-typewriter');
  if(tw){
    const cursor = tw.querySelector('.tw-cursor');
    const phrases = ['Audit & Assurance','Direct Taxation','Indirect Tax & GST','Legal Services','Debt Syndication','Insolvency & IBC','State Incentives','Listing Compliances'];
    let pi=0,ci=0,deleting=false;
    const textNode = document.createElement('span');
    tw.insertBefore(textNode, cursor);
    function typeStep(){
      const phrase = phrases[pi];
      if(!deleting){
        textNode.textContent = phrase.slice(0, ++ci);
        if(ci===phrase.length){ deleting=true; setTimeout(typeStep,2000); return; }
        setTimeout(typeStep,65);
      } else {
        textNode.textContent = phrase.slice(0, --ci);
        if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; setTimeout(typeStep,380); return; }
        setTimeout(typeStep,36);
      }
    }
    setTimeout(typeStep,1000);
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||76;
        window.scrollTo({top: target.offsetTop - navH - 16, behavior:'smooth'});
      }
    });
  });

  /* ── SERVICES SIDEBAR ACTIVE STATE ── */
  function updateSvcNav(){
    const navLinks = document.querySelectorAll('.svc-nav a');
    if(!navLinks.length) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||76;
    const sections = document.querySelectorAll('.svc-section');
    let current = '';
    sections.forEach(s=>{ if(window.scrollY >= s.offsetTop - navH - 60) current = '#' + s.id; });
    navLinks.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href')===current); });
  }

  /* ── CONTACT FORM ── */
  const form = document.querySelector('.c-form form');
  form?.addEventListener('submit', e=>{
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending…'; btn.disabled = true;
    setTimeout(()=>{
      btn.innerHTML = '✓ Message Sent — We\'ll be in touch!';
      btn.style.background = '#16a34a';
      form.reset();
      setTimeout(()=>{ btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
    }, 1200);
  });

  /* ── DRAWER STAGGER ── */
  document.querySelectorAll('.drawer a').forEach((a,i)=>{
    a.style.animationDelay = `${i*0.055 + 0.08}s`;
  });

  /* ── PUBLICATIONS FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card[data-cat]');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      pubCards.forEach(card=>{
        card.style.display = (cat==='all' || card.dataset.cat===cat) ? '' : 'none';
      });
    });
  });

  /* ── HERO SCROLL HIDE ── */
  const heroScroll = document.querySelector('.hero-scroll');
  if(heroScroll){
    window.addEventListener('scroll', ()=>{
      heroScroll.classList.toggle('hidden', window.scrollY > 80);
    }, {passive:true});
  }

})();

/* ── EVENTS TABS + SLIDERS ── */
(function(){
  const tabs = document.querySelectorAll('.event-tab');
  const panels = document.querySelectorAll('.event-panel');
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-'+tab.dataset.tab);
      if(target) target.classList.add('active');
    });
  });

  const sliderState = {};

  function getCardW(sliderId){
    const slider = document.getElementById(sliderId);
    if(!slider) return 0;
    const card = slider.querySelector('.event-card');
    if(!card) return 0;
    return card.offsetWidth + parseInt(getComputedStyle(slider).gap || '16');
  }

  function slideTo(sliderId, dir){
    const slider = document.getElementById(sliderId);
    if(!slider) return;
    const cards = slider.querySelectorAll('.event-card');
    if(!sliderState[sliderId]) sliderState[sliderId] = 0;
    sliderState[sliderId] = Math.max(0, Math.min(sliderState[sliderId]+dir, cards.length-1));
    slider.style.transform = `translateX(-${sliderState[sliderId] * getCardW(sliderId)}px)`;
  }

  document.querySelectorAll('.slider-btn[data-slider]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      slideTo(btn.dataset.slider, parseInt(btn.dataset.dir));
    });
  });

  /* Touch/swipe */
  document.querySelectorAll('.events-slider-wrap').forEach(wrap=>{
    let startX=0, isDragging=false;
    wrap.addEventListener('touchstart', e=>{ startX=e.touches[0].clientX; }, {passive:true});
    wrap.addEventListener('touchend', e=>{
      const diff = startX - e.changedTouches[0].clientX;
      const slider = wrap.querySelector('.events-slider');
      if(!slider || Math.abs(diff)<45) return;
      slideTo(slider.id, diff>0 ? 1 : -1);
    });
    /* Mouse drag */
    wrap.addEventListener('mousedown', e=>{ startX=e.clientX; isDragging=true; });
    wrap.addEventListener('mousemove', e=>{ if(isDragging) e.preventDefault(); });
    wrap.addEventListener('mouseup', e=>{
      if(!isDragging) return;
      isDragging=false;
      const diff = startX - e.clientX;
      const slider = wrap.querySelector('.events-slider');
      if(!slider || Math.abs(diff)<45) return;
      slideTo(slider.id, diff>0 ? 1 : -1);
    });
    wrap.addEventListener('mouseleave', ()=>{ isDragging=false; });
  });
})();

/* ── ACHIEVEMENT COUNTERS ── */
(function(){
  const counters = document.querySelectorAll('.achieve-num span[data-count], .stat-n[data-count]');
  if(!counters.length) return;

  function animateCount(el){
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const step = 16;
    const increment = target / (duration/step);
    let current = 0;
    const timer = setInterval(()=>{
      current += increment;
      if(current >= target){ current=target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  }

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ animateCount(e.target); io.unobserve(e.target); }
    });
  }, {threshold:0.4});

  counters.forEach(c=>io.observe(c));
})();
