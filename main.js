let isWordChanging = false;
const levels = [ [],[],[] ];   // array of arrays, each one holding list of words
const colorSettings = {luminosity: 'light'};
var state = {
  isLevelVisible: false,
  isHelpVisible: false,
  backgroundColor: '#ffccdd',
  level: 0,
  words: [],
  currentWord: -1,
}

window.addEventListener('DOMContentLoaded', initalise);

async function initalise() {

  levels[0] = await fetchWords('words/0.txt');
  levels[1] = await fetchWords('words/1.txt');
  levels[2] = await fetchWords('words/2.txt');

  setLevel(state.level);

  renderBackground();
  renderWord();

  replaceHistory();

  $('.dia-main').fadeIn(500); // fade-in main dialog

  // event listeners -----------------------------------------
  window.addEventListener('popstate', loadHistory);
  document.querySelector('.btn-word').onmousedown = setNextWord;
  document.querySelector('.btn-level').onmousedown = handleLevelDialogOpen;
  document.querySelectorAll('.btn-set-level').forEach(el => el.onmousedown = handleLevelDialogClose);
  document.querySelector('.dia-level .bg-shade').onmousedown = handleLevelDialogCancel;
  document.querySelector('.btn-help').onmousedown = handleHelpDialogOpen;
  document.querySelector('.btn-hide-help').onmousedown = handleHelpDialogClose;
  document.querySelector('.dia-help .bg-shade').onmousedown = handleHelpDialogCancel;

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

  let a = ['err-0','err-1','err-2','err-3','err-4'];
  
  try {

    const response = await fetch(url)
    const text = await response.text();

    let a = text.toLowerCase().split("\n"); // convert to array
    a = a.filter(function(n){ return n != '' }); // remove empty items in array
    a = a.removeDuplicateItems();

  } catch (err) {
      //console.error(err);
  }

  return a;

}

function setNextWord() {

  // start animation
  if (!isWordChanging) {
    isWordChanging = true;
    $('.word-wrapper').fadeOut(100, () => {

      state.currentWord +=1;

      // loop back to the beginning once we reach the end
      if (state.currentWord > state.words.length - 1) {
        state.currentWord = 0;
      }

      state.backgroundColor = getRandomColor();

      renderWord();
      renderBackground();

      saveHistory();

      $('.word-wrapper').fadeIn(100, () => {
        // finished animation
        isWordChanging = false;
      });

    });
  }
  
}

function handleLevelDialogOpen () {
  document.querySelector('.btn-level').classList.add('btn-click');
  window.setTimeout( () => {
    document.querySelector('.btn-level').classList.remove('btn-click');
    state.isLevelVisible = true;
    renderLevelDialog();
    saveHistory();
  }, 50);
}

function handleLevelDialogClose(event) {

  document.querySelectorAll('.btn-set-level').forEach(el => el.classList.remove('sel'));
  const el = event.target;
  el.classList.add('sel');
  el.classList.add('btn-click');

  window.setTimeout( () => {
    el.classList.remove('btn-click');
    const newLevel = el.getAttribute('id');
    if (state.level != newLevel) {
      setLevel(newLevel);
      state.isLevelVisible = false;
      replaceHistory();
    } else {
      window.history.back();
    }
    renderLevelDialog();
  }, 50);

}

function handleLevelDialogCancel() {
  window.history.back();
  renderLevelDialog()
}

function handleHelpDialogOpen () {
  document.querySelector('.btn-help').classList.add('btn-click');
  window.setTimeout( () => {
    document.querySelector('.btn-help').classList.remove('btn-click');
    state.isHelpVisible = true;
    renderHelpDialog();
    saveHistory();
  }, 50);
}

function handleHelpDialogClose() {
  document.querySelector('.btn-hide-help').classList.add('btn-click');
  window.setTimeout( () => {
    document.querySelector('.btn-hide-help').classList.remove('btn-click');
    window.history.back();
    renderHelpDialog();
  }, 50);
}

function handleHelpDialogCancel() {
  window.history.back();
  renderHelpDialog();
}

function setLevel(level) {
  state.level = parseInt(level);
  state.currentWord = -1;
  state.words = [];

  // shuffle the list
  const words = levels[state.level].slice(); // clone
  while (words.length > 0) {
    state.words.push(words.removeRandomElement());
  }

  renderWord();
  renderLevel();
}

function getRandomColor () {
  return randomColor(colorSettings);
}

function replaceHistory() {
  console.log(state);
  window.history.replaceState(state, null, null);
}

function saveHistory() {
  console.log(state);
  window.history.pushState(state, null, null);
}

function loadHistory(event) {
  state = event.state;
  console.log(state);
  renderLevelDialog();
  renderHelpDialog();
  renderLevel();
  renderWord();
  renderBackground();
}

function showDialog_Level() {
  state.isLevelVisible = true;
  renderLevelDialog();
  document.querySelector('.btn-level').classList.remove('btn-click');
}

function hideDialog_Level() {
  state.isLevelVisible = false;
  renderLevelDialog();
  document.querySelector('.btn-set-level').classList.remove('btn-click');
}

function renderLevel() {
  const el = document.querySelector('.btn-level');
  if (state.level === 0) {
    el.innerHTML = 'easy';
  } else if (state.level === 1) {
    el.innerHTML = 'medium';
  } else if (state.level === 2) {
    el.innerHTML = 'hard';
  }
  document.querySelectorAll('.btn-set-level').forEach(el => el.classList.remove('set'));
  document.querySelector(`.btn-set-level[id='${state.level}']`).classList.add('set');
}

function renderLevelDialog() {
  if (state.isLevelVisible) {
    $('.dia-main').fadeOut(100, () => {
      // finished animation
      $('.dia-level').fadeIn(100);
    });
  } else {
    $('.dia-level').fadeOut(100, () => {
      // finished animation
      $('.dia-main').fadeIn(100);
    });
  }
}

function renderHelpDialog() {
  if (state.isHelpVisible) {
    $('.dia-main').fadeOut(100, () => {
      // finished animation
      $('.dia-help').fadeIn(100);
    });
  } else {
    $('.dia-help').fadeOut(100, () => {
      // finished animation
      $('.dia-main').fadeIn(100);
    });
  }
}

function renderBackground() {
  document.body.style.backgroundColor = state.backgroundColor;
}

function renderWord() {
  const el = document.querySelector('.word-wrapper');
  if (state.currentWord !== -1) {
    el.innerHTML = state.words[state.currentWord];
    el.classList.add('word');
    el.classList.remove('intro');
  } else {
    el.innerHTML = 'Tap to see<br>a new word';
    el.classList.remove('word');
    el.classList.add('intro');
  }
}
