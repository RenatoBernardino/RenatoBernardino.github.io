var current_audio = null;
var gradual_audio_increase_id = null;
var loop = false;

var volume = 100;
var last_volume = 100;
var volume_changed = false;




 
function play_music(number){
  if(current_audio != null){

    var n = parseInt(current_audio.dataset.audioNumber);
    if(n != number){
      current_audio.pause();
      current_audio.currentTime = 0;
      current_audio.loop = false;
      $(document.getElementById("audio_" + n + "_play")).css("display", "block");
      $(document.getElementById("audio_" + n + "_pause")).css("display", "none");
    }

  }
  current_audio = document.getElementById("audio" + number);
  current_audio.play();
  current_audio.loop = loop;
  current_audio.volume = volume / 100;
  var n = current_audio.dataset.audioNumber;

  $(document.getElementById("audio_" + n + "_play")).css("display", "none");
  $(document.getElementById("audio_" + n + "_pause")).css("display", "block");
}

function stop_music(number){
  current_audio.pause();
  $(document.getElementById("audio_" + number + "_play")).css("display", "block");
  $(document.getElementById("audio_" + number + "_pause")).css("display", "none");
}

function start_playing_music() {
  if(current_audio != null){
    return;
  }
  setTimeout(() => {
    play_music(1);
    if(volume_changed){
      current_audio.volume = volume;
      return;
    }
    var initial_volume = 0.2;
    current_audio.volume = initial_volume;

    gradual_audio_increase_id = setInterval(() => {
      var v = current_audio.volume;
      v += 0.05;
      if(v > volume / 100){
        v = volume / 100;
      }
      current_audio.volume = v.valueOf();
    }, 1000);

    setTimeout(() => {
      clearInterval(gradual_audio_increase_id);
      gradual_audio_increase_id = null;
    }, 20000);

  }, 2000);
}




function open_sound_bar() {
  var sound = document.getElementById('sound_bar_container');
  if(sound.style.display === "block"){
    $(sound).css('display', 'none');
  }
  else{
    $(sound).css('display', 'block');
  }
}

function update_volume(value){
  last_volume = volume.valueOf();
  change_volume(value);
}


function change_volume(value){

  volume_changed = true;
  volume = value;

  $("div.sound_bar_value").html(value);

  var bars = document.getElementsByClassName('sound_bar');
  for(var i = 0; i < bars.length; i++){
    bars[i].value = value;
  }

  if(value == 0){
    $(document.getElementById("sound")).css("display", "none");
    $(document.getElementById("no_sound")).css("display", "block");
  }
  else{
    $(document.getElementById("sound")).css("display", "block");
    $(document.getElementById("no_sound")).css("display", "none");
    
    
  }
  if(current_audio == null){
    return;
  }
  current_audio.volume = value/100;
  if(gradual_audio_increase_id != null){
    clearInterval(gradual_audio_increase_id);
    gradual_audio_increase_id = null;
  }
}

function change_loop(element){
  if(element.classList.contains("selected")){
    element.classList.remove("selected");
    element.classList.add("not_selected");
    loop = false;
    
  }
  else{
    element.classList.remove("not_selected");
    element.classList.add("selected");
    loop = true;
  }
  if(current_audio != null){
    current_audio.loop = loop;
  }
}