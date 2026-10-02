import { NextRequest, NextResponse } from "next/server";
import { searchTokens } from "@/lib/catalog/search";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 9)); // Changed default from 12 to 9
    const offset = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category_id") ?? searchParams.get("category");
    if (searchParams.has("category_id") && !category?.trim()) {
      return NextResponse.json({ error: "La línea es requerida" }, { status: 400 });
    }
    const search = searchParams.get("search");
    const skinType = searchParams.get("skin_type");
    const hairType = searchParams.get("hair_type");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const featured = searchParams.get("featured");
    const inStock = searchParams.get("in_stock");
    const onSale = searchParams.get("on_sale");

    // Build query with count option
    let query = supabase.from("products").select(
      `
        *,
        categories:category_id (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          title,
          price,
          inventory_quantity,
          option1,
          option2,
          option3,
          is_default
        )
      `,
      { count: "exact" },
    );

    // Apply filters
    if (category) {
      query = query.eq("category_id", category);
    }

    let tokens: string[];
    try { tokens = searchTokens(search || ""); } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
    for (const token of tokens) query = query.ilike("name_search", `%${token}%`);
    for (const [key, slug] of [["anatomy",searchParams.get("anatomy")], ...[...searchParams.getAll("need"), skinType, hairType].map(slug=>["need",slug])]) {
      if (!slug) continue;
      const { data: term } = await supabase.from("catalog_terms").select("id").eq("slug", slug).eq("kind", key === "anatomy" ? "anatomy" : "need").eq("is_active", true).maybeSingle();
      if (!term) return NextResponse.json({ products: [], pagination: { page, limit, total: 0, totalPages: 0, hasMore: false } });
      query = query.contains("catalog_term_ids", [term.id]);
    }
    const lineSlug = searchParams.get("line");
    if (lineSlug) {
      const { data: line } = await supabase.from("categories").select("id").eq("slug", lineSlug).maybeSingle();
      if (!line) return NextResponse.json({ products: [], pagination: { page, limit, total: 0, totalPages: 0, hasMore: false } });
      query = query.eq("category_id", line.id);
    }



    if (minPrice) {
      query = query.gte("price", parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price", parseFloat(maxPrice));
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (inStock === "true") {
      query = query.gt("inventory_quantity", 0);
    }

    if (onSale === "true") {
      query = query.eq("is_on_sale", true);
    }

    query = query.eq("status", "active").order("is_kit", { ascending: true }).order("created_at", { ascending: false });

    // Execute query with pagination and get count
    const {
      data: products,
      count,
      error,
    } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    // Fetch review summaries for each product
    const productsWithReviews = await Promise.all(
      (products || []).map(async (product) => {
        try {
          // Get review summary for this product
          const { data: reviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("product_id", product.id)
            .eq("is_approved", true);

          const reviewCount = reviews?.length || 0;
          const averageRating =
            reviewCount > 0 && reviews
              ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviewCount
              : 0;

          return {
            ...product,
            reviewCount,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          };
        } catch (error) {
          console.error(
            `Error fetching reviews for product ${product.id}:`,
            error,
          );
          return {
            ...product,
            reviewCount: 0,
            averageRating: 0,
          };
        }
      }),
    );

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      products: productsWithReviews,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Compatibility endpoint shares the authenticated Admin writer.
export { POST } from "@/app/api/admin/products/route";
