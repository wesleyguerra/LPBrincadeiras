<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Landing Page Brincadeiras</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Se você precisar de CSS adicional, coloque aqui -->
    <style>
        /* Estilos originais do script.js e da galeria */
        .fade-in {
            animation: fadeInUp 0.8s ease forwards;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        .lazy.loaded {
            opacity: 1;
        }
        #image-gallery {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
            margin: 30px 0;
        }
        #image-gallery .image-gallery-img {
            max-width: 180px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            transition: transform 0.3s;
        }
        #image-gallery .image-gallery-img:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <!-- Seu conteúdo do site aqui -->

    <!-- Galeria de Imagens (será populada pelo JS) -->
    <div id="image-gallery"></div>

    <!-- Scripts -->
    <script>
    // Aguarda o carregamento completo da página
    document.addEventListener('DOMContentLoaded', function() {
        // Funcionalidade do FAQ
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question && question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        });

        // Smooth scroll para links internos
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Ajuste para header fixo se houver
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Animação de entrada dos elementos quando entram na viewport
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Elementos para animar
        const animatedElements = document.querySelectorAll('.target-card, .bonus-card, .testimonial-card, .pricing-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Contador animado para o preço
        const priceElement = document.querySelector('.main-price');
        if (priceElement) {
            const finalPrice = 47;
            const duration = 2000; // 2 segundos
            const startPrice = 97;
            const startTime = performance.now();

            function animatePrice(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentPrice = Math.round(startPrice - (startPrice - finalPrice) * easeOut);

                if (progress < 1) {
                    priceElement.innerHTML = `R$ ${currentPrice},00 <span>à vista</span>`;
                    requestAnimationFrame(animatePrice);
                } else {
                    priceElement.innerHTML = `R$ ${finalPrice},00 <span>à vista</span>`;
                }
            }

            const priceObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(animatePrice);
                        priceObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            priceObserver.observe(priceElement);
        }

        // Efeito de parallax suave no hero
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                if (scrolled < heroSection.offsetHeight) {
                    heroSection.style.transform = `translateY(${rate}px)`;
                }
            });
        }

        // Adiciona classe para animações CSS quando elementos entram na viewport
        const fadeElements = document.querySelectorAll('.intro-text, .target-description, .product-subtitle, .testimonials-subtitle');
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.3 });
        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });

        // Efeito de hover nos botões CTA
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            button.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(-1px) scale(0.98)';
            });
            button.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
        });

        // Tracking de eventos (opcional - para analytics)
        function trackEvent(eventName, elementType, elementText) {
            console.log(`Event: ${eventName}, Element: ${elementType}, Text: ${elementText}`);
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    'event_category': 'Landing Page',
                    'event_label': elementText
                });
            }
        }

        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                trackEvent('cta_click', 'button', this.textContent.trim());
            });
        });

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question && question.addEventListener('click', function() {
                const h3 = this.querySelector('h3');
                const questionText = h3 ? h3.textContent.trim() : '';
                trackEvent('faq_open', 'faq_item', questionText);
            });
        });

        // Lazy loading para imagens (compatível com src tradicional E data-src)
        const images = document.querySelectorAll('img[data-src], img[src]');
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => {
            imageObserver.observe(img);
        });

        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.href && !this.href.includes('#')) {
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
                    this.style.pointerEvents = 'none';
                }
            });
        });

        let hasShownExitIntent = false;
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY <= 0 && !hasShownExitIntent) {
                hasShownExitIntent = true;
                console.log('Exit intent detected - show special offer');
                trackEvent('exit_intent', 'mouse_leave', 'top_of_page');
            }
        });

        // Scroll progress indicator (opcional)
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });

        // ====== GALERIA AUTOMÁTICA DE IMAGENS DA PASTA /image ======
        const galleryContainer = document.getElementById('image-gallery');
        if (galleryContainer) {
            fetch('https://api.github.com/repos/wesleyguerra/lpbrincadeiras/contents/image')
                .then(response => response.json())
                .then(files => {
                    files.forEach(file => {
                        if (
                            file.type === "file" &&
                            /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
                        ) {
                            const img = document.createElement('img');
                            img.src = file.download_url;
                            img.alt = file.name;
                            img.loading = "lazy";
                            img.className = "image-gallery-img";
                            galleryContainer.appendChild(img);
                        }
                    });
                })
                .catch(error => {
                    galleryContainer.innerHTML = "Erro ao carregar imagens.";
                    console.error(error);
                });
        }
        // ====== FIM DA GALERIA AUTOMÁTICA ======
    });

    // Função para validar email (se houver formulário)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função para formatar telefone brasileiro (se houver campo de telefone)
    function formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    }

    // Função para scroll suave para o topo
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Adiciona botão de voltar ao topo (opcional)
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        let backToTopButton = document.getElementById('back-to-top');
        if (scrollTop > 500) {
            if (!backToTopButton) {
                backToTopButton = document.createElement('button');
                backToTopButton.id = 'back-to-top';
                backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
                backToTopButton.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    z-index: 1000;
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateY(20px);
                `;
                backToTopButton.addEventListener('click', scrollToTop);
                document.body.appendChild(backToTopButton);
            }
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'translateY(0)';
        } else if (backToTopButton) {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'translateY(20px)';
        }
    });
    </script>
</body>
</html>
