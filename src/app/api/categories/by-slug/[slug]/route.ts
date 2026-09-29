import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { slug } = params;

    // Preserve the old Kits URL while following the current slug of its stable record.
    const legacyKits = slug === 'linea-kits-y-experiencia';
    const { data: category, error } = await supabase
      .from('categories' as any)
      .select('*')
      .eq(legacyKits ? 'id' : 'slug', legacyKits ? '2196c12a-3e6a-42b1-b137-770837530f46' : slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching category by slug:', error);
      return NextResponse.json(
        { error: 'Failed to fetch category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
