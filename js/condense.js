'use strict';

let luckcondensebutton = document.getElementById('luckcondensebutton')

opencondensebutton.onclick = function() {
    showInterface('condense')
}

luckcondensebutton.onclick = function(){
    game.maxcondenseluck = game.maxcondenseluck.add(game.luck)
    game.condense.luckadd = game.condense.luckadd.add(game.luck.sqrt())
    game.luck = D(1);
}
