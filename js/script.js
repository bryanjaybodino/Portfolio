// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

if (themeToggle) {
    const icon = themeToggle.querySelector('i');

    // 1. Respect system preferences if no saved theme exists
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;
    const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');

    // Apply initial theme
    applyTheme(savedTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        navbarNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });

    // Sync with system preferences dynamically
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);

        if (icon) {
            icon.classList.toggle('fa-sun', theme === 'dark');
            icon.classList.toggle('fa-moon', theme !== 'dark');
        }

        // Update accessibility states
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navbarNav = document.getElementById('navbarNav');

if (mobileMenuBtn && navbarNav) {
    // Toggle menu state
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navbarNav.classList.toggle('active');

        // Accessibility attribute sync
        mobileMenuBtn.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when clicking nav links
    navbarNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
        if (!navbarNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navbarNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbarNav.classList.contains('active')) {
            navbarNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== SMOOTH SCROLL & ACTIVE LINK HIGHLIGHT =====
const navLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignore empty anchor tags
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Update active navigation items based on scroll position
if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset buffer

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            link.classList.toggle('active', linkHref === `#${currentSectionId}`);
        });
    }, { passive: true });
}

// ===== YEARS OF EXPERIENCE =====
const experienceElement = document.getElementById('yearsOfExperience');

if (experienceElement) {
    const startDate = new Date("2019-01-15");
    const today = new Date();

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    experienceElement.textContent = `${years}+ years`;
}

// ===== INFINITE MARQUEE ANIMATION =====
const track = document.querySelector('.image-scroll-track');

if (track && track.children.length > 0) {
    let animationId = null;
    let position = 0;
    const speed = 0.8; // Smooth baseline speed

    function animate() {
        position -= speed;

        const firstImage = track.firstElementChild;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap || style.columnGap || 32);
        const imageWidth = firstImage.offsetWidth;

        // Reposition element when completely scrolled past
        if (Math.abs(position) >= imageWidth + gap) {
            position += imageWidth + gap;
            track.appendChild(firstImage);
        }

        track.style.transform = `translate3d(${position}px, 0, 0)`;
        animationId = requestAnimationFrame(animate);
    }

    // Pause scroll animation when user hovers or focuses
    track.addEventListener('mouseenter', () => cancelAnimationFrame(animationId));
    track.addEventListener('mouseleave', () => animationId = requestAnimationFrame(animate));

    // Start loop
    animationId = requestAnimationFrame(animate);
}

// ===== IMAGE MODAL POPUP =====
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

// Get all clickable images (Certifications & Featured Projects)
const clickableImages = document.querySelectorAll('.cert-image img, .project-image img');

clickableImages.forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        openImageModal(img);
    });
});

function openImageModal(imgElement) {
    // Get the image source
    const imgSrc = imgElement.src;
    const imgAlt = imgElement.alt || 'Image';

    // Set modal image
    modalImage.src = imgSrc;
    modalImage.alt = imgAlt;

    // Get the rotation class from the original image
    const rotationClass = imgElement.className;

    modalImage.style.transform = 'none';

    // Show modal
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeImageModal() {
    imageModal.classList.remove('active');
    modalImage.src = '';
    modalImage.style.transform = 'none';
    document.body.style.overflow = 'auto'; // Restore background scroll
}

// Close modal on overlay click
modalOverlay.addEventListener('click', closeImageModal);

// Close modal on close button click
if (modalClose) {
    modalClose.addEventListener('click', closeImageModal);
}

// Close modal on ESC key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeImageModal();
    }
});

// Prevent modal content click from closing modal
if (document.querySelector('.modal-content')) {
    document.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}




// Fetch and display visitor count
const COUNTER_API_URL = 'https://api.counterapi.dev/v2/bryanjaybodino-5219/portfolio-5219';

function updateVisitorCount() {
    // Check if this browser tab has already incremented the counter
    const hasCounted = sessionStorage.getItem('has_counted_visit');

    // Only call /up on initial load; use read-only endpoint on refreshes to avoid rate limiting
    const endpoint = hasCounted ? COUNTER_API_URL : COUNTER_API_URL + '/up';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch(endpoint, {
        method: 'GET',
        signal: controller.signal
    })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Counter API unreachable');
            return response.json();
        })
        .then(res => {
            // Mark session as counted after a successful increment call
            if (!hasCounted) {
                sessionStorage.setItem('has_counted_visit', 'true');
            }

            const countElement = document.getElementById('visitor-count');
            if (countElement && res.data && res.data.up_count !== undefined) {
                countElement.textContent = res.data.up_count.toLocaleString();
                countElement.classList.add('count-loaded');
            }
        })
        .catch(error => {
            console.warn('Visitor counter notice:', error.message);
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVisitorCount);
} else {
    updateVisitorCount();
}
function handleMessengerClick(el) {
    // Better mobile detection
    const isMobile = window.matchMedia("(max-width: 1024px)").matches ||
        ('ontouchstart' in window) ||
        navigator.maxTouchPoints > 0;

    // Prevent multiple clicks
    if (el.classList.contains('loading')) return;

    // Show loading only on mobile
    if (isMobile) {
        el.classList.add('loading');
    }

    // Open messenger
    window.open('https://m.me/bodino.a.bryanjay', '_blank');

    // Remove loading after 15 seconds (mobile only)
    if (isMobile) {
        setTimeout(function () {
            el.classList.remove('loading');
        }, 15000);
    }
}