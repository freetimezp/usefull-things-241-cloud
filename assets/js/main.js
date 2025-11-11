// --- SCENE LOGIC ---
let isNight = false;
const cycleDuration = 20; // seconds
const progressRing = document.querySelector(".progress-ring");
const timerText = document.getElementById("timer-text");
const title = document.getElementById("scene-title");

const circumference = 2 * Math.PI * 54;
progressRing.style.strokeDasharray = circumference;

let elapsed = 0;
let direction = 1; // 1 = forward, -1 = backward

function updateTimer() {
    elapsed += 0.01;
    const progress = elapsed / cycleDuration;

    // Calculate the offset depending on direction (forward/backward)
    const offset = direction === 1 ? progress * circumference : (1 - progress) * circumference;

    progressRing.style.strokeDashoffset = offset;

    const remaining = Math.max(0, cycleDuration - elapsed);
    timerText.textContent = `${remaining.toFixed(0)}s`;

    // When the timer completes a cycle
    if (elapsed >= cycleDuration) {
        isNight = !isNight;
        document.body.classList.toggle("night", isNight);
        elapsed = 0;
        direction *= -1; // reverse animation direction
    }

    // Sync title
    title.textContent = isNight ? "Stars Dream" : "Sunny Skies";

    requestAnimationFrame(updateTimer);
}
requestAnimationFrame(updateTimer);

// --- STARFIELD + METEORS ---
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
let meteors = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Generate stars
for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2,
        alpha: Math.random(),
        speed: 0.02 + Math.random() * 0.02,
    });
}

// Draw stars
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.fill();

        star.alpha += star.speed * (Math.random() > 0.5 ? 1 : -1);
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;
    });
}

// Meteors
function spawnMeteor() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.3;
    meteors.push({ x, y, length: 80 + Math.random() * 40, speed: 10 + Math.random() * 5, alpha: 1 });
}

function drawMeteors() {
    for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        ctx.beginPath();
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.length, m.y + m.length / 3);
        grad.addColorStop(0, `rgba(255,255,255,${m.alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.length, m.y + m.length / 3);
        ctx.stroke();

        m.x -= m.speed;
        m.y += m.speed * 0.3;
        m.alpha -= 0.02;

        if (m.alpha <= 0) meteors.splice(i, 1);
    }
}

function animateStars() {
    if (isNight) {
        drawStars();
        drawMeteors();
        if (Math.random() < 0.005) spawnMeteor();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(animateStars);
}
animateStars();

// --- LIGHT PARALLAX EFFECT ---
document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 10;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
    document.querySelector(".scene-title").style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
});
