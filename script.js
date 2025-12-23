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
// 2. FORM VALIDATION (No Phone Numbers Allowed)
// --------------------------------------------------------

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const formData = new FormData(this);
        const name = formData.get('name') || '';
        const message = formData.get('message') || '';
        
        // Regular expression to find 10 or more consecutive digits
        // or digits with common separators like dashes or spaces
        const phoneRegex = /(\d[\s-]*){10,}/;

        if (phoneRegex.test(name) || phoneRegex.test(message)) {
            e.preventDefault(); // Block the form submission
            
            // Create or update error message UI
            let errorMsg = document.getElementById('form-error');
            if (!errorMsg) {
                errorMsg = document.createElement('p');
                errorMsg.id = 'form-error';
                errorMsg.style.color = '#ef4444';
                errorMsg.style.marginTop = '1rem';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.style.fontWeight = '500';
                contactForm.appendChild(errorMsg);
            }
            
            errorMsg.textContent = "Error: Phone numbers are not allowed in the name or message fields. Please remove any contact numbers to proceed.";
            
            // Highlight the message box briefly
            const messageBox = document.querySelector('.form-textarea');
            if (messageBox) {
                messageBox.style.borderColor = '#ef4444';
                setTimeout(() => {
                    messageBox.style.borderColor = '';
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
