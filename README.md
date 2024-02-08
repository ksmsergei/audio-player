# JQuery Audio Player
This is a wrapper for working with Java Script Audio Player (requires JQuery as well).

Usage
---
First, on your HTML page, create the elements for:
- Play button
- Caption text
- Duration text
- Volume button
- Volume range
- Progress bar
- Replay button

It might look something like this:
```html
<button id="load">Load Autio</button>
<span id="caption">Song name</span>
<span id="duration">00:00 / 00:00</span>
<progress id="audio_progress" value="0"></progress>
<button id="play"></button>
<button id="replay"></button>
<button id="volume"></button>
<input id="volume_range" type="range" min="0" max="1" step="0.01" value="1"/>
```

After that you have to include jQuery and player.js:
```html
<script src="jquery-1.12.4.min.js"></script>
<script src="player.js"></script>
```

Now it only remains to create an Audio Player and connect it to your elements:
```html
<script>
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
        Player.PlayAudio("MP3 test file", "mp3_example.mp3");
    });
</script>
```

One more moment
---
During operation, the audio player changes the attributes of some elements:
- Play/Pause button
  - **data-play="play"** - When audio is playing
  - **data-play=""** - When audio is paused
- Mute/Unmute button
  - **data-volume="full"** - When the volume is at its maximum
  - **data-volume="medium"** - When the volume is somewhere in the middle
  - **data-volume="mute"** - When the sound is muted
- Repeat on/off button
  - **data-replay="replay"** - When repeat is on
  - **data-replay=""** - When replay is off
  
You can use this to change css styles to suit your needs. Here is a small example:
```css
#play::before {
    content: "Play";
}

#play[data-play="play"]::before {
    content: "Pause";
}

#replay::before {
    content: "Enable Repeat";
}

#replay[data-replay="replay"]::before {
    content: "Disable Repeat";
}

#volume::before {
    content: "Mute sound";
}

#volume[data-volume="mute"]::before {
    content: "Unmute sound";
}
```

Usage example
---
You can see and try out this audio player from this [link](https://ksmsergei.github.io/audio-player/example/).<br>
This example is located in this repository, in the folder **"example"**.
