# World Map Region Music
FoundryVTT module which tracks regional themes on an overworld or world map, so that the correct theme plays when returning to that scene. Works for both Foundry's built-in Regions and MATT, and should be compatible with other modules as well. This module requires a GM present to work properly.

# To Use with FoundryVTT Regions
## 1) Create your Overworld Map
Create a scene to use as your overworld. In the scene config, go to the ambience tab and check the box to enable regional music. It is also recommended to use a grid.

## 2) Create your Regions
Using the region tool, paint your regions. Avoid spliting any grid cells with your regions (using diagonals on square grid or cutting the hexes on a hex grid), as Foundry is spotty about tracking token movements across those boundaries.

## 3) Add your Tracks
Best practice is to create a playlist for each map you intend to use regional audio with. For each region, add a Start Playing effect with the trigger "Move In" and any others you think you may need. Check the box to stop other music first, then save. Repeat for each region.

Now you have a working overworld map that will start and stop the correct track when you transition scenes.

# To Use with Monk's Active Tile Triggers
Follow the same steps as above, except use MATT tiles instead of Foundry Regions.
