(function () {
    'use strict';

    class PresentationController {
        constructor() {
            this.slidesWrapper = document.getElementById('slidesWrapper');
            this.slides = Array.from(document.querySelectorAll('.slide'));
            this.totalSlides = this.slides.length;
            this.currentSlide = 0;
            this.isPlaying = true;
            this.slideDuration = 8000; // milisegundos
            this.autoPlayInterval = null;

            this.indicatorsContainer = document.getElementById('indicators');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.playPauseBtn = document.getElementById('playPauseBtn');
            this.playPauseIcon = document.getElementById('playPauseIcon');

            this.createIndicators();
            this.bindEvents();
            this.updateSlide();
            this.startAutoPlay();
        }

        createIndicators() {
            if (!this.indicatorsContainer) return;
            this.indicatorsContainer.innerHTML = '';
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'indicator' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
                dot.addEventListener('click', () => {
                    this.currentSlide = i;
                    this.updateSlide();
                    this.restartAutoPlay();
                });
                this.indicatorsContainer.appendChild(dot);
            }
        }

        bindEvents() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                    this.restartAutoPlay();
                });
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                    this.restartAutoPlay();
                });
            }
            if (this.playPauseBtn) {
                this.playPauseBtn.addEventListener('click', () => {
                    this.togglePlayPause();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.restartAutoPlay();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.restartAutoPlay();
                } else if (e.code === 'Space') {
                    e.preventDefault();
                    this.togglePlayPause();
                }
            });
        }

        startAutoPlay() {
            if (this.autoPlayInterval || !this.isPlaying) return;
            this.autoPlayInterval = window.setInterval(() => {
                if (this.isPlaying) {
                    this.nextSlide();
                }
            }, this.slideDuration);
        }

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        restartAutoPlay() {
            this.stopAutoPlay();
            if (this.isPlaying) {
                this.startAutoPlay();
            }
        }

        togglePlayPause() {
            this.isPlaying = !this.isPlaying;
            if (this.playPauseIcon) {
                if (this.isPlaying) {
                    this.playPauseIcon.classList.remove('fa-play');
                    this.playPauseIcon.classList.add('fa-pause');
                } else {
                    this.playPauseIcon.classList.remove('fa-pause');
                    this.playPauseIcon.classList.add('fa-play');
                }
            }
            if (this.isPlaying) {
                this.startAutoPlay();
            } else {
                this.stopAutoPlay();
            }
        }

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.updateSlide();
        }

        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateSlide();
        }

        updateSlide() {
            if (!this.slidesWrapper) return;
            const offset = this.currentSlide * 100;
            this.slidesWrapper.style.transform = 'translateX(-' + offset + '%)';

            if (this.indicatorsContainer) {
                const dots = this.indicatorsContainer.querySelectorAll('.indicator');
                dots.forEach((dot, index) => {
                    if (index === this.currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        new PresentationController();
    });

})();
