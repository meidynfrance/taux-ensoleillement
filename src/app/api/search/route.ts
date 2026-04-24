import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';
import type { Commune } from '@/types';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await sql<Commune[]>`
      SELECT code_insee, nom, slug, code_postal, departement_code, ensoleillement_annuel
      FROM communes
      WHERE nom ILIKE ${q + '%'}
      ORDER BY population DESC NULLS LAST
      LIMIT 8
    `;
    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
