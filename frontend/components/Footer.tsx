export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-black bg-orange-200 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-sm sm:text-base text-black font-medium text-center max-w-3xl leading-relaxed">
            This is not a therapy app!
          </p>
          <p className="text-sm sm:text-sm text-black text-center max-w-2xl leading-relaxed">
            If you are in crisis, please contact your local emergency services or a mental health professional.
          </p>
        </div>
      </div>
    </footer>
  );
}

