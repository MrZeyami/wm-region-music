const MODULE_ID = "wm-region-music";

/* ---------------- Scene Config UI ---------------- */
Hooks.on("renderSceneConfig", (app, html) => {
  const scene = app.document;
  const enabled = scene.getFlag(MODULE_ID, "useRegionalAudio") ?? false;

  // Prevent duplicate toggle
  if (html.querySelector(`[name="flags.${MODULE_ID}.useRegionalAudio"]`)) return;

  const playlistSelect = html.querySelector('select[name="playlist"]');
  const playlistField = playlistSelect?.closest(".form-group");
  if (!playlistField) return;

  const trackSelect = html.querySelector('select[name="playlistSound"]');
  const trackField = trackSelect?.closest(".form-group");

  // Create toggle above playlist field
  const wrapper = document.createElement("div");
  wrapper.className = "form-group";
  wrapper.innerHTML = `
    <label>Use Regional Audio</label>
    <div class="form-fields">
      <input type="checkbox" name="flags.${MODULE_ID}.useRegionalAudio" ${enabled ? "checked" : ""}>
    </div>
    <p class="notes">Hides scene playlist and plays the saved regional track automatically.</p>
  `;
  playlistField.before(wrapper);

  const checkbox = wrapper.querySelector("input");

  function updateFields() {
    const state = checkbox.checked;
    playlistField.style.display = state ? "none" : "";
    if (trackField) trackField.style.display = state ? "none" : "";
  }

  updateFields();
  checkbox.addEventListener("change", updateFields);
});


/* ---------------- Save Currently Playing Track ---------------- */
Hooks.on("preUpdateScene", async (scene, updateData, options, userId) => {

  if (!game.user.isGM) return;
  if (!game.user.isActiveGM) return;

  // Only run when a scene is being activated
  if (!updateData.active) return;

  const previousScene = game.scenes.active;
  if (!previousScene) return;

  // Find the first playlist with a playing track
  for (const playlist of game.playlists) {
    const track = playlist.sounds.find(s => s.playing);
    if (track) {

      await previousScene.setFlag(MODULE_ID, "overworldTheme", {
        playlistId: playlist.id,
        trackId: track.id
      });

      console.log(
        `[Regional Music] Saved track "${track.name}" for scene "${previousScene.name}"`
      );

      break;
    }
  }
});

/* ---------------- Scene Activated ---------------- */
Hooks.on("updateScene", async (scene, update, options, userId) => {

  if (!game.user.isActiveGM) return;
  if (!update.active) return;

  const useRegional = scene.getFlag(MODULE_ID, "useRegionalAudio");
  const flag = scene.getFlag(MODULE_ID, "overworldTheme");

  if (!useRegional || !flag?.playlistId || !flag?.trackId) return;

  update.playlist = flag.playlistId; 
  update.playlistSound = flag.trackId;

});
