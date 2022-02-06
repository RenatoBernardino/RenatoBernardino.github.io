
'use strict';

var shadow_frac = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--column-shadow-frac'), 10);

var columns = [];
var scroll_columns = [];

var column_number = 6;
var row_number = 5;

var initial_bonus_spins = 5;
var bonus_spins = 5; 

var current_bonus = null;

var current_bonus_spin = 1;

var auto_spin = false;
var auto_spins_left = 0;

var current_audio = null;
var gradual_audio_increase_id = null;
var loop = false;

var volume = 100;
var last_volume = 100;
var volume_changed = false;


//var odds = [0.16, 0.15, 0.14, 0.13, 0.12, 0.08, 0.07, 0.055, 0.045, 0.03, 0.02];
var odds = [0.16, 0.15, 0.14, 0.13, 0.12, 0.09, 0.075, 0.065, 0.05, 0.02];
//var odds = [0.02, 0.4, 0.01, 0.01, 0.12, 0.09, 0.075, 0.065, 0.05, 0.16]; // test scatter
//var images = ["10.jpg", "J.jpg", "Q.jpg", "K.jpg", "A.jpg", "P5.jpg", "P4.jpg", "P3.jpg", "P2.jpg", "P1.jpg", "Scatter.jpg"];
var images = ["hive.png", "immolator.png", "lolita.png", "kayn.png", "prodigal.png", "spider.png", "meathead.png", "assassin.png", "scrapbeak.png", "bonus.png"];
var symbol_number = odds.length; 
console.log("symbol number = " + symbol_number);

var credit = 100000;
var coin_index = 4;
var coin_values = [0.2, 0.4, 0.6, 0.8, 1, 1.5, 2, 4, 5, 8, 10, 15, 20, 25, 30, 40, 50, 75, 100, 200, 300, 400, 600, 1000];
var coin_values_size = coin_values.length;

var coin = 1;
var Dez_6 =  "5*coin";
var J_6 = "5*coin";
var Q_6 = "7.5 * coin";
var K_6 = "7.5 * coin";
var As_6 = "10 * coin";
var P5_6 = "12.5 * coin";
var P4_6 = "12.5 * coin";
var P3_6 = "15 * coin";
var P2_6 = "25 * coin";
var P1_6 = "100 * coin";

var Dez_5 = "coin * 2";
var J_5 = "coin * 2";
var Q_5 = "coin * 3";
var K_5 = "coin * 3";
var As_5 = "coin * 4";
var P5_5 = "coin * 5";
var P4_5 = "coin * 5";
var P3_5 = "coin * 6";
var P2_5 = "coin * 10";
var P1_5 = "coin * 40";

var Dez_4 = "coin * 1";
var J_4 = "coin * 1.25";
var Q_4 = "coin * 1.5";
var K_4 = "coin * 2";
var As_4 = "coin * 2.5";
var P5_4 = "coin * 3";
var P4_4 = "coin * 3";
var P3_4 = "coin * 4";
var P2_4 = "coin * 8";
var P1_4 = "coin * 25";


var Dez_3 = "coin * 0.25";
var J_3 = "coin * 0.50";
var Q_3 = "coin * 0.75";
var K_3 = "coin * 0.75";
var As_3 = "coin";
var P5_3 = "coin * 1.25";
var P4_3 = "coin * 1.25";
var P3_3 = "coin * 1.5";
var P2_3 = "coin * 2.5";
var P1_3 = "coin * 5";


//line_6 = [nove_6, Dez_6, J_6, Q_6, K_6, As_6, P5_6, P4_6, P3_6, P2_6, P1_6]
//line_5 = [nove_5, Dez_5, J_5, Q_5, K_5, As_5, P5_5, P4_5, P3_5, P2_5, P1_5]
//line_4 = [nove_4, Dez_4, J_4, Q_4, K_4, As_4, P5_4, P4_4, P3_4, P2_4, P1_4]
//line_3 = [nove_3, Dez_3, J_3, Q_3, K_3, As_3, P5_3, P4_3, P3_3, P2_3, P1_3]

//line_6 = [Dez_6, J_6, Q_6, K_6, As_6, P5_6, P4_6, P3_6, P2_6, P1_6]
//line_5 = [Dez_5, J_5, Q_5, K_5, As_5, P5_5, P4_5, P3_5, P2_5, P1_5]
//line_4 = [Dez_4, J_4, Q_4, K_4, As_4, P5_4, P4_4, P3_4, P2_4, P1_4]
//line_3 = [Dez_3, J_3, Q_3, K_3, As_3, P5_3, P4_3, P3_3, P2_3, P1_3]


var line_3_symbols = [Dez_3, J_3, Q_3, K_3, As_3, P4_3, P3_3, P2_3, P1_3];
var line_4_symbols = [Dez_4, J_4, Q_4, K_4, As_4, P4_4, P3_4, P2_4, P1_4];
var line_5_symbols = [Dez_5, J_5, Q_5, K_5, As_5, P4_5, P3_5, P2_5, P1_5];
var line_6_symbols = [Dez_6, J_6, Q_6, K_6, As_6, P4_6, P3_6, P2_6, P1_6];

var scroll_animation_time = 2000; //1 sec

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
  //element.classList.remove("bet_button_clicked");
  //element.classList.add("bet_button_clicked"); 
}

function update_info_values(){
  for(var index = 0; index < symbol_number - 1; index++){
    document.getElementById("value" + (index+1) + "_" + 6).innerHTML = "6 - €" +  eval(line_6_symbols[index]);
    document.getElementById("value" + (index+1) + "_" + 5).innerHTML = "5 - €" +  eval(line_5_symbols[index]);
    document.getElementById("value" + (index+1) + "_" + 4).innerHTML = "4 - €" +  eval(line_4_symbols[index]);
    document.getElementById("value" + (index+1) + "_" + 3).innerHTML = "3 - €" +  eval(line_3_symbols[index]);
  }
}


class Scroll_Column{
  constructor(column){
    this.column = column;
    this.scrolled = 0;
    
  }

  scroll(){

    var t = new Date().getTime();
    var diff = t - this.start_time;
    var frac = diff / scroll_animation_time;
    var ts = this.total_offset * frac;
    var s = ts - this.scrolled;


    this.column.valueOf().scrollTop = s.valueOf();

    //$(this.column).scrollTo({top: s});
    this.set_scrolled = $.extend( {}, ts );

    if(diff > scroll_animation_time){
      console.log("CAnceling this sht");
      clearTimeout(this.time_interval);
    }
    else{
      var id = setTimeout(this.scroll, 1000);
      this.set_interval_id = id.valueOf();
    }

  }
  set set_final_offset(offset){
    this.final_offset = offset;
  }

  get get_final_offset(){
    return this.final_offset;
  }

  set set_scrolled(scrolled){
    this.scrolled = scrolled;
  }

  set set_column(column){
    this.column = column;
  }

  set set_start_time(start_time){
    this.start_time = start_time;
  }

  set set_total_offset(offset){
    this.total_offset = offset;
  }

  set set_interval_id(id){
    this.time_interval_id = id;
  }

  set set_animation_time(time){
    this.animation_time = time;
  }

  set set_has_bonus(b){
    this.has_bonus = b;
  }

  get get_animation_time(){
    return this.animation_time;
  }

  get get_start_time(){
    return this.start_time;
  }

  get get_total_offset(){
    return this.total_offset;
  }
  get get_scrolled(){
    return this.scrolled;
  }
  get get_interval_id(){
    return this.time_interval_id;
  }

  get get_has_bonus(){
    return this.has_bonus;
  }
}

class Column {

    constructor(column, index){
      this.element = column;
      this.focused_square = null;
      this.column_index = index;
      this.current_index = 0;
      this.recent_scatter = false;
      this.scatter_count = 0;
    }

    set set_recent_scatter(b){
      this.recent_scatter = b;
    }

    get is_recent_scatter(){
      return this.recent_scatter;
    }

    set set_scatter_countdown(n){
      this.scatter_count = n;
    }

    get get_scatter_countdown(){
      return this.scatter_count;
    }

    set set_square(square){
      this.focused_square = square;
    }

    set set_current_index(index){
      this.current_index = index;
    }

    get get_square(){
      return this.focused_square;
    }

    get get_column(){
      return this.element;
    }

    get get_current_index(){
      return this.current_index;
    }

}

class Pos {
  constructor(posX, posY){
    this.posX = posX;
    this.posY = posY;
    this.value = 0;
    this.element = null;
  }

  get get_posX(){
    return this.posX;
  }

  get get_posY(){
    return this.posY;
  }

  get get_value(){
    return this.value;
  }

  update_value(){
    var e = findClassOnPos(this.posX, this.posY, "symbol_square");
    this.value = e.dataset.value;
    this.element = e;
  }

  highlight_square(){
    if(this.value == symbol_number - 1){
      this.element.parentElement.classList.add("scatter_bonus");
    }
    else{
      this.element.classList.add("paying_square");
    }
  }

  stop_highlight_square(){
    if(this.value == symbol_number - 1){
      this.element.classList.remove("scatter_bonus");

    }
    else{
      this.element.classList.remove("paying_square");

    }
  }



}

//FIX ME
function findClassOnPos(posX, posY, classe){
  var elements = document.elementsFromPoint(posX, posY);
  var size = elements.length;
  for(var i = 0; i < size; i++){
      if(elements[i].classList.contains(classe)){
          return elements[i];
      }
  }
  return null;
}
function findChildrenWithClass(element, className){
  if(element == null){
      return null;
  }  
  if(element.classList.contains(className)){
      return element;
  }
  else{
      for(var child of element.children){
          var childResult = findChildrenWithClass(child,className);
          if(childResult != null){ return childResult;}
      }
      return null;
  } 
}


class Line{
  constructor(positions){
    this.positions = positions;
    this.line_length = 6;
  }

  draw_line(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    if(this.line_length < 3){
      return;
    }

    ctx.beginPath();
    for(var i = 0; i < this.line_length; i++){

      var p = this.positions[i];

      if(i == 0){
        ctx.moveTo(p.get_posX, p.get_posY);
      }
      else{
        ctx.lineTo(p.get_posX, p.get_posY);
        ctx.lineWidth = 5;
      }
    }

    ctx.strokeStyle = "#FFA500";
    ctx.stroke();
  }

  check_pay(multiplier){
    var symbol = this.positions[0].get_value;

    var size = this.positions.length;
    this.line_length = 1;

    //If line starts with scatter end
    if(symbol == symbol_number - 1){
      return 0;
    }


    for(var i = 1; i < size; i++){
      if(this.positions[i].get_value == symbol){
        this.line_length++;
      }
      else{
        break;
      }
    }

    if(this.line_length < 3){
      return 0;
    }
    add_paying_square(this.positions[0]);
    add_paying_square(this.positions[1]);
    add_paying_square(this.positions[2]);
    if(this.line_length == 3){
      return eval(line_3_symbols[symbol]) * multiplier;
    }
    add_paying_square(this.positions[3]);
    if(this.line_length == 4){
      return eval(line_4_symbols[symbol]) * multiplier;
    }
    add_paying_square(this.positions[4]);
    if(this.line_length == 5){
      return eval(line_5_symbols[symbol]) * multiplier;
    }
    add_paying_square(this.positions[5]);
    if(this.line_length == 6){
      return eval(line_6_symbols[symbol]) * multiplier;
    }
    else{
      //Raise error
    }


  }
}



var paying_squares = [];
var scatters = [];
var scatter_highlight_interval = 0;

function add_paying_square(square) {
  if(!paying_squares.includes(square)){
    paying_squares.push(square);
  }
}

function highlight_squares(b) {
  paying_squares.forEach(pos => {
    if(b){
      pos.highlight_square();
      
    }
    else{
      pos.stop_highlight_square();
    }
  });
  
}

var scatter_highlighting = false;
function highlight_scatters() {
  scatters.forEach(pos => {
    if(!scatter_highlighting){
      pos.highlight_square();
      
    }
    else{
      pos.stop_highlight_square();
    }
    
  });
  scatter_highlighting = !scatter_highlighting;
  
}

class Slot{
  constructor(slot){

    this.slot = [];

    this.create_pos(slot);
    
    this.create_lines();

    //this.draw_lines();
    
  }

  create_pos(slot){
    var rect = slot.getBoundingClientRect();
    console.log(rect.left);
    console.log(rect.top);
    var height = rect.height;
    var width = rect.width;
    var border_size = parseInt($(slot).css("border-left-width"),10);
    console.log(border_size);
    height -= border_size * 2;
    width -= border_size * 2;

    var column_width = width / 6;
    var row_height = height/(5 + shadow_frac*2);

    var left = rect.left + border_size + column_width / 2;
    console.log(shadow_frac);
    var top = rect.top + border_size + row_height * (0.5 + shadow_frac);

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    for(var i = 0; i < 5; i++){

      var row = []

      for(var j = 0; j < 6; j++){

        var posX = (left + j * column_width);
        var posY = (top + i * row_height);

        //ctx.fillStyle = '#0000FF';
        //ctx.fillRect(posX, posY, 10,10);
        //ctx.beginPath();
        //ctx.arc(posX, posY, 10, 0, Math.PI *2, true);
        //ctx.fill();
        //setTimeout(function(){ctx.fillRect(posX, posY, 1,1);}, 0);

        var pos = new Pos(posX, posY);
        row.push(pos);
      }
      this.slot.push(row);

    }
  }

  create_lines(){

    this.lines = [];

    create_straight_lines(this.slot, this.lines);
    create_two_row_lines(this.slot, this.lines);
    create_three_row_lines(this.slot, this.lines);
    create_four_row_lines(this.slot, this.lines);
    create_five_row_lines(this.slot, this.lines);

    console.log(this.lines);

    function create_straight_lines(slot, lines){

      for(var i = 0; i < 5; i++){
        var positions = []

        for(var j = 0; j < 6; j++){
          var p = slot[i][j];
          positions.push(p);
        }

        var l = new Line(positions);
        lines.push(l);
      }
    }

    function create_line(start_line, line_direction, line_offset, slot, lines){
      var positions = [];
      var current_line = start_line;
      var direction = line_direction;

      for(var j = 0; j < 6; j++){
        positions.push(slot[current_line][j]);

        if(current_line == start_line){
          direction = line_direction;
        }
        else if( current_line == start_line + line_offset || current_line == start_line - line_offset){
          direction = -line_direction;
        }
        current_line += direction;
      }

      var l = new Line(positions);
      lines.push(l);

    }

    function create_two_row_lines(slot, lines){
      for(var i = 0; i < 5; i++){
        if(i == 0){
          create_line(i, 1, 1, slot, lines);
        }
        else if(i == 4){
          create_line(i, -1, 1, slot, lines);
        }
        else{
          create_line(i, -1, 1, slot, lines);
          create_line(i, 1, 1, slot, lines);
          
        }
      }
    }

    function create_three_row_lines(slot, lines){
      for(var i = 0; i < 5; i++){
        if(i == 0 || i == 1){
          create_line(i, 1, 2, slot, lines);
        }
        else if(i == 3 || i == 4){
          create_line(i, -1, 2, slot, lines);
        }
        else{
          create_line(i, -1, 2, slot, lines);
          create_line(i, 1, 2, slot, lines);
          
        }
      }
    }

    function create_four_row_lines(slot, lines){
      for(var i = 0; i < 5; i++){
        if(i == 0 || i == 1){
          create_line(i, 1, 3, slot, lines);
        }
        else if(i == 3 || i == 4){
          create_line(i, -1, 3, slot, lines);
        }
      }
    }

    function create_five_row_lines(slot, lines){
      create_line(0, 1, 4, slot, lines);
      create_line(4, -1, 4, slot, lines);
    }
  
  }

  spin_reward(){
    this.update_positions();
    return this.check_gains();
  }

  check_gains(){
    var size = this.lines.length;
    var total = 0;
    var paying_lines = []
    for(var i = 0; i < size; i++){
      var pay = this.lines[i].check_pay(multiplier);
      if (pay > 0){
        paying_lines.push(this.lines[i]);
        total += pay;
      }
    }

    for(var i = 0; i < paying_lines.length; i++){
      paying_lines[i].draw_line();
    }

    if(total > 0){
      setTimeout( function () {

        highlight_squares(true);

        canvas_flickering();
        flickering_id = setInterval(canvas_flickering, canvas_flickering_time);
      }, canvas_flickering_time / 2);

    }

    this.update_money_received(total);
    return total;

  }

  update_positions(){
    for(var i = 0; i < row_number; i++){
      for(var j = 0; j < column_number;j++){
        this.slot[i][j].update_value();
      }
    }
  }

  update_money_received(money){
    var s = document.getElementById("spin_win");
    if(money == 0){
      s.innerHTML = "Spin to win";
    }
    else{
      s.innerHTML = "You won €" + money.toFixed(2).replace('.', ','); 

    }
  }

  draw_lines(){
    var size = this.lines.length;
    for(var i = 0; i < size; i++){
      this.lines[i].draw_line();
    }
  }

  check_for_bonus(){
    scatters = [];
    var number_of_scatter = 0;

    for(var i = 0; i < 5; i++){
      for(var j = 0; j < 6; j++){
        var p = this.slot[i][j];
        if(p.get_value == symbol_number - 1){
          number_of_scatter++;
          scatters.push(p);
        }
      }
    }
    return number_of_scatter >= 3;
  }
}


class Bonus{
  constructor(){

    this.total_won = 0;

    this.total_spins = initial_bonus_spins;    

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


}

var slot = null;
var in_spin = false;
var first_spin = false;
$(document).ready(function(){

  

  startSlot();
  update_info_values();
  slot = new Slot(document.getElementById("slot"));
  
  

  $(document).keydown(function(e) {
    if (e.keyCode == 83 || e.keyCode == 32) {    //S
      try_to_spin();

    }

  });

});


function stop_music(number){
  current_audio.pause();
  $(document.getElementById("audio_" + number + "_play")).css("display", "block");
  $(document.getElementById("audio_" + number + "_pause")).css("display", "none");
}
 
function play_music(number){
  if(current_audio != null){

    var n = parseInt(current_audio.dataset.audioNumber);
    if(n != number){
      console.log("entered");
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

function try_to_spin() {
  if(!first_spin){
    first_spin = true;
    start_playing_music();
  }
  if(!in_bonus && !entering_bonus && !in_spin){

    if(credit - coin >= 0){
      in_spin = true;
      credit -= coin;
      update_credit();
      perform_spin();

    }
  } 
}
function perform_spin() {
  reset_canvas();
  spin();
}

function startSlot(){
  for(var i = 1; i <= 6; i++){
    var column = document.getElementById("column"+ i);
    const c = new Column(column, i-1);
    columns.push(c);
    const s = new Scroll_Column(c);
    scroll_columns.push(s);
    add_symbols_to_column(c, 100);
    var size = column.children.length;
    var square = column.children[size - 1 - 5];

    var offset = square.offsetTop - square.getBoundingClientRect().height * shadow_frac;
    column.scroll({top: offset});


    c.set_square = square;
  }
}

var canvas_showing = false;
var canvas_flickering_time = 800;
var flickering_id = 0;
function canvas_flickering(){

  var canvas = document.getElementById("canvas");
  if(canvas_showing){
    $(canvas).css("display", "none");

  }
  else{
    $(canvas).css("display", "block");
  }
  canvas_showing = !canvas_showing;
  
}

function reset_canvas(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(flickering_id);
  canvas_showing = false;
  $(canvas).css("display", "none");
  highlight_squares(false);
  paying_squares = [];

  good_luck();
  update_bonus_spins();
  update_multiplier_indicator();
}
function good_luck() {
  var s = document.getElementById("spin_win");
  s.innerHTML = "Good luck!";

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

function update_credit(){
  var element = document.getElementById("credit");
  element.innerHTML = "€" + (Math.round(credit * 100) / 100).toFixed(2).replace('.', ',');
}

var sincronization = 0;
function spin() {
  sincronization = 0; //may be useless

  var r = Math.random();
  var amount = 40 + Math.round(r*20);
  var animation_time = scroll_animation_time.valueOf();

  var time_per_symbol = animation_time / amount;

  var t = new Date().getTime();
  
  for(var i = 0; i < column_number; i++){
    let column = columns[i];
    let scroll = scroll_columns[i];

    let index = Array.prototype.indexOf.call(column.get_column.children, column.get_square);
    let new_index = index - amount;
    let new_top_square = column.get_column.children[new_index];


    scroll.set_has_bonus = false;
    for(var j = 0; j < row_number; j++){
      if(findChildrenWithClass(column.get_column.children[new_index + j], "symbol_square").dataset.value ==  symbol_number - 1){
        scroll.set_has_bonus = true;
        break;
      }
    }

    let square_offset = new_top_square.offsetTop - new_top_square.getBoundingClientRect().height * shadow_frac;
    let column_offset = column.get_column.scrollTop;
    var offset = column_offset - square_offset;

    scroll.set_start_time = t.valueOf();
    scroll.set_total_offset = offset.valueOf();
    scroll.set_final_offset = square_offset.valueOf();
    scroll.set_scrolled = 0;

    column.set_square = new_top_square.valueOf();
    column.set_current_index = new_index.valueOf();
    if(i != 0){
      var add = Math.round(Math.random() * 5);
      amount += add; 
      animation_time += time_per_symbol * add;
      scroll.set_animation_time = animation_time;
    }else{
      scroll.set_animation_time = animation_time;
      var add = Math.round(Math.random() * 5);
      amount += add; 
    }
  }

  
  let id0 = setInterval(function(){  spin_column(0); }, 8);
  scroll_columns[0].set_interval_id = id0;
  let id1 = setInterval(function(){  spin_column(1); }, 8);
  scroll_columns[1].set_interval_id = id1;
  let id2 = setInterval(function(){  spin_column(2); }, 8);
  scroll_columns[2].set_interval_id = id2;
  let id3 = setInterval(function(){  spin_column(3); }, 8);
  scroll_columns[3].set_interval_id = id3;
  let id4 = setInterval(function(){  spin_column(4); }, 8);
  scroll_columns[4].set_interval_id = id4;
  let id5 = setInterval(function(){  spin_column(5); }, 8);
  scroll_columns[5].set_interval_id = id5;

  /*FIX ME weird effect made me feel sick
  setTimeout(() => {
    let id0 = setInterval(function(){  spin_column(0); }, 10);
    scroll_columns[0].set_interval_id = id0;
  }, 0);
  setTimeout(() => {
    let id1 = setInterval(function(){  spin_column(1); }, 10);
    scroll_columns[1].set_interval_id = id1;
  }, 300);

  setTimeout(() => {
    let id2 = setInterval(function(){  spin_column(2); }, 10);
    scroll_columns[2].set_interval_id = id2;
  }, 600);

  setTimeout(() => {
    let id3 = setInterval(function(){  spin_column(3); }, 10);
    scroll_columns[3].set_interval_id = id3;
  }, 900);
  
  setTimeout(() => {
    let id4 = setInterval(function(){  spin_column(4); }, 10);
    scroll_columns[4].set_interval_id = id4;
  }, 1200);

  setTimeout(() => {
    let id5 = setInterval(function(){  spin_column(5); }, 10);
    scroll_columns[5].set_interval_id = id5;
  }, 1500);*/
}

function spin_column(index) {
  
  var column = columns[index];
  let scroll = scroll_columns[index]; 
  

  //console.log("Initial scroll = " + column.get_column.scrollTop);
  let t = new Date().getTime();
  let diff = t - scroll.get_start_time;
  let frac = diff / scroll.get_animation_time;
  if(frac > 1){
    frac = 1;
  }

  //let s = scroll.get_final_offset + scroll.get_total_offset * Math.pow((1 - Math.pow(frac, 3)), 20); 
  //let s = scroll.get_final_offset + Math.pow(scroll.get_total_offset * (1 - Math.pow(frac, 3)), 1-frac / 2);
  let s = scroll.get_final_offset + scroll.get_total_offset * (1 - Math.pow(frac, 2)); 
  column.get_column.scroll({top: s});

  //console.log("Final scroll = " + column.get_column.scrollTop);

  if(diff > scroll.get_animation_time){

    if(scroll.get_has_bonus){
      /*
      var audio = new Audio('Sounds/headshot.mp3');
      audio.play();*/
    }

    clearInterval(scroll.get_interval_id);
    sincronization++;
    
    endSpin();
  }

}
var multiplier = 1;
function endSpin(){
  if(sincronization == column_number){

    sincronization = 0;
    for(var k = 0; k < column_number; k++){
      var c = columns[k];
  
      var child = c.get_column.children;
      var size = child.length;
      var current_index = c.current_index;
  
      for(var i = size - 1; i > current_index + 5; i--){
        c.get_column.removeChild(child[i]);
      }
      var add_quantity = 100 - current_index;
      add_symbols_to_column(c, add_quantity);

      var offset = c.get_square.offsetTop - c.get_square.getBoundingClientRect().height * shadow_frac;
      c.get_column.scroll({top: offset});
      
      
    }

    var total = slot.spin_reward();


    if(in_bonus){
      bonus(total);
    }
    else{ 

      credit += total;
      update_credit();


      if(slot.check_for_bonus()){ //enter bonus 

        stop_automatic_play();


        setTimeout( function () {
          highlight_scatters();
          setTimeout(() => {
            var audio = new Audio('Sounds/headshot.mp3');
            audio.play();
          }, 200);
          
          highlight_scatters();
        }, canvas_flickering_time / 2);
        
        entering_bonus = true;
        setTimeout(() => {
          show_bonus_screen();
        }, 3000);
      }
      else{
        if(auto_spin){
          setTimeout(() => {
            if(auto_spins_left > 0){
              auto_spins_left--;
              try_to_spin();
            }
            else{
              stop_automatic_play();
            }
            
          }, 1000);
        }
      }
    }


    
    setTimeout(() => {
      in_spin = false;
    }, 300);
  }

  return;
}


function add_symbols_to_column(column, quantity){
  //adds new elements
  for(var i = 0; i < quantity; i++){

    var r = Math.random();
    var sum = 0;

    for(var j = 0; j < symbol_number; j++){
      if(r <= odds[j] + sum){

        if(j == (symbol_number - 1)){
          if(column.is_recent_scatter){
            i--;
            break;
          }
          else{
            column.set_recent_scatter = true;
            column.set_scatter_countdown = 5;
            add_symbol(j, column);
          }
        }
        else{
          add_symbol(j, column);
          if(column.is_recent_scatter){
            column.set_scatter_countdown = column.get_scatter_countdown - 1;
            
            if(column.get_scatter_countdown == 0){
              column.set_recent_scatter = false;
            }
          }
        }

        break;
      }

      else{
        sum += odds[j];
      }


    }
  }
  
  //column.insertBefore(new_first_element, column.firstChild);
}

function add_symbol(index, column){
  var element = create_element(index);

  column.get_column.prepend(element);
  //column.get_column.insertBefore(element, column.get_column.firstChild);
}

function create_element(index){
  var src = "IMAGES/" + images[index];

  var square_container = document.createElement("div");
  square_container.classList.add("symbol_square_container");

  var square = document.createElement("div");
  square.classList.add("symbol_square");

  if(images[index] == "hive.png" || images[index] == "spider.png"){
    square.classList.add("more_brightness");
  }


  square.id = "symbol" + getSquareKey().toString();
  square.setAttribute("data-value", index);


  var img1 = document.createElement("IMG");
  img1.src = src;
  img1.classList.add("symbol_image");
  
  square.append(img1);

  if(index == symbol_number - 1){
    var img2 = document.createElement("IMG");
    img2.src = "IMAGES/target.png";
    img2.classList.add("target_animation");

    square_container.append(img2);
  }

  square_container.append(square);

  return square_container;


}

var entering_bonus = false;
var can_enter = false;

function show_bonus_screen() {
  can_enter = true;
  var e = document.getElementById("enter_bonus");
  e.classList.remove("not_show");
  e.classList.add("show");
  
}


function start_bonus() {
  clearInterval(scatter_highlight_interval);
  scatter_highlighting = true;
  highlight_scatters();
  in_bonus = true;
  current_bonus = new Bonus();
  multiplier = 1;
  
  bonus_spins = initial_bonus_spins;
  current_bonus_spin = 1;

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

window.onmousedown = function(event) {
  printMousePosition(event);
  if(entering_bonus && can_enter){
    entering_bonus = false;
    can_enter = false;
    var e = document.getElementById("enter_bonus");
    e.classList.remove("show");
    e.classList.add("not_show");
    start_bonus();

  }
  else if(in_bonus && can_leave_bonus){
    in_bonus = false;
    can_leave_bonus = false;
    var e = document.getElementById("leave_bonus");
    e.classList.remove("show");
    e.classList.add("not_show");

    e = document.getElementById("bonus_win_container");
    $(e).css("display", "none");
  }
}



function automatic_play() {
  if(auto_spin){
    stop_automatic_play();
    return;
  }
  if(in_spin || entering_bonus || in_bonus){
    return;
  }

  auto_spins_left = 100;
  auto_spin = true;
  document.getElementById("automatic_spins").classList.remove("automatic_spins_off");
  document.getElementById("automatic_spins").classList.add("automatic_spins_active");
  try_to_spin();

}

function stop_automatic_play() {
  auto_spin = false;
  auto_spins_left = 0;
  document.getElementById("automatic_spins").classList.remove("automatic_spins_active");
  document.getElementById("automatic_spins").classList.add("automatic_spins_off");
}



function close_info() {
  var info = document.getElementById("info");
  $(info).css("display", "none");
  
}

function open_info(){
  var info = document.getElementById("info");
  $(info).css("display", "block");
}

function select_image(){
  var audio = new Audio('Sounds/select.wav');
  audio.volume = 0.1;
  audio.play();
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

function hyper_spin(element){
  if(element.classList.contains("normal_spin")){
    element.classList.remove("normal_spin");
    element.classList.remove("hyper_spin");
    scroll_animation_time = 1300;
  }
  else{
    element.classList.remove("hyper_spin");
    element.classList.add("normal_spin");
    scroll_animation_time = 2000;
  }
}

function printMousePosition(ev){
  console.log("Mouse X = " + ev.clientX);
  console.log("Mouse Y = " + ev.clientY);
}


var id = 0;
function getSquareKey(){
  if(id > 1000000){
    id = 0;
  }
  return id++;
}
