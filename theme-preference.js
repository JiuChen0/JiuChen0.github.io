window.siteThemePreference = (() => {
  const storageKey = "jiu-chen-theme";
  const systemScheme = window.matchMedia?.("(prefers-color-scheme: dark)");
  const systemTheme = () => systemScheme?.matches ? "dark" : "light";

  const read = () => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {
      // Follow the system when storage is unavailable.
    }
    return systemTheme();
  };

  const save = (theme) => {
    try {
      if (theme === systemTheme()) {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(storageKey, theme);
      }
    } catch (_) {
      // The theme can still change for the current page.
    }
  };

  const subscribe = (onChange) => {
    const update = () => {
      const theme = systemTheme();
      save(theme);
      onChange(theme);
    };
    systemScheme?.addEventListener?.("change", update);
    return () => systemScheme?.removeEventListener?.("change", update);
  };

  return { read, save, subscribe };
})();

document.documentElement.dataset.theme = window.siteThemePreference.read();
