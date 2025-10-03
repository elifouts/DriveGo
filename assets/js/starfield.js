// Car Animation Background with Glowing Rectangles
function createCarAnimation() {
    // Create canvas
    const carCanvas = document.createElement('canvas');
    carCanvas.className = 'starfield-bg';
    document.body.prepend(carCanvas);
    
    // Get context and initialize variables
    const ctx = carCanvas.getContext('2d');
    let w, h, dpr;
    let cars = [];
    let trails = [];
    
    // Function to update canvas size
    function updateCanvasSize() {
        dpr = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        
        carCanvas.width = w * dpr;
        carCanvas.height = h * dpr;
        
        ctx.scale(dpr, dpr);
        
        carCanvas.style.width = w + 'px';
        carCanvas.style.height = h + 'px';
    }
    
    // Function to get random car color
    function getRandomCarColor() {
        const colors = [
            'rgba(131, 165, 152, 0.9)', // accent green
            'rgba(168, 153, 132, 0.7)', // primary tan
            'rgba(235, 219, 178, 0.8)', // light cream
            'rgba(184, 187, 38, 0.6)',  // color_one
            'rgba(177, 98, 134, 0.7)',  // color_two
            'rgba(250, 189, 47, 0.8)',  // warm yellow
            'rgba(69, 133, 136, 0.7)'   // teal
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Function to generate cars
    function generateCars() {
        const numCars = Math.min(30, Math.floor((w * h) / 25000) + 15);
        cars = [];
        
        for (let i = 0; i < numCars; i++) {
            cars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                width: Math.random() * 10 + 6,  // 6-16px wide
                height: Math.random() * 6 + 3,  // 3-9px tall
                vx: (Math.random() - 0.5) * 3,  // velocity x
                vy: (Math.random() - 0.5) * 3,  // velocity y
                color: getRandomCarColor(),
                glowSize: Math.random() * 15 + 10,
                trailPoints: [],
                maxTrailLength: Math.random() * 40 + 20,
                lastX: 0,
                lastY: 0
            });
        }
    }
    
    // Function to update car positions and trails
    function updateCars() {
        cars.forEach(car => {
            // Store previous position
            car.lastX = car.x;
            car.lastY = car.y;
            
            // Update position
            car.x += car.vx;
            car.y += car.vy;
            
            // Add current position to trail
            car.trailPoints.push({
                x: car.x + car.width / 2,
                y: car.y + car.height / 2,
                alpha: 1,
                age: 0
            });
            
            // Limit trail length
            if (car.trailPoints.length > car.maxTrailLength) {
                car.trailPoints.shift();
            }
            
            // Age trail points
            car.trailPoints.forEach(point => {
                point.age++;
                point.alpha = 1 - (point.age / car.maxTrailLength);
                if (point.alpha < 0) point.alpha = 0;
            });
            
            // Wrap around screen edges
            if (car.x > w + 20) {
                car.x = -20;
                car.trailPoints = []; // Clear trail when wrapping
            }
            if (car.x < -20) {
                car.x = w + 20;
                car.trailPoints = [];
            }
            if (car.y > h + 20) {
                car.y = -20;
                car.trailPoints = [];
            }
            if (car.y < -20) {
                car.y = h + 20;
                car.trailPoints = [];
            }
            
            // Slightly random direction changes
            if (Math.random() < 0.002) {
                car.vx += (Math.random() - 0.5) * 0.5;
                car.vy += (Math.random() - 0.5) * 0.5;
                
                // Limit speed
                const maxSpeed = 3;
                const speed = Math.sqrt(car.vx * car.vx + car.vy * car.vy);
                if (speed > maxSpeed) {
                    car.vx = (car.vx / speed) * maxSpeed;
                    car.vy = (car.vy / speed) * maxSpeed;
                }
            }
        });
    }
    
    // Function to draw car trails
    function drawTrails() {
        cars.forEach(car => {
            if (car.trailPoints.length < 2) return;
            
            ctx.strokeStyle = car.color.replace(/[\d\.]+\)$/g, '0.3)');
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            
            for (let i = 1; i < car.trailPoints.length; i++) {
                const point = car.trailPoints[i];
                const prevPoint = car.trailPoints[i - 1];
                
                if (point.alpha > 0) {
                    ctx.globalAlpha = point.alpha * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(prevPoint.x, prevPoint.y);
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;
        });
    }
    
    // Function to draw cars
    function drawCars() {
        cars.forEach(car => {
            // Draw glow effect
            ctx.shadowColor = car.color.replace(/rgba\(([^)]+)\)/, 'rgba($1)');
            ctx.shadowBlur = car.glowSize;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Draw car body (rectangle)
            ctx.fillStyle = car.color;
            ctx.fillRect(car.x, car.y, car.width, car.height);
            
            // Draw headlights
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            
            // Determine car direction and place headlights accordingly
            const isMovingRight = car.vx > 0;
            const isMovingDown = car.vy > 0;
            
            const lightSize = Math.max(1, car.width * 0.15);
            
            if (Math.abs(car.vx) > Math.abs(car.vy)) {
                // Moving horizontally
                if (isMovingRight) {
                    // Headlights on right side
                    ctx.fillRect(car.x + car.width - lightSize, car.y + 1, lightSize, lightSize);
                    ctx.fillRect(car.x + car.width - lightSize, car.y + car.height - lightSize - 1, lightSize, lightSize);
                } else {
                    // Headlights on left side
                    ctx.fillRect(car.x, car.y + 1, lightSize, lightSize);
                    ctx.fillRect(car.x, car.y + car.height - lightSize - 1, lightSize, lightSize);
                }
            } else {
                // Moving vertically
                if (isMovingDown) {
                    // Headlights on bottom
                    ctx.fillRect(car.x + 1, car.y + car.height - lightSize, lightSize, lightSize);
                    ctx.fillRect(car.x + car.width - lightSize - 1, car.y + car.height - lightSize, lightSize, lightSize);
                } else {
                    // Headlights on top
                    ctx.fillRect(car.x + 1, car.y, lightSize, lightSize);
                    ctx.fillRect(car.x + car.width - lightSize - 1, car.y, lightSize, lightSize);
                }
            }
            
            // Reset shadow
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        });
    }
    
    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, w, h);
        
        updateCars();
        drawTrails();
        drawCars();
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    function init() {
        updateCanvasSize();
        generateCars();
        animate();
    }
    
    // Event Listeners
    window.addEventListener('resize', () => {
        updateCanvasSize();
        generateCars();
    });
    
    // Start the car animation
    init();
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCarAnimation);
} else {
    createCarAnimation();
}