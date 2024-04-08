export function agentHas(keyword: string) {
  return navigator.userAgent.toLowerCase().search(keyword.toLowerCase()) > -1;
}
