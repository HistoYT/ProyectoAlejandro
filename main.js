// Fondo animado de partículas conectadas y formas inmersivas infinitas
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];
let shapes = [];
const PARTICLE_COUNT = window.innerWidth < 600 ? 40 : 80;
const SHAPE_COUNT = 12;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
    createShapes();
});



function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Velocidades variadas y direcciones aleatorias
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.3;
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.5 + 1.2,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            color: `rgba(${180+Math.floor(Math.random()*60)},${220+Math.floor(Math.random()*35)},255,${Math.random() * 0.7 + 0.5})`
        });
    }
}
function createShapes() {
    shapes = [];
    for (let i = 0; i < SHAPE_COUNT; i++) {
        const type = Math.random() > 0.5 ? 'circle' : 'triangle';
        shapes.push({
            type,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 80 + 40,
            angle: Math.random() * Math.PI * 2,
            speed: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.18 + 0.07,
            color: type === 'circle'
                ? `rgba(160,231,229,${Math.random() * 0.12 + 0.08})`
                : `rgba(247,183,49,${Math.random() * 0.12 + 0.08})`
        });
    }
}
createParticles();
createShapes();
window.addEventListener('resize', createParticles);
window.addEventListener('resize', createShapes);

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(160,231,229,${0.22 - dist/900})`;
                ctx.lineWidth = 1;
                ctx.shadowColor = "#a0e7e5";
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }
}

let mouse = {x: 0, y: 0};
canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function drawShapes() {
    for (let s of shapes) {
        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        if (s.type === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, s.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.shadowColor = "#a0e7e5";
            ctx.shadowBlur = 24;
            ctx.fill();
        } else if (s.type === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -s.size / 2);
            ctx.lineTo(-s.size / 2, s.size / 2);
            ctx.lineTo(s.size / 2, s.size / 2);
            ctx.closePath();
            ctx.fillStyle = s.color;
            ctx.shadowColor = "#f7b731";
            ctx.shadowBlur = 24;
            ctx.fill();
        }
        ctx.restore();

        // Movimiento infinito y rotación
        s.x += Math.cos(s.angle) * 0.18 + s.speed;
        s.y += Math.sin(s.angle) * 0.18 + s.speed;
        s.angle += 0.001 + s.speed * 0.02;

        // Reaparece por el otro lado si sale de pantalla
        if (s.x < -100) s.x = canvas.width + 100;
        if (s.x > canvas.width + 100) s.x = -100;
        if (s.y < -100) s.y = canvas.height + 100;
        if (s.y > canvas.height + 100) s.y = -100;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo gradiente animado
    let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#0f2027");
    grad.addColorStop(1, "#2c5364");
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // Formas inmersivas
    drawShapes();

    // Partículas
    for (let p of particles) {
        // Parallax sutil
        let dx = (mouse.x - p.x) * 0.0007;
        let dy = (mouse.y - p.y) * 0.0007;
        p.x += p.dx + dx;
        p.y += p.dy + dy;

        // Rebote infinito
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#a0e7e5";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Líneas entre partículas
    drawConnections();

    requestAnimationFrame(animate);
}
animate();