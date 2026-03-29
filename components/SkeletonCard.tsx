'use client'

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 skeleton-pulse card-shadow" style={{ backgroundColor: '#FCFAF2' }}>
      {/* Icon + dot row */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-8 h-8 rounded-full bg-[#EDE9D8]" />
        <div className="w-4 h-4 rounded-full bg-[#EDE9D8]" />
      </div>
      {/* Title */}
      <div className="h-5 rounded-full bg-[#EDE9D8] w-3/4 mb-3" />
      {/* Preview lines */}
      <div className="space-y-2 mb-5">
        <div className="h-3 rounded-full bg-[#EDE9D8] w-full" />
        <div className="h-3 rounded-full bg-[#EDE9D8] w-5/6" />
      </div>
      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-[#EDE9D8]">
        <div className="h-3 rounded-full bg-[#EDE9D8] w-16" />
        <div className="h-5 rounded-full bg-[#EDE9D8] w-16" />
      </div>
    </div>
  )
}
