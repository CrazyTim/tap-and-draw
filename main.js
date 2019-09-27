var words = [];
var levels = [ [],[],[] ];   // array of arrays, each one holding list of words
var level = -1; 
var intro = '<span class="intro">Tap to see <br> a new word.</span>';
var showNextWord_transition = false;
var level_visible = false;
var help_visible = false;
var bg_color = randomColor({luminosity: 'light'});

window.addEventListener('DOMContentLoaded', () => {
  initalise();
});

function showNextWord() {

	// start animation
	if (!showNextWord_transition) {
		showNextWord_transition = true;
	
		$('#btn_word').fadeOut(100, function() {

			// pull a random word from the hat
			var random_word = words.removeRandomElement();
			$('#btn_word').html( '<span class="word">' + random_word + '</span>' );

			// change the background color:
			bg_color = randomColor({luminosity: 'light'});
			document.body.style.backgroundColor = bg_color;

			// if we run out of words, repopulate the list so we can start again
			if (words.length == 0) {
				setWords();

				// remove the last word we showed, so we dont repeat it twice in a row:
				var i = words.indexOf(random_word);
				words.splice(i,1);
			}

			$('#btn_word').fadeIn(100, function() {
				// finished animation
				showNextWord_transition = false;
			});
		});
	}
	
}

function setWords() {
	words = levels[level].slice();
}

function showLevel(show) {
	if (show == true) {
		$('#dia_main').fadeOut(100, function() {
			// finished animation
			$('#dia_level').fadeIn(100);
		});

		level_visible = true;

	} else {
		$('#dia_level').fadeOut(100, function() {
			// finished animation
			$('#dia_main').fadeIn(100);
		});

		level_visible = false;
	}
}

function showHelp(show) {
	if (show == true) {
		$('#dia_main').fadeOut(100, function() {
			// finished animation
			$('#dia_help').fadeIn(100);
		});

		help_visible = true;
	} else {
		$('#dia_help').fadeOut(100, function() {
			// finished animation
			$('#dia_main').fadeIn(100);
		});

		help_visible = false;
	}
}

function setLevel(i) {
	// set the difficulty
	if (i == 'easy') {
		if (level != 0 ) {
			level = 0;
			setWords(); // load the word list
			$('#btn_word').html(intro); 
		}
	} else if (i == 'medium') {
		if (level != 1 ) {
			level = 1;
			setWords(); // load the word list
			$('#btn_word').html(intro); 
		}
	} else if (i == 'hard') {
		if (level != 2 ) {
			level = 2;
			setWords(); // load the word list
			$('#btn_word').html(intro); 
		}
	}

	$('#btn_level').html(i);
}

function saveHistory() {
	var state = {'level_visible':level_visible, 'help_visible':help_visible}
	window.history.pushState(state, null, null);
}

function iniHistory() {
	var state = {'level_visible':level_visible, 'help_visible':help_visible}
	window.history.replaceState(state,null, null);
}

Array.prototype.removeDuplicateItems = function () {
  var seen = {};
  var out = [];
  var len = this.length;
  var j = 0;
  for(var i = 0; i < len; i++) {
       var item = this[i];
       if(seen[item] !== 1) {
             seen[item] = 1;
             out[j++] = item;
       }
  }
  return out;
}

Array.prototype.removeRandomElement = function() {
  if (this.length == 0) {
    return;
  } else if (this.length == 1) {
    return this.splice(0,1)[0];
  } else {
  // choose a random item
  var i = Math.floor(Math.random() * this.length);
  // return a new list with the item removed
  return this.splice(i,1)[0];
  }
}

async function fetchWords(url) {

  try {
    const response = await fetch(url)
    const text = await response.text();

    let a = text.split("\n"); // convert to array
    a = a.filter(function(n){ return n != '' }); // remove empty items in array
    a = a.removeDuplicateItems();

    return a;

  } catch (err) {
      console.error(err);
  }

  return ['error'];
  
}

function loadHistory(state) {
	// hide level if nessecary
	if (state.level_visible != level_visible) {
		level_visible = state.level_visible;
		showLevel(level_visible);
	}

	// hide help if nessecary
	if (state.help_visible != help_visible) {
		help_visible = state.help_visible;
		showHelp(help_visible);
	}
}

async function initalise() {

  // fetch words
  levels[0] = await fetchWords('words/0.txt');
  levels[1] = await fetchWords('words/1.txt');
  levels[2] = await fetchWords('words/2.txt');

  document.body.style.backgroundColor = bg_color;

  setLevel('easy');
  iniHistory();
  $('#dia_main').fadeIn(0);

  $( '#tab_main' ).mousedown(function() {
    showNextWord();
    });

  $( '#btn_level' ).mousedown(function() {
      $('#btn_level').addClass('btn_click');
    window.setTimeout( function() {
      showLevel(true);
      saveHistory();
      $('#btn_level').removeClass('btn_click');
    }, 50 );
    });

    $( '.btn_setlevel' ).mousedown(function() {
    var l = $(this).html();
    var el = this;
      $('.btn_setlevel').removeClass('sel');
      $(el).addClass('sel');
      $(el).addClass('btn_click');
    window.setTimeout( function() {
      setLevel(l)
      showLevel(false);
      window.history.back();
      $(el).removeClass('btn_click');
    }, 50 );
    });

    $( '#dia_level .bg_shade' ).mousedown(function() {
    showLevel(false);
    window.history.back();
    });

  $( '#btn_help' ).mousedown(function() {
      $('#btn_help').addClass('btn_click');
    window.setTimeout( function() {
      showHelp(true);
      saveHistory();
      $('#btn_help').removeClass('btn_click');
    }, 50 );
    });

  $( '#btn_hideHelp' ).mousedown(function() {
      $('#btn_hideHelp').addClass('btn_click');
    window.setTimeout( function() {
      showHelp(false);
      window.history.back();
      $('#btn_hideHelp').removeClass('btn_click');
    }, 50 );
    });

  $( '#dia_help .bg_shade' ).mousedown(function() {
    showHelp(false);
    window.history.back();
    });

    window.addEventListener('popstate', function(e) {
    //console.log(e.state);
        loadHistory(e.state);
  });
 
}
