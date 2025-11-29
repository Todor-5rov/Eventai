import Link from 'next/link';

interface HeaderProps {
  isAuthenticated?: boolean;
  userType?: 'organizer' | 'partner';
  onSignOut?: () => void;
}

export function Header({ isAuthenticated, userType, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">EventAI</span>
          </Link>

          <nav className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href={userType === 'organizer' ? '/dashboard/organizer' : '/dashboard/partner'}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={onSignOut}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

