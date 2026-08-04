import type { SearchTermGroup } from "./types";

let groupCounter = 0;

export function createSearchTermGroup(): SearchTermGroup {
  groupCounter += 1;

  return {
    id: `search-group-${groupCounter}-${Date.now()}`,
    searchTerms: "",
    caseSensitive: false,
    wholeWord: false,
  };
}
