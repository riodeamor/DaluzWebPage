import { NextRequest } from "next/server";
import { expect, it, vi } from "vitest";
import { POST } from "./route";

const mocks = vi.hoisted(() => ({ client: vi.fn() }));
vi.mock("@/utils/supabase/server", () => ({ createServiceRoleClient: mocks.client }));

it("ignores client approval and creates every new review pending moderation", async () => {
  const query = {
    select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValueOnce({ data: null }).mockResolvedValueOnce({ data: { is_approved: false } }),
  };
  mocks.client.mockReturnValue({ from: () => query });
  const response = await POST(new NextRequest("http://localhost/api/products/product/reviews", {
    method: "POST", body: JSON.stringify({ rating: 5, user_id: "client", comment: "Muy bueno", is_approved: true }),
  }), { params: { id: "product" } });
  expect(response.status).toBe(201);
  expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({ is_approved: false, product_id: "product" }));
});
