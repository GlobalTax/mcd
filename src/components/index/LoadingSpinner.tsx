
export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
};
