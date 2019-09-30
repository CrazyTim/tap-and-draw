var words = [];
var levels = [ [],[],[] ];   // array of arrays, each one holding list of words
var level = -1; 
var intro = '<span class="intro">Tap to see <br> a new word.</span>';
var showNextWord_transition = false;
var bg_color = randomColor({luminosity: 'light'});
var state = {
  isLevelVisible: false,
  isHelpVisible: false,
}

window.addEventListener('DOMContentLoaded', () => {
  initalise();
});

function showNextWord() {

	// start animation
	if (!showNextWord_transition) {
		showNextWord_transition = true;
	
		$('.btn-word').fadeOut(100, function() {

			// pull a random word from the hat
			var random_word = words.removeRandomElement();
			$('.btn-word').html( '<span class="word">' + random_word + '</span>' );

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

			$('.btn-word').fadeIn(100, function() {
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
		$('.dia-main').fadeOut(100, function() {
			// finished animation
			$('.dia-level').fadeIn(100);
		});

		state.isLevelVisible = true;

	} else {
		$('.dia-level').fadeOut(100, function() {
			// finished animation
			$('.dia-main').fadeIn(100);
		});

		state.isLevelVisible = false;
	}
}

function showHelp(show) {
	if (show == true) {
		$('.dia-main').fadeOut(100, function() {
			// finished animation
			$('.dia-help').fadeIn(100);
		});

		isHelpVisible = true;
	} else {
		$('.dia-help').fadeOut(100, function() {
			// finished animation
			$('.dia-main').fadeIn(100);
		});

		isHelpVisible = false;
	}
}

function setLevel(i) {
	// set the difficulty
	if (i == 'easy') {
		if (level != 0 ) {
			level = 0;
			setWords(); // load the word list
			$('.btn-word').html(intro); 
		}
	} else if (i == 'medium') {
		if (level != 1 ) {
			level = 1;
			setWords(); // load the word list
			$('.btn-word').html(intro); 
		}
	} else if (i == 'hard') {
		if (level != 2 ) {
			level = 2;
			setWords(); // load the word list
			$('.btn-word').html(intro); 
		}
	}

	$('.btn-level').html(i);
}

function saveHistory() {
	window.history.pushState(state, null, null);
}

function iniHistory() {
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

    let a = text.toLowerCase().split("\n"); // convert to array
    a = a.filter(function(n){ return n != '' }); // remove empty items in array
    a = a.removeDuplicateItems();

    return a;

  } catch (err) {
      console.error(err);
  }

  return ['error'];
  
}

function loadHistory(newState) {

	if (state.isLevelVisible !== newState.isLevelVisible) {
		state.isLevelVisible = newState.isLevelVisible;
		showLevel(state.isLevelVisible);
	}

	if (state.isHelpVisible !== newState.isHelpVisible) {
		isHelpVisible = newState.isHelpVisible;
		showHelp(state.isHelpVisible);
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
  $('.dia-main').fadeIn(0);

  $( '.tab-main' ).mousedown(function() {
    showNextWord();
    });

  $( '.btn-level' ).mousedown(function() {
      $('.btn-level').addClass('btn-click');
    window.setTimeout( function() {
      showLevel(true);
      saveHistory();
      $('.btn-level').removeClass('btn-click');
    }, 50 );
    });

    $( '.btn-set-level' ).mousedown(function() {
    var l = $(this).html();
    var el = this;
      $('.btn-set-level').removeClass('sel');
      $(el).addClass('sel');
      $(el).addClass('btn-click');
    window.setTimeout( function() {
      setLevel(l)
      showLevel(false);
      window.history.back();
      $(el).removeClass('btn-click');
    }, 50 );
    });

    $( '.dia-level .bg-shade' ).mousedown(function() {
    showLevel(false);
    window.history.back();
    });

  $( '.btn-help' ).mousedown(function() {
      $('.btn-help').addClass('btn-click');
    window.setTimeout( function() {
      showHelp(true);
      saveHistory();
      $('.btn-help').removeClass('btn-click');
    }, 50 );
    });

  $( '.btn-hide-help' ).mousedown(function() {
      $('.btn-hide-help').addClass('btn-click');
    window.setTimeout( function() {
      showHelp(false);
      window.history.back();
      $('.btn-hide-help').removeClass('btn-click');
    }, 50 );
    });

  $( '.dia-help .bg-shade' ).mousedown(function() {
    showHelp(false);
    window.history.back();
    });

    window.addEventListener('popstate', function(e) {
    //console.log(e.state);
        loadHistory(e.state);
  });
 
}
