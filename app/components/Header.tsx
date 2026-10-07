import Link from 'next/link';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto px-4 pt-10 pb-4">
      {/* Top Row: Title on the left, [About] on the top-right */}
      <div className="flex items-center justify-between pb-6">
        <Link 
          href="/" 
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-light hover:text-accent-red transition-colors"
        >
          Xavier's Weblog
        </Link>
        <Link 
          href="/about" 
          className="text-sm font-mono text-text-light opacity-60 hover:opacity-100 hover:text-accent-red transition-all"
        >
          [About]
        </Link>
      </div>

      {/* Bottom Row: Navigation Tabs + Search Bar side by side */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 border-b border-surface-blue pb-4 mb-8">
        <Navbar />
        <div className="w-full sm:w-80">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}