import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { PUT } from "./route";

const { update, single } = vi.hoisted(() => ({ update: vi.fn(), single: vi.fn() }));
vi.mock("@/lib/auth/helpers", () => ({
  requireAdmin: async () => ({ ok: true }),
  getServiceClient: () => ({ from: () => ({ update }) }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  update.mockReturnValue({ eq: () => ({ select: () => ({ single }) }) });
});

function save() {
  return PUT(new NextRequest("https://example.com/api/admin/products/serum", {
    method: "PUT",
    body: JSON.stringify({ info_frontal: "Niacinamida y Hamamelis", treasure_access_ids: ["linea-umbral"] }),
  }), { params: { id: "serum" } });
}

it("saves the ficha when production rejects its unsupported treasure assignment", async () => {
  single.mockResolvedValueOnce({ error: {
    code: "PGRST204", message: "Could not find the 'treasure_access_ids' column of 'products' in the schema cache",
  } }).mockResolvedValueOnce({ data: { id: "serum" }, error: null });
  const response = await save();
  expect(response.status).toBe(200);
  expect((await response.json()).warning).toMatch(/Tesoros/);
  expect(update).toHaveBeenCalledTimes(2);
  expect(update.mock.calls[1][0]).toMatchObject({ info_frontal: "Niacinamida y Hamamelis" });
  expect(update.mock.calls[1][0]).not.toHaveProperty("treasure_access_ids");
});

it("keeps a valid assignment where it is supported", async () => {
  single.mockResolvedValue({ data: { id: "serum" }, error: null });
  expect((await save()).status).toBe(200);
  expect(update).toHaveBeenCalledTimes(1);
  expect(update.mock.calls[0][0].treasure_access_ids).toEqual(["linea-umbral"]);
});
