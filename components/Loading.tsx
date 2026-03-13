export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative inline-block">
          <img 
            src="/logo.svg" 
            alt="UR Aerotech" 
            className="w-32 h-32 animate-pulse"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="mt-6 text-lg text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}
