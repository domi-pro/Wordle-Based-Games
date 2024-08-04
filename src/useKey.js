import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      function escapeClick(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }
      document.addEventListener("keydown", escapeClick);

      return function () {
        document.removeEventListener("keydown", escapeClick);
      };
    },
    [action, key]
  );
}