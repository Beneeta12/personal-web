// --------------------------------------------------------
// 1. NAVIGATION & MENU LOGIC
// --------------------------------------------------------

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');
let isMenuOpen = false;

function toggleMenu(forceClose = false) {
    if (!mobileMenuBtn || !mobileMenu) return;

    if (forceClose) {
        isMenuOpen = false;
    } else {
        isMenuOpen = !isMenuOpen;
    }

    if (isMenuOpen) {
        mobileMenu.classList.add('open');
        iconMenu.classList.add('hidden');
        iconClose.classList.remove('hidden');
    } else {
        mobileMenu.classList.remove('open');
        iconMenu.classList.remove('hidden');
        iconClose.classList.add('hidden');
    }
}

// Event Listener for Menu Button
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMenu());
}


// --------------------------------------------------------
// 2. CENTRALIZED CLICK HANDLER (Event Delegation)
// --------------------------------------------------------

document.addEventListener('click', (e) => {
    // Check if the clicked element (or its parent) has 'data-scroll-to'
    const targetButton = e.target.closest('[data-scroll-to]');

    if (targetButton) {
        e.preventDefault(); // Prevent default anchor behavior
        const sectionId = targetButton.getAttribute('data-scroll-to');
        const sectionElement = document.getElementById(sectionId);

        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
            toggleMenu(true); // Close mobile menu if open
        }
    }
});


// --------------------------------------------------------
// 3. SCROLL SPY (Active Link Highlighter)
// --------------------------------------------------------

const sections = ['home', 'about', 'skills', 'projects', 'resume', 'contact'];
const navButtons = document.querySelectorAll('.nav-links .nav-link');

function setActiveSection() {
    // Trigger highlight when section is 1/3 down the viewport
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        const element = document.getElementById(section);
        // Ensure element exists and we are within its bounds
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
            navButtons.forEach(btn => {
                if (btn.getAttribute('data-scroll-to') === section) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    });
}

// Throttle scroll event for performance
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            setActiveSection();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Initial call
setActiveSection();
