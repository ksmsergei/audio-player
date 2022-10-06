let options = {
    playButton: $("#play"),
    captionText: $("#caption"),
    durationText: $("#duration"),
    volumeButton: $("#volume"),
    volumeRange: $("#volume_range"),
    progressBar: $("#audio_progress"),
    replayButton: $("#replay")
};

let Player = new AudioPlayer(options);

$("#load").click(function(){
    alert("hi");
    Player.PlayAudio("MP3 test file", "mp3_example.mp3");
});