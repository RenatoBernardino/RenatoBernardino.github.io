var initial_bonus_spins = 4;
var retrigger_bonus_spins = 2;
var bonus_spins = 4; 

var current_bonus = null;


var entering_bonus = false;
var can_enter = false;


class Bonus{
  constructor(number_of_scatter){

    this.total_won = 0;

    this.total_spins = initial_bonus_spins + (number_of_scatter - 3) * retrigger_bonus_spins;    

    this.current_bonus_spin = 1;
  }

  increase_total(m){
    this.total_won += m;
  }

  go_to_next_spin(){
    this.current_bonus_spin++;
  }

  get get_total(){
    return this.total_won;
  }

  get get_total_spins(){
    return this.total_spins;
  }

  get get_current_spin(){
    return this.current_bonus_spin;
  }

  increase_total_spin_number(n){
    this.total_spins += retrigger_bonus_spins * (n - 2);
  }

}




function show_bonus_screen() {
  can_enter = true;
  var e = document.getElementById("enter_bonus");
  e.classList.remove("not_show");
  e.classList.add("show");
  e = document.getElementById("you_won_spins");
  e.innerHTML =   "You won " + current_bonus.get_total_spins + " free spins!";
  
}


function start_bonus() {


  in_bonus = true;
  multiplier = 1;
  
  update_bonus_spins();
  update_multiplier_indicator();

  var e = document.getElementById("spin_indicator");
  e.classList.remove("not_showing_spin_indicator");
  e.classList.add("showing_spin_indicator");

  e = document.getElementById("multiplier_indicator");
  e.classList.remove("not_showing_multiplier_indicator");
  e.classList.add("showing_multiplier_indicator");

  e = document.getElementById("bonus_win_container");
  $(e).css("display", "block");
  e = document.getElementById("bonus_win");
  e.innerHTML = "Total win: €0,00";


  setTimeout(() => {
    in_spin = false;
    perform_spin();
  }, 1500);
}

function update_total_win_bonus() {
  var e = document.getElementById("bonus_win");
  e.innerHTML = "Total win: €" + current_bonus.get_total.toFixed(2).replace('.',',');
}

var in_bonus = false;
function bonus(total) {

  var number_of_scatter = slot.check_for_scatters();
  if(number_of_scatter > 0){
    highlight_scatters(number_of_scatter);
  }
  if(number_of_scatter >= 3){
    current_bonus.increase_total_spin_number(number_of_scatter);
  }

  if(total > 0){ //current spin is an hit
    current_bonus.go_to_next_spin();
    current_bonus.increase_total(total);
    update_total_win_bonus();
    multiplier = 1;
    if(current_bonus.get_current_spin > current_bonus.get_total_spins){ //end of bonus
      end_bonus();
    }
    else{ //go to next spin
      setTimeout(() => {
        perform_spin();
      }, 2000);
    }
  }
  else{ //no pay in this spin, continue
    multiplier++;
    if(number_of_scatter <= 2){
      multiplier += number_of_scatter
    }
    setTimeout(() => {
      perform_spin();
    }, 1000);
  }

}
var can_leave_bonus = false;
function end_bonus() {
  var e = document.getElementById("spin_indicator");
  e.classList.remove("showing_spin_indicator");
  e.classList.add("not_showing_spin_indicator");

  e = document.getElementById("multiplier_indicator");
  e.classList.remove("showing_multiplier_indicator");

  e.classList.add("not_showing_multiplier_indicator");


  e = document.getElementById("won_in_bonus");
  e.innerHTML = "You won €" + current_bonus.get_total.toFixed(2) + "!";

  setTimeout(() => {
    var e = document.getElementById("leave_bonus");
    e.classList.remove("not_show");
    e.classList.add("show");
    setTimeout(() => {
      can_leave_bonus = true;
    }, 1000);
  }, 1500);

  credit += current_bonus.get_total;
  update_credit();
  

  current_bonus = null;
}


var scatters = [];
function highlight_scatters(number_of_scatter) {
  scatters.forEach(pos => {
    pos.highlight_square();
  });
  if(number_of_scatter >= 3){
    setTimeout(() => {
      var audio = new Audio('Sounds/headshot.mp3');
      audio.volume = volume / 100;
      audio.play();
    }, 200);
  }
}


function update_bonus_spins() {
  var e = document.getElementById("spin_count");
  if(current_bonus == null){
    e.innerHTML = 1 + " / " + initial_bonus_spins + " SPINS";
  }
  else{
    e.innerHTML = current_bonus.get_current_spin + " / " + current_bonus.get_total_spins + " SPINS";

  }
}


function update_multiplier_indicator() {

  var e = document.getElementById("multiplier");
  e.innerHTML = multiplier + " X";
  
}