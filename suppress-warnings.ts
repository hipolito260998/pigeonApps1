// suppress-warnings.ts
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;

  const shouldIgnore = (args: any[]) => {
    if (typeof args[0] === "string") {
      const msg = args[0];
      if (
        msg.includes("props.pointerEvents is deprecated") ||
        msg.includes('"shadow*" style props are deprecated') ||
        msg.includes("Blocked aria-hidden on an element")
      ) {
        return true;
      }
    }
    return false;
  };

  console.warn = (...args) => {
    if (shouldIgnore(args)) return;
    originalWarn(...args);
  };

  console.error = (...args) => {
    if (shouldIgnore(args)) return;
    originalError(...args);
  };
  
  console.log = (...args) => {
    if (shouldIgnore(args)) return;
    originalLog(...args);
  };
}
