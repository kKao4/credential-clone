import { agentHas } from "./agentHas";

export function isSafari() {
  return (
    (!!(window as any).ApplePaySetupFeature || !!(window as any).safari) &&
    agentHas("Safari") &&
    !agentHas("Chrome") &&
    !agentHas("CriOS")
  );
}
