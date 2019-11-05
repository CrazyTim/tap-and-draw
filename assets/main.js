let isWordChanging = false;
const LEVELS = [ [],[],[] ];   // array of arrays, each one holding list of words
const COLOR_SETTINGS = {luminosity: 'light'};
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const DURATION_BTN_CLICK = 50;
const DURATION_DIALOG_TRANSITION = 100;

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

  LEVELS[0] = await fetchWords('words/0.txt');
  LEVELS[1] = await fetchWords('words/1.txt');
  LEVELS[2] = await fetchWords('words/2.txt');

  setLevel(state.level);
  renderBackground();
  renderWord();
  replaceHistory();
  fadeIn($('.dia-main')); // fade-in main dialog on app start

  // event listeners -----------------------------------------
  window.addEventListener('popstate', loadHistory);
  $('.btn-show-level').onmousedown = handleLevelDialogOpen;
  $$('.btn-set-level').forEach(el => el.onmousedown = handleLevelDialogClose);
  $('.btn-show-help').onmousedown = handleHelpDialogOpen;
  $('.btn-hide-help').onmousedown = handleHelpDialogClose;
  $('.dia-main').onmousedown = handleSetWord;
  $('.dia-level').onmousedown = handleLevelDialogCancel;
  $('.dia-help').onmousedown = handleHelpDialogCancel;

}

function fadeOut(el, callBack) {

  const style = window.getComputedStyle(el);
  if (style.display == 'none') return; // already hidden
  if (el.classList.contains('fade-in')) return; // already animating
  if (el.classList.contains('fade-out')) return; // already animating

  el.classList.add('fade-out');
  setTimeout(function() {
    el.classList.add('hide');
    el.classList.remove('fade-out');
    if (callBack !== undefined) callBack();
  }, DURATION_DIALOG_TRANSITION);

}

function fadeIn(el, callBack) {

  const style = window.getComputedStyle(el);
  if (style.display != 'none') return; // already shown
  if (el.classList.contains('fade-in')) return; // already animating
  if (el.classList.contains('fade-out')) return; // already animating

  el.classList.add('fade-in');
  el.classList.remove('hide');
  setTimeout(function() {
    el.classList.remove('fade-in');
    if (callBack !== undefined) callBack();
  }, DURATION_DIALOG_TRANSITION);

}

function removeDuplicates(array) {
  const seen = {};
  const out = [];
  let j = 0;
  for(let i = 0; i < array.length; i++) {
     var item = array[i];
     if(seen[item] !== 1) {
       seen[item] = 1;
       out[j++] = item;
     }
  }
  return out;
}

function popRandom(array) {
  if (array.length == 0) {
    return;
  } else if (array.length == 1) {
    return array.splice(0,1)[0];
  } else {
    // choose a random item
    var i = Math.floor(Math.random() * array.length);
    // return a new list with the item removed
    return array.splice(i,1)[0];
  }
}

async function fetchWords(url) {

  let a = ['err-0','err-1','err-1','err-2','err-3','err-4']; // test data, will be overridden
  
  try {

    const response = await fetch(url)
    const text = await response.text();

    a = text.toLowerCase().split("\n"); // convert to array
    a = a.filter(function(n){ return n != '' }); // remove empty items in array
    a = removeDuplicates(a);

  } catch (err) {
      console.error(err);
  }

  return a;

}

function handleSetWord(event) {

  // start animation
  if (!isWordChanging) {

    isWordChanging = true;

    const wordWrapper = $('.word-wrapper')
    
    fadeOut(wordWrapper, () => {

      state.currentWord +=1;

      // loop back to the beginning once we reach the end
      if (state.currentWord > state.words.length - 1) {
        state.currentWord = 0;
      }

      state.backgroundColor = getRandomColor();
      renderWord();
      renderBackground();
      saveHistory();

      fadeIn(wordWrapper, () => {
        isWordChanging = false; // animation finished
      });

    });
  }

  event.stopPropagation();
  
}

function handleLevelDialogOpen (event) {
  $('.btn-show-level').classList.add('btn-click');
  window.setTimeout( () => {
    $('.btn-show-level').classList.remove('btn-click');
    state.isLevelVisible = true;
    renderLevelDialog();
    saveHistory();
  }, DURATION_BTN_CLICK);
  event.stopPropagation();
}

function handleLevelDialogClose(event) {

  $$('.btn-set-level').forEach(el => el.classList.remove('sel'));
  const el = event.target;
  el.classList.add('sel');
  el.classList.add('btn-click');

  window.setTimeout( () => {
    el.classList.remove('btn-click');
    const newLevel = el.getAttribute('data-id');
    if (state.level != newLevel) {
      setLevel(newLevel);
      state.isLevelVisible = false;
      replaceHistory();
    } else {
      window.history.back();
    }
    renderLevelDialog();
  }, DURATION_BTN_CLICK);

  event.stopPropagation();

}

function handleLevelDialogCancel(event) {
  window.history.back();
  renderLevelDialog();
  event.stopPropagation();
}

function handleHelpDialogOpen (event) {
  $('.btn-show-help').classList.add('btn-click');
  window.setTimeout( () => {
    $('.btn-show-help').classList.remove('btn-click');
    state.isHelpVisible = true;
    renderHelpDialog();
    saveHistory();
  }, DURATION_BTN_CLICK);
  event.stopPropagation();
}

function handleHelpDialogClose(event) {
  $('.btn-hide-help').classList.add('btn-click');
  window.setTimeout( () => {
    $('.btn-hide-help').classList.remove('btn-click');
    window.history.back();
    renderHelpDialog();
  }, DURATION_BTN_CLICK);
  event.stopPropagation();
}

function handleHelpDialogCancel(event) {
  window.history.back();
  renderHelpDialog();
  event.stopPropagation();
}

function setLevel(level) {

  state.level = parseInt(level);
  state.currentWord = -1;
  state.words = [];

  // shuffle words
  const words = LEVELS[state.level].slice(); // clone
  while (words.length > 0) {
    state.words.push(popRandom(words));
  }

  renderWord();
  renderLevel();

}

function getRandomColor () {
  return randomColor(COLOR_SETTINGS);
}

function replaceHistory() {
  //console.log(state);
  window.history.replaceState(state, null, null);
}

function saveHistory() {
  //console.log(state);
  window.history.pushState(state, null, null);
}

function loadHistory(event) {
  state = event.state;
  //console.log(state);
  renderLevelDialog();
  renderHelpDialog();
  renderLevel();
  renderWord();
  renderBackground();
}

function renderLevel() {
  const el = $('.btn-show-level');
  if (state.level === 0) {
    el.innerHTML = 'easy';
  } else if (state.level === 1) {
    el.innerHTML = 'medium';
  } else if (state.level === 2) {
    el.innerHTML = 'hard';
  }
  $$('.btn-set-level').forEach(el => el.classList.remove('set'));
  $(`.btn-set-level[data-id='${state.level}']`).classList.add('set');
}

function renderLevelDialog() {

  const diaMain = $('.dia-main');
  const diaLevel = $('.dia-level');

  if (state.isLevelVisible) {
    fadeOut(diaMain, () => {
      fadeIn(diaLevel);
    })
  } else {
    fadeOut(diaLevel, () => {
      fadeIn(diaMain);
    })
  }
}

function renderHelpDialog() {

  const diaMain = $('.dia-main');
  const diaHelp = $('.dia-help');

  if (state.isHelpVisible) {
    fadeOut(diaMain, () => {
      fadeIn(diaHelp);
    })
  } else {
    fadeOut(diaHelp, () => {
      fadeIn(diaMain);
    })
  }
}

function renderBackground() {
  document.body.style.backgroundColor = state.backgroundColor;
}

function renderWord() {
  const el = $('.word-wrapper');
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
