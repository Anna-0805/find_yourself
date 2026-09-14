export default function SkeletonCard() {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-4 animate-pulse">

      <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
      
      <div className="flex gap-4">
        <div className="h-4 bg-slate-200 rounded-md w-24"></div>
        <div className="h-4 bg-slate-200 rounded-md w-32"></div>
      </div>
      
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded-md w-full"></div>
        <div className="h-3 bg-slate-200 rounded-md w-5/6"></div>
      </div>
      
      <div className="pt-2 flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded-md w-28"></div>
        <div className="h-8 bg-slate-200 rounded-md w-24"></div>
      </div>
    </div>
  );
}