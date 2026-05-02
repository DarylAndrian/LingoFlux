export default function WordCard({
  word,
  saved = false,
  onSave,
}: {
  word: any
  saved?: boolean
  onSave?: () => void
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-1">
            {word.word || word.text}
          </h4>
          {word.pinyin_romaji && (
            <p className="text-sm text-gray-600 italic">{word.pinyin_romaji}</p>
          )}
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
          {word.part_of_speech || 'Noun'}
        </span>
      </div>

      <p className="text-gray-700 mb-3">{word.definition}</p>

      {word.example_sentence && (
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600 italic">{word.example_sentence}</p>
        </div>
      )}

      {word.difficulty_score && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Difficulty</span>
            <span>{word.difficulty_score}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${word.difficulty_score * 10}%` }}
            ></div>
          </div>
        </div>
      )}

      {!saved && onSave && (
        <button
          onClick={onSave}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          💾 Save Word
        </button>
      )}

      {saved && (
        <button
          disabled
          className="w-full px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg cursor-not-allowed"
        >
          ✓ Already Saved
        </button>
      )}
    </div>
  )
}
