// Initialize Three.js Scene for 3D Elements
let scene, camera, renderer, joystick;
let isAnimating = false;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(200, 200);
    document.querySelector('.joystick-3d').appendChild(renderer.domElement);

    // Create joystick geometry
    const geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,
        shininess: 100
    });
    joystick = new THREE.Mesh(geometry, material);
    scene.add(joystick);

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    joystick.rotation.x += 0.01;
    joystick.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// Parallax Effect
function parallax(e) {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.5;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}

// Smooth Scroll with Progress Indicator
function initSmoothScroll() {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// Responsive Navigation
function initResponsiveNav() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';
    cursor.appendChild(cursorInner);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let cursorInnerX = 0, cursorInnerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Add hover effect
        const target = e.target;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
            cursor.classList.add('hover');
        } else {
            cursor.classList.remove('hover');
        }
    });

    function animate() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        // Inner cursor follows with delay
        cursorInnerX += (mouseX - cursorInnerX) * 0.2;
        cursorInnerY += (mouseY - cursorInnerY) * 0.2;
        cursorInner.style.transform = `translate(${cursorInnerX}px, ${cursorInnerY}px)`;

        requestAnimationFrame(animate);
    }

    animate();
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            // Play click sound
            if (window.soundManager) {
                window.soundManager.playSound('click');
            }
            
            // Add press animation
            this.themeToggle.classList.add('pressed');
            setTimeout(() => this.themeToggle.classList.remove('pressed'), 200);

            // Toggle theme
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });

        // Add hover sound effect
        this.themeToggle.addEventListener('mouseenter', () => {
            if (window.soundManager) {
                window.soundManager.playSound('hover');
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateIcon(theme);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    updateIcon(theme) {
        // Remove old classes
        this.themeIcon.className = '';
        // Add new classes
        this.themeIcon.classList.add('fas');
        this.themeIcon.classList.add(theme === 'light' ? 'fa-moon' : 'fa-sun');
        
        // Add animation class
        this.themeIcon.classList.add('rotate-icon');
        setTimeout(() => this.themeIcon.classList.remove('rotate-icon'), 500);
    }
}

// Sound Manager
class SoundManager {
    constructor() {
        this.sounds = {
            hover: new Howl({
                src: ['sounds/hover.mp3'],
                volume: 0.3
            }),
            click: new Howl({
                src: ['sounds/click.mp3'],
                volume: 0.4
            })
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
}

// Form Validation and Animation
function initForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('.submit-btn');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            soundManager.playSound('hover');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.classList.add('loading');
        soundManager.playSound('click');

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        submitBtn.classList.remove('loading');
        showNotification('MESSAGE SENT!', 'success');
        form.reset();
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Responsive Image Loading
function initResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Start Button Functionality
function initStartButton() {
    const startBtn = document.querySelector('.start-btn');
    const heroSection = document.querySelector('.hero');
    const mainContent = document.querySelector('main');
    
    // Initially hide all content below hero
    document.querySelectorAll('section:not(.hero)').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
    });

    startBtn.addEventListener('click', () => {
        // Play click sound
        soundManager.playSound('click');
        
        // Animate start button
        startBtn.classList.add('pressed');
        
        // Hide hero section with fade out
        heroSection.style.transition = 'all 0.5s ease';
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-100%)';
        
        // Show main content with fade in
        setTimeout(() => {
            document.querySelectorAll('section:not(.hero)').forEach(section => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            });
            
            // Enable scrolling
            document.body.style.overflow = 'auto';
        }, 500);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initially disable scrolling
    document.body.style.overflow = 'hidden';
    
    initThreeJS();
    initSmoothScroll();
    initIntersectionObserver();
    initResponsiveNav();
    initCustomCursor();
    initForm();
    initResponsiveImages();
    initStartButton();

    // Initialize sound manager
    window.soundManager = new SoundManager();

    // Initialize theme manager
    window.themeManager = new ThemeManager();

    // Add parallax effect
    document.addEventListener('mousemove', parallax);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Theme change listener
    window.addEventListener('themechange', (e) => {
        // Update Three.js materials if needed
        if (window.joystick) {
            joystick.material.color.setHex(
                e.detail.theme === 'light' ? 0x00aa00 : 0x00ff00
            );
        }
    });
}); 