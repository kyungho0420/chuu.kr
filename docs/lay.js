/**
 * CHUU - Vintage Kitsch & Creamy
 */
const siteConfig = {
    meta: {
        framework: 'V4',
        type: 'page',
        mode: 'demo',
        lang: 'ko',
        theme: false,
        scroll_smooth: true
    },
    api: {
        server: 'damso',
        turnstile: '0x4AAAAAABrG4DQP8tkp1_TI',
        redirect: '../'
    },
    canvas: {
        target: '#home',
        effect: 'heartEffect',
        overlay: 'dotted',
        brightness: 0.8,

        image_type: 'cover',
        image_count: 3,
        image_slide: 6,
        image_path: './section/home/',
        image_format: 'jpg'
    },
    buttons: [
        { name: 'Profile', icon: 'mail', url: '#profile' },
        { name: 'Search', icon: 'search', url: '#search' },
        { name: 'Request', icon: 'auto_awesome', url: '#request' }
    ]
};

// Custom Effect Implementation (Tier 3 Extension)
window.heartEffect = {
    canvas: null,
    ctx: null,
    animationFrameId: null,
    hearts: [],
    sparkles: [],
    mouse: { x: null, y: null, radius: 100 },
    width: 0,
    height: 0,
    heartBaseColors: [[255, 139, 167], [255, 209, 220], [255, 245, 157], [178, 235, 242]],
    numberOfHearts: 45,

    init: function (container) {
        this.container = container;
        // V4 Canvas Plug creates .damso-canvas__effect
        this.canvas = this.container.querySelector('.damso-canvas__effect');

        if (!this.canvas) {
            // Fallback if not created by plug (should be, but just in case)
            this.canvas = document.createElement('canvas');
            this.canvas.className = 'damso-canvas__effect';
            this.container.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createHearts();

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onResize = this.resize.bind(this);
        this.animate = this.animate.bind(this);

        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseout', this.onMouseOut);
        window.addEventListener('resize', this.onResize);

        this.animate();
    },

    resize: function () {
        if (!this.container) return;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    drawHeart: function (x, y, size, color, rotation) {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.translate(-x, -y);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(x, y + topCurveHeight);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
        this.ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    },

    createHearts: function () {
        this.hearts = [];
        for (let i = 0; i < this.numberOfHearts; i++) {
            this.hearts.push(this.createHeart());
        }
    },

    createHeart: function () {
        const size = (Math.random() * 20) + 12;
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const directionX = (Math.random() * 0.6) - 0.3;
        const directionY = (Math.random() * 0.6) - 0.3;
        const baseColor = this.heartBaseColors[Math.floor(Math.random() * this.heartBaseColors.length)];
        const alpha = Math.random() * 0.5 + 0.3;
        const color = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${alpha})`;
        const rotation = (Math.random() - 0.5) * 0.8;
        return { x, y, directionX, directionY, size, color, rotation };
    },

    animate: function () {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.hearts.forEach(h => {
            if (h.x > this.width + h.size || h.x < -h.size) h.x = (h.directionX > 0) ? -h.size : this.width + h.size;
            if (h.y > this.height + h.size || h.y < -h.size) h.y = (h.directionY > 0) ? -h.size : this.height + h.size;

            if (this.mouse.x !== null) {
                const dx = this.mouse.x - h.x;
                const dy = this.mouse.y - h.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius + h.size) {
                    h.x -= dx / 20;
                    h.y -= dy / 20;
                }
            }
            h.x += h.directionX;
            h.y += h.directionY;
            this.drawHeart(h.x, h.y, h.size, h.color, h.rotation);
        });

        if (Math.random() > 0.94) {
            this.sparkles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3 + 1,
                life: 1,
                opacity: 1
            });
        }

        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            const s = this.sparkles[i];
            s.life -= 0.02;
            s.opacity = s.life;
            if (s.life <= 0) {
                this.sparkles.splice(i, 1);
            } else {
                this.ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        this.animationFrameId = requestAnimationFrame(this.animate);
    },

    onMouseMove: function (event) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    },

    onMouseOut: function () {
        this.mouse.x = null;
        this.mouse.y = null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.V4) {
        window.V4.init(siteConfig).then((app) => {
            app.registerEffect('heartEffect', window.heartEffect);
        });
    }
});