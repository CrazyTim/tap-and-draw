# Tap And Draw

A simple web app to help you play pictionary! Like if you're on holiday and forgot to bring pictionary with you :).

## Features
- Simple, colourful design.
- Words are currently in English, and hopefully interesting to draw. 
- 3 levels of difficulty:
    - 400 easy words.
    - 1800 medium words.
    - 300 hard words.
- Words are randomised and don't repeat until all words in the level have been seen.
- Words with UK/Australian meanings are preferred over American (ie: 'bin' instead of 'trash can', 'icing' instead of 'frosting'). Also words that have different meanings depending on the locale have been avoided.

## Tech Notes
- Recently refactored to use the latest web standards and ES6, so wont work on older browsers.
- Designed to be used on a mobile phones, so it has a very simple interface requiring only a few taps to use.
- Uses the browser history API for navigation; press the (android) back button to see previous words, or exit out of dialogues.
- Words are stored in plain text files and fetched when the app loads. Any duplicate or blank words are removed.
- Animations are implemented manually (no jQuery!).
