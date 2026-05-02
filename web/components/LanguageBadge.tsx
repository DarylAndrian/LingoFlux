export default function LanguageBadge({
  language,
  level,
  active = false,
  onClick,
}: {
  language: string
  level: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <div className="text-xs mb-1 opacity-75">{level}</div>
      <div>{language}</div>
    </button>
  )
}
