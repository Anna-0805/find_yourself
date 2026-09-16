interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorRetry({ message = "Что-то пошло не так при загрузке данных.", onRetry }: ErrorRetryProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl max-w-md mx-auto text-center space-y-4 my-6">
      <div className="text-3xl">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800">Помилка мережі</h3>
      <p className="text-sm text-red-600">{message}</p>
      
      <button
        onClick={onRetry}
        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
      >
        Повторити спробу
      </button>
    </div>
  );
}