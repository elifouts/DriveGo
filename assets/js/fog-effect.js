// Fog Background Effect
class FogEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.fogLayers = [];
        this.animationId = null;
        this.colors = ['#458588', '#83a598', '#a89984']; // Default Gruvbox colors
        this.init();
    }

    init() {
        this.createCanvas();
        this.createFogLayers();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'fog-background';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -10;
            pointer-events: none;
            opacity: 0.1;
        `;
        document.body.prepend(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    createFogLayers() {
        const layerCount = 4;
        for (let i = 0; i < layerCount; i++) {
            this.fogLayers.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 300 + 100,
                speed: Math.random() * 0.5 + 0.2,
                direction: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.3 + 0.1,
                colorIndex: Math.floor(Math.random() * this.colors.length)
            });
        }
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.fogLayers.forEach(layer => {
            // Update position
            layer.x += Math.cos(layer.direction) * layer.speed;
            layer.y += Math.sin(layer.direction) * layer.speed;

            // Wrap around screen
            if (layer.x > window.innerWidth + layer.radius) layer.x = -layer.radius;
            if (layer.x < -layer.radius) layer.x = window.innerWidth + layer.radius;
            if (layer.y > window.innerHeight + layer.radius) layer.y = -layer.radius;
            if (layer.y < -layer.radius) layer.y = window.innerHeight + layer.radius;

            // Draw fog with theme colors
            const color = this.hexToRgb(this.colors[layer.colorIndex]);
            const gradient = this.ctx.createRadialGradient(
                layer.x, layer.y, 0,
                layer.x, layer.y, layer.radius
            );
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${layer.opacity})`);
            gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(layer.x, layer.y, layer.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateColors(newColors) {
        this.colors = newColors;
        // Update existing layers with new color indices
        this.fogLayers.forEach(layer => {
            layer.colorIndex = Math.floor(Math.random() * this.colors.length);
        });
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 200, g: 200, b: 200}; // fallback
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize fog effect when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (!window.fogEffect) {
        window.fogEffect = new FogEffect();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (window.fogEffect) {
        window.fogEffect.destroy();
    }
});