Hooks.on("canvasTearDown", async () => {

  // Change the playlist name if needed
  const playlistName = 'Overworld'; 
  const playlist = game.playlists.getName(playlistName);
  const moduleId = "wm-region-music";

  // Get the active scene
  const scene = canvas.scene;

  let track = null;

  if (playlist) {
    track = playlist.sounds.find(sound => sound.playing === true);
  }

  // Store the playing track on the scene flag
  if (scene && track) {
    await scene.setFlag(moduleId, 'overworldTheme', track.id);
  }

  // Stop all tracks in the playlist
  if (playlist) {
    await playlist.stopAll();
  }

});

Hooks.on("renderSceneConfig", (app, html, data) => {

  const moduleId = "wm-region-music";
  const scene = app.object;

  const enabled = scene.getFlag(moduleId, "useRegionalAudio") ?? false;

  const checkbox = $(`
  <div class="form-group">
    <label>Use Regional Themes</label>
    <div class="form-fields">
      <input type="checkbox" name="flags.${moduleId}.useRegionalAudio" ${enabled ? "checked" : ""}>
    </div>
    <p class="notes">Overrides the playlist settings and uses the regional theme system.</p>
  </div>
  `);

  // Insert into Ambience tab
  const ambienceTab = html.find('.tab[data-tab="ambience"]');

  // Insert inside the audio block
  ambienceTab.find('.form-group').last().after(checkbox);

  const toggle = html.find(`input[name="flags.${moduleId}.useRegionalAudio"]`);

  const playlistFields = html.find('select[name="playlist"]')
    .closest('.form-group');

  function updateVisibility() {
    if (toggle.prop("checked")) {
      playlistFields.hide();
    } else {
      playlistFields.show();
    }
  }

  updateVisibility();

  toggle.on("change", updateVisibility);

});

Hooks.on("canvasReady", async () => {

//Change the playlist name given here to match yours if necessary
const playlistName = 'Overworld';
const playlist = game.playlists.getName(playlistName);

const scene = canvas.scene;
const moduleId = "wm-region-music";

const track = scene.getFlag(moduleId, 'overworldTheme');

if (scene.useRegionalAudio) {playlist.playSound(playlist.sounds.get(track))};

});