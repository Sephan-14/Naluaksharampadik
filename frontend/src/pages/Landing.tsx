import { Link } from 'react-router-dom';
import { GraduationCap, Users, Target, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      {/* Navigation */}
      <nav className="bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-fuchsia-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-fuchsia-500/30">
                <GraduationCap className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  Naalu Aksharam Padikk
                </h1>
                <p className="text-xs text-gray-300">Connect. Learn. Grow Together.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-100 hover:bg-neutral-800">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-fuchsia-500 to-purple-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Never Feel Lost Academically Again
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Too many juniors feel lost academically, simply because they don't know who to approach—
            even though there are seniors ready and willing to help. We're solving this disconnect.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-lg px-8 py-6">
                Start Your Journey <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-neutral-700 text-gray-100">
                I Already Have Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-neutral-900 rounded-2xl p-12 shadow-xl border border-neutral-800">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-100">
            The Problems We're Solving
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-red-500/40 bg-red-500/10 text-gray-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">😰</div>
                <h4 className="font-bold text-lg mb-2">Guidance Disconnect</h4>
                <p className="text-gray-200">
                  Juniors don't know who to approach, and seniors willing to help go unnoticed
                </p>
              </CardContent>
            </Card>
            <Card className="border border-amber-500/40 bg-amber-500/10 text-gray-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">😔</div>
                <h4 className="font-bold text-lg mb-2">Inconsistency & Procrastination</h4>
                <p className="text-gray-200">
                  Students struggle to maintain consistent study habits without accountability
                </p>
              </CardContent>
            </Card>
            <Card className="border border-yellow-400/40 bg-yellow-400/10 text-gray-100">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">😱</div>
                <h4 className="font-bold text-lg mb-2">"It's Too Late" Panic</h4>
                <p className="text-gray-200">
                  Late starters receive vague advice instead of actionable recovery roadmaps
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-100">
          Our Solution
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border border-indigo-500/40 bg-neutral-900 hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Users className="size-12 text-indigo-300 mb-4" />
              <h4 className="font-bold text-xl mb-3">Verified Mentorship Network</h4>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>Connect with verified seniors without social friction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>Search by department, expertise, and ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>Direct messaging and guidance</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/40 bg-neutral-900 hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <TrendingUp className="size-12 text-purple-300 mb-4" />
              <h4 className="font-bold text-xl mb-3">Social Accountability System</h4>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>Daily study logs to build consistency streaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Non-toxic environment with positive peer pressure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Community feed to share progress</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-pink-500/40 bg-neutral-900 hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <Target className="size-12 text-pink-300 mb-4" />
              <h4 className="font-bold text-xl mb-3">Smart Catch-Up Plans</h4>
              <ul className="space-y-2 text-gray-200">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>Time-optimized recovery roadmaps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Senior-approved study plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Track progress and adjust as needed</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold text-center mb-12">Join Our Growing Community</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">247</div>
              <div className="text-indigo-100">Active Mentors</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1,834</div>
              <div className="text-indigo-100">Daily Study Logs</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">563</div>
              <div className="text-indigo-100">Catch-Up Plans Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h3 className="text-4xl font-bold mb-6">
          Ready to Transform Your Academic Journey?
        </h3>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands of students who are already learning, growing, and succeeding together.
        </p>
        <Link to="/signup">
          <Button size="lg" className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-lg px-12 py-6">
            Get Started for Free <ArrowRight className="ml-2 size-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>© 2026 Naalu Aksharam Padikk. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
