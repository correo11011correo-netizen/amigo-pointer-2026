/**
 * 🦅 AMIGO-POINTER 2026 | GOOGLE SERVER v3.0 (RAW DEBUG)
 */

var cache = CacheService.getScriptCache();

function doGet(e) {
  try {
    var sala = e.parameter.sala;
    var userId = e.parameter.userId;
    var lat = e.parameter.lat;
    var lon = e.parameter.lon;
    var callback = e.parameter.callback;

    if (sala && userId && lat && lon) {
      // Guardar mi posición
      var myData = { lat: lat, lon: lon, t: Date.now() };
      cache.put(sala + "_" + userId, JSON.stringify(myData), 600);
      
      // Obtener posición del amigo
      var friendId = (userId === "u1") ? "u2" : "u1";
      var friendRaw = cache.get(sala + "_" + friendId);
      
      // Construir respuesta RAW
      var responseObj = {
        status: "OK",
        server_time: new Date().toISOString(),
        my_id: userId,
        friend_data: friendRaw ? JSON.parse(friendRaw) : null,
        cache_key: sala + "_" + friendId
      };
      
      var output = callback + "(" + JSON.stringify(responseObj) + ")";
      return ContentService.createTextOutput(output)
                           .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput("Error: Faltan parámetros").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
