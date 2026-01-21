// ========================================
// Global Variables
// ========================================

let conversationHistory = [];

// ========================================
// DOM Elements
// ========================================

const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.getElementById('themeOptions');
const themeOptionButtons = document.querySelectorAll('.theme-option');
const paletteToggle = document.getElementById('paletteToggle');
const paletteOptions = document.getElementById('paletteOptions');
const paletteOptionButtons = document.querySelectorAll('.palette-option');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMessages = document.getElementById('chatbotMessages');
const contactForm = document.getElementById('contactForm');

// ========================================
// Theme Management
// ========================================

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'default';
document.documentElement.setAttribute('data-theme', savedTheme);

// Toggle theme options
themeToggle.addEventListener('click', () => {
    themeOptions.classList.toggle('active');
});

// Close theme options when clicking outside
document.addEventListener('click', (e) => {
    if (!themeToggle.contains(e.target) && !themeOptions.contains(e.target)) {
        themeOptions.classList.remove('active');
    }
});

// Theme selection
themeOptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeOptions.classList.remove('active');

        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    });
});

// ========================================
// Color Palette Management
// ========================================

// Load saved palette
const savedPalette = localStorage.getItem('colorPalette') || 'blue';
document.documentElement.setAttribute('data-palette', savedPalette);

// Update active palette button
paletteOptionButtons.forEach(btn => {
    if (btn.getAttribute('data-palette') === savedPalette) {
        btn.classList.add('active');
    }
});

// Toggle palette options
if (paletteToggle) {
    paletteToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        paletteOptions.classList.toggle('active');
    });
}

// Close palette options when clicking outside
document.addEventListener('click', (e) => {
    if (paletteOptions && !paletteToggle.contains(e.target) && !paletteOptions.contains(e.target)) {
        paletteOptions.classList.remove('active');
    }
});

// Palette selection
paletteOptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const palette = button.getAttribute('data-palette');

        // Update active state
        paletteOptionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Apply palette
        document.documentElement.setAttribute('data-palette', palette);
        localStorage.setItem('colorPalette', palette);
        paletteOptions.classList.remove('active');

        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    });
});

// ========================================
// Navigation
// ========================================

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Close mobile menu for all links
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';

        // Only handle internal anchor links for smooth scroll
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to section
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Header shadow on scroll
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ========================================
// Chatbot Functionality
// ========================================

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
    chatbotInput.focus();
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// Add message to chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;

    const messageText = document.createElement('p');
    messageText.textContent = content;

    messageDiv.appendChild(messageText);
    chatbotMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Add loading message
function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message loading';
    messageDiv.id = 'loading-message';

    const messageText = document.createElement('p');
    messageText.textContent = 'Escribiendo';

    messageDiv.appendChild(messageText);
    chatbotMessages.appendChild(messageDiv);

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Remove loading message
function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Send message to Claude API through serverless function
async function sendMessageToClaude(userMessage) {
    // Add user message to conversation history
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    try {
        // Llamar a nuestra función serverless en /api/chat
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory,
                systemPrompt: CHATBOT_CONFIG.SYSTEM_PROMPT,
                model: CHATBOT_CONFIG.MODEL,
                maxTokens: CHATBOT_CONFIG.MAX_TOKENS
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        const assistantMessage = data.content[0].text;

        // Add assistant message to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    } catch (error) {
        console.error('Error al comunicarse con el chatbot:', error);
        return `Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente o contáctanos directamente al ${CHATBOT_CONFIG.PHONE}.`;
    }
}

// Handle chatbot form submission
chatbotForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    chatbotInput.value = '';

    // Show loading message
    addLoadingMessage();

    // Send message to Claude and get response
    const response = await sendMessageToClaude(message);

    // Remove loading message
    removeLoadingMessage();

    // Add bot response to chat
    addMessage(response, false);
});

// ========================================
// Contact Form
// ========================================

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Create submit button reference
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Show success message
        alert('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.');

        // Reset form
        contactForm.reset();

        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 1500);

    // In production, you would send this to your backend:
    /*
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        } else {
            throw new Error('Error al enviar el formulario');
        }
    } catch (error) {
        alert('Hubo un error al enviar tu consulta. Por favor, intenta nuevamente.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
    */
});

// ========================================
// Smooth Scroll (for all anchor links except nav links)
// ========================================

// Handle all anchor links (including hero buttons, footer links, etc.)
// Note: nav links are handled separately above to avoid duplicate event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only handle internal anchor links
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Smooth scroll to section
                    const headerOffset = 80;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// ========================================
// Scroll Animations
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .fleet-card, .value-item, .stat-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ========================================
// Form Validation
// ========================================

const formInputs = document.querySelectorAll('input, textarea, select');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = 'var(--accent-color)';
        } else {
            this.style.borderColor = 'var(--border-color)';
        }
    });

    input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(245, 158, 11)' || this.style.borderColor === 'var(--accent-color)') {
            if (this.value.trim()) {
                this.style.borderColor = 'var(--border-color)';
            }
        }
    });
});

// Email validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = 'var(--accent-color)';
        } else if (this.value) {
            this.style.borderColor = 'var(--primary-color)';
        }
    });
}

// ========================================
// Stats Counter Animation
// ========================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isPercentage = target <= 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const statNumbers = entry.target.querySelectorAll('.stat-number');

            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const isPercentage = text.includes('%');
                const is247 = text.includes('24/7');

                if (is247) {
                    // Don't animate 24/7
                    return;
                }

                const value = parseInt(text.replace(/\D/g, ''));
                stat.textContent = '0' + (isPercentage ? '%' : '+');
                setTimeout(() => animateCounter(stat, value), 200);
            });
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about-stats');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// ========================================
// Keyboard Navigation
// ========================================

document.addEventListener('keydown', (e) => {
    // Close chatbot with Escape key
    if (e.key === 'Escape' && chatbotContainer.classList.contains('active')) {
        chatbotContainer.classList.remove('active');
    }

    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close theme options with Escape key
    if (e.key === 'Escape' && themeOptions.classList.contains('active')) {
        themeOptions.classList.remove('active');
    }
});

// ========================================
// Performance Optimization
// ========================================

// Lazy load images (if you add images later)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// Promo Modal Management
// ========================================

const promoModal = document.getElementById('promo-modal');
const promoCloseBtn = document.querySelector('.promo-close-btn');
const promoOverlay = document.querySelector('.promo-modal-overlay');

// Function to show promo modal
function showPromoModal() {
    if (promoModal) {
        promoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Function to close promo modal
function closePromoModal() {
    if (promoModal) {
        promoModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Show modal after 500ms (optional - commented out by default)
// setTimeout(showPromoModal, 500);

// Auto-close after 7.5 seconds (optional)
// setTimeout(closePromoModal, 7500);

// Close button event
if (promoCloseBtn) {
    promoCloseBtn.addEventListener('click', closePromoModal);
}

// Close on overlay click
if (promoOverlay) {
    promoOverlay.addEventListener('click', closePromoModal);
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && promoModal && promoModal.classList.contains('active')) {
        closePromoModal();
    }
});

// ========================================
// Portal Images Auto-Rotation
// ========================================

let portalRotateInterval;
let currentPortalImage = 0;

function rotatePortalImages() {
    const portalImages = document.querySelectorAll('.portal-img');

    if (portalImages.length > 0) {
        // Remove active class from all images
        portalImages.forEach(img => img.classList.remove('active'));

        // Move to next image
        currentPortalImage = (currentPortalImage + 1) % portalImages.length;

        // Add active class to current image
        portalImages[currentPortalImage].classList.add('active');
    }
}

function initPortalRotation() {
    const portalImages = document.querySelectorAll('.portal-img');

    if (portalImages.length > 1) {
        // Start auto-rotation every 5 seconds
        portalRotateInterval = setInterval(rotatePortalImages, 5000);

        // Manual click to change image
        const portalStack = document.querySelector('.portal-images-stack');
        if (portalStack) {
            portalStack.addEventListener('click', () => {
                // Clear auto-rotation
                clearInterval(portalRotateInterval);

                // Rotate image
                rotatePortalImages();

                // Restart auto-rotation
                portalRotateInterval = setInterval(rotatePortalImages, 5000);
            });
        }
    }
}

// Initialize portal rotation when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortalRotation);
} else {
    initPortalRotation();
}

// ========================================
// Console Message
// ========================================

console.log('%c¡Bienvenido a CMD Mudanzas!', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%cSitio web desarrollado con las mejores prácticas de SEO y UX', 'color: #6b7280; font-size: 14px;');

// ========================================
// Service Worker Registration (for PWA support)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you create a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ========================================
// Error Handling
// ========================================

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    // You can send errors to your analytics service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send errors to your analytics service here
});

// ========================================
// Initialize
// ========================================

console.log('CMD Mudanzas website initialized successfully!');
