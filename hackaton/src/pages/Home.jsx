import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Hackathons Just for You</h1>
              <div className="space-x-4">
                <Link to="/hackathons" className="bg-blue-600 text-white px-6 py-3 rounded-md">
                  Join a Hackathon
                </Link>
                <Link to="/add-hackathon" className="bg-white text-blue-600 px-6 py-3 rounded-md border border-blue-600">
                  Host a Hackathon
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Ongoing Hackathons */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Ongoing Hackathons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Hackathon cards will be mapped here */}
            </div>
          </div>
        </section>

        {/* How to Register */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How to Register</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">1. Create Account</h3>
                  <p>Sign up as a participant or host in just a few clicks</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">2. Choose Hackathon</h3>
                  <p>Browse through available hackathons and pick your favorite</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">3. Submit Project</h3>
                  <p>Work on your project and submit before the deadline</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
