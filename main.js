// Fondo animado de partículas conectadas
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 90;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2.2 + 1,
            dx: (Math.random() - 0.5) * 0.7,
            dy: (Math.random() - 0.5) * 0.7,
           color: `rgba(${180+Math.floor(Math.random()*60)},${220+Math.floor(Math.random()*35)},255,${Math.random() * 0.7 + 0.5})`
        });
    }
}
createParticles();
window.addEventListener('resize', createParticles);

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(160,231,229,${0.22 - dist/900})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

let mouse = {x: 0, y: 0};
canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo gradiente animado
    let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#0f2027");
    grad.addColorStop(1, "#2c5364");
    ctx.fillStyle = grad;
    ctx.globalAlpha = 0.18;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    // Partículas
    for (let p of particles) {
        // Parallax sutil
        let dx = (mouse.x - p.x) * 0.0007;
        let dy = (mouse.y - p.y) * 0.0007;
        p.x += p.dx + dx;
        p.y += p.dy + dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#a0e7e5";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Líneas entre partículas
    drawConnections();

    requestAnimationFrame(animate);
}
animate();