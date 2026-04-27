(function() {
    /* ============ Custom Cursor ============ */
    const cursor = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-card, .contact-card, .nav-toggle, .about-image-placeholder');
    hoverTargets.forEach(function(el) {
        el.addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
        el.addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
    });

    document.addEventListener('mouseleave', function() { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', function() { cursor.style.opacity = '1'; });

    /* ============ Particle System ============ */
    var canvas = document.getElementById('particle-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 80;
    var mouseX = 0;
    var mouseY = 0;
    var connectionDist = 140;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    for (var i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            var dxMouse = mouseX - p.x;
            var dyMouse = mouseY - p.y;
            var distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse < 200) {
                p.x += dxMouse * 0.0003;
                p.y += dyMouse * 0.0003;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(76, 201, 240, ' + p.opacity + ')';
            ctx.fill();

            for (var j = i + 1; j < particles.length; j++) {
                var p2 = particles[j];
                var dx = p.x - p2.x;
                var dy = p.y - p2.y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = 'rgba(123, 47, 247, ' + (1 - dist / connectionDist) * 0.15 + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ============ Floating Shapes ============ */
    var shapesContainer = document.getElementById('floating-shapes');
    for (var s = 0; s < 4; s++) {
        var shape = document.createElement('div');
        shape.className = 'float-shape';
        shapesContainer.appendChild(shape);
    }

    /* ============ Typewriter Effect ============ */
    var words = ['嵌入式开发', '机器人技术', '电路设计', '开源硬件', 'FPGA开发'];
    var typingEl = document.getElementById('typing-text');
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 80;
    var deleteSpeed = 40;
    var pauseTime = 2000;

    function typeLoop() {
        var currentWord = words[wordIndex];

        if (isDeleting) {
            typingEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(function() {
                isDeleting = true;
                typeLoop();
            }, pauseTime);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeLoop, 400);
            return;
        }

        setTimeout(typeLoop, isDeleting ? deleteSpeed : typeSpeed);
    }
    typeLoop();

    /* ============ Counter Animation ============ */
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'));
        var duration = 1800;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target) + '+';
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + '+';
            }
        }

        requestAnimationFrame(step);
    }

    /* ============ Scroll Reveal ============ */
    var revealElements = document.querySelectorAll(
        '.about-container, .about-image-wrapper, .about-text, .skill-card, ' +
        '.project-card, .timeline-item, .contact-card, .stat-item, .section-header'
    );

    revealElements.forEach(function(el, index) {
        el.classList.add('reveal', 'reveal-up');
        el.style.transitionDelay = (index % 4) * 0.08 + 's';
    });

    var timelineLeftItems = document.querySelectorAll('.timeline-item.left');
    var timelineRightItems = document.querySelectorAll('.timeline-item.right');
    timelineLeftItems.forEach(function(el) {
        el.classList.remove('reveal-up');
        el.classList.add('reveal-left');
    });
    timelineRightItems.forEach(function(el) {
        el.classList.remove('reveal-up');
        el.classList.add('reveal-right');
    });

    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function(el, i) {
        el.style.transitionDelay = (i % 3) * 0.1 + 's';
    });

    var observedCounters = false;
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                if (entry.target.classList.contains('stat-item') && !observedCounters) {
                    var counters = document.querySelectorAll('.stat-number');
                    counters.forEach(function(c, i) {
                        setTimeout(function() { animateCounter(c); }, i * 200);
                    });
                    observedCounters = true;
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(function(el) { observer.observe(el); });

    /* ============ Skill Bar Animation ============ */
    var skillBarsObserved = false;
    var skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !skillBarsObserved) {
                var bars = document.querySelectorAll('.skill-progress');
                bars.forEach(function(bar, i) {
                    setTimeout(function() {
                        bar.style.width = bar.getAttribute('data-width');
                    }, i * 100);
                });
                skillBarsObserved = true;
            }
        });
    }, { threshold: 0.3 });

    var skillsSection = document.querySelector('#skills');
    if (skillsSection) skillObserver.observe(skillsSection);

    /* ============ 3D Tilt Effect ============ */
    var tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / centerY * -8;
            var rotateY = (x - centerX) / centerX * 8;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    /* ============ Navbar Scroll Effect ============ */
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        var current = '';
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    /* ============ Mobile Menu Toggle ============ */
    var navToggle = document.querySelector('.nav-toggle');
    var navLinksContainer = document.querySelector('.nav-links');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    /* ============ Parallax on Scroll ============ */
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        var shapes = document.querySelectorAll('.float-shape');
        if (shapes.length >= 4) {
            shapes[0].style.transform = 'translateY(' + scrolled * 0.03 + 'px)';
            shapes[1].style.transform = 'translateY(' + scrolled * -0.04 + 'px)';
            shapes[2].style.transform = 'translateY(' + scrolled * 0.02 + 'px)';
        }
    });

    console.log('%c 牛志浩的个人网站 %c 已就绪 ',
        'background:#7b2ff7;color:#fff;padding:6px 10px;border-radius:4px 0 0 4px;font-weight:bold;',
        'background:#4cc9f0;color:#07070e;padding:6px 10px;border-radius:0 4px 4px 0;font-weight:bold;');
})();
