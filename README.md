# Shiny Hunting App
This app is for streamers who wish to display a shiny hunting tracker on their streams. The list is supported up to Gen 8, except for regional forms (see Known Issues).

## How to Build
1. Install Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/) 
2. Clone the repository using Git: 
   - `git clone https://github.com/swc19/shiny-hunting-app.git`
3. Navigate to the directory
4. Run `npm install`
5. Run `npm start`
6. The app will be running on localhost:3000
7. Done!


## How to Use
1. Search the Pokémon you want to track.
2. Click on the Pokémon.
3. Increment and decrement using the buttons as necessary.
4. If you get a shiny, click "Shiny" to celebrate!  

*NOTE:* The count and current Pokémon will persist through restarting your browser, as well as closing/restarting the app, provided you don't clear your local storage (cookies) between uses. 

*NOTE:* You will need a consistent internet connection to get the models. If you're streaming, I assume this won't be a problem.

*NOTE:* Disable any darkmode extension on the localhost domain while using this app.

## Modifying the App
Typically, the only things you'll want to be modifying are the text color or font used. To do this, go to `shiny-hunting-app.css` in your directory and modify the following lines:  
- Line 68: 
  - `color: {YOUR COLOR HERE};`
- Line 69: 
  - `font-family: {YOUR FONT HERE}, monospace;`

If you would like to disable the rainbow effect on a shiny, either don't click the shiny button or comment out the following:  
- Line 89: 
  - `/*animation: colorRotate 1s linear 0s infinite;*/`


## OBS Setup
1. Select Window Capture in OBS, then capture your browser window and crop to the green box.
   - You do not have to be precise in the crop, there is enough buffer space to crop some edges.
2. Set up a Chroma Key under Filters.    

   Settings: 
     - Key Color Type: Green
     - Similarity: ~400
     - Smoothness: ~75
     - Key Color Spill Reduction: ~30

*NOTE:* Some very green shinies (Espeon as an example) may get Chroma Keyed out themselves. Adjust the similarity and/or smoothness settings until it looks good.

## Known Issues
1. Pokémon from Hisui/regional forms from there are not yet supported, due to no shiny .gif's on Showdown.
2. There may be some text/image clipping if your browser window is very small. A fullscreen window is recommended.
3. There may also be some clipping if both your count is large (4 digits) and the current Pokémon has a large model. This is unlikely to occur, however.


## Credits
This app was created by [swc19](https://github.com/swc19).  
Data obtained from [pokeapi.co](https://pokeapi.co/).  
[Pokémon Showdown](https://play.pokemonshowdown.com) is used for the Pokémon images.


## License
This app is licensed under the MIT license. You are permitted to use, modify, and redistribute this app as long as you give credit to the original author. You can also use this on monetized streams without issue.
