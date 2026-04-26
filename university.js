// Sticky Navbar
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Animate on scroll (Intersection Observer)
const revealElements = document.querySelectorAll(
    '.reveal-fade-up, .reveal-fade-right, .reveal-fade-left, .reveal-scale'
);

const revealCallback = function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Number Counter Animation
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.stats');
let hasAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
};

const statsObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !hasAnimated) {
        animateCounters();
        hasAnimated = true;
    }
}, { threshold: 0.5 });

if(statsSection) {
    statsObserver.observe(statsSection);
}

// Countdown Timer
function updateCountdown() {
    const now = new Date();
    // Simulate a target date 12 days from now for demo purpose
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 12);
    targetDate.setHours(targetDate.getHours() + 8);
    targetDate.setMinutes(targetDate.getMinutes() + 45);

    // Normally you'd set a specific fixed date, e.g.,
    // const targetDate = new Date('2026-09-01T00:00:00');
    
    // For demo, we just animate some static numbers by decrementing seconds
    let days = parseInt(document.getElementById('days').innerText);
    let hours = parseInt(document.getElementById('hours').innerText);
    let minutes = parseInt(document.getElementById('minutes').innerText);
    let seconds = parseInt(document.getElementById('seconds').innerText);

    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
                hours = 23;
                days--;
                if(days < 0) {
                    days = 0; hours = 0; minutes = 0; seconds = 0;
                }
            }
        }
    }

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
