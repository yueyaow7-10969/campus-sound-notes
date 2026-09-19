// Install on the existing "place" question. Survey Flow fields are listed in SETUP.md.
// No location request is made until the participant presses Use my location.
Qualtrics.SurveyEngine.addOnReady(function initializeObservationLocation() {
  var engine = Qualtrics.SurveyEngine;
  var container = this.getQuestionContainer();
  if (!container || container.querySelector('.csn-location')) return;
  var alive = true, request = 0, pending = false;
  var fields = ['csn_latitude', 'csn_longitude', 'csn_accuracy_m', 'csn_captured_at', 'csn_location_source'];
  var panel = document.createElement('section');
  panel.className = 'csn-location';
  panel.setAttribute('aria-label', 'Observation coordinates');
  panel.innerHTML = '<style>.csn-location{padding:18px;margin:0 0 24px;border:1px solid #a8b9a1;border-radius:14px;background:#e7eee4;color:#19382e;font:16px/1.5 Arial,sans-serif}.csn-location p{margin:0 0 12px}.csn-location button{font:600 16px/1.4 Arial,sans-serif;min-height:48px;padding:12px 16px;border:1px solid #245b49;border-radius:12px;background:#245b49;color:#fff;cursor:pointer}.csn-location button:focus-visible{outline:3px solid #a65315;outline-offset:3px}.csn-location button:disabled{opacity:.65;cursor:wait}.csn-location .csn-clear{background:transparent;color:#245b49;margin:8px 0 0}.csn-location .csn-status{font-size:14px;overflow-wrap:anywhere;margin:12px 0 0}.csn-location [hidden]{display:none!important}</style><p><strong>Add your observation coordinates</strong></p><p>At your listening spot, use your location or choose a public place below.</p><button type="button" class="csn-locate">Use my location</button><br><button type="button" class="csn-clear" hidden>Use a place instead</button><p class="csn-status" role="status" aria-live="polite">Your browser will ask permission. Coordinates will be saved with this response.</p>';
  container.insertBefore(panel, container.firstChild);
  var locate = panel.querySelector('.csn-locate'), clear = panel.querySelector('.csn-clear'), status = panel.querySelector('.csn-status');
  function value(name) { return String(engine.getJSEmbeddedData(name) || ''); }
  function clearFields() { fields.forEach(function (f) { engine.setJSEmbeddedData(f, ''); }); }
  function valid(lat, lon, accuracy) { return Number.isFinite(lat) && lat >= 1.275 && lat <= 1.325 && Number.isFinite(lon) && lon >= 103.755 && lon <= 103.795 && Number.isFinite(accuracy) && accuracy > 0 && accuracy <= 50000; }
  function showPosition(lat, lon, accuracy) {
    status.textContent = 'Coordinates added: ' + lat.toFixed(6) + ', ' + lon.toFixed(6) + ' (accuracy about ' + Math.ceil(accuracy) + ' m). Select the place name below.' + (accuracy > 100 ? ' This estimate is broad; try again or use a place instead.' : '');
    clear.hidden = false;
  }
  var oldLat = value('csn_latitude'), oldLon = value('csn_longitude'), oldAccuracy = value('csn_accuracy_m');
  if (value('csn_location_source') === 'device' && oldLat && oldLon && oldAccuracy && valid(Number(oldLat), Number(oldLon), Number(oldAccuracy))) showPosition(Number(oldLat), Number(oldLon), Number(oldAccuracy));
  locate.addEventListener('click', function () {
    if (pending) return;
    if (!window.isSecureContext || !navigator.geolocation) { status.textContent = 'Location is unavailable in this browser. Choose a public place below.'; return; }
    var ticket = ++request;
    try { clearFields(); } catch (_) { status.textContent = 'Coordinates could not be attached. Choose a public place below.'; return; }
    pending = true; locate.disabled = true; clear.hidden = false;
    status.textContent = 'Finding your location… Allow location access when your browser asks, or use a place instead.';
    function finish(message) { pending = false; locate.disabled = false; clear.hidden = true; status.textContent = message; }
    function failure(error) {
      if (!alive || ticket !== request) return;
      finish(error && error.code === 1 ? 'Location access was not allowed. Choose a public place below, or open the form in a new tab and try again.' : error && error.code === 3 ? 'Location took too long. Try again or choose a public place below.' : 'Your location could not be found. Try again or choose a public place below.');
    }
    try { navigator.geolocation.getCurrentPosition(function (position) {
      if (!alive || ticket !== request) return;
      var c = position.coords;
      if (!valid(c.latitude, c.longitude, c.accuracy)) { finish('This location is outside the Kent Ridge study area or could not be used. Choose the place where you listened below.'); return; }
      try {
        engine.setJSEmbeddedData('csn_latitude', c.latitude.toFixed(6));
        engine.setJSEmbeddedData('csn_longitude', c.longitude.toFixed(6));
        engine.setJSEmbeddedData('csn_accuracy_m', String(Math.ceil(c.accuracy)));
        engine.setJSEmbeddedData('csn_captured_at', new Date(position.timestamp).toISOString());
        engine.setJSEmbeddedData('csn_location_source', 'device');
      } catch (_) { try { clearFields(); } catch (_) {} finish('Coordinates could not be attached. Choose a public place below.'); return; }
      pending = false; locate.disabled = false; showPosition(c.latitude, c.longitude, c.accuracy);
    }, failure, {enableHighAccuracy:true, timeout:15000, maximumAge:0}); } catch (_) { failure(); }
  });
  clear.addEventListener('click', function () {
    request++; pending = false; locate.disabled = false;
    try { clearFields(); clear.hidden = true; status.textContent = 'No device coordinates attached. Choose a public place below.'; }
    catch (_) { status.textContent = 'Coordinates could not be cleared. Reload this form before continuing without location.'; }
  });
  engine.addOnPageSubmit(function invalidatePendingLocation() {
    request++;
    if (pending) {
      pending = false; locate.disabled = false; clear.hidden = true;
      status.textContent = 'Location request cancelled. Try again or choose a public place below.';
    }
  });
  engine.addOnUnload(function disposeObservationLocation() { alive = false; request++; });
});
