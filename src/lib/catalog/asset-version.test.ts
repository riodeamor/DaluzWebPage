import { it, expect } from "vitest";
import { createRequire } from "node:module";
const { rewrite } = createRequire(import.meta.url)(
  "../../../scripts/public-asset-version.cjs",
);
it("versiona assets de código y CSS emitidos sin alterar fuentes", () => {
  expect(rewrite('url("/images/a.png") /assets/x.svg', "build123")).toBe(
    'url("/images/a.png?v=build123") /assets/x.svg?v=build123',
  );
  expect(rewrite("/images/a.png?v=old", "new")).toBe("/images/a.png?v=old");
});
