'use client';

export default function Banner() {
  return (
    <div className="relative w-full bg-gradient-to-r from-secondary to-primary text-white py-6 px-4 rounded-lg shadow-md mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/patterns/news-pattern.png')] bg-cover bg-center"></div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-extrabold font-serif drop-shadow">
          Stay Informed
        </h1>
        <p className="text-lg font-light max-w-2xl">
          Get the latest breaking news, featured stories, and top headlines – all
          in one place.
        </p>
      </div>
    </div>
  );
}
