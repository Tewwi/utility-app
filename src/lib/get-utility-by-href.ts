import { utilities } from "./utilities";

export function getUtilityByHref(href: string) {
  return utilities.find((utility) => utility.href === href);
}
