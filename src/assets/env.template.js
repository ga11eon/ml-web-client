(function(window) {
  window.env = window.env || {};
  window["env"]["mlServerAddress"] = "${ML_SERVER_ADDRESSES}";
  window["env"]["serverInternalPath"] = "${SERVER_INTERNAL_PATH}";
})(this);
