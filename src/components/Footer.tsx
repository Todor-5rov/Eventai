export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EventAI</h3>
            <p className="text-gray-400">
              Automate your event planning with AI-powered outreach.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Organizers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>How It Works</li>
              <li>Pricing</li>
              <li>Success Stories</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Partners</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Join as Partner</li>
              <li>Partner Benefits</li>
              <li>Partner Dashboard</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EventAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

