(function () {
    this.AudioPlayer = function(options){

        var audio = $(new Audio()).attr("id", "audioPlayerJS").appendTo("body");
        this.audio = audio;

        var playButton = options.playButton;
        var captionText = options.captionText;
        var durationText = options.durationText;
        var volumeButton = options.volumeButton;
        var volumeRange = options.volumeRange;
        var progressBar = options.progressBar;
        var replayButton = options.replayButton;
        var backwardButton = options.backwardButton;
        var forwardButton = options.forwardButton;
        var visualCanvas = options.visualCanvas;

        var old_title; //Изначальный заголовк страницы
        var title_timer = null; //Хэндл таймера, для его остановки

        var StopTitle = function() {
            if (title_timer != null){ //Если заголовок движется, остановить его
                clearTimeout(title_timer);
                title_timer = null;
                $("title").html(old_title); //Поставить старый заголовок
            }
        };

        var StartTitle = function(text) {
            StopTitle(); //Перед тем как поставить новый заголовок, убрать старый
            old_title = $("title").html();

            $("title").html(text);  //Выставляет новый заголовок
            title_timer = setTimeout(function () {    //Запускаем таймер для изменения заголовка
                StartTitle(text.substr(1) + text.substr(0, 1)); //Убираем первый символ, добавляем его в конец
            }, 500);
        };

        var TimeToString = function(time) {
            time = Math.floor(time);

            var minutes = Math.floor(time / 60);
            var seconds = time % 60;

            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            return minutes + ":" + seconds;
        }

        ///////////////////////Кнопка играть-пауза////////////////////////////////////////
        playButton.on("click", function(e){
            e.preventDefault();
            if ( $(this).attr("data-play") == "play" ) {
                audio.trigger("pause");
            } else {
                audio.trigger("play");
            }
        });

        audio.on("play", function(){
            playButton.attr("data-play", "play");
            StartTitle( $("#caption").text() + " | ");
        });

        audio.on("pause", function(){
            playButton.attr("data-play", "");
            StopTitle();
        });

        ///////////////////////////Кнопка повтора/////////////////////////////////////////
        replayButton.on("click", function(e){
            e.preventDefault();
            if ( $(this).attr("data-replay") == "replay" ) {
                $(this).attr("data-replay", "");
                audio.prop("loop", false);
            } else {
                $(this).attr("data-replay", "replay");
                audio.prop("loop", true);
            }
        });

        ///////////////////////Ползунок длительности аудио////////////////////////////////
        var clicking_bar = false;

        progressBar.on("mousedown", function(e){
            clicking_bar = true;

            var posX = e.pageX  - progressBar.offset().left;
            var width = progressBar.width();

            progressBar.val( progressBar.attr("max") / (width / posX) );
        });

        $(document).on("mouseup", function(e){
            if (clicking_bar) {
                audio.prop("currentTime",  progressBar.val());
            };

            clicking_bar = false;
        })

        $(document).on("mousemove", function(e){
            if(clicking_bar == false) return;

            e.preventDefault();

            var posX = e.pageX  - progressBar.offset().left;
            var width = progressBar.width();

            progressBar.val( progressBar.attr("max") / (width / posX) );
        });

        ///////////////////////////Изменение громкости звука//////////////////////////////
        var is_mute = false;
        var old_volume = 1;

        volumeRange.on("input", function(){  //Изменение значка звука
            const volume_val = $(this).val();

            is_mute = false;
            old_volume = volume_val;

            if (volume_val == 0) {
                volumeButton.attr("data-volume", "mute");
                is_mute = true;
                old_volume = 1;
            } else if (volume_val <= 0.5) {
                volumeButton.attr("data-volume", "medium");
            } else {
                volumeButton.attr("data-volume", "full");
            }

            audio.prop("volume", $(this).val());
        });

        volumeButton.on("dblclick", function(){  //Возможность выключения звука простым нажатием на иконку
            if (is_mute) {
                is_mute = false;
                volumeRange.val(old_volume);
            } else {
                is_mute = true;
                volumeRange.val(0);
            }

            const volume_val = volumeRange.val();

            if (volume_val == 0) {
                volumeButton.attr("data-volume", "mute");
            } else if (volume_val <= 0.5) {
                volumeButton.attr("data-volume", "medium");
            } else {
                volumeButton.attr("data-volume", "full");
            }

            audio.prop("volume", volumeRange.val());
        });

        ///////////////////////////Вперёд и назад/////////////////////////////////////////
        forwardButton.on("click", function(){
            if (playList.songIndex == -1) return;

            if (playList.songIndex == playList.songs.length - 1) {
                PlayAudioFromPlayList(0);
                return;
            }

            PlayAudioFromPlayList( playList.songIndex + 1 );
        });

        backwardButton.on("click", function(){
            if (playList.songIndex == -1) return;

            if (playList.songIndex == 0) {
                PlayAudioFromPlayList( playList.songs.length - 1 );
                return;
            }

            PlayAudioFromPlayList( playList.songIndex - 1 );
        });

        ///////////////////////////Визуализатор аудио/////////////////////////////////////
        var wave = new Wave();
        wave_options = {
            type: "bars",
            colors: ["#2456F6", "#3A3CFE", "#5A21FE", "#5A21FE", "#7611F7"],
            stroke: 4
        };
        wave.fromElement("audioPlayerJS", visualCanvas, wave_options);

        ///////////////////////////Метаданные/////////////////////////////////////////////
        audio.on("loadedmetadata", function(){
            var dur = $(this).prop("duration");
            var dur_p = TimeToString(dur);

            durationText.text("00:00 / " + dur_p);

            progressBar.attr("max", dur);
            progressBar.val(0);
        });

        var dur_timer = null;

        audio.on("canplay", function(){  //При начале проигрывания
            if (dur_timer != null) {
                clearInterval(dur_timer);
                dur_timer = null;
            };

            dur_timer = setInterval(function(){
                var currentTime = audio.prop("currentTime");
                var dur_p = TimeToString( audio.prop("duration") );

                if (!clicking_bar) {
                    progressBar.val(currentTime);
                    durationText.text(TimeToString(currentTime) + " / " + dur_p);
                }
            }, 100);
        });


        audio.on("ended", function(){
            if (dur_timer != null) {
                clearInterval(dur_timer);
                dur_timer = null;
            };
        });

        ///////////////////////////Методы/////////////////////////////////////////////////
        var PlayAudio = function(song_name, src) {
            captionText.text(song_name);

            audio.attr("src", src);
            audio.trigger("load");

            audio.on("canplay", function(){
				playList.songIndex = playList.hasSong( [song_name, src] );
                audio.trigger("play");
            });
			
        }
        this.PlayAudio = PlayAudio;

        var PlayAudioFromPlayList = function(songIndex) {
            playList.songIndex = songIndex;

            song_name = playList.songs[songIndex][0];
            src = playList.songs[songIndex][1];

            PlayAudio(song_name, src);
        }
        this.PlayAudioFromPlayList = PlayAudioFromPlayList;

        ///////////////////////////Плэйлисты//////////////////////////////////////////////
        var playList = {
            songs: [],
            songIndex: -1,

            hasSong: function(song) {
                function arraysEqual(a, b) {
                    if (a === b) return true;
                    if (a == null || b == null) return false;
                    if (a.length !== b.length) return false;

                    for (var i = 0; i < a.length; ++i) {
                        if (a[i] !== b[i]) return false;
                    }
                    return true;
                }

                for (var i = 0; i < playList.songs.length; i++) {
                    if (arraysEqual(song, playList.songs[i])) return i;
                }
                return -1;
            },


        };

        this.playList = playList;
    }
}());
