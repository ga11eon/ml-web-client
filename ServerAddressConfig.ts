import {environment} from "./src/environment/environment";

const ServerAddressRawString: string = environment.mlServerAddress + ',MOCK';
export const ServerAddressConfig: string[] = ServerAddressRawString.split(',');
