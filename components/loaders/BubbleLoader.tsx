// components/BubbleLoader.tsx
export default function BubbleLoader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="flex space-x-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full bg-gray-600 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
