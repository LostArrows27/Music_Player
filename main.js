const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const audio = $('#audio');
const player = $('.player');
const progress = $('#progress');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const overLay = $('.over-lay');
const dashboard = $('.dashboard')
const playback = $('.playback');

var temp = window.getComputedStyle(
    document.querySelector('.dashboard'), ':after'
);

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // cai dat cho app
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Grand Escape',
            singers: 'RADWIMPS ft Miura Touko',
            path: './assets/music/02.mp3',
            image: './assets/img/01.jfif'
        },
        {
            name: 'Sparkle',
            singers: 'RADWIMPS',
            path: './assets/music/01.mp3',
            image: './assets/img/02.jfif'
        },
        {
            name: '思想犯',
            singers: 'ヨルシカ',
            path: './assets/music/03.mp3',
            image: './assets/img/03.jfif'
        },
        {
            name: 'アルコール',
            singers: 'YOASOBI',
            path: './assets/music/04.mp3',
            image: './assets/img/04.jfif'
        },
        {
            name: '優しい彗星',
            singers: 'YOASOBI',
            path: './assets/music/05.mp3',
            image: './assets/img/05.jfif'
        },
        {
            name: 'YuruKyan no theme',
            singers: 'Yuru Camp OST',
            path: './assets/music/06.mp3',
            image: './assets/img/06.jfif'
        },
        {
            name: 'Is there anything love can do',
            singers: 'RADWIMPS',
            path: './assets/music/07.mp3',
            image: './assets/img/07.jfif'
        },
        {
            name: 'Pretender',
            singers: 'Official HIGE DANdism',
            path: './assets/music/08.mp3',
            image: './assets/img/08.jfif'
        },
        {
            name: 'アルペジオ',
            singers: 'ALEXANDROS',
            path: './assets/music/09.mp3',
            image: './assets/img/09.jfif'
        },
        {
            name: '打上花火',
            singers: 'DAOKO x Kenshi Yonezu',
            path: './assets/music/10.mp3',
            image: './assets/img/10.jfif'
        }
    ],
    //  set cai dat mac de reload trang khong mat
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singers}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xu li CD quay va dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 sec rotate
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        // set BG cho dashboard khi dish bi thu nho
        var setDiskBG = function () {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            if (newCdWidth <= 50) {
                var myBackgroundLink = cdThumb.style.backgroundImage;
                dashboard.style.backgroundImage = myBackgroundLink;
                if(scrollTop == 211.1999969482422){
                    dashboard.style.opacity = 1;
                }
                else if (newCdWidth > -50) {
                    dashboard.style.opacity = 1 - (newCdWidth + 50) / 100;
                } else {
                    dashboard.style.opacity = 1;
                }
            } else {
                dashboard.style.opacity = 1;
                dashboard.style.backgroundImage = '';
            }
            // console.log(temp.);
            // xet lai may cho cac nut
        }

        // Xu li phong to dia nhac
        document.onscroll = function () {
            // playback.style.left = progress.offsetLeft + "px";
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / 200;
            setDiskBG();
            // return vi tri y khi scroll
        }
        // kiem tra hanh dong scroll cua trinh duyet

        // Xu li khi click play
        playBtn.onclick = function () {
            player.classList.toggle('playing');
            if (!_this.isPlaying) {
                audio.play();
                cdThumbAnimate.play();
            } else {
                audio.pause();
                cdThumbAnimate.pause();
            }
        }
        // Khi song duoc play 
        audio.onplay = function () {
            _this.isPlaying = true;
            setDiskBG();
        }

        // Khi song duoc dung
        audio.onpause = function () {
            _this.isPlaying = false;
        }

        var getWidth = () => {
            var currentWidth = progress.offsetWidth * audio.currentTime / audio.duration + 0.7;
            if(progress.value <= 10) currentWidth += 3;
            else if(progress.value >= 90) currentWidth -= 3;
            return `${currentWidth}px`
        }

        // Khi nhac duoi choi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
                playback.style.width = getWidth()
            }
        }

        // Khi keo thanh input
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
            progress.value = e.target.value;
            playback.style.width = getWidth();

        }

        // Khi next bai hat
        nextBtn.onclick = function () {
            if (!player.classList.contains('playing')) {
                player.classList.add('playing')
            }
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            setDiskBG();
        }

        // Khi prev bai hat
        prevBtn.onclick = function () {
            if (!player.classList.contains('playing')) {
                player.classList.add('playing')
            }
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            setDiskBG();
        }

        // Random bai hat
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // bai hat ket thuc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // xu li lap lai 1 bai hat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // lang nghe hanh vi click vao playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            // ta co the click ca vao nhung the h3, ...
            // de lay the cha hoac chinh no
            if (songNode || e.target.closest('.option')) {
                // Khi click vao bai hat
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    if (!player.classList.contains('playing')) {
                        player.classList.add('playing')
                    }
                    _this.render();
                    audio.play();
                }

                //  Khi click vao option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        if(this.currentIndex >= 0 && this.currentIndex <= 1) {
            document.documentElement.scrollTop = 0; 
        }  else {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                // scroll bai hat den vi tri dang play
            }, 400); 
        } 
    },
    start: function () {
        // Gan cau hinh tu config vao app
        this.loadConfig();

        // Dinh nghia thuoc tinh cho object
        this.defineProperties();

        // langn nghe va xu li cac su kien
        this.handleEvents();

        // Load Current song vao UI khi dang nhap
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // hien thi trang thai ban dau cua 2 button repeat va random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();