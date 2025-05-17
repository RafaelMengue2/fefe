// Atualiza a data atual
function updateCurrentDate() {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const today = new Date();
    const dateString = today.toLocaleDateString('pt-BR', options);
    document.getElementById('current-date').textContent = dateString;
}

// Controle dos players de música
let currentPlaying = null;

function togglePlay(trackNumber) {
    const audio = document.getElementById(`track${trackNumber}`);
    const playBtn = document.querySelector(`#track${trackNumber}`).parentElement.querySelector('.play-btn i');
    
    // Pausar o player atual se estiver tocando
    if (currentPlaying && currentPlaying !== audio) {
        currentPlaying.pause();
        const currentBtn = currentPlaying.parentElement.querySelector('.play-btn i');
        currentBtn.classList.remove('fa-pause');
        currentBtn.classList.add('fa-play');
    }
    
    // Tocar/pausar o player selecionado
    if (audio.paused) {
        audio.play();
        playBtn.classList.remove('fa-play');
        playBtn.classList.add('fa-pause');
        currentPlaying = audio;
    } else {
        audio.pause();
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
        currentPlaying = null;
    }
    
    // Atualizar barra de progresso
    audio.addEventListener('timeupdate', function() {
        const progress = this.parentElement.querySelector('.progress');
        const percentage = (this.currentTime / this.duration) * 100;
        progress.style.width = percentage + '%';
        
        // Atualizar tempo decorrido
        const timeElement = this.parentElement.querySelector('.time');
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
        timeElement.textContent = `${minutes}:${seconds}`;
    });
    
    // Resetar quando terminar
    audio.addEventListener('ended', function() {
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
        currentPlaying = null;
    });
}

// Clique na barra de progresso para buscar
document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.addEventListener('click', function(e) {
        const audio = this.parentElement.parentElement.querySelector('audio');
        if (!audio) return;
        
        const percent = e.offsetX / this.offsetWidth;
        audio.currentTime = percent * audio.duration;
        this.querySelector('.progress').style.width = (percent * 100) + '%';
    });
});

// Animação dos elementos ao aparecer na tela
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.music-card, .moment-card').forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Controle de vídeo (opcional)
document.querySelectorAll('.moment-video').forEach(video => {
    const card = video.parentElement;
    
    // Pausa/play ao clicar no card
    card.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    
    // Reinicia o vídeo quando sai da tela (para autoplay)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.currentTime = 0;
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    observer.observe(video);
});

// Inicializa a data quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', updateCurrentDate);