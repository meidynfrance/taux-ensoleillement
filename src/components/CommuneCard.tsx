import Link from 'next/link';

interface CommuneCardProps {
  nom: string;
  slug: string;
  ensoleillement: number | null;
  departement?: string;
  codePostal?: string | null;
  rank?: number;
}

export default function CommuneCard({ nom, slug, ensoleillement, departement, codePostal, rank }: CommuneCardProps) {
  return (
    <Link
      href={`/commune/${slug}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-amber-300 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {rank && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
              #{rank}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors truncate">
            {nom}
          </h3>
          {departement && (
            <p className="text-sm text-gray-500 mt-0.5">{departement}</p>
          )}
          {codePostal && (
            <p className="text-xs text-gray-400 mt-0.5">{codePostal}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          {ensoleillement !== null ? (
            <>
              <p className="text-2xl font-bold text-amber-500">{ensoleillement.toLocaleString('fr-FR')}</p>
              <p className="text-xs text-gray-500">h/an</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">--</p>
          )}
        </div>
      </div>
    </Link>
  );
}
