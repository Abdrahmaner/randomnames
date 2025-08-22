import React, { useState, useCallback, useEffect } from 'react';
import { Copy, RefreshCw, Search, Sparkles, Globe, Clipboard } from 'lucide-react';

interface Domain {
  name: string;
  id: string;
}

function App() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load words from public/prefix.json
  useEffect(() => {
    fetch('/prefix.json')
      .then(res => res.json())
      .then(data => setKeywords(data))
      .catch(err => console.error("Error loading prefix.json:", err));
  }, []);

  const generateDomains = useCallback(() => {
    if (keywords.length === 0) return;

    setIsGenerating(true);

    setTimeout(() => {
      const newDomains: Domain[] = [];
      const used = new Set<string>();

      while (newDomains.length < 100) {
        const word1 = keywords[Math.floor(Math.random() * keywords.length)];
        const word2 = keywords[Math.floor(Math.random() * keywords.length)];

        if (word1 !== word2) {
          const combination = `${word1}${word2}`;
          if (!used.has(combination.toLowerCase())) {
            used.add(combination.toLowerCase());
            newDomains.push({
              name: `${combination.toLowerCase()}.com`,
              id: `${combination}-${Date.now()}-${Math.random()}`
            });
          }
        }
      }

      setDomains(newDomains);
      setIsGenerating(false);
    }, 800);
  }, [keywords]);

  const copyToClipboard = async (domain: string, id: string) => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert(`Please manually copy: ${domain}`);
    }
  };

  const copyAllDomains = async () => {
    const domainsText = filteredDomains.map(domain => domain.name).join('\n');
    try {
      await navigator.clipboard.writeText(domainsText);
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy all domains:', err);
      alert(`Please manually copy. Total domains: ${filteredDomains.length}`);
    }
  };

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (keywords.length > 0) generateDomains();
  }, [keywords, generateDomains]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center pt-16 pb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-2xl shadow-xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Domain Generator 2025
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover powerful .com domain combinations using your custom word list from prefix.json. 
            Perfect for AI startups, fintech, sustainability, and next-gen businesses.
          </p>
        </header>

        {/* Controls */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search domains..."
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={copyAllDomains}
                disabled={filteredDomains.length === 0}
                className={`flex items-center gap-3 px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  allCopied
                    ? 'bg-green-500 text-white scale-110'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                }`}
              >
                <Clipboard className="w-5 h-5" />
                {allCopied ? 'All Copied!' : `Copy All (${filteredDomains.length})`}
              </button>
              
              <button
                onClick={generateDomains}
                disabled={isGenerating}
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? 'Generating...' : 'Generate New Domains'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        {domains.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 mb-6">
            <p className="text-gray-300 text-lg">
              Showing <span className="text-cyan-400 font-semibold">{filteredDomains.length}</span> domains
              {searchTerm && (
                <span className="text-gray-400"> for "{searchTerm}"</span>
              )}
            </p>
          </div>
        )}

        {/* Domain Grid */}
        <main className="max-w-6xl mx-auto px-6 pb-16">
          {isGenerating && domains.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-6">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              </div>
              <p className="text-xl text-gray-300">Generating your domain combinations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDomains.map((domain, index) => (
                <div
                  key={domain.id}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 20}ms`,
                    animation: isGenerating ? 'none' : 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-lg truncate group-hover:text-cyan-300 transition-colors duration-200">
                        {domain.name}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(domain.name, domain.id)}
                      className={`ml-3 p-2 rounded-lg transition-all duration-200 ${
                        copiedId === domain.id
                          ? 'bg-green-500 text-white scale-110'
                          : 'bg-white/10 text-gray-300 hover:bg-cyan-500 hover:text-white hover:scale-110'
                      }`}
                      title={copiedId === domain.id ? 'Copied!' : 'Copy to clipboard'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400">
            Built for the future of domain discovery • Using prefix.json
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
