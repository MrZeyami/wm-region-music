const MODULE_ID = "wm-region-music";

let pendingSceneAudio = null;

/* ---------------- Scene Config UI ---------------- */
Hooks.on("renderSceneConfig", (app, html) => {
  const scene = app.document;
  const enabled = scene.getFlag(MODULE_ID, "useRegionalAudio") ?? false;

  if (html.querySelector(`[name="flags.${MODULE_ID}.useRegionalAudio"]`)) return;

  const playlistSelect = html.querySelector('select[name="playlist"]');
  const playlistField = playlistSelect?.closest(".form-group");
  if (!playlistField) return;

  const trackSelect = html.querySelector('select[name="playlistSound"]');
  const trackField = trackSelect?.closest(".form-group");

  const wrapper = document.createElement("div");
  wrapper.className = "form-group";
  wrapper.innerHTML = `
    <label title="Use Region-based audio for overworld maps or similar use-cases.">Use Regional Audio</label>
    <div class="form-fields">
      <input type="checkbox" name="flags.${MODULE_ID}.useRegionalAudio" ${enabled ? "checked" : ""}>
    </div>
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
Hooks.on("preUpdateScene", async (scene, delta) => {

  if (!game.user.isActiveGM) return;
  if (!delta.active) return;

  const previousScene = game.scenes.active;
  if (!previousScene) return;

  for (const playlist of game.playlists) {
    const track = playlist.sounds.find(s => s.playing);
    if (!track) continue;

    await previousScene.setFlag(MODULE_ID, "overworldTheme", {
      playlistId: playlist.id,
      trackId: track.id
    });

    console.log(`[Regional Music] Saved "${track.name}" for "${previousScene.name}"`);
    break;
  }

});


/* ---------------- Scene Activated ---------------- */
Hooks.on("updateScene", (scene, delta) => {

  if (!game.user.isActiveGM) return;
  if (!delta.active) return;

  /* Stop currently playing tracks */
  for (const playlist of game.playlists) {
    playlist.stopAll();
  }

  const enabled = scene.getFlag(MODULE_ID, "useRegionalAudio");
  const flag = scene.getFlag(MODULE_ID, "overworldTheme");

  if (!enabled || !flag.playlistId || !flag.trackId) return;

  pendingSceneAudio = {
    sceneId: scene.id,
    playlistId: flag.playlistId,
    trackId: flag.trackId
  };

});


/* ---------------- Apply Scene Audio ---------------- */
Hooks.on("canvasReady", async () => {

  if (!game.user.isActiveGM) return;
  if (!pendingSceneAudio) return;

  const scene = canvas.scene;
  if (!scene || scene.id !== pendingSceneAudio.sceneId) return;

  await scene.update({
    playlist: pendingSceneAudio.playlistId,
    playlistSound: pendingSceneAudio.trackId
  });

  console.log(`[Regional Music] Applied audio to scene "${scene.name}"`);

  pendingSceneAudio = null;

});
