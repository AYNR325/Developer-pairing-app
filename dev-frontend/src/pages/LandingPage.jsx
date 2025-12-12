import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, MessageSquare, Users, Rocket, ExternalLink, Github } from 'lucide-react';
import heroImage from '../assets/hero-illustration.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#FF96F5] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-[#FF96F5]/30 backdrop-blur-md sticky top-0 z-50 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-[#8D2B7E] via-[#FF96F5] to-[#A259C6] bg-clip-text text-transparent text-3xl font-bold drop-shadow-[0_2px_8px_rgba(141,43,126,0.25)] animate-gradient-x select-none">
                &lt;/&gt;
              </span>
              <span className="font-extrabold text-2xl tracking-wide select-none">
                <span className="bg-gradient-to-r from-[#FF96F5] via-[#8D2B7E] to-[#A259C6] bg-clip-text text-transparent">Dev</span>
                <span className="bg-gradient-to-r from-[#A259C6] to-[#FF96F5] bg-clip-text text-transparent">Hub</span>
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth/login" 
                className="text-gray-300 hover:text-[#FF96F5] font-medium transition-colors text-base"
              >
                Log in
              </Link>
              <Link 
                to="/auth/register" 
                className="bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] hover:from-[#A259C6] hover:to-[#8D2B7E] text-white px-6 py-2.5 rounded-full text-base font-bold transition-all shadow-[0_0_15px_rgba(141,43,126,0.5)] hover:shadow-[0_0_25px_rgba(141,43,126,0.7)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow relative">
         {/* Background decoration - Desktop only specific blobs */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none hidden lg:block">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#8D2B7E]/20 rounded-full blur-[120px]"></div>
             <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#2D033B]/40 rounded-full blur-[120px]"></div>
          </div>

        <section className="relative pt-20 pb-20 lg:pt-20 lg:pb-32 min-h-[90vh] lg:min-h-0 flex items-center lg:block">
          {/* Mobile Background Image */}
          <div className="absolute inset-0 lg:hidden overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src={heroImage} 
              alt="Background" 
              className="w-full h-full object-cover opacity-50" 
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="text-center md:max-w-3xl md:mx-auto lg:col-span-6 lg:text-left animate-fade-in-up">
                <div className="inline-flex items-center rounded-full border border-[#FF96F5]/30 px-4 py-1.5 text-sm font-semibold transition-colors bg-[#2D033B]/50 text-[#FF96F5] mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(255,150,245,0.3)]">
                  <span className="flex h-2 w-2 rounded-full bg-[#FF96F5] mr-2 animate-pulse"></span>
                  v1.0 Now Live
                </div>
                <h1 className="text-4xl xs:text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl mb-6 leading-tight drop-shadow-xl">
                  <span className="block">Collaborate locally,</span>
                  <span className="block bg-gradient-to-r from-[#FF96F5] via-[#A259C6] to-[#8D2B7E] bg-clip-text text-transparent pb-2">Build globally.</span>
                </h1>
                <p className="mt-4 text-lg text-gray-200 sm:mt-5 sm:text-xl lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
                  The ultimate platform for developers to find peers, create sprints, and build amazing software together in real-time. Experience the power of sync.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      to="/auth/register"
                      className="inline-flex items-center justify-center rounded-full text-base font-bold bg-[#8D2B7E] text-white hover:bg-[#A259C6] h-14 px-10 py-3 shadow-[0_0_20px_rgba(141,43,126,0.4)] hover:shadow-[0_0_30px_rgba(141,43,126,0.6)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
                    >
                      Start Building
                      <Rocket className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center justify-center rounded-full text-base font-bold border-2 border-[#FF96F5]/50 text-white hover:bg-[#FF96F5]/10 hover:border-[#FF96F5] h-14 px-10 py-3 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
                    >
                      View Demo
                    </Link>
                </div>
              </div>
              
              {/* Desktop Image Section - Hidden on Mobile */}
              <div className="hidden lg:block mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 lg:flex lg:items-center relative animate-fade-in">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8D2B7E] to-[#FF96F5] blur-[80px] opacity-30 rounded-full transform scale-90"></div>
                <div className="relative mx-auto w-full rounded-3xl shadow-2xl lg:max-w-md overflow-hidden border border-[#FF96F5]/20 bg-[#111]/40 backdrop-blur-sm p-2">
                   <div className="rounded-2xl overflow-hidden relative">
                     <img 
                        src={heroImage} 
                        alt="Developer Collaboration" 
                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-60"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl mb-6">
                Everything you need to <span className="text-[#FF96F5]">ship faster</span>
              </h2>
              <p className="mt-4 text-xl text-gray-400">
                DevHub provides the essential tools to streamline your collaborative development process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-8 w-8 text-[#FF96F5]" />,
                  title: "Team Formation",
                  description: "Find the perfect teammates based on skills, timezone, and project interests."
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-[#FF96F5]" />,
                  title: "Real-time Chat",
                  description: "Seamless communication with integrated chat rooms for every sprint and team."
                },
                {
                  icon: <Rocket className="h-8 w-8 text-[#FF96F5]" />,
                  title: "Sprint Management",
                  description: "Organize your workflow with intuitive kanban boards and sprint tracking."
                }
              ].map((feature, index) => (
                <div key={index} className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#8D2B7E]/30 rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(141,43,126,0.15)] hover:border-[#FF96F5]/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8D2B7E]/5 to-[#FF96F5]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-[#2D033B] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#8D2B7E]/30">
                        {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF96F5] transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D033B] via-[#111] to-[#2D033B] opacity-90"></div>
          {/* Decorative blurs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#8D2B7E]/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#FF96F5]/20 rounded-full blur-[100px]"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-white">Ready to start your journey?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Join thousands of developers building the future together. Create your profile and find your sprint team today.</p>
            <Link 
              to="/auth/register"
              className="inline-block bg-gradient-to-r from-[#8D2B7E] to-[#A259C6] hover:from-[#A259C6] hover:to-[#8D2B7E] text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(141,43,126,0.5)] hover:shadow-[0_0_40px_rgba(141,43,126,0.7)] hover:-translate-y-1 transition-all duration-300"
            >
              Join DevHub Today
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-[#8D2B7E]/30 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-white">DevHub</span>
             </div>
             <p className="text-sm text-gray-500">© 2025 DevHub Platform. All rights reserved.</p>
             <div className="flex gap-6">
               <a href="#" className="text-gray-500 hover:text-[#FF96F5] transition-colors"><Github className="h-6 w-6"/></a>
               <a href="#" className="text-gray-500 hover:text-[#FF96F5] transition-colors"><ExternalLink className="h-6 w-6"/></a>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
