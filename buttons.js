function enter_slot(){
  var element = document.getElementById("introductory_page");
  $(element).css("display", "none");
}



function change_coin(c, element) {
  var tmp = coin_index + c;
  if(tmp >= 0 && tmp < coin_values_size && !in_bonus && !entering_bonus && !in_spin){
    coin_index = tmp;
    coin = coin_values[coin_index];

    update_info_values();

    element.style.animation = 'none';
    element.offsetHeight; /* trigger reflow */
    element.style.animation = null; 

    element = document.getElementById("bet");
    element.innerHTML = "€" + coin.toString().replace('.',',');
  }

}



//###################################//
//###################################//
//######## A U T O  S P I N #########//
//###################################//
//###################################//

var auto_spin = false;
var auto_spins_left = 0;



function automatic_play() {
  if(auto_spin){
    stop_automatic_play();
    return;
  }
  if(in_spin || entering_bonus || in_bonus){
    return;
  }

  auto_spins_left = 99;
  auto_spin = true;
  document.getElementById("automatic_spins").classList.remove("automatic_spins_off");
  document.getElementById("automatic_spins").classList.add("automatic_spins_active");
  try_to_spin();
  update_auto_spin_count_display();

}

function update_auto_spin_count_display(){
  var e = document.getElementById("bonus_win_container");
  $(e).css("display", "block");
  e = document.getElementById("bonus_win");
  e.innerHTML = "Auto spins left: " + auto_spins_left;
}

function stop_automatic_play() {
  auto_spin = false;
  auto_spins_left = 0;
  document.getElementById("automatic_spins").classList.remove("automatic_spins_active");
  document.getElementById("automatic_spins").classList.add("automatic_spins_off");
  var e = document.getElementById("bonus_win_container");
  $(e).css("display", "none");
}




//###################################//
//###################################//
//############# I N F O #############//
//###################################//
//###################################//




function open_info(){
  var info = document.getElementById("info");
  if(info.style.display === "block"){
    $(info).css('display', 'none');
  }
  else{
    $(info).css('display', 'block');
  }
  select_image();
}

function update_info_values(){
  for(var index = 0; index < symbol_number - 1; index++){
    document.getElementById("value" + (index+1) + "_" + 6).innerHTML = "6 - €" +  eval(line_6_symbols[index]).toFixed(2).replace('.', ',');
    document.getElementById("value" + (index+1) + "_" + 5).innerHTML = "5 - €" +  eval(line_5_symbols[index]).toFixed(2).replace('.', ',');
    document.getElementById("value" + (index+1) + "_" + 4).innerHTML = "4 - €" +  eval(line_4_symbols[index]).toFixed(2).replace('.', ',');
    document.getElementById("value" + (index+1) + "_" + 3).innerHTML = "3 - €" +  eval(line_3_symbols[index]).toFixed(2).replace('.', ',');
  }
}

function select_image(){
  var audio = new Audio('Sounds/select.wav');
  audio.volume = 0.1;
  audio.play();
}



//###################################//
//###################################//
//####### H Y P E R  S P I N  #######//
//###################################//
//###################################//



var hyper_spin = false;
function change_hyper_spin(element){
  if(!hyper_spin){
    element.classList.remove("normal_spin");
    element.classList.remove("hyper_spin");
    hyper_spin = true;
    scroll_animation_time = 1300;
  }
  else{
    element.classList.remove("hyper_spin");
    element.classList.add("normal_spin");
    scroll_animation_time = 2000;
    hyper_spin = false;
  }
}