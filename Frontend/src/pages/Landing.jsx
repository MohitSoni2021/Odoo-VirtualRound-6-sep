import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <header className="bg-ecoCream/70 backdrop-blur supports-[backdrop-filter]:bg-ecoCream/60 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold text-ecoDark">EcoFinds</span>
            <span className="text-ecoGreen" role="img" aria-label="leaf">🌿</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-ecoDark">
            <a href="#home" className="hover:text-ecoGreen">Home</a>
            <a href="#browse" className="hover:text-ecoGreen">Browse</a>
            <a href="#categories" className="hover:text-ecoGreen">Categories</a>
            <a href="#about" className="hover:text-ecoGreen">About</a>
            <Link to="/" className="hover:text-ecoGreen">Login</Link>
            <Link to="/signup" className="hover:text-ecoGreen">Signup</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/signup" className="inline-flex items-center rounded-xl bg-ecoGreen px-4 py-2 text-white hover:bg-ecoDark transition-colors shadow-soft">
              Start Selling
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-ecoCream via-white to-ecoLight/40">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-ecoDark">
            Give Products a Second Life <span role="img" aria-label="earth">🌍</span>
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Buy & sell pre-loved items easily, save money, and reduce waste.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#browse" className="px-6 py-3 rounded-xl bg-ecoGreen text-white hover:bg-ecoDark transition-colors shadow-soft">Shop Now</a>
            <Link to="/signup" className="px-6 py-3 rounded-xl border border-ecoGreen text-ecoGreen hover:bg-ecoLight transition-colors">Sell an Item</Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-2xl bg-ecoLight shadow-soft border border-ecoGreen/10 flex items-center justify-center">
            <div className="text-ecoDark/80 text-center p-6">
              <div className="text-7xl mb-4">🛍️</div>
              <p className="text-lg">Eco-friendly marketplace illustration</p>
            </div>
          </div>
          <div className="absolute -z-10 -top-10 -right-10 w-72 h-72 bg-ecoLight blur-3xl rounded-full opacity-60" />
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: 'Sustainable Shopping',
      emoji: '♻️',
      desc: 'Extend product lifecycles and reduce environmental impact.'
    },
    {
      title: 'Easy Listings',
      emoji: '🛒',
      desc: 'Quickly add, manage, and sell your items with ease.'
    },
    {
      title: 'Trusted Community',
      emoji: '🤝',
      desc: 'Safe and reliable buyers & sellers with transparent reviews.'
    },
    {
      title: 'Smart Search',
      emoji: '🔍',
      desc: 'Filter by category and keywords to find the perfect item.'
    },
  ];
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-display font-semibold text-ecoDark text-center">Why Choose EcoFinds?</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((f, idx) => (
            <div key={idx} className="bg-ecoCream rounded-2xl p-6 shadow-soft border border-ecoGreen/10 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.emoji}</div>
              <h3 className="text-xl font-semibold text-ecoDark">{f.title}</h3>
              <p className="mt-2 text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: 'Sign Up', desc: 'Create your free account to get started.', icon: '📝' },
    { title: 'List or Browse Products', desc: 'Post your items or explore thousands of listings.', icon: '📦' },
    { title: 'Buy or Sell Sustainably', desc: 'Complete secure transactions and reduce waste.', icon: '✅' },
  ];
  return (
    <section id="about" className="py-16 bg-ecoCream">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-display font-semibold text-ecoDark text-center">How It Works</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-ecoGreen/10">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h3 className="text-xl font-semibold text-ecoDark">{s.title}</h3>
              <p className="mt-2 text-gray-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: 'Products Resold', value: '500+' },
    { label: 'Waste Saved', value: '200+ kg' },
    { label: 'Active Users', value: '1,000+' },
  ];
  return (
    <section id="stats" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-2xl bg-gradient-to-r from-ecoLight to-ecoCream p-10 border border-ecoGreen/10 shadow-soft">
          <h2 className="text-2xl font-display font-semibold text-ecoDark text-center">Community Impact</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {stats.map((st, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-soft border border-ecoGreen/10">
                <div className="text-3xl font-bold text-ecoGreen">{st.value}</div>
                <div className="mt-2 text-gray-700">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="py-16 bg-ecoCream">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-display font-semibold text-ecoDark">Join the EcoFinds Community Today!</h2>
        <Link to="/signup" className="inline-flex items-center mt-6 rounded-xl bg-ecoGreen px-6 py-3 text-white hover:bg-ecoDark transition-colors shadow-soft">
          Get Started →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-ecoGreen/10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-semibold text-ecoDark">EcoFinds</span>
            <span className="text-ecoGreen" role="img" aria-label="leaf">🌿</span>
          </div>
          <p className="mt-3 text-gray-600">Sustainable second-hand marketplace. Buy pre-loved, sell responsibly.</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-ecoDark">Company</h4>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li><a href="#about" className="hover:text-ecoGreen">About</a></li>
              <li><a href="#" className="hover:text-ecoGreen">Privacy</a></li>
              <li><a href="#" className="hover:text-ecoGreen">Terms</a></li>
              <li><a href="#" className="hover:text-ecoGreen">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-ecoDark">Follow Us</h4>
            <div className="mt-3 flex gap-3 text-ecoDark">
              <a href="#" aria-label="Facebook" className="hover:text-ecoGreen">{/* Facebook */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12.06C22 6.49 17.52 2 11.94 2S2 6.49 2 12.06C2 17.08 5.66 21.21 10.44 22v-7.02H7.9v-2.92h2.54V9.84c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.92h-2.34V22C18.34 21.21 22 17.08 22 12.06Z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-ecoGreen">{/* Instagram */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm0 2h10c1.67 0 3 1.33 3 3v10c0 1.67-1.33 3-3 3H7c-1.67 0-3-1.33-3-3V7c0-1.67 1.33-3 3-3Zm10.25 1.75a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-ecoGreen">{/* LinkedIn */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2ZM8.34 18.34H6.03V10.1h2.31v8.24Zm-1.15-9.37c-.74 0-1.35-.6-1.35-1.35 0-.74.61-1.35 1.35-1.35.75 0 1.35.61 1.35 1.35 0 .75-.6 1.35-1.35 1.35Zm11.14 9.37h-2.31v-4.4c0-1.05-.02-2.41-1.47-2.41-1.47 0-1.69 1.15-1.69 2.34v4.47H9.6V10.1h2.22v1.12h.03c.31-.59 1.07-1.2 2.2-1.2 2.35 0 2.78 1.55 2.78 3.56v4.76Z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-gray-500 border-t border-ecoGreen/10">© {new Date().getFullYear()} EcoFinds. All rights reserved.</div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen font-sans">
      <NavBar />
      <Hero />
      <section id="browse">
        <Features />
      </section>
      <section id="categories">
        <HowItWorks />
      </section>
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}
