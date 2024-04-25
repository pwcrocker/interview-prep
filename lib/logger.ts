/* eslint-disable no-console */

export function log(msg: string) {
  console.log(msg);
}

export function logJson(prefix: string, obj: any) {
  log(`${prefix}: ${JSON.stringify(obj, null, 2)}`);
}

export function logWarn(msg: string) {
  console.warn(msg);
}

export function logErr(msg: string, err?: any) {
  console.error(msg, err);
}
