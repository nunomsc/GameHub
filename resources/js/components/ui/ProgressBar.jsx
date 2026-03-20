export default function ProgressBar({ value = 0, animated = false }) {
    return (
        <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full bg-blue-500 transition-all duration-300 ${animated ? 'animate-pulse' : ''}`}
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    )
}