export const environment = {
  production: true,
  mlServerAddress: window["env"]["mlServerAddress"] || "http://localhost:4200",
  serverInternalPath: window["env"]["serverInternalPath"] || "/predictions/garbage_cont_classify",
};
