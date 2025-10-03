
// Simple theme cycling for fallback - UPDATED TO MATCH CSS
function simpleThemeCycle() {
    const root = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'midnight';
    const themes = ['midnight', 'nord', 'forest', 'cyberpunk', 'gruvbox', 'noctua', 'dracula', 'everforest', 'crimson'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    // Apply theme switching with correct CSS attribute handling
    if (nextTheme === 'midnight') {
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', nextTheme);
    }
    localStorage.setItem('theme', nextTheme);
    
    console.log(`Main.js fallback: Theme switched to: ${nextTheme}`);
    
    // Update grid background if available
    if (window.gridBackground) {
        window.gridBackground.updateTheme(nextTheme);
    }
}

// Theme button fallback handler
function initThemeButtonFallback() {
    console.log('Main.js theme fallback initializing on:', window.location.pathname);
    
    // Check multiple times to catch buttons that might load later
    const attempts = [100, 500, 1000, 2000];
    
    attempts.forEach(delay => {
        setTimeout(() => {
            const themeBtn = document.getElementById('theme-toggle-btn');
            const mobileThemeBtn = document.getElementById('mobile-theme-toggle-btn');
            
            console.log(`Attempt at ${delay}ms - Desktop button:`, !!themeBtn, 'Mobile button:', !!mobileThemeBtn);
            
                if (themeBtn && !themeBtn.hasAttribute('data-initialized')) {
                console.log('Checking for simple theme system...');
                
                // Check if simple theme system is available (preferred)
                if (typeof cycleTheme === 'function') {
                    console.log('Simple theme system detected - skipping main.js fallback');
                    return;
                }
                
                console.log('Initializing desktop theme button fallback...');
                themeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Desktop theme button clicked (main.js fallback)');
                    
                    if (window.themeManager && typeof window.themeManager.cycleTheme === 'function') {
                        console.log('Using primary theme system');
                        window.themeManager.cycleTheme();
                    } else {
                        console.warn('Using main.js fallback theme cycling');
                        simpleThemeCycle();
                    }
                    
                    // Visual feedback
                    themeBtn.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        themeBtn.style.transform = '';
                    }, 150);
                });
                themeBtn.setAttribute('data-initialized', 'main-fallback');
                console.log('Desktop theme button initialized (main.js fallback)');
            }            if (mobileThemeBtn && !mobileThemeBtn.hasAttribute('data-initialized')) {
                console.log('Checking for simple theme system (mobile)...');
                
                // Check if simple theme system is available (preferred)
                if (typeof cycleTheme === 'function') {
                    console.log('Simple theme system detected - skipping main.js mobile fallback');
                    return;
                }
                
                console.log('Initializing mobile theme button fallback...');
                mobileThemeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Mobile theme button clicked (main.js fallback)');
                    
                    if (window.themeManager && typeof window.themeManager.cycleTheme === 'function') {
                        console.log('Using primary theme system');
                        window.themeManager.cycleTheme();
                    } else {
                        console.warn('Using main.js fallback theme cycling');
                        simpleThemeCycle();
                    }
                    
                    // Visual feedback
                    mobileThemeBtn.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        mobileThemeBtn.style.transform = '';
                    }, 150);
                });
                mobileThemeBtn.setAttribute('data-initialized', 'main-fallback');
                console.log('Mobile theme button initialized (main.js fallback)');
            }
        }, delay);
    });
}

// Set active class on navigation based on current page
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Get the href path
        const href = link.getAttribute('href');
        
        // Compare the current path with the link's href
        if (href === './index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
            link.classList.add('active');
        } else if (href && currentPath.includes(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
}

//Navbar toggle icon
function navbar_toggler() {
    $('.navbar-toggler[data-toggle=collapse]').click(function () {
        if ($(".navbar-toggler[data-bs-toggle=collapse] i").hasClass('fa-bars')) {
        } else {
            $(".navbar-toggler[data-bs-toggle=collapse] i").removeClass("fa-times");
        }
    });
}
navbar_toggler();
  
// Navbar clone in mobile device
function navClone() {
    $('.js-clone-nav').each(function () {
        var $this = $(this);
        $this.clone().attr('class', 'navbar-nav ml-auto').appendTo('.d2c_mobile_view_body');
    });

    $('.d2c_mobile_view .nav-link').click(function () {
        $(".nav-link").removeClass("active");
        $('.d2c_mobile_view').removeClass('show');
        $(this).toggleClass('active');
    });
    }
    navClone();

// JS for fancybox Slide & button

function fancybox() {
  $('[data-fancybox]').fancybox({
      protect: true,
      buttons: [
          "fullScreen",
          "thumbs",
          "share",
          "slideShow",
          "close"
      ],
      image: {
          preload: false
      },
  });
}
fancybox();

// Call setActiveNavLink when page loads
document.addEventListener('DOMContentLoaded', setActiveNavLink);
document.addEventListener('DOMContentLoaded', initThemeButtonFallback);

// Emergency theme button handler - runs immediately
setTimeout(() => {
    console.log('Emergency theme button check...');
    const btn = document.getElementById('theme-toggle-btn');
    const mobileBtn = document.getElementById('mobile-theme-toggle-btn');
    
    if (btn) {
        console.log('Found desktop theme button, adding emergency handler');
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Emergency desktop theme handler triggered');
            simpleThemeCycle();
        });
    }
    
    if (mobileBtn) {
        console.log('Found mobile theme button, adding emergency handler');
        mobileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Emergency mobile theme handler triggered');
            simpleThemeCycle();
        });
    }
}, 2000);

// Partner Slider
$('.d2c_testimonial_slider').slick({
centerMode: true,
centerPadding: '0px',
dots: false,
arrows: true,
infinite: true,
autoplay:true,
speed: 1000,
slidesToShow: 3,
slidesToScroll: 1,
pauseOnHover:false,
responsive: [
    {
    breakpoint: 1500,
    settings: {
        slidesToShow: 3,
    }
    },
    {
    breakpoint: 992,
    settings: {
        slidesToShow: 2,
    }
    },
    {
    breakpoint: 480,
    settings: {
        slidesToShow: 1,
    }
    }
]
});

// Form Validation Js
(function () {
    'use strict'
  
    var forms = document.querySelectorAll('.needs-validation')
  
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
    })
})();


// Preloader JS
window.addEventListener('load', function() {
    var preloader = document.querySelector('.preloader');
    preloader.classList.add('hide');
});
// WOW JS - staggered card animations for smooth sequential reveal
function initStaggeredWOW() {
  // Choose base delay and step (seconds) for stagger
  var baseDelay = 0.12; // first card delay in seconds
  var stepDelay = 0.08; // incremental delay per card

  // Select the project card wrappers and set data-wow-delay/data-wow-duration
  var cards = document.querySelectorAll('.project-card-wrapper');
  if (cards && cards.length) {
    cards.forEach(function(card, idx) {
      // Only set when not explicitly provided
      var existing = card.getAttribute('data-wow-delay');
      if (!existing) {
        var delay = (baseDelay + idx * stepDelay).toFixed(2) + 's';
        card.setAttribute('data-wow-delay', delay);
      }
      // set a consistent duration for all cards for smoothness
      card.setAttribute('data-wow-duration', '0.7s');
    });
  }

  // Initialize WOW after attributes are set
  wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: false,
    live: true
  });
  wow.init();
}

// Run once DOM is ready so elements exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStaggeredWOW);
} else {
  initStaggeredWOW();
}

// ScrollBtn JS - DISABLED
// window.onscroll = function() { scrollFunction() };

// Subtle mouse-avoid and shrink effect for hero/about images and colored boxes
function addMouseAvoidEffect() {
  function applyEffect(el, direction) {
    el.addEventListener('mousemove', function(e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Move away from mouse, shrink slightly
      const moveX = ((centerX - x) / centerX) * 16 * direction.x;
      const moveY = ((centerY - y) / centerY) * 16 * direction.y;
      const scale = 0.97 + Math.abs(moveX + moveY) * 0.0007;
      el.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
    });
  }
  // Hero image and box
  const heroImgWrapper = document.querySelector('.d2c_hero_img_wrapper');
  if (heroImgWrapper) applyEffect(heroImgWrapper, { x: 1, y: -1 });
  // About image and box
  const aboutImgWrapper = document.querySelector('.d2c_about_img_wrapper');
  if (aboutImgWrapper) applyEffect(aboutImgWrapper, { x: -1, y: 1 });
}
document.addEventListener('DOMContentLoaded', addMouseAvoidEffect);



// Hero Animations
document.addEventListener('DOMContentLoaded', function() {
    // Counter Animation
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.querySelector('.stat-number').textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe counter elements
    document.querySelectorAll('.animate-counter').forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Intersection Observer for card animations
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.style.animationDelay = delay + 's';
                    entry.target.classList.add('animate-card');
                }, delay * 1000);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe highlight cards
    document.querySelectorAll('.highlight-card').forEach(card => {
        cardObserver.observe(card);
    });
    
    // Typing effect for hero badge
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        typingText.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Smooth hover effects for buttons
    document.querySelectorAll('.hero-btn, .community-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

    // SCROLL BUTTON DISABLED
    // function scrollFunction() {
    //     var scrollBtn = document.getElementById("scrollBtn");
    //     if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    //         scrollBtn.classList.add("show");
    //     } else {
    //         scrollBtn.classList.remove("show");
    //     }
    // }

// Counter
$(document).ready(function() {

    var counters = $(".count");
    var countersQuantity = counters.length;
    var counter = [];
  
    for (i = 0; i < countersQuantity; i++) {
      counter[i] = parseInt(counters[i].innerHTML);
    }
  
    var count = function(start, value, id) {
      var localStart = start;
      setInterval(function() {
        if (localStart < value) {
          localStart++;
          counters[id].innerHTML = localStart;
        }
      }, 40);
    }
  
    for (j = 0; j < countersQuantity; j++) {
      count(0, counter[j], j);
    }
  });

// Load More and Explore More Button JS
function updateSliceShow() {
    var windowWidth = $(window).width();
    var $defaultShow, $sliceShow;
  
    if (windowWidth < 768) {
      $defaultShow = 1;
      $sliceShow = 1;
    } else if (windowWidth < 992) {
      $defaultShow = 2;
      $sliceShow = 2;
    } else if (windowWidth < 1200) {
      $defaultShow = 6;
      $sliceShow = 3;
    } else {
      $defaultShow = 6;
      $sliceShow = 3;
    }
  
    return [$sliceShow, $defaultShow];
  }
  
  function load_more($sectionName = "", $locationCol, $btnParentClass ,$btnId, $defaultShow = 6, $sliceShow = 3) {
    $($locationCol).css("display", "none");
    $($sectionName + " " + $btnParentClass).css("display", "none");
  
    $($locationCol).slice(0, $defaultShow).fadeIn();
    if ($($locationCol + ":hidden").length != 0) {
      $($sectionName + " " + $btnParentClass).css("display", "flex");
  
      $($btnId).off("click").on("click", function (e) {
        e.preventDefault();
  
        $($locationCol + ":hidden").slice(0, $sliceShow).slideDown(500);
        if ($($locationCol + ":hidden").length == 0) {
          $($sectionName + " " + $btnParentClass).css("display", "none");
        }
      });
    }
  }
  
  $(document).ready(function () {
    var sliceDefault, sliceShow;
  
    [sliceShow, sliceDefault] = updateSliceShow();
  
    $(window).on("resize", function () {
      [sliceShow, sliceDefault] = updateSliceShow();
  
      load_more(".d2c_services_wrapper", ".service", ".d2c_service_btn" ,"#d2c_service_more", sliceDefault, sliceShow);
      load_more(".d2c_blog_wrapper", ".blog", ".d2c_blog_btn" ,"#d2c_blog_more", sliceDefault, sliceShow);
    });
  
    load_more(".d2c_services_wrapper", ".service", ".d2c_service_btn" ,"#d2c_service_more", sliceDefault, sliceShow);
    load_more(".d2c_blog_wrapper", ".blog", ".d2c_blog_btn" ,"#d2c_blog_more", sliceDefault, sliceShow);
  });

// GitHub Repository Slider
function initGithubSlider() {
  // Destroy existing slider if it exists
  if ($('.github-repo-slider').hasClass('slick-initialized')) {
    $('.github-repo-slider').slick('unslick');
  }
  
  $('.github-repo-slider').slick({
    centerMode: false,
    centerPadding: '0px',
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '20px'
        }
      }
    ]
  });
}

// Initialize slider when window loads
$(window).on('load', function() {
  setTimeout(initGithubSlider, 500);
});




// Template Name: {{ReactProx- React Developer Portfolio Website Templates}}
// Template URL: {{https://designtocodes.com/product/reactprox-react-developer-portfolio-website-templates}}
// Description: {{Purchase your ReactProx- React Developer Portfolio and get seamless integration for react projects plus top-notch portfolio as well.}}
// Author: DesignToCodes
// Author URL: https://www.designtocodes.com
// Text Domain: {{ React Prox }}
