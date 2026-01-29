export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium text-center max-w-3xl leading-relaxed">
            QuietHelp is not a replacement for professional therapy or medical care.
          </p>

          <p className="text-sm text-gray-700 dark:text-gray-300 text-center max-w-2xl leading-relaxed">
            If you’re in danger or feel like you might hurt yourself or others, please seek immediate help.
            <br />
            Need urgent support? 🇺🇸{" "}
            <a
              href="tel:988"
              className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Call or text 988
            </a>{" "}
            (Suicide & Crisis Lifeline) · 🌍{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Find local helplines
            </a>
          </p>

          <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white text-center">
            You are not alone.
          </p>
        </div>
      </div>
    </footer>
  );
}
