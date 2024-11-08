"use strict";

var shadow_frac = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue(
    "--column-shadow-frac"
  ),
  10
);

var columns = [];
var scroll_columns = [];

var column_number;
var row_number;

var multiplier;

var odds;
var images;
var symbol_number;

var credit;
var coin_index;
var coin_values;
var coin_values_size;

var coin;
var line_3_symbols;
var line_4_symbols;
var line_5_symbols;
var line_6_symbols;

var scroll_animation_time = 2000; //1 sec

var slot = null;
var in_spin = false;
var first_spin = false;

class Scroll_Column {
  constructor(column) {
    this.column = column;
    this.scrolled = 0;
  }

  scroll() {
    var t = new Date().getTime();
    var diff = t - this.start_time;
    var frac = diff / scroll_animation_time;
    var ts = this.total_offset * frac;
    var s = ts - this.scrolled;

    this.column.valueOf().scrollTop = s.valueOf();

    //$(this.column).scrollTo({top: s});
    this.set_scrolled = $.extend({}, ts);

    if (diff > scroll_animation_time) {
      clearTimeout(this.time_interval);
    } else {
      var id = setTimeout(this.scroll, 1000);
      this.set_interval_id = id.valueOf();
    }
  }
  set set_final_offset(offset) {
    this.final_offset = offset;
  }

  get get_final_offset() {
    return this.final_offset;
  }

  set set_scrolled(scrolled) {
    this.scrolled = scrolled;
  }

  set set_column(column) {
    this.column = column;
  }

  set set_start_time(start_time) {
    this.start_time = start_time;
  }

  set set_total_offset(offset) {
    this.total_offset = offset;
  }

  set set_interval_id(id) {
    this.time_interval_id = id;
  }

  set set_animation_time(time) {
    this.animation_time = time;
  }

  set set_has_bonus(b) {
    this.has_bonus = b;
  }

  get get_animation_time() {
    return this.animation_time;
  }

  get get_start_time() {
    return this.start_time;
  }

  get get_total_offset() {
    return this.total_offset;
  }
  get get_scrolled() {
    return this.scrolled;
  }
  get get_interval_id() {
    return this.time_interval_id;
  }

  get get_has_bonus() {
    return this.has_bonus;
  }
}

class Column {
  constructor(column, index) {
    this.element = column;
    this.focused_square = null;
    this.column_index = index;
    this.current_index = 0;
    this.recent_scatter = false;
    this.scatter_count = 0;
  }

  set set_recent_scatter(b) {
    this.recent_scatter = b;
  }

  get is_recent_scatter() {
    return this.recent_scatter;
  }

  set set_scatter_countdown(n) {
    this.scatter_count = n;
  }

  get get_scatter_countdown() {
    return this.scatter_count;
  }

  set set_square(square) {
    this.focused_square = square;
  }

  set set_current_index(index) {
    this.current_index = index;
  }

  get get_square() {
    return this.focused_square;
  }

  get get_column() {
    return this.element;
  }

  get get_current_index() {
    return this.current_index;
  }
}

class Pos {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.value = 0;
    this.element = null;
  }

  get get_posX() {
    return this.posX;
  }

  get get_posY() {
    return this.posY;
  }

  get get_value() {
    return this.value;
  }

  update_value() {
    var e = findClassOnPos(this.posX, this.posY, "symbol_square");
    this.value = e.dataset.value;
    this.element = e;
  }

  highlight_square() {
    if (this.value == symbol_number - 1) {
      this.element.parentElement.classList.add("scatter_bonus");
    } else {
      this.element.classList.add("paying_square");
    }
  }

  stop_highlight_square() {
    if (this.value == symbol_number - 1) {
      this.element.classList.remove("scatter_bonus");
    } else {
      this.element.classList.remove("paying_square");
    }
  }
}

class Line {
  constructor(positions) {
    this.positions = positions;
    this.line_length = 6;
  }

  draw_line() {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    if (this.line_length < 3) {
      return;
    }

    ctx.beginPath();
    for (var i = 0; i < this.line_length; i++) {
      var p = this.positions[i];

      if (i == 0) {
        ctx.moveTo(p.get_posX, p.get_posY);
      } else {
        ctx.lineTo(p.get_posX, p.get_posY);
        ctx.lineWidth = 5;
      }
    }

    ctx.strokeStyle = "#FFA500";
    ctx.stroke();
  }

  check_pay(multiplier) {
    var symbol = this.positions[0].get_value;

    var size = this.positions.length;
    this.line_length = 1;

    //If line starts with scatter end
    if (symbol == symbol_number - 1) {
      return 0;
    }

    for (var i = 1; i < size; i++) {
      if (this.positions[i].get_value == symbol) {
        this.line_length++;
      } else {
        break;
      }
    }

    if (this.line_length < 3) {
      return 0;
    }
    add_paying_square(this.positions[0]);
    add_paying_square(this.positions[1]);
    add_paying_square(this.positions[2]);
    if (this.line_length == 3) {
      return eval(line_3_symbols[symbol]) * multiplier;
    }
    add_paying_square(this.positions[3]);
    if (this.line_length == 4) {
      return eval(line_4_symbols[symbol]) * multiplier;
    }
    add_paying_square(this.positions[4]);
    if (this.line_length == 5) {
      return eval(line_5_symbols[symbol]) * multiplier;
    }
    add_paying_square(this.positions[5]);
    if (this.line_length == 6) {
      return eval(line_6_symbols[symbol]) * multiplier;
    } else {
      //Raise error
    }
  }
}

var paying_squares = [];

function add_paying_square(square) {
  if (!paying_squares.includes(square)) {
    paying_squares.push(square);
  }
}

function highlight_squares(b) {
  paying_squares.forEach((pos) => {
    if (b) {
      pos.highlight_square();
    } else {
      pos.stop_highlight_square();
    }
  });
}

class Slot {
  constructor(slot) {
    this.create_pos(slot);

    this.create_lines();

    //this.draw_lines();
  }

  create_pos(slot) {
    this.slot = [];
    var rect = slot.getBoundingClientRect();
    var height = rect.height;
    var width = rect.width;
    var border_size = parseInt($(slot).css("border-left-width"), 10);
    height -= border_size * 2;
    width -= border_size * 2;

    var column_width = width / 6;
    var row_height = height / (5 + shadow_frac * 2);

    var left = rect.left + border_size + column_width / 2;
    var top = rect.top + border_size + row_height * (0.5 + shadow_frac);

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    for (var i = 0; i < 5; i++) {
      var row = [];

      for (var j = 0; j < 6; j++) {
        var posX = left + j * column_width;
        var posY = top + i * row_height;

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

  create_lines() {
    this.lines = [];

    create_straight_lines(this.slot, this.lines);
    create_two_row_lines(this.slot, this.lines);
    create_three_row_lines(this.slot, this.lines);
    create_four_row_lines(this.slot, this.lines);
    create_five_row_lines(this.slot, this.lines);

    function create_straight_lines(slot, lines) {
      for (var i = 0; i < 5; i++) {
        var positions = [];

        for (var j = 0; j < 6; j++) {
          var p = slot[i][j];
          positions.push(p);
        }

        var l = new Line(positions);
        lines.push(l);
      }
    }

    function create_line(start_line, line_direction, line_offset, slot, lines) {
      var positions = [];
      var current_line = start_line;
      var direction = line_direction;

      for (var j = 0; j < 6; j++) {
        positions.push(slot[current_line][j]);

        if (current_line == start_line) {
          direction = line_direction;
        } else if (
          current_line == start_line + line_offset ||
          current_line == start_line - line_offset
        ) {
          direction = -line_direction;
        }
        current_line += direction;
      }

      var l = new Line(positions);
      lines.push(l);
    }

    function create_two_row_lines(slot, lines) {
      for (var i = 0; i < 5; i++) {
        if (i == 0) {
          create_line(i, 1, 1, slot, lines);
        } else if (i == 4) {
          create_line(i, -1, 1, slot, lines);
        } else {
          create_line(i, -1, 1, slot, lines);
          create_line(i, 1, 1, slot, lines);
        }
      }
    }

    function create_three_row_lines(slot, lines) {
      for (var i = 0; i < 5; i++) {
        if (i == 0 || i == 1) {
          create_line(i, 1, 2, slot, lines);
        } else if (i == 3 || i == 4) {
          create_line(i, -1, 2, slot, lines);
        } else {
          create_line(i, -1, 2, slot, lines);
          create_line(i, 1, 2, slot, lines);
        }
      }
    }

    function create_four_row_lines(slot, lines) {
      for (var i = 0; i < 5; i++) {
        if (i == 0 || i == 1) {
          create_line(i, 1, 3, slot, lines);
        } else if (i == 3 || i == 4) {
          create_line(i, -1, 3, slot, lines);
        }
      }
    }

    function create_five_row_lines(slot, lines) {
      create_line(0, 1, 4, slot, lines);
      create_line(4, -1, 4, slot, lines);
    }
  }

  spin_reward() {
    this.update_positions();
    return this.check_gains();
  }

  check_gains() {
    var size = this.lines.length;
    var total = 0;
    var paying_lines = [];
    for (var i = 0; i < size; i++) {
      var pay = this.lines[i].check_pay(multiplier);
      if (pay > 0) {
        paying_lines.push(this.lines[i]);
        total += pay;
      }
    }

    for (var i = 0; i < paying_lines.length; i++) {
      paying_lines[i].draw_line();
    }

    if (total > 0) {
      setTimeout(function () {
        highlight_squares(true);

        canvas_flickering();
        flickering_id = setInterval(canvas_flickering, canvas_flickering_time);
      }, canvas_flickering_time / 2);
    }

    this.update_money_received(total);
    return total;
  }

  update_positions() {
    for (var i = 0; i < row_number; i++) {
      for (var j = 0; j < column_number; j++) {
        this.slot[i][j].update_value();
      }
    }
  }

  update_money_received(money) {
    var s = document.getElementById("spin_win");
    if (money == 0) {
      s.innerHTML = "Spin to win";
    } else {
      s.innerHTML = "You won €" + money.toFixed(2).replace(".", ",");
    }
  }

  draw_lines() {
    var size = this.lines.length;
    for (var i = 0; i < size; i++) {
      this.lines[i].draw_line();
    }
  }

  check_for_scatters() {
    scatters = [];
    var number_of_scatter = 0;

    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        var p = this.slot[i][j];
        if (p.get_value == symbol_number - 1) {
          number_of_scatter++;
          scatters.push(p);
        }
      }
    }
    return number_of_scatter;
  }
}

function try_to_spin() {
  if (!first_spin) {
    first_spin = true;
    start_playing_music();
  }
  if (!in_bonus && !entering_bonus && !in_spin) {
    if (credit - coin >= 0) {
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

$(document).ready(function () {
  loadGameConfig()
    .then(() => {
      startSlot();
      update_info_values();
      slot = new Slot(document.getElementById("slot"));

      // Set up keyboard event listener
      $(document).keydown(function (e) {
        if (e.keyCode == 83 || e.keyCode == 32) {
          //S or space
          try_to_spin();
        }
      });
    })
    .catch((error) => {
      // TODO show an error message to the user here
      console.error("Failed to initialize game:", error);
    });
});

async function loadGameConfig() {
  try {
    const response = await fetch("./config.json");
    const config = await response.json();
    // Destructure and store all configuration values globally
    const {
      configGridSize: { configColumns, configRows },
      gameSettings: {
        configMultiplier,
        configSymbolNumber,
        configCredit,
        configCoinIndex,
        configCoin,
      },
      configOdds,
      configImages,
      configCoinValues,
      configPayouts,
    } = config;

    // Store all values in global variables
    column_number = configColumns;
    row_number = configRows;
    multiplier = configMultiplier;
    odds = configOdds;
    images = configImages;
    symbol_number = configSymbolNumber;
    credit = configCredit;
    coin_index = configCoinIndex;
    coin_values = configCoinValues;
    coin_values_size = configCoinValues.length;
    coin = configCoin;

    // Convert payout strings into arrays for each line
    line_3_symbols = Object.values(configPayouts.line3);
    line_4_symbols = Object.values(configPayouts.line4);
    line_5_symbols = Object.values(configPayouts.line5);
    line_6_symbols = Object.values(configPayouts.line6);
  } catch (error) {
    console.error("Error loading game configuration:", error);
    throw error;
  }
}

function startSlot() {
  for (var i = 1; i <= 6; i++) {
    var column = document.getElementById("column" + i);
    const c = new Column(column, i - 1);
    columns.push(c);
    const s = new Scroll_Column(c);
    scroll_columns.push(s);
    add_symbols_to_column(c, 100);
    var size = column.children.length;
    var square = column.children[size - 1 - 5];

    var offset =
      square.offsetTop - square.getBoundingClientRect().height * shadow_frac;
    column.scroll({ top: offset });

    c.set_square = square;
  }
}

var canvas_showing = false;
var canvas_flickering_time = 800;
var flickering_id = 0;
function canvas_flickering() {
  var canvas = document.getElementById("canvas");
  if (canvas_showing) {
    $(canvas).css("display", "none");
  } else {
    $(canvas).css("display", "block");
  }
  canvas_showing = !canvas_showing;
}

function reset_canvas() {
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

function update_credit() {
  var element = document.getElementById("credit");
  element.innerHTML =
    "€" + (Math.round(credit * 100) / 100).toFixed(2).replace(".", ",");
}

var sincronization = 0;
function spin() {
  for (var k = 0; k < column_number; k++) {
    var c = columns[k];
    var add_quantity = 110 - c.current_index;
    add_symbols_to_column(c.valueOf(), add_quantity.valueOf());
  }

  var r = Math.random();
  var amount = 40 + Math.round(r * 20);
  var animation_time = scroll_animation_time.valueOf();

  var time_per_symbol = animation_time / amount;

  var t = new Date().getTime();

  for (var i = 0; i < column_number; i++) {
    let column = columns[i];
    let scroll = scroll_columns[i];

    let index = Array.prototype.indexOf.call(
      column.get_column.children,
      column.get_square
    );
    let new_index = index - amount;
    let new_top_square = column.get_column.children[new_index];

    scroll.set_has_bonus = false;
    for (var j = 0; j < row_number; j++) {
      if (
        findChildrenWithClass(
          column.get_column.children[new_index + j],
          "symbol_square"
        ).dataset.value ==
        symbol_number - 1
      ) {
        scroll.set_has_bonus = true;
        break;
      }
    }

    let square_offset =
      new_top_square.offsetTop -
      new_top_square.getBoundingClientRect().height * shadow_frac;
    let column_offset = column.get_column.scrollTop;
    var offset = column_offset - square_offset;

    scroll.set_start_time = t.valueOf();
    scroll.set_total_offset = offset.valueOf();
    scroll.set_final_offset = square_offset.valueOf();
    scroll.set_scrolled = 0;

    column.set_square = new_top_square.valueOf();
    column.set_current_index = new_index.valueOf();

    var added_amount = 10;
    if (hyper_spin) {
      added_amount /= 2;
    }
    if (i != 0) {
      var add = Math.round(Math.random() * added_amount);
      add = added_amount;
      amount += add;
      animation_time += time_per_symbol * add;
      scroll.set_animation_time = animation_time;
    } else {
      scroll.set_animation_time = animation_time;
      var add = Math.round(Math.random() * added_amount);
      add = added_amount;
      amount += add;
    }
  }

  let id0 = setInterval(function () {
    spin_column(0);
  }, 8);
  scroll_columns[0].set_interval_id = id0;
  let id1 = setInterval(function () {
    spin_column(1);
  }, 8);
  scroll_columns[1].set_interval_id = id1;
  let id2 = setInterval(function () {
    spin_column(2);
  }, 8);
  scroll_columns[2].set_interval_id = id2;
  let id3 = setInterval(function () {
    spin_column(3);
  }, 8);
  scroll_columns[3].set_interval_id = id3;
  let id4 = setInterval(function () {
    spin_column(4);
  }, 8);
  scroll_columns[4].set_interval_id = id4;
  let id5 = setInterval(function () {
    spin_column(5);
  }, 8);
  scroll_columns[5].set_interval_id = id5;
}

function spin_column(index) {
  var column = columns[index];
  let scroll = scroll_columns[index];

  //console.log("Initial scroll = " + column.get_column.scrollTop);
  let t = new Date().getTime();
  let diff = t - scroll.get_start_time;
  let frac = diff / scroll.get_animation_time;
  if (frac > 1) {
    frac = 1;
  }

  let s =
    scroll.get_final_offset +
    scroll.get_total_offset *
      ((1 / 2) * Math.sin(Math.PI * (Math.pow(frac, 1.6 - frac) + 0.5)) + 0.5);
  column.get_column.scroll({ top: s });

  if (diff > scroll.get_animation_time) {
    if (scroll.get_has_bonus) {
      /*
      var audio = new Audio('Sounds/headshot.mp3');
      audio.play();*/
    }

    clearInterval(scroll.get_interval_id);
    sincronization++;

    end_spin();
  }
}

function end_spin() {
  if (sincronization == column_number) {
    sincronization = 0;
    for (var k = 0; k < column_number; k++) {
      var c = columns[k];

      var child = c.get_column.children;
      var size = child.length;
      var current_index = c.current_index;

      for (var i = size - 1; i > current_index + 5; i--) {
        c.get_column.removeChild(child[i]);
      }
    }

    var total = slot.spin_reward();

    if (in_bonus) {
      bonus(total);
    } else {
      credit += total;
      update_credit();

      var number_of_scatter = slot.check_for_scatters();
      if (number_of_scatter >= 3) {
        //enter bonus

        stop_automatic_play();

        setTimeout(function () {
          highlight_scatters(number_of_scatter);
        }, canvas_flickering_time / 2);

        entering_bonus = true;
        current_bonus = new Bonus(number_of_scatter);

        setTimeout(() => {
          show_bonus_screen();
        }, 3000);
      } else {
        if (auto_spin) {
          setTimeout(
            () => {
              if (auto_spins_left > 0) {
                auto_spins_left--;
                update_auto_spin_count_display();
                try_to_spin();
              } else {
                stop_automatic_play();
              }
            },
            total == 0 ? 1000 : 2000
          );
        }
      }
    }

    setTimeout(() => {
      in_spin = false;
    }, 300);
  }

  return;
}

function add_symbols_to_column(column, quantity) {
  //adds new elements
  for (var i = 0; i < quantity; i++) {
    var r = Math.random();
    var sum = 0;

    for (var j = 0; j < symbol_number; j++) {
      if (r <= odds[j] + sum) {
        if (j == symbol_number - 1) {
          if (column.is_recent_scatter) {
            i--;
            break;
          } else {
            column.set_recent_scatter = true;
            column.set_scatter_countdown = 5;
            add_symbol(j, column);
          }
        } else {
          add_symbol(j, column);
          if (column.is_recent_scatter) {
            column.set_scatter_countdown = column.get_scatter_countdown - 1;

            if (column.get_scatter_countdown == 0) {
              column.set_recent_scatter = false;
            }
          }
        }

        break;
      } else {
        sum += odds[j];
      }
    }
  }

  //column.insertBefore(new_first_element, column.firstChild);
}

function add_symbol(index, column) {
  var element = create_element(index);

  column.get_column.prepend(element);
  //column.get_column.insertBefore(element, column.get_column.firstChild);
}

function create_element(index) {
  var src = "IMAGES/" + images[index];

  var square_container = document.createElement("div");
  square_container.classList.add("symbol_square_container");

  var square = document.createElement("div");
  square.classList.add("symbol_square");

  if (images[index] == "hive.png" || images[index] == "spider.png") {
    square.classList.add("more_brightness");
  }

  square.id = "symbol" + getSquareKey().toString();
  square.setAttribute("data-value", index);

  var img1 = document.createElement("IMG");
  img1.src = src;
  img1.classList.add("symbol_image");

  square.append(img1);

  if (index == symbol_number - 1) {
    var img2 = document.createElement("IMG");
    img2.src = "IMAGES/target.png";
    img2.classList.add("target_animation");

    square_container.append(img2);
  }

  square_container.append(square);

  return square_container;
}

window.onmousedown = function (event) {
  //printMousePosition(event);
  if (entering_bonus && can_enter) {
    entering_bonus = false;
    can_enter = false;
    var e = document.getElementById("enter_bonus");
    e.classList.remove("show");
    e.classList.add("not_show");
    start_bonus();
  } else if (in_bonus && can_leave_bonus) {
    in_bonus = false;
    can_leave_bonus = false;
    var e = document.getElementById("leave_bonus");
    e.classList.remove("show");
    e.classList.add("not_show");

    e = document.getElementById("bonus_win_container");
    $(e).css("display", "none");
  }
};

window.onresize = function (event) {
  slot = new Slot(document.getElementById("slot"));
};

function printMousePosition(ev) {
  console.log("Mouse X = " + ev.clientX);
  console.log("Mouse Y = " + ev.clientY);
}

function findClassOnPos(posX, posY, classe) {
  var elements = document.elementsFromPoint(posX, posY);
  var size = elements.length;
  for (var i = 0; i < size; i++) {
    if (elements[i].classList.contains(classe)) {
      return elements[i];
    }
  }
  return null;
}

function findChildrenWithClass(element, className) {
  if (element == null) {
    return null;
  }
  if (element.classList.contains(className)) {
    return element;
  } else {
    for (var child of element.children) {
      var childResult = findChildrenWithClass(child, className);
      if (childResult != null) {
        return childResult;
      }
    }
    return null;
  }
}

var id = 0;
function getSquareKey() {
  if (id > 1000000) {
    id = 0;
  }
  return id++;
}
