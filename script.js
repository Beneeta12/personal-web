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

// Event delegation for all scroll triggers (Desktop + Mobile)
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-scroll-to]');
    if (target) {
        const sectionId = target.getAttribute('data-scroll-to');
        const sectionElement = document.getElementById(sectionId);

        if (sectionElement) {
            // Smooth Scroll
            sectionElement.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu if it's open
            toggleMenu(true);
        }
    }
});

// Toggle mobile menu on button click
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMenu());
}


// --------------------------------------------------------
// 2. FORM VALIDATION
// --------------------------------------------------------

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const formData = new FormData(this);
        const name = (formData.get('name') || '').trim();
        const message = formData.get('message') || '';
        
        // Validation 1: Phone numbers (10 or more consecutive digits)
        const phoneRegex = /(\d[\s-]*){10,}/;
        
        // Validation 2: No numbers allowed in the name field
        const nameHasNumbers = /\d/.test(name);

        let errorMessage = "";

        if (nameHasNumbers) {
            errorMessage = "Error: The Name field should not contain numbers. Please enter a valid name.";
        } else if (phoneRegex.test(name) || phoneRegex.test(message)) {
            errorMessage = "Error: Phone numbers are not allowed. Please remove any contact numbers to proceed.";
        }

        if (errorMessage) {
            e.preventDefault(); // Block the form submission
            
            // Create or update error message UI
            let errorMsgEl = document.getElementById('form-error');
            if (!errorMsgEl) {
                errorMsgEl = document.createElement('p');
                errorMsgEl.id = 'form-error';
                errorMsgEl.style.color = '#ef4444';
                errorMsgEl.style.marginTop = '1rem';
                errorMsgEl.style.fontSize = '0.875rem';
                errorMsgEl.style.fontWeight = '500';
                contactForm.appendChild(errorMsgEl);
            }
            
            errorMsgEl.textContent = errorMessage;
            
            // UI Feedback: Flash the offending input
            const targetInput = nameHasNumbers ? document.querySelector('input[name="name"]') : document.querySelector('.form-textarea');
            if (targetInput) {
                targetInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    targetInput.style.borderColor = '';
                }, 3000);
            }
        }
    });
}


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
