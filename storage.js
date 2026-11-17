(() => {
  "use strict";

  const directory = new URL("./", window.location.href).pathname;
  const key = `basf-workplace-demo-v1:${directory}`;

  function load() {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  window.CourseStorage = { load, save };
})();
