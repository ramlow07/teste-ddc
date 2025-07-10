interface ChartPlaceholderProps {
  type: "line" | "bar" | "pie"
  height?: number
}

export function ChartPlaceholder({ type, height = 300 }: ChartPlaceholderProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
      style={{ height }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">
          {type === "line" && "📈"}
          {type === "bar" && "📊"}
          {type === "pie" && "🥧"}
        </div>
        <p className="text-gray-600 font-medium capitalize">{type} Chart</p>
        <p className="text-sm text-gray-500 mt-1">Chart visualization would appear here</p>
      </div>
    </div>
  )
}
