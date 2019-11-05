# Tap And Draw

A simple web app to help you play pictionary! Like if you're on holiday and forgot to bring pictionary with you :).

## Features
- Words are currently in English, and hopefully interesting to draw. 
- 3 levels of difficulty:
    - 400 easy words.
    - 1800 medium words.
    - 300 hard words.
- Words are stored in plain text files and fetched when the app loads.
- Words are randomised and don't repeat until all words in the level have been seen.
- Words with UK/Australian meanings are preferred over American (ie: 'bin' instead of 'trash can', 'icing' instead of 'frosting'). Also words that have different meanings depending on the locale have been avoided.

## Tech Notes
- Designed to be used on a mobile phones, and so it has a very simple interface requiring only a few taps to use.
- Uses the browser history API for navigation; press the (android) back button to see previous words, or exit out of dialogues.
