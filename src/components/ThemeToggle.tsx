"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-lg border border-gray-300 bg-white p-2 text-lg leading-none hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
      <span className="dark:hidden">🌙</span>
      <span className="hidden dark:inline">☀️</span>
    </button>
  );
}
