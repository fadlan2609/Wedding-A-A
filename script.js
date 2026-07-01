// ========== INISIALISASI AOS ==========
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out'
});

// ========== DATA ==========
const galleryImages = [
    'assets/galeri/poto1.jpg',
    'assets/galeri/poto2.jpg',
    'assets/galeri/poto3.jpg',
    'assets/galeri/poto4.jpg',
    'assets/galeri/poto5.jpg',
    'assets/galeri/poto6.jpg'
];

const weddingDate = new Date(2026, 6, 25, 0, 0, 0);
const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8jsaBJRszO06W36kvZtG_YBbevXIo5_JTIn44CiM-Xnos18BF3u_sT_0w_GAnIwNN/exec';

// ========== NAMA TAMU ==========
const urlParams = new URLSearchParams(window.location.search);
let guestName = urlParams.get('to') || urlParams.get('nama') || "Tamu Undangan";
guestName = decodeURIComponent(guestName);

const homeGuestName = document.getElementById('home-guest-name');
const navGuestName = document.getElementById('nav-guest-name');
if (homeGuestName) homeGuestName.innerText = guestName;
if (navGuestName) navGuestName.innerText = guestName;

// ========== LOADING SCREEN ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
});

// ========== HEADER SHOW/HIDE ==========
let headerShown = false;
const headerNav = document.getElementById('header-nav');

function showHeader() {
    if (!headerShown && headerNav) {
        headerNav.style.display = 'block';
        headerShown = true;
        // Trigger reflow untuk animasi
        void headerNav.offsetWidth;
    }
}

// ========== SCROLL FUNCTIONS ==========
function scrollToNextSection(currentSectionId) {
    const sections = document.querySelectorAll('.section');
    let currentIndex = -1;
    sections.forEach((section, index) => {
        if (section.id === currentSectionId) {
            currentIndex = index;
        }
    });
    if (currentIndex !== -1 && currentIndex + 1 < sections.length) {
        const nextSection = sections[currentIndex + 1];
        const offset = 70;
        const elementPosition = nextSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 70;
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
}

// Scroll Down Buttons
document.querySelectorAll('.scroll-down-btn-small').forEach(btn => {
    btn.addEventListener('click', () => {
        const parentSection = btn.closest('.section');
        if (parentSection) {
            scrollToNextSection(parentSection.id);
        }
    });
});

// ========== NAVIGATION ==========
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function updateActiveNav() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 150;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const sectionId = link.getAttribute('data-section');
        scrollToSection(sectionId);
    });
});

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ========== MUSIC PLAYER ==========
let bgMusic = null;
let isMusicPlaying = false;
let musicStarted = false;

function initAudio() {
    if (!bgMusic) {
        bgMusic = document.getElementById('bgm');
        if (!bgMusic) {
            bgMusic = new Audio('assets/music/lagu.mp3');
            bgMusic.loop = true;
            bgMusic.volume = 0.4;
        }
    }
}

function playMusic() {
    initAudio();
    bgMusic.play()
        .then(() => {
            isMusicPlaying = true;
            musicStarted = true;
            updateMusicButton(true);
        })
        .catch(err => console.log('Autoplay blocked:', err));
}

function pauseMusic() {
    if (bgMusic) {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicButton(false);
    }
}

function toggleMusic() {
    initAudio();
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function updateMusicButton(playing) {
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        if (playing) {
            musicBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
            musicBtn.classList.remove('muted');
        } else {
            musicBtn.innerHTML = '<i class="fas fa-music" aria-hidden="true"></i>';
            musicBtn.classList.add('muted');
        }
    }
}

document.getElementById('music-toggle')?.addEventListener('click', toggleMusic);

function enableAudioOnInteraction() {
    if (!musicStarted) playMusic();
    document.removeEventListener('click', enableAudioOnInteraction);
    document.removeEventListener('touchstart', enableAudioOnInteraction);
    document.removeEventListener('scroll', enableAudioOnInteraction);
}

document.addEventListener('click', enableAudioOnInteraction);
document.addEventListener('touchstart', enableAudioOnInteraction);

// ========== OPEN INVITATION ==========
document.getElementById('open-invitation')?.addEventListener('click', () => {
    playMusic();
    showHeader(); // Tampilkan header saat buka undangan
    scrollToSection('info');
});

// ========== HAMBURGER MENU TOGGLE ==========
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');

hamburgerBtn?.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('open');
});

// Tutup menu saat link diklik (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn?.classList.remove('active');
        navMenu?.classList.remove('open');
    });
});

// Tutup menu saat klik di luar (mobile)
document.addEventListener('click', (e) => {
    const isClickInside = headerNav?.contains(e.target);
    if (!isClickInside && window.innerWidth <= 768) {
        hamburgerBtn?.classList.remove('active');
        navMenu?.classList.remove('open');
    }
});

// ========== COUNTDOWN ==========
function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;
    if (diff <= 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = '00';
        });
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ========== PROGRESS BAR ==========
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}
createProgressBar();

// ========== SCROLL TOP BUTTON ==========
function createScrollTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Kembali ke atas');
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
createScrollTopButton();

// ========== FLOATING HEARTS - ONLY IN INFO ==========
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '<i class="fas fa-heart" aria-hidden="true"></i>';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (8 + Math.random() * 20) + 'px';
        heart.style.animationDelay = Math.random() * 15 + 's';
        heart.style.animationDuration = (6 + Math.random() * 10) + 's';
        container.appendChild(heart);
    }
}

function enhanceFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    if (!container) return;
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (10 + Math.random() * 25) + 'px';
        heart.style.animationDuration = (6 + Math.random() * 8) + 's';
        heart.style.animationDelay = '0s';
        container.appendChild(heart);
        setTimeout(() => {
            if (heart && heart.remove) heart.remove();
        }, 10000);
    }, 800);
}

setTimeout(createFloatingHearts, 1000);
setTimeout(enhanceFloatingHearts, 2000);

// ========== PETALS - ONLY IN HOME ==========
function createPetals() {
    const homeSection = document.querySelector('#home');
    if (!homeSection) return;
    
    const container = document.createElement('div');
    container.className = 'petals-container';
    homeSection.appendChild(container);
    
    
}

// Panggil petals hanya untuk HOME
setTimeout(createPetals, 2500);

// ========== GALLERY ==========
const galleryGrid = document.getElementById('gallery-grid');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
let currentImageIndex = 0;

function buildGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    galleryImages.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', (index * 100).toString());
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery ${index + 1}`;
        img.loading = 'lazy';
        item.appendChild(img);
        item.addEventListener('click', () => openLightbox(index));
        galleryGrid.appendChild(item);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[currentImageIndex];
    lightboxCaption.textContent = `Momen Bahagia ${currentImageIndex + 1}`;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
    lightboxCaption.textContent = `Momen Bahagia ${currentImageIndex + 1}`;
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
    lightboxCaption.textContent = `Momen Bahagia ${currentImageIndex + 1}`;
}

document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-next')?.addEventListener('click', nextImage);
document.querySelector('.lightbox-prev')?.addEventListener('click', prevImage);
lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

buildGallery();

// ========== GALLERY REVEAL ==========
function initGalleryReveal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    galleryItems.forEach(item => observer.observe(item));
}
setTimeout(initGalleryReveal, 500);

// ========== PARTICLES BACKGROUND ==========
function createParticleBackground() {
    const hero = document.querySelector('#home');
    if (!hero) return;
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${2 + Math.random() * 5}px;
            height: ${2 + Math.random() * 5}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${6 + Math.random() * 12}s linear infinite;
            animation-delay: ${Math.random() * 6}s;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}
setTimeout(createParticleBackground, 500);

// ========== RSVP ==========
const rsvpForm = document.getElementById('rsvp-form');
const rsvpMessage = document.getElementById('rsvp-status-message');

async function loadRSVPData() {
    const tableBody = document.getElementById('rsvp-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;"><i class="fas fa-spinner fa-pulse"></i> Memuat data...</td></tr>';
    try {
        const response = await fetch(`${RSVP_SCRIPT_URL}?action=getData`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
            tableBody.innerHTML = '';
            result.data.forEach(row => {
                const tr = document.createElement('tr');
                const timestamp = row.Timestamp || row.timestamp || '-';
                const namaTamu = row.Nama_Tamu || row.name || '-';
                let statusKehadiran = row.Status_Kehadiran || row.attendance || '-';
                if (statusKehadiran === 'Hadir') statusKehadiran = '✅ Hadir';
                else if (statusKehadiran === 'Tidak Hadir') statusKehadiran = '❌ Tidak Hadir';
                else if (statusKehadiran === 'Ragu') statusKehadiran = '🤔 Ragu';
                const jumlahTamu = row.Jumlah_Tamu || row.guests || '0';
                const keterangan = row.Keterangan || row.message || '-';
                tr.innerHTML = `
                    <td>${escapeHtml(timestamp)}</td>
                    <td>${escapeHtml(namaTamu)}</td>
                    <td>${escapeHtml(statusKehadiran)}</td>
                    <td>${escapeHtml(jumlahTamu)}</td>
                    <td>${escapeHtml(keterangan)}</td>
                `;
                tableBody.appendChild(tr);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">✨ Belum ada data RSVP. Jadilah yang pertama! ✨</td></tr>';
        }
    } catch (error) {
        console.error('Gagal load data RSVP:', error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">⚠️ Gagal memuat data</td></tr>';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvp-name').value.trim();
        const status = document.getElementById('rsvp-status').value;
        const guests = document.getElementById('rsvp-guests').value || '1';
        const keterangan = document.getElementById('rsvp-message').value.trim() || '';
        if (!name) {
            rsvpMessage.innerHTML = '❌ Harap isi nama lengkap Anda';
            rsvpMessage.style.color = '#e74c3c';
            return;
        }
        if (!status) {
            rsvpMessage.innerHTML = '❌ Harap pilih status kehadiran';
            rsvpMessage.style.color = '#e74c3c';
            return;
        }
        rsvpMessage.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Mengirim konfirmasi...';
        rsvpMessage.style.color = '#c9a96e';
        try {
            const formData = new URLSearchParams();
            formData.append('Nama_Tamu', name);
            formData.append('Status_Kehadiran', status);
            formData.append('Jumlah_Tamu', guests);
            formData.append('Keterangan', keterangan);
            formData.append('Timestamp', new Date().toLocaleString('id-ID'));
            await fetch(RSVP_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });
            rsvpMessage.innerHTML = '✅ Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.';
            rsvpMessage.style.color = '#27ae60';
            rsvpForm.reset();
            setTimeout(() => loadRSVPData(), 1000);
            setTimeout(() => { rsvpMessage.innerHTML = ''; }, 5000);
        } catch (error) {
            console.error('RSVP Error:', error);
            rsvpMessage.innerHTML = '⚠️ Gagal mengirim. Silakan coba lagi.';
            rsvpMessage.style.color = '#e74c3c';
        }
    });
}

// ========== LOAD RSVP ==========
loadRSVPData();

// ========== AOS REFRESH ==========
if (typeof AOS !== 'undefined') {
    AOS.refresh();
}

console.log('✨ Undangan Ngunduh Mantu Aprisila & Anry siap digunakan!');
console.log('💡 Tips: Ganti nama tamu dengan menambah ?to=NamaTamu di URL');