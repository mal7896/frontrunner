# Front Runner

Run for President of the United States, from Labor Day to Election Night.

**Play it here: https://mal7896.github.io/frontrunner/**

Front Runner is a presidential campaign game that runs in your browser, on a phone or a computer. Pick a candidate and a running mate, make the calls that come up each week, campaign across the map, and watch the returns come in state by state on Election Night.

## What's in it

- **The 2028 race** with fictional candidates, plus eight real elections replayed with the real candidates and state results: 1948, 1960, 1968, 1976, 1980, 1992 and 2000.
- **Third-party campaigns.** Run as George Wallace (1968), John Anderson (1980), Ross Perot (1992) or Ralph Nader (2000), each with goals based on what the campaign was really trying to do.
- **Two ways to play.**
  - **Quick:** one decision and one campaign stop a turn.
  - **Full campaign:** the hard mode. Every week you plan a schedule for you and your running mate, buy ads, open field offices, raise money and prep for debates that go round by round.
- **Election Night** with state calls, a live forecast needle, recounts, and a newspaper front page the morning after.
- **Music, sound effects, light and dark themes, larger text and a reduced-motion option**, all under Settings.

Your game saves in your browser, so you can close the tab and pick up where you left off.

## Running it locally

`index.html` is the whole game in one file. The music lives in `audio/`.

To play locally, serve the folder with any static web server, for example:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing the game

The source is in `src/`:

- `game.js`: the main game.
- `full.js`: the Full campaign mode.
- `data2028.js`: the 2028 race.
- `history.js`, `history2.js`, `history3.js`: the historical races.
- `hist_data.js`: state results.
- `style.css` and `body.html`: the page itself.

After changing anything in `src/`, rebuild `index.html`:

```sh
python3 src/build.py
```

## Credits

- **Music:** by Tanner Helland, from [tannerhelland.com/music.html](https://tannerhelland.com/music.html) and [github.com/tannerhelland/free-music](https://github.com/tannerhelland/free-music), used under the Creative Commons Attribution license (CC BY 4.0; some tracks are tagged CC BY-SA 3.0).
  - Title: "Daybreak"
  - Campaign: "Familiar Roads"
  - Election Night: "Now or Never"
  - Victory: "Home"
  - Defeat: "A Memory Away"
- **Historical election results:** [The American Presidency Project](https://www.presidency.ucsb.edu/statistics/elections), UC Santa Barbara.
- **State shapes:** [us-atlas](https://github.com/topojson/us-atlas), based on U.S. Census Bureau boundary files.
- **Fonts:** Libre Franklin and Newsreader, from Google Fonts.

The game code is under the MIT License (see `LICENSE`). The music keeps its own Creative Commons license.
