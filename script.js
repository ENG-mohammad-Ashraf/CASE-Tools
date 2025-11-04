// app-enhanced.js

console.log("Presentation designed and developed by Mohammad Ashraf");

const presenterName = "Mohammad Ashraf"; 

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const panels = Array.from(document.querySelectorAll('.panel'));
  const indicator = document.getElementById('indicator');
  const navDots = document.getElementById('navDots');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const fsBtn = document.getElementById('fsBtn');
  const themeToggle = document.getElementById('themeToggle');
  const quizBtn = document.getElementById('quizBtn');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const progressFill = document.getElementById('progressFill');
  const presenterEl = document.getElementById('presenter');
  const quizModal = document.getElementById('quizModal');
  const closeModal = document.querySelector('.close');

  presenterEl.textContent = presenterName;

  // Build nav dots
  panels.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = i === 0 ? 'active' : '';
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => scrollToPanel(i));
    navDots.appendChild(btn);
  });

  const dots = Array.from(navDots.children);

  // Intersection Observer to detect active panel
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const panel = entry.target;
        const idx = Number(panel.dataset.index);
        setActive(idx);
        updateProgress(idx);
        
        // Trigger animations for active panel
        if(panel.classList.contains('active')) {
          animatePanelContent(panel);
        }
      }
    });
  }, {threshold: 0.6});

  panels.forEach(p => io.observe(p));

  function setActive(index){
    panels.forEach((p,i) => {
      if(i === index){
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
    
    // Update nav
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    indicator.textContent = `${index + 1} / ${panels.length}`;
  }

  function updateProgress(index) {
    const progress = ((index + 1) / panels.length) * 100;
    progressFill.style.width = `${progress}%`;
  }

  function scrollToPanel(index){
    if(index < 0) index = 0;
    if(index > panels.length -1) index = panels.length -1;
    panels[index].scrollIntoView({behavior:'smooth', block:'start'});
  }

  // Prev / Next
  prevBtn.addEventListener('click', () => {
    const active = panels.findIndex(p => p.classList.contains('active'));
    scrollToPanel(active - 1);
  });
  
  nextBtn.addEventListener('click', () => {
    const active = panels.findIndex(p => p.classList.contains('active'));
    scrollToPanel(active + 1);
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight' || e.key === 'PageDown') nextBtn.click();
    if(e.key === 'ArrowLeft' || e.key === 'PageUp') prevBtn.click();
    if(e.key === 'Home') scrollToPanel(0);
    if(e.key === 'End') scrollToPanel(panels.length -1);
    if(e.key === 'Escape') closeModal.click();
    if(e.key === 'f' || (e.key === 'F' && e.ctrlKey)) toggleFullScreen();
  });

  // Fullscreen toggle
  fsBtn.addEventListener('click', toggleFullScreen);
  function toggleFullScreen(){
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '🌓';
  }

  // Quiz functionality
  quizBtn.addEventListener('click', showQuiz);
  closeModal.addEventListener('click', () => {
    quizModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === quizModal) {
      quizModal.style.display = 'none';
    }
  });

function showQuiz() {
  const quizContainer = document.getElementById('quizContainer');
  quizContainer.innerHTML = `
    <div class="quiz-question">
      <p>1. What is the primary purpose of CASE tools?</p>
      <div class="quiz-options">
        <div class="quiz-option" data-correct="true">Automate software engineering tasks</div>
        <div class="quiz-option">Replace system analysts</div>
        <div class="quiz-option">Generate random code</div>
        <div class="quiz-option">Create user interfaces</div>
      </div>
    </div>
    <div class="quiz-question">
      <p>2. Which type of CASE tools focuses on analysis and design?</p>
      <div class="quiz-options">
        <div class="quiz-option">Lower CASE</div>
        <div class="quiz-option" data-correct="true">Upper CASE</div>
        <div class="quiz-option">Integrated CASE</div>
      </div>
    </div>
    <div class="quiz-question">
      <p>3. What is a key benefit of using CASE tools in SDLC?</p>
      <div class="quiz-options">
        <div class="quiz-option">Increased manual work</div>
        <div class="quiz-option">Longer development cycles</div>
        <div class="quiz-option" data-correct="true">Better traceability between phases</div>
        <div class="quiz-option">Higher error rates</div>
      </div>
    </div>
    <button id="submitQuiz" class="modern-btn" style="margin-top: 20px;">Submit Answers</button>
  `;
  
  quizModal.style.display = 'block';
  
  document.getElementById('submitQuiz').addEventListener('click', evaluateQuiz);
  
  // إضافة تأثير scale عند النقر
  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      // إزالة التحديد من الخيارات الأخرى في نفس السؤال
      const siblings = Array.from(this.parentElement.children);
      siblings.forEach(sib => {
        sib.classList.remove('selected');
        // إعادة scale إلى الطبيعي للخيارات الأخرى
        sib.style.transform = 'scale(1)';
      });
      
      // إضافة تأثير scale للخيار المحدد
      this.classList.add('selected');
      this.style.transform = 'scale(1.05)';
      
      // إضافة تأثير اهتزاز خفيف
      this.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        this.style.animation = '';
      }, 200);
    });
  });
}
  function evaluateQuiz() {
    let score = 0;
    const questions = document.querySelectorAll('.quiz-question');
    
    questions.forEach(question => {
      const options = question.querySelectorAll('.quiz-option');
      let answered = false;
      
      options.forEach(option => {
        if (option.classList.contains('selected')) {
          answered = true;
          if (option.dataset.correct === 'true') {
            option.classList.add('correct');
            score++;
          } else {
            option.classList.add('incorrect');
            // Highlight correct answer
            options.forEach(opt => {
              if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
              }
            });
          }
        }
      });
      
      if (!answered) {
        // Highlight correct answers for unanswered questions
        options.forEach(opt => {
          if (opt.dataset.correct === 'true') {
            opt.classList.add('correct');
          }
        });
      }
    });
    
    const result = document.createElement('div');
    result.innerHTML = `<h4 style="margin-top: 20px; color: var(--cyan);">Your score: ${score}/${questions.length}</h4>`;
    document.getElementById('quizContainer').appendChild(result);
    
    document.getElementById('submitQuiz').style.display = 'none';
  }

  // PDF Download (simulated)
  downloadPdfBtn.addEventListener('click', () => {
    alert('this fill will be add as soon as posible');
  });

  // Enhanced hover tilt effect
  const tiltElements = Array.from(document.querySelectorAll('.hover-tilt'));
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (ev) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = ev.clientX - cx;
      const dy = ev.clientY - cy;
      const tiltX = (dy / r.height) * -8;
      const tiltY = (dx / r.width) * 8;
      el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(6px)`;
      el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.6), ${Math.abs(tiltY)}px ${Math.abs(tiltX)}px 40px rgba(0,229,255,0.1)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.boxShadow = '';
    });
  });

  // Panel content animation
  function animatePanelContent(panel) {
    const elements = panel.querySelectorAll('h1, h2, h3, h4, p, li, article, div, .visual-aid');
    
    elements.forEach((el, idx) => {
      // Skip if already animated
      if (el.classList.contains('animated')) return;
      
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2,0.9,0.2,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.classList.add('animated');
      }, 100 * (idx + 1));
    });
  }

  // Initialize typewriter effect for first panel
function initTypewriter() {
    const titles = document.querySelectorAll('.typewriter');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.style.overflow = 'hidden';
        title.style.borderRight = '3px solid var(--cyan)';
        
        let i = 0;
        function type() {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                // إزالة المؤشر والعودة للعرض الطبيعي
                setTimeout(() => {
                    title.style.borderRight = 'none';
                    title.style.overflow = 'visible';
                }, 500);
            }
        }
        type();
    });
}
  // Create particles for background
  function createParticles() {
    const container = document.querySelector('.particles-container');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const size = Math.random() * 3 + 1;
      const tx = (Math.random() - 0.5) * 200;
      const ty = (Math.random() - 0.5) * 200;
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * 20;
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        --tx: ${tx};
        --ty: ${ty};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        background: ${i % 3 === 0 ? 'var(--cyan)' : i % 3 === 1 ? 'var(--magenta)' : 'var(--electric)'};
      `;
      
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      
      container.appendChild(particle);
    }
  }

  // Initialize everything
  setTimeout(initTypewriter, 500);
  createParticles();
  
  // Prevent accidental scroll bounce on touch
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if(now - lastTouch <= 300) e.preventDefault();
    lastTouch = now;
  }, {passive:false});
});