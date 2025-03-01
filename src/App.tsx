import React, { useEffect, useRef, useState } from 'react';
import { Coins, Rocket, TrendingUp, Users, DollarSign, CreditCard, Edit, User, Calendar, Sparkles } from 'lucide-react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cardColor, setCardColor] = useState('#0f0f0f'); // Default black color
  const [cardName, setCardName] = useState('YOUR NAME');
  const [cardNumber, setCardNumber] = useState('XXXX XXXX XXXX XXXX');
  const [cardExpiry, setCardExpiry] = useState('MM/YY');
  const [cardPattern, setCardPattern] = useState('geometric'); // Default pattern

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create dogecoin image
    const dogeImage = new Image();
    dogeImage.src = 'https://images.unsplash.com/photo-1622020457014-24a745608d1d?auto=format&fit=crop&w=100&h=100';

    // Coin properties
    const coins: {
      x: number;
      y: number;
      speed: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];

    // Create initial coins
    const createCoins = () => {
      const numberOfCoins = Math.floor(window.innerWidth / 50); // Adjust density
      
      for (let i = 0; i < numberOfCoins; i++) {
        coins.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * -1 - 100, // Start above the viewport
          speed: 1 + Math.random() * 3,
          size: 30 + Math.random() * 40,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update each coin
      coins.forEach((coin, index) => {
        ctx.save();
        ctx.translate(coin.x, coin.y);
        ctx.rotate(coin.rotation);
        
        if (dogeImage.complete) {
          ctx.drawImage(
            dogeImage, 
            -coin.size / 2, 
            -coin.size / 2, 
            coin.size, 
            coin.size
          );
        }
        
        ctx.restore();
        
        // Update position
        coin.y += coin.speed;
        coin.rotation += coin.rotationSpeed;
        
        // Reset if off screen
        if (coin.y > canvas.height + coin.size) {
          coin.y = -coin.size;
          coin.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    };

    dogeImage.onload = () => {
      createCoins();
      animate();
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Get pattern style based on selected pattern
  const getPatternStyle = () => {
    switch (cardPattern) {
      case 'geometric':
        return {
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(255, 215, 0, 0.15) 20%, transparent 20%),
            radial-gradient(circle at 0% 100%, rgba(255, 215, 0, 0.15) 20%, transparent 20%),
            linear-gradient(45deg, rgba(255, 215, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 215, 0, 0.05) 75%),
            linear-gradient(-45deg, rgba(255, 215, 0, 0.05) 25%, transparent 25%, transparent 75%, rgba(255, 215, 0, 0.05) 75%)
          `,
          backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0'
        };
      case 'waves':
        return {
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0px, rgba(255, 215, 0, 0.05) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(-45deg, rgba(255, 215, 0, 0.05) 0px, rgba(255, 215, 0, 0.05) 2px, transparent 2px, transparent 4px),
            linear-gradient(to right, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05))
          `,
          backgroundSize: '30px 30px, 30px 30px, 100% 100%'
        };
      case 'dots':
        return {
          backgroundImage: `
            radial-gradient(circle, rgba(255, 215, 0, 0.1) 1px, transparent 1px),
            radial-gradient(circle, rgba(255, 215, 0, 0.05) 2px, transparent 2px)
          `,
          backgroundSize: '30px 30px, 60px 60px',
          backgroundPosition: '0 0, 15px 15px'
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      {/* Background canvas for coin animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="text-yellow-400" size={32} />
            <span className="text-yellow-400">X</span>MONEY
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#tokenomics" className="hover:text-yellow-400 transition-colors">Tokenomics</a>
            <a href="#roadmap" className="hover:text-yellow-400 transition-colors">Roadmap</a>
            <a href="#xcard" className="hover:text-yellow-400 transition-colors">X Card</a>
            <a href="#community" className="hover:text-yellow-400 transition-colors">Community</a>
          </nav>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full transition-colors">
            Buy Now
          </button>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="text-yellow-400">X</span>MONEY
          </h1>
          <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto">
            The next generation memecoin that's taking the crypto world by storm
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors">
              Buy $XMONEY
            </button>
            <button className="bg-transparent border-2 border-yellow-400 hover:bg-yellow-400/10 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors">
              View Whitepaper
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16" id="about">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose <span className="text-yellow-400">X</span>MONEY?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-yellow-400 p-3 rounded-full w-fit mb-4">
                <Rocket className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Explosive Growth</h3>
              <p className="text-gray-300">Join early and experience the potential for massive returns as XMONEY takes off.</p>
            </div>
            <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-yellow-400 p-3 rounded-full w-fit mb-4">
                <Users className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Strong Community</h3>
              <p className="text-gray-300">Be part of a vibrant, engaged community of believers and supporters.</p>
            </div>
            <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-yellow-400 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Deflationary Model</h3>
              <p className="text-gray-300">Our tokenomics ensure that XMONEY becomes more scarce over time, driving value.</p>
            </div>
            <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
              <div className="bg-yellow-400 p-3 rounded-full w-fit mb-4">
                <Coins className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Meme Power</h3>
              <p className="text-gray-300">Harness the viral nature of memes with a coin designed for the social media age.</p>
            </div>
          </div>
        </section>

        {/* Tokenomics */}
        <section className="container mx-auto px-4 py-16 bg-blue-900/30 backdrop-blur-sm rounded-xl my-16" id="tokenomics">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tokenomics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1,000,000,000,000</div>
              <p className="text-xl">Total Supply</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">5%</div>
              <p className="text-xl">Transaction Fee</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">2%</div>
              <p className="text-xl">Burn Rate</p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 text-center">Token Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-800/50 p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-4">Initial Distribution</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Public Sale</span>
                    <span className="font-bold">40%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Liquidity Pool</span>
                    <span className="font-bold">30%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Team & Development</span>
                    <span className="font-bold">15%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Marketing</span>
                    <span className="font-bold">10%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Community Rewards</span>
                    <span className="font-bold">5%</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-800/50 p-6 rounded-xl">
                <h4 className="text-xl font-bold mb-4">Transaction Fee Breakdown</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Redistribution to Holders</span>
                    <span className="font-bold">2%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Automatic Burn</span>
                    <span className="font-bold">2%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Marketing & Development</span>
                    <span className="font-bold">1%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* X Card Creator Section */}
        <section className="container mx-auto px-4 py-16 bg-black/50 backdrop-blur-sm rounded-xl my-16" id="xcard">
          <div className="relative">
            {/* Gold accent elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-yellow-400 opacity-50 rounded-tl-xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-yellow-400 opacity-50 rounded-br-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl max-h-[80%] border border-yellow-400/20 rounded-3xl pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 relative">
              <span className="text-black bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">LUXURY</span> X CARD
            </h2>
            <p className="text-xl text-center max-w-3xl mx-auto mb-16 text-yellow-100/80">
              Exclusive access to the financial elite. Your personalized premium card awaits.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Card Preview */}
              <div className="flex justify-center">
                <div className="relative group perspective">
                  <div 
                    className="w-full max-w-md aspect-[1.586/1] rounded-xl p-6 flex flex-col justify-between shadow-[0_0_25px_rgba(255,215,0,0.2)] relative overflow-hidden transform transition-all duration-700 preserve-3d hover:rotate-y-12 hover:shadow-[0_0_35px_rgba(255,215,0,0.3)]"
                    style={{ 
                      background: `linear-gradient(135deg, ${cardColor} 0%, #000000 100%)`,
                      ...getPatternStyle()
                    }}
                  >
                    {/* Gold edge effect */}
                    <div className="absolute inset-0 rounded-xl border border-yellow-400/30"></div>
                    
                    {/* Reflective shine effect */}
                    <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-yellow-100/10 to-transparent rounded-xl transform translate-x-full group-hover:translate-x-0 transition-transform duration-1500"></div>
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="text-yellow-400 bg-black/30 p-1.5 rounded-full">
                          <DollarSign size={28} className="drop-shadow-[0_0_3px_rgba(255,215,0,0.5)]" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">X<span className="opacity-80">CARD</span></span>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                        <CreditCard className="text-black" size={24} />
                      </div>
                    </div>
                    
                    {/* Card Chip */}
                    <div className="relative z-10 mb-4 flex items-center gap-3">
                      <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md shadow-[0_0_10px_rgba(255,215,0,0.2)] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full opacity-30">
                          <div className="w-full h-[1px] bg-black/50 translate-y-1"></div>
                          <div className="w-full h-[1px] bg-black/50 translate-y-3"></div>
                          <div className="w-full h-[1px] bg-black/50 translate-y-5"></div>
                        </div>
                      </div>
                      <Sparkles size={16} className="text-yellow-400" />
                    </div>
                    
                    {/* Card Number */}
                    <div className="text-xl md:text-2xl font-mono font-medium tracking-wider mb-4 relative z-10 bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                      {cardNumber}
                    </div>
                    
                    {/* Card Footer */}
                    <div className="flex justify-between items-end relative z-10">
                      <div>
                        <p className="text-xs text-yellow-400/70 uppercase mb-1 font-semibold">Card Holder</p>
                        <p className="text-lg font-medium text-yellow-100">{cardName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-400/70 uppercase mb-1 font-semibold">Expires</p>
                        <p className="text-lg font-medium text-yellow-100">{cardExpiry}</p>
                      </div>
                    </div>
                    
                    {/* Holographic effect */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-full bg-gradient-to-br from-yellow-400/5 via-yellow-400/10 to-yellow-400/5 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* Card Customization Form */}
              <div className="bg-black/70 p-8 rounded-xl border border-yellow-900/30 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
                <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">Customize Your Premium Card</h3>
                
                {/* Color Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2 text-yellow-100">
                    <Edit size={16} className="text-yellow-400" /> Card Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['#0f0f0f', '#1a1a1a', '#0f172a', '#1e1b4b', '#3b0764', '#4a044e', '#450a0a'].map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full transition-all ${cardColor === color ? 'ring-4 ring-yellow-400 scale-110' : 'ring-2 ring-yellow-600/30'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setCardColor(color)}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Pattern Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2 text-yellow-100">
                    <Sparkles size={16} className="text-yellow-400" /> Card Pattern
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'geometric', name: 'Geometric' },
                      { id: 'waves', name: 'Waves' },
                      { id: 'dots', name: 'Dots' },
                      { id: 'none', name: 'None' }
                    ].map((pattern) => (
                      <button
                        key={pattern.id}
                        className={`px-4 py-2 rounded-full transition-all ${cardPattern === pattern.id ? 'bg-yellow-400 text-black font-medium' : 'bg-black/50 text-yellow-100 border border-yellow-900/30 hover:border-yellow-400/50'}`}
                        onClick={() => setCardPattern(pattern.id)}
                      >
                        {pattern.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-yellow-100">
                      <User size={16} className="text-yellow-400" /> Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="YOUR NAME"
                      maxLength={24}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-100 placeholder-yellow-900/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-yellow-100">
                      <CreditCard size={16} className="text-yellow-400" /> Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-100 placeholder-yellow-900/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-yellow-100">
                      <Calendar size={16} className="text-yellow-400" /> Expiration Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d/]/g, '');
                        if (value.length <= 5) {
                          setCardExpiry(value);
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-lg bg-black/50 border border-yellow-900/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-100 placeholder-yellow-900/50"
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <button className="w-full mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-4 px-8 rounded-full text-lg transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                  Claim Your Premium X Card
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="container mx-auto px-4 py-16" id="roadmap">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Roadmap</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-yellow-400"></div>
            
            {/* Phase 1 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-black font-bold">1</span>
              </div>
              <div className="ml-auto mr-8 md:mr-auto md:ml-8 md:w-1/2 bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">Phase 1: Launch</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Website and social media launch</li>
                  <li>Community building</li>
                  <li>Initial token distribution</li>
                  <li>Listing on DEX</li>
                  <li>First marketing campaign</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 2 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-black font-bold">2</span>
              </div>
              <div className="mr-auto ml-8 md:ml-auto md:mr-8 md:w-1/2 bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">Phase 2: Growth</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>CoinMarketCap and CoinGecko listings</li>
                  <li>Community expansion</li>
                  <li>Partnerships with influencers</li>
                  <li>Enhanced marketing efforts</li>
                  <li>Development of XMONEY merchandise</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 3 */}
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-black font-bold">3</span>
              </div>
              <div className="ml-auto mr-8 md:mr-auto md:ml-8 md:w-1/2 bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">Phase 3: Expansion</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>CEX listings</li>
                  <li>XMONEY NFT collection</li>
                  <li>Cross-chain integration</li>
                  <li>Global marketing campaign</li>
                  <li>Community governance implementation</li>
                </ul>
              </div>
            </div>
            
            {/* Phase 4 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-black font-bold">4</span>
              </div>
              <div className="mr-auto ml-8 md:ml-auto md:mr-8 md:w-1/2 bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">Phase 4: Ecosystem</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>XMONEY DeFi platform</li>
                  <li>Mobile wallet app</li>
                  <li>Strategic partnerships</li>
                  <li>Real-world use cases</li>
                  <li>Metaverse integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="container mx-auto px-4 py-16 bg-blue-900/30 backdrop-blur-sm rounded-xl my-16" id="community">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <a href="#" className="bg-blue-800/50 hover:bg-blue-700/50 p-6 rounded-xl text-center transition-colors">
              <div className="text-4xl mb-2">🐦</div>
              <h3 className="text-xl font-bold">Twitter</h3>
            </a>
            <a href="#" className="bg-blue-800/50 hover:bg-blue-700/50 p-6 rounded-xl text-center transition-colors">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="text-xl font-bold">Telegram</h3>
            </a>
            <a href="#" className="bg-blue-800/50 hover:bg-blue-700/50 p-6 rounded-xl text-center transition-colors">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="text-xl font-bold">Discord</h3>
            </a>
            <a href="#" className="bg-blue-800/50 hover:bg-blue-700/50 p-6 rounded-xl text-center transition-colors">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-xl font-bold">Reddit</h3>
            </a>
          </div>
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Updates</h3>
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-l-full bg-blue-800/50 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button 
                  type="submit" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-r-full transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-950 py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center gap-2 text-2xl font-bold mb-4 md:mb-0">
                <DollarSign className="text-yellow-400" size={32} />
                <span className="text-yellow-400">X</span>MONEY
              </div>
              <div className="flex gap-4">
                <a href="#" className="hover:text-yellow-400 transition-colors">Twitter</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Telegram</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Discord</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Reddit</a>
              </div>
            </div>
            <div className="border-t border-blue-800 pt-8 text-center text-sm text-gray-400">
              <p className="mb-2">© 2025 XMONEY. All rights reserved.</p>
              <p>XMONEY is a meme coin with no intrinsic value or financial return expectation. This website is for entertainment purposes only.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;