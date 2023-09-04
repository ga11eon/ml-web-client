export const environment = {
  production: false,
  mlServerAddress: window["env"]["mlServerAddress"] || "http://localhost:4200",
  serverInternalPath: window["env"]["serverInternalPath"] || "/predictions/garbage_cont_classify",
};
