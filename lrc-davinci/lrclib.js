(() => {
  const status = document.getElementById('searchStatus');
  const results = document.getElementById('searchResults');
  const button = document.getElementById('searchButton');
  let request = 0;
  let controller;
  function message(text) { status.textContent = text; }
  function hasSyncedLyrics(track) {
    return typeof track.syncedLyrics === 'string' && /\[\d+:\d{1,2}(?:[.:]\d{1,3})?\]\s*\S/.test(track.syncedLyrics);
  }
  function duration(seconds) {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) return '';
    const total = Math.round(seconds);
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  }
  function render(tracks) {
    results.replaceChildren();
    tracks.forEach(track => {
      const row = document.createElement('div');
      row.style.cssText = 'padding:12px 0;border-top:1px solid #292929;overflow-wrap:anywhere';
      const title = document.createElement('strong');
      title.textContent = `${track.trackName || 'Sin título'} · ${track.artistName || 'Artista desconocido'}`;
      const meta = document.createElement('p');
      meta.style.cssText = 'font-size:12px;color:#aaa;margin:6px 0';
      meta.textContent = [track.albumName, duration(track.duration)].filter(Boolean).join(' · ');
      const load = document.createElement('button');
      const synced = hasSyncedLyrics(track);
      load.disabled = !synced;
      load.style.opacity = synced ? '1' : '.55';
      load.textContent = synced ? 'CARGAR LETRA SINCRONIZADA' : track.instrumental ? 'INSTRUMENTAL · SIN LETRA SINCRONIZADA' : 'SIN LETRA SINCRONIZADA';
      load.addEventListener('click', () => {
        document.getElementById('input').value = track.syncedLyrics;
        document.getElementById('filename').value = [track.artistName, track.trackName].filter(Boolean).join(' - ') || 'karaoke_letra';
        parse();
        message(`Letra cargada: ${track.trackName || 'Sin título'}. SRT y vista previa actualizados.`);
        document.getElementById('input').focus({ preventScroll: true });
      });
      row.append(title, meta, load);
      results.append(row);
    });
  }
  document.getElementById('lyricsSearch').addEventListener('submit', async event => {
    event.preventDefault();
    const track = document.getElementById('searchTrack').value.trim();
    const artist = document.getElementById('searchArtist').value.trim();
    if (!track) { message('Escribe el nombre de una canción.'); return; }
    const id = ++request;
    controller?.abort();
    controller = new AbortController();
    const activeController = controller;
    const timeout = setTimeout(() => activeController.abort(), 15000);
    button.textContent = 'BUSCANDO…';
    results.replaceChildren();
    results.setAttribute('aria-busy', 'true');
    message('Buscando en LRCLIB…');
    const params = new URLSearchParams({ track_name: track });
    if (artist) params.set('artist_name', artist);
    try {
      const response = await fetch(`https://lrclib.net/api/search?${params}`, { signal: activeController.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inválida');
      if (id !== request) return;
      const tracks = data.filter(item => item && typeof item === 'object');
      tracks.sort((a, b) => Number(hasSyncedLyrics(b)) - Number(hasSyncedLyrics(a)));
      render(tracks);
      const synced = tracks.filter(hasSyncedLyrics).length;
      message(!tracks.length ? 'No se encontraron resultados. Revisa el título o prueba sin artista.' :
        `${tracks.length} resultados · ${synced} con letra sincronizada.${synced ? ' Selecciona una versión para cargarla.' : ' Ninguna versión tiene tiempos; prueba otra búsqueda o pega un LRC en el editor.'}`);
    } catch (error) {
      if (id !== request) return;
      message(error.name === 'AbortError' ? 'LRCLIB tardó demasiado en responder. Vuelve a buscar.' :
        error instanceof TypeError ? 'No se pudo conectar con LRCLIB. Revisa tu conexión; el navegador o la red pueden estar bloqueando la solicitud (CORS). Reintenta o pega un LRC en el editor.' :
        `No se pudo completar la búsqueda (${error.message}). Inténtalo de nuevo más tarde.`);
    } finally {
      clearTimeout(timeout);
      if (id === request) {
        button.textContent = 'BUSCAR EN LRCLIB';
        results.setAttribute('aria-busy', 'false');
      }
    }
  });
})();
