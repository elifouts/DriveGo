// Centralized Email Popup System
// Gruvbox-themed, non-intrusive, click-position based popup

function showEmailPopup(event) {
    const email = 'eligfouts@gmail.com';
    
    // Prevent default behavior and get click position
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Get click coordinates or default to center-ish
    const clickX = event ? event.clientX : window.innerWidth / 2;
    const clickY = event ? event.clientY : window.innerHeight / 2;
    
    // Calculate popup position (offset from click to avoid covering cursor)
    const popupX = Math.min(clickX + 30, window.innerWidth - 80);
    const popupY = Math.max(clickY - 40, 40);
    
    // Remove any existing popup
    const existingPopup = document.getElementById('emailPopup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create beautiful circular clipboard button
    const popupHTML = `
        <div id="emailPopup" style="
            position: fixed;
            left: ${popupX}px;
            top: ${popupY}px;
            z-index: 10000;
            transform: scale(0) rotate(-180deg);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
        ">
            <!-- Main circular button -->
            <div class="email-circle-btn" onclick="copyEmailInstant('${email}')" style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #fefcf5 0%, #f5f1e8 100%);
                border: 2px solid rgba(168, 153, 132, 0.2);
                box-shadow: 
                    0 8px 25px rgba(0, 0, 0, 0.15),
                    0 4px 12px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                overflow: hidden;
            " 
            onmouseover="emailBtnHover(this, true)" 
            onmouseout="emailBtnHover(this, false)">
                
                <!-- Animated background shimmer -->
                <div style="
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                " class="shimmer-effect"></div>
                
                <!-- Clipboard icon -->
                <i class="fas fa-clipboard" style="
                    font-size: 20px;
                    color: #458588;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 2;
                "></i>
                
                <!-- Floating tooltip -->
                <div class="tooltip" style="
                    position: absolute;
                    bottom: 70px;
                    left: 50%;
                    transform: translateX(-50%) scale(0);
                    background: rgba(50, 48, 47, 0.95);
                    color: #ebdbb2;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 500;
                    white-space: nowrap;
                    transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    opacity: 0;
                ">
                    Click to copy email
                    <div style="
                        position: absolute;
                        top: 100%;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 6px solid rgba(50, 48, 47, 0.95);
                    "></div>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to body
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // Animate in with spectacular entrance
    requestAnimationFrame(() => {
        const popup = document.getElementById('emailPopup');
        if (popup) {
            popup.style.transform = 'scale(1) rotate(0deg)';
            popup.style.opacity = '1';
            
            // Add a subtle bounce after entrance
            setTimeout(() => {
                popup.style.transform = 'scale(1.05) rotate(0deg)';
            }, 200);
            
            setTimeout(() => {
                popup.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }
    });
    
    // Auto-close after 6 seconds of no interaction
    setTimeout(() => {
        const popup = document.getElementById('emailPopup');
        if (popup) {
            closeEmailPopup();
        }
    }, 6000);
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick, { once: true });
    }, 100);
}

// Hover animation function
function emailBtnHover(element, isHover) {
    const icon = element.querySelector('i');
    const tooltip = element.querySelector('.tooltip');
    const shimmer = element.querySelector('.shimmer-effect');
    
    if (isHover) {
        element.style.transform = 'translateY(-4px) scale(1.05)';
        element.style.boxShadow = `
            0 12px 35px rgba(0, 0, 0, 0.2),
            0 6px 20px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05)`;
        icon.style.color = '#689d6a';
        icon.style.transform = 'scale(1.1)';
        tooltip.style.transform = 'translateX(-50%) scale(1)';
        tooltip.style.opacity = '1';
        shimmer.style.transform = 'translateX(100%)';
    } else {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = `
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05)`;
        icon.style.color = '#458588';
        icon.style.transform = 'scale(1)';
        tooltip.style.transform = 'translateX(-50%) scale(0)';
        tooltip.style.opacity = '0';
        shimmer.style.transform = 'translateX(-100%)';
    }
}

function copyEmailInstant(email) {
    const popup = document.getElementById('emailPopup');
    const button = popup.querySelector('.email-circle-btn');
    const icon = button.querySelector('i');
    
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(() => {
        // Success animation sequence
        button.style.background = 'linear-gradient(135deg, #d5f4e6 0%, #b8e6d2 100%)';
        button.style.transform = 'translateY(-4px) scale(1.15)';
        
        // Icon morph animation
        icon.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            icon.className = 'fas fa-check';
            icon.style.color = '#689d6a';
            icon.style.transform = 'scale(1.2) rotate(0deg)';
        }, 150);
        
        // Ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(104, 157, 106, 0.3);
            transform: translate(-50%, -50%);
            transition: all 0.6s ease-out;
            pointer-events: none;
        `;
        button.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.width = '120px';
            ripple.style.height = '120px';
            ripple.style.opacity = '0';
        });
        
        // Cleanup and close
        setTimeout(() => {
            closeEmailPopup();
        }, 800);
        
    }).catch(() => {
        // Error state
        button.style.background = 'linear-gradient(135deg, #fec5bb 0%, #fcd5ce 100%)';
        icon.style.color = '#d62d20';
        
        setTimeout(() => closeEmailPopup(), 1000);
    });
}

function closeEmailPopup() {
    const popup = document.getElementById('emailPopup');
    if (popup) {
        // Spectacular exit animation
        popup.style.transform = 'scale(0) rotate(180deg) translateY(-20px)';
        popup.style.opacity = '0';
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 400);
    }
}

function handleOutsideClick(event) {
    const popup = document.getElementById('emailPopup');
    if (popup && !popup.contains(event.target)) {
        closeEmailPopup();
    }
}

// Update all email click handlers to pass the event
document.addEventListener('DOMContentLoaded', function() {
    // Find all email links and update their onclick handlers
    const emailElements = document.querySelectorAll('[onclick*="showEmailPopup"]');
    emailElements.forEach(element => {
        element.onclick = function(event) {
            showEmailPopup(event);
            return false;
        };
    });
});