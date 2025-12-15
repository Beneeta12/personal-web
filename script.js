// --------------------------------------------------------
// PERFORMANCE OPTIMIZATION: 
// Wrap icon creation in DOMContentLoaded to prevent blocking 
// the main thread while the browser is parsing the initial HTML.
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});


// --------------------------------------------------------
// 1. NAVIGATION & SCROLL LOGIC
// --------------------------------------------------------

// Helper to handle menu state
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
let isMenuOpen = false;

function toggleMenu(forceClose = false) {
    if (!mobileMenuBtn || !mobileMenu || !menuIcon) return;

    if (forceClose) {
        isMenuOpen = false;
    } else {
        isMenuOpen = !isMenuOpen;
    }

    if (isMenuOpen) {
        mobileMenu.classList.add('open');
        menuIcon.setAttribute('data-lucide', 'x');
    } else {
        mobileMenu.classList.remove('open');
        menuIcon.setAttribute('data-lucide', 'menu');
    }
    // Re-create icons to ensure the 'x' icon is rendered when opened
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Event Listener for Menu Button
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMenu());
}

// --------------------------------------------------------
// 2. CENTRALIZED CLICK HANDLER (Replaces inline onclick)
// --------------------------------------------------------

document.addEventListener('click', (e) => {
    // Check if the clicked element (or its parent) has 'data-scroll-to'
    const targetButton = e.target.closest('[data-scroll-to]');

    if (targetButton) {
        e.preventDefault(); // Prevent default if it's an anchor tag
        const sectionId = targetButton.getAttribute('data-scroll-to');
        const sectionElement = document.getElementById(sectionId);

        if (sectionElement) {
            // Smooth Scroll
            sectionElement.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu if it's open
            toggleMenu(true);
        }
    }
});


// --------------------------------------------------------
// 3. SCROLL SPY (Active Link Highlighter)
// --------------------------------------------------------

const sections = ['home', 'about', 'skills', 'projects', 'resume', 'contact'];
// Select only buttons inside nav-links for desktop highlighting
const navButtons = document.querySelectorAll('.nav-links .nav-link');

function setActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {

            navButtons.forEach(btn => {
                // Match the data-scroll-to attribute with the current section
                if (btn.getAttribute('data-scroll-to') === section) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });
}

// Attach Scroll Event
window.addEventListener('scroll', setActiveSection);

// Initial call to set active state on load
setActiveSection();