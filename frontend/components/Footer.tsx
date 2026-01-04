export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-black bg-orange-200 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-sm sm:text-base text-black font-medium text-center max-w-3xl leading-relaxed">
            QuietHelp is not a replacement for professional therapy or medical care.
          </p>

          <p className="text-sm text-black text-center max-w-2xl leading-relaxed">
            If you’re in danger or feel like you might hurt yourself or others, please seek immediate help.
            <br />
            Need urgent support? 🇺🇸{" "}
            <a
              href="tel:988"
              className="underline font-medium hover:text-black/80"
            >
              Call or text 988
            </a>{" "}
            (Suicide & Crisis Lifeline) · 🌍{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-black/80"
            >
              Find local helplines
            </a>
          </p>

          <p className="text-sm sm:text-base font-bold text-black text-center">
            You are not alone.
          </p>
        </div>
      </div>
    </footer>
  );
}
