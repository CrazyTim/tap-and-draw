<div>
  <img alt="thumbnail" src="https://crazytim.github.io/tap-and-draw/repo-thumbnail.jpg" width=350px />
  <br>
</div>

# Tap And Draw

A simple pictionary-type game! Pens and paper still required.

## Motivation

I love classic Pictionary! Thinking how to draw something and watching others stretch their imagination is very entertaining, especially when others interpret what you have drawn in a way you didn't expect!

I wanted to design a very simple intuitive interface, as well as choose and research the list of words. The words should be spontaneous, absolutely relatable, and interesting to draw, and then there wouldn't be a need to lug a board game box around.

Also I think the traditional hour glass that comes in the box is annoying - I mean how do you reset it half-way through? A timer in an app would be much easier.

## Features
- Simple, colourful interface.
- Words are currently in English, and hopefully interesting to draw. 
- 3 levels of difficulty:
    - 400 easy words.
    - 1800 medium words.
    - 400 hard words.
- Words are randomised and don't repeat until all words in the level have been seen.
- Words with UK/Australian meanings are preferred over American (ie: 'bin' instead of 'trash can', 'icing' instead of 'frosting'). Also words that have different meanings depending on the locale have been avoided.

## Tech Notes
- Designed to be used on a mobile phone, so it has a very simple interface.
- Uses the browser history API for navigation; press the (android) back button to see previous words, or exit out of dialogues.
- Words are stored in plain text files and fetched when the app loads. Any duplicate or blank words are removed.
- Animations are implemented in vanilla js.
