/**
 *  AMIGO-POINTER 2026 | GOOGLE SERVER v4.0 (TRANS-CORS)
 */

var cache = CacheService.getScriptCache();

function doGet(e) {
  var callback = e.parameter.callback || "console.log";
  
  try {
    var sala = e.parameter.sala;
    var userId = e.parameter.userId;
    var lat = e.parameter.lat;
    var lon = e.parameter.lon;

    if (!sala || !userId) {
      return buildResponse(callback, { status: "ERROR", msg: "Missing Params" });
    }

    // Guardar y recuperar
    var key = sala + "_" + userId;
    var friendKey = sala + "_" + (userId === "u1" ? "u2" : "u1");
    
    if (lat && lon) {
      cache.put(key, JSON.stringify({lat: lat, lon: lon, t: Date.now()}), 600);
    }
    
    var friendData = cache.get(friendKey);
    
    return buildResponse(callback, {
      status: "OK",
      server_time: new Date().toISOString(),
      my_key: key,
      friend_raw: friendData ? JSON.parse(friendData) : null,
      params_received: {sala: sala, user: userId}
    });

  } catch (err) {
    return buildResponse(callback, { status: "CRASH", error: err.toString() });
  }
}

function buildResponse(cb, obj) {
  var out = cb + "(" + JSON.stringify(obj) + ")";
  return ContentService.createTextOutput(out)
                       .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
