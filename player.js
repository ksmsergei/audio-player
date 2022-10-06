(function () {
    this.AudioPlayer = function(options){

        var audio = $(new Audio()).attr("id", "audioPlayerJS").appendTo("body");
        this.audio = audio;

        var playButton = options.playButton;            //Кнопка проигрывания
        var captionText = options.captionText;          //Элемент для отображения названия аудио
        var durationText = options.durationText;        //Элемент для отображения длительносьти аудио
        var volumeButton = options.volumeButton;        //Кнопка для полного оключения звука
        var volumeRange = options.volumeRange;          //Ползунок громости, должен быть input с типом range
        var progressBar = options.progressBar;          //Элемент отображающий на каком моменте играет аудио, должен быть элементом progress
        var replayButton = options.replayButton;        //Кнопка повтора

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
        });

        audio.on("pause", function(){
            playButton.attr("data-play", "");
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

        volumeButton.on("click", function(){  //Возможность выключения звука простым нажатием на иконку
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
                audio.trigger("play");
            });
        }
        this.PlayAudio = PlayAudio;
    }
}());