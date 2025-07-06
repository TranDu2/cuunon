const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // gọi khi load trang
const binaryChars = "01";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.075)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

const introCountdown = ["3", "2", "1"];
const messages = [
    "HELLO!\n TEAM CỪU NON!",
    "TUY KHÔNG SINH\n CÙNG NGÀY",
    "TUY KHÔNG CÓ \nSỐ MÁ",
    "NHƯNG CHÚNG TA CÓ\n 2 THÁNG VUI VẺ",
    "ĐI LÀM CŨNG CHỈ\n THẾ LÀ CÙNG!",
    "CUỐI CÙNG",
    "CHÚC ANH EM\n THÀNH CÔNG NHÉ!",
    "MÃI IU"
];
const allMessages = [...introCountdown, ...messages];
const introFontSizes = { "3": 200, "2": 240, "1": 280 };
const lastMessageIndex = allMessages.length - 1;

const endingImage = document.getElementById("endingImage");
const endingAudio = document.getElementById("endingAudio");

let messageIndex = 0;
let particles = [];

function createParticlesFromText(text) {
    particles = [];

    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d");
    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;

    const isIntro = introCountdown.includes(text);
    const fontSize = isIntro ? introFontSizes[text] : 100;
    offCtx.fillStyle = "white";
    offCtx.font = `bold ${fontSize}px sans-serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    const lines = text.split("\n");
    const lineHeight = fontSize * 1.5;
    const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, i) => {
        offCtx.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });


    const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 6) {
        for (let x = 0; x < canvas.width; x += 6) {
            const i = (y * canvas.width + x) * 4;
            if (imageData.data[i + 3] > 128) {
                particles.push({
                    x: isIntro ? canvas.width / 2 + (Math.random() - 0.5) * 100 : Math.random() * canvas.width,
                    y: isIntro ? canvas.height / 2 + (Math.random() - 0.5) * 100 : Math.random() * canvas.height,
                    tx: x,
                    ty: y,
                    size: 3,
                    vx: 0,
                    vy: 0,
                    alpha: 1,
                    arrived: false,
                    exploded: false
                });
            }
        }
    }

    const showTime = isIntro ? 1000 : 5500;
    const explodeTime = isIntro ? 1500 : 2000;

    setTimeout(() => {
        particles.forEach((p) => {
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = (Math.random() - 0.5) * 2;
            p.exploded = true;
        });

        setTimeout(() => {
            messageIndex++;
            if (messageIndex === allMessages.length) {
                endingImage.style.opacity = 1;
                endingImage.style.transform = "translate(-50%, -50%) scale(1.05)";
                return;
            }

            createParticlesFromText(allMessages[messageIndex]);
        }, explodeTime);
    }, showTime);
}

function animate() {
    drawMatrix();
    ctx.shadowBlur = 0;
    ctx.shadowColor = "#ff99ff";

    particles.forEach((p) => {
        if (!p.arrived) {
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            p.vx = dx * 0.05;
            p.vy = dy * 0.05;
            p.x += p.vx;
            p.y += p.vy;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                p.arrived = true;
                p.x = p.tx;
                p.y = p.ty;
            }
        } else if (p.exploded) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.005;
            if (p.alpha < 0) p.alpha = 0;
        }

        ctx.fillStyle = `rgba(255, 0, 0, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(animate);
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
    startButton.style.display = "none";

    // ✅ Phát nhạc ngay sau khi người dùng nhấn
    endingAudio.volume = 0.1;
    endingAudio.play().catch((e) => {
        console.log("Không phát được nhạc:", e);
    });

    // ✅ Fade-in âm lượng mượt từ 0.1 → 1.0
    let volume = 0.1;
    const fadeInterval = setInterval(() => {
        if (volume < 1.0) {
            volume += 0.02;
            endingAudio.volume = Math.min(volume, 1.0);
        } else {
            clearInterval(fadeInterval);
        }
    }, 200);

    // Bắt đầu hiệu ứng
    createParticlesFromText(allMessages[messageIndex]);
    animate();
});
var settings = {
    particles: {
        length: 10000, // maximum amount of particles
        duration: 4, // particle duration in sec
        velocity: 80, // particle velocity in pixels/sec
        effect: -1.3, // play with this for a nice effect
        size: 8, // particle size in pixels
    },
};
/*
 */
(function () {
    var b = 0; var c = ["ms", "moz", "webkit", "o"]; for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
        window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"]
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (h, e) {
            var d = new Date().getTime(); var f = Math.max(0, 16 - (d - b));
            var g = window.setTimeout(function () { h(d + f) }, f); b = d + f; return g
        }
    }
    if (!window.cancelAnimationFrame) { window.cancelAnimationFrame = function (d) { clearTimeout(d) } }
}());
/*
 * Point class
 */
var Point = (function () {
    function Point(x, y) {
        this.x = (typeof x !== 'undefined') ? x : 0;
        this.y = (typeof y !== 'undefined') ? y : 0;
    }
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.length = function (length) {
        if (typeof length == 'undefined')
            return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    };
    Point.prototype.normalize = function () {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    };
    return Point;
})();
/*
 * Particle class
 */
var Particle = (function () {
    function Particle() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
    }
    Particle.prototype.initialize = function (x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
    };
    Particle.prototype.update = function (deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    };
    Particle.prototype.draw = function (context, image) {
        function ease(t) {
            return (--t) * t * t + 1;
        }
        var size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    };
    return Particle;
})();
/*
 * ParticlePool class
 */
var ParticlePool = (function () {
    var particles,
        firstActive = 0,
        firstFree = 0,
        duration = settings.particles.duration;

    function ParticlePool(length) {
        // create and populate particle pool
        particles = new Array(length);
        for (var i = 0; i < particles.length; i++)
            particles[i] = new Particle();
    }
    ParticlePool.prototype.add = function (x, y, dx, dy) {
        particles[firstFree].initialize(x, y, dx, dy);

        // handle circular queue
        firstFree++;
        if (firstFree == particles.length) firstFree = 0;
        if (firstActive == firstFree) firstActive++;
        if (firstActive == particles.length) firstActive = 0;
    };
    ParticlePool.prototype.update = function (deltaTime) {
        var i;

        // update active particles
        if (firstActive < firstFree) {
            for (i = firstActive; i < firstFree; i++)
                particles[i].update(deltaTime);
        }
        if (firstFree < firstActive) {
            for (i = firstActive; i < particles.length; i++)
                particles[i].update(deltaTime);
            for (i = 0; i < firstFree; i++)
                particles[i].update(deltaTime);
        }

        // remove inactive particles
        while (particles[firstActive].age >= duration && firstActive != firstFree) {
            firstActive++;
            if (firstActive == particles.length) firstActive = 0;
        }


    };
    ParticlePool.prototype.draw = function (context, image) {
        // draw active particles
        if (firstActive < firstFree) {
            for (i = firstActive; i < firstFree; i++)
                particles[i].draw(context, image);
        }
        if (firstFree < firstActive) {
            for (i = firstActive; i < particles.length; i++)
                particles[i].draw(context, image);
            for (i = 0; i < firstFree; i++)
                particles[i].draw(context, image);
        }
    };
    return ParticlePool;
})();
/*
 * Putting it all together
 */
(function (canvas) {
    var context = canvas.getContext('2d'),
        particles = new ParticlePool(settings.particles.length),
        particleRate = settings.particles.length / settings.particles.duration, // particles/sec
        time;

    // get point on heart with -PI <= t <= PI
    function pointOnHeart(t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        );
    }

    // creating the particle image using a dummy canvas
    var image = (function () {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');
        canvas.width = settings.particles.size;
        canvas.height = settings.particles.size;
        // helper function to create the path
        function to(t) {
            var point = pointOnHeart(t);
            point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
            point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
            return point;
        }
        // create the path
        context.beginPath();
        var t = -Math.PI;
        var point = to(t);
        context.moveTo(point.x, point.y);
        while (t < Math.PI) {
            t += 0.01; // baby steps!
            point = to(t);
            context.lineTo(point.x, point.y);
        }
        context.closePath();
        // create the fill
        context.fillStyle = '#006600';
        context.fill();
        // create the image
        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    })();

    // render that thing!
    function render() {
        // next animation frame
        requestAnimationFrame(render);

        // update time
        var newTime = new Date().getTime() / 1000,
            deltaTime = newTime - (time || newTime);
        time = newTime;

        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // create new particles
        var amount = particleRate * deltaTime;
        for (var i = 0; i < amount; i++) {
            var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            var dir = pos.clone().length(settings.particles.velocity);
            particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
        }

        // update and draw particles
        particles.update(deltaTime);
        particles.draw(context, image);
    }

    // handle (re-)sizing of the canvas
    function onResize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    window.onresize = onResize;

    // delay rendering bootstrap
    setTimeout(function () {
        onResize();
        render();
    }, 10);
})(document.getElementById('pinkboard'));

