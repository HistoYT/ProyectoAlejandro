const parallax = document.getElementById('parallax');
document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    parallax.style.transform = `translate(${x}px, ${y}px)`;
});