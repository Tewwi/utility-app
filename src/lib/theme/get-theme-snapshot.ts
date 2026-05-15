export function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
