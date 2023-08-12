import song from './playlist.js';
const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);
const playlist= document.querySelector(".container-main-2")
const btnplay = $('.btn-play')
const audio = $('#audio');
const cd =$('.master-cdthumb')
const heading =$('.cd-name')
const singer =$('.cd-singer')
const timesong = $('.contro-right')
const prvebtn = $('.btn-prev')
const nextbtn = $('.btn-next')
const repeatbtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const play = $('.container-playlist')
const menuclick= $$('.song-choose-item')
const menuplay = $$('.playlist')
const imgbig = $('.container-main-1')
const progress = $('.contro-time')
const Current = $('.contr-input-current')
const Circle = $('.circle')
const timeleft = $('.contro-left');
const timeright = $('.contro-right');
const progressVolum = $('.progress-volum');
const volumCurrent = $('.volum-curent');
const volumCircle = $('.volum-circle');
const playVolume = $('.contro-volum');


const menuform = $('.menu');
menuform.onclick = function(){
    menuform.classList.toggle('active');
    $('.menu-side').classList.toggle('active-mobile');
}
menuclick.forEach((tab) => {
    tab.onclick = function() {
        
        $('.song-choose-item.active').classList.remove('active')
        this.classList.add('active')
    }
})
menuplay.forEach((value) =>{
    value.onclick = function( ){
        $('.playlist.active').classList.remove('active')
        this.classList.add("active")
    }
})
const app={
    songs : song,
    currentIndex : 0,
    isRandom: false,
    isRepert: false,
    isPlaying : true,
    isvolume : true,
    isSong : true,
    render: function(){
        const playlistsong= this.songs.map((songer,index) =>{
            return ` 
         <div class="container-playlist ${app.currentIndex === index ? 'active' : ''}" data-index = "${index}">
            <div class="container-playlist-avatar">
                <div class="avatar" style="background-image: url('${songer.img}');">
                    <i class="fa-solid fa-play play-img"></i>
                    <img src="./img/icon-playing.gif" alt="" class="gif-music">
                </div>
                <div class="avatar-name">
                    <h4>${songer.name}</h4>
                    <span>${songer.singer}</span>
                </div>
            </div>
            <div class="avatar-miner">
                <span>${songer.time}</span>
            </div>
            <div class="avatar-choose">
                <i class="fa-solid fa-microphone"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
        </div>`
        });
        playlist.innerHTML=playlistsong.join("");
    },
    definePropertiesz: function(){
        Object.defineProperty(this,"currentSong",{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    loadingsong: function(){
        cd.style.backgroundImage=`url('${this.currentSong.img}')`
        imgbig.style.backgroundImage = `url('${this.currentSong.img}')`
        heading.textContent= this.currentSong.name
        singer.textContent= this.currentSong.singer
        timesong.textContent=this.currentSong.time
        audio.src=this.currentSong.music
    },
    hendeliven: function(){
        var lastValueVolume = 1;
        const imngThumm = imgbig.animate([ { transform: 'rotate(360deg)'}],
        {
            duration:10000,
            iterations: Infinity
        });
        const cdThumbAnimate = cd.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });

        imngThumm.pause();
        cdThumbAnimate.pause();

        btnplay.onclick = Playunc;
        function Playunc() {
           if(app.isPlaying)
             audio.play()
            else 
             audio.pause()

            audio.onplay = function(){
                app.isPlaying = false;
                btnplay.classList.add('active')
                cdThumbAnimate.play();
                imngThumm.play()
                play.classList.add('active')
            }
            audio.onpause = function(){
                app.isPlaying = true;
                btnplay.classList.remove('active')
                cdThumbAnimate.pause();
                imngThumm.pause();
                play.classList.remove('active')
            }
             // tien do bai hat thay doi
            audio.ontimeupdate = function() {
                if(audio.duration)
                {
                    const progressPersent = audio.currentTime / audio.duration * 100;
                    progress.value= progressPersent;
                    Circle.style.left = `calc(${progressPersent}% - 2px)`;
                    Current.style.width = progressPersent + '%';
                    
                    const sum = Math.floor(audio.currentTime);
                    const g = sum%60;
                    const h = Math.floor(sum/60);
                    var c;
                    if(g < 10)
                    {
                         c=0;
                    }else{
                        c='';
                    }
                    timeleft.textContent = '0' + h + ":" + c + g
                }
            }
            //tyhay doi bai hat
            progress.oninput = function(){
                const chageTime = progress.value * audio.duration / 100;
                audio.currentTime = chageTime;
            }
            // bai hat ket thuc
            audio.onended = function(){
                if(app.isRepert)
                {
                    Playunc();
                    audio.play();
                }else{

                    app.nextSong();
                    Playunc();
                    audio.play();
                    app.render();
                    // app.scroll();

                }
            }
        }
        // thay doi am luong
        progressVolum.oninput = function(){
            // audio.volume = lastValueVolume;
            audio.volume = progressVolum.value /100;
            volumCircle.style.left = `calc(${audio.volume * 100}% - 1px)`;
            volumCurrent.style.width =(audio.volume * 100)+ '%';
            if(audio.volume === 0)
            {
                playVolume.classList.toggle('mute',true);
                app.isvolume = false;
            }else{
                playVolume.classList.toggle('mute',false);
                app.isvolume = true;
            }

        }
        // tat bat am luong
        playVolume.onclick = function( ){
            if(app.isvolume)
            {
                audio.volume = 0;
                volumCurrent.style.width = audio.volume * 100 + '%';
                volumCircle.style.left = `calc(${audio.volume * 100}% - 1px)`;
            }else{
                audio.volume = 1;
                volumCurrent.style.width = audio.volume * 100 + '%';
                volumCircle.style.left = `calc(${audio.volume * 100}% - 1px)`;
                
            }
            playVolume.classList.toggle('mute',app.isvolume);
            app.isvolume = !app.isvolume;
        }
        // Playunc()
        repeatbtn.onclick = function(){
            if(app.isRepert)
            {
                $('.btn-repeat.active').classList.remove('active');
                app.isRepert = !app.isRepert;
            }else{
                repeatbtn.classList.add('active');
                app.isRepert = !app.isRepert;
            }
        }
        nextbtn.onclick = function(){
            if(app.isRandom)
            {
                app.PlayrandomSong()
            }else{

                app.nextSong();
            }
            Playunc();
            audio.play();
            app.render();
            // app.scroll();
        }
        prvebtn.onclick = function(){
            if(app.isRandom)
            {
                app.PlayrandomSong();
            }else{
                app.PrevSong();
            }
            Playunc();
            audio.play();
            app.render();
            // app.scroll();
        }

       randomBtn.onclick = function() {
        if(app.isRandom)
        {
            $('.btn-random.active').classList.remove('active');
            app.isRandom = !app.isRandom;
        }else{
            randomBtn.classList.add('active');
            app.isRandom = !app.isRandom;
        }
       }
       playlist.onclick = function(e){
        const getplaylist = e.target.closest('.container-playlist:not(.active')
        if(getplaylist || e.target.closest('.fa-ellipsis-vertical'))
        {
            //xu ly click vao song
            if(getplaylist)
            {
                app.currentIndex = Number(getplaylist.dataset.index);
                app.loadingsong();
                app.render();
                Playunc();
                audio.play();
            }
        }
       }
    },
    nextSong: function(){
        if(this.isRandom)
        {
            this.PlayrandomSong();
        }else{
            this.currentIndex++;
            if(this.currentIndex >=this.songs.length)
            {
                this.currentIndex = 0;
            }
            // remo.classList.remove('active')
        }
        this.loadingsong();

    },
    PrevSong: function(){
        if(this.isRandom)
        {
            this.PlayrandomSong();
        }else{
            this.currentIndex--;
            if(this.currentIndex < 0)
             this.currentIndex = this.songs.length;
        }
        this.loadingsong();
    },
    scroll : function(){
        setTimeout(()=> {
            $('.container-playlist.active').scrollIntoView({
            behavior: 'smooth',
            block : 'center',
           })
        },100)
    },
    PlayrandomSong: function(){
        let newIndex;
        do{
            newIndex=Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadingsong()
    },
    start:function(){
        this.definePropertiesz()
        this.loadingsong()
        this.render();
        this.hendeliven();
        console.log(progressVolum)
        console.log(audio.volume)
        console.log(this.isRepert)
    },
    
}
app.start();
