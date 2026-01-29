import { useState, useEffect, useRef } from "react";

export default function Slogan() {
  const [brand, setBrand] = useState("");
  const [desc, setDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("");
  const [generated, setGenerated] = useState([]);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState("generated");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showUnderscore, setShowUnderscore] = useState(true);
  const fileInputRef = useRef(null);

  // Faster underscore animation - 300ms
  useEffect(() => {
    const interval = setInterval(() => {
      setShowUnderscore(prev => !prev);
    }, 300); // Faster blink (300ms)
    
    return () => clearInterval(interval);
  }, []);

  // AI model simulation - generates slogans based on input
  const generateSlogans = () => {
    if (!brand.trim()) {
      alert("Please enter a brand name");
      return;
    }

    setLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const baseSlogans = [
        "Excellence in Design",
        "Create. Inspire. Deliver.",
        "Ideas Come Alive",
        "Strategic Creative Partner",
        "Professional Creative Solutions",
        "Artistry Meets Purpose",
        "Creating Magic, One Pixel at a Time",
        "Design That Speaks",
        "Where Imagination Takes Flight",
        "Innovation Redefined",
        "Beyond Ordinary Design",
        "Crafting Digital Experiences",
        "Vision to Reality",
        "The Future of Creativity",
        "Design with Purpose"
      ];

      // Filter based on industry and style
      let filteredSlogans = [...baseSlogans];
      
      if (industry) {
        const industrySlogans = {
          "Technology": [
            "Tech That Transforms",
            "Innovate. Integrate. Elevate.",
            "Digital Solutions for Tomorrow",
            "Code Your Vision",
            "Tech with Purpose"
          ],
          "Finance": [
            "Secure Your Future",
            "Financial Freedom Redefined",
            "Smart Money Solutions",
            "Wealth. Wisdom. Wins.",
            "Bank on Excellence"
          ],
          "Healthcare": [
            "Care That Heals",
            "Health First, Always",
            "Compassionate Care, Advanced Medicine",
            "Your Wellness Journey Starts Here",
            "Healing with Heart"
          ],
          "Education": [
            "Learn. Grow. Succeed.",
            "Knowledge Opens Doors",
            "Educate to Elevate",
            "Future Leaders Start Here",
            "Ignite the Spark of Learning"
          ],
          "Retail": [
            "Shop the Experience",
            "Quality You Can Trust",
            "Retail Therapy Redefined",
            "Style Meets Substance",
            "Your Perfect Purchase Awaits"
          ]
        };
        
        filteredSlogans = filteredSlogans.concat(industrySlogans[industry] || []);
      }

      // Apply style filters
      if (style) {
        const styleMap = {
          "Bold": ["Dare to Be Different", "Unapologetically You", "Bold Moves Only"],
          "Minimal": ["Simple. Effective.", "Less is More", "Clean & Clear"],
          "Emotional": ["Feel the Difference", "Heart-Driven Design", "Emotion in Motion"],
          "Witty": ["Smarter, Not Harder", "Think Outside the Box", "Clever by Design"],
          "Playful": ["Fun Meets Function", "Playful Innovation", "Joy in Every Detail"]
        };
        
        filteredSlogans = filteredSlogans.concat(styleMap[style] || []);
      }

      // Add brand name to some slogans
      const personalizedSlogans = filteredSlogans.map(slogan => {
        if (Math.random() > 0.7 && brand.trim()) {
          return slogan.replace(/\.$/, ` for ${brand}`) + (slogan.endsWith('.') ? '' : '.');
        }
        return slogan;
      });

      // Shuffle and limit to 12 slogans
      const shuffled = [...personalizedSlogans]
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);

      // Add match percentages
      const withPercentages = shuffled.map((slogan, index) => ({
        text: slogan,
        match: Math.floor(75 + Math.random() * 25), // 75-100%
        id: Date.now() + index,
        industry: industry || "General",
        style: style || "Standard"
      }));

      setGenerated(withPercentages);
      setLoading(false);
      setTab("generated");
    }, 1500);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    // Visual feedback
    const originalText = document.activeElement.textContent;
    document.activeElement.textContent = "COPIED!";
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.textContent = originalText;
      }
    }, 1000);
  };

  const saveText = (sloganObj) => {
    if (!saved.find(item => item.text === sloganObj.text)) {
      setSaved([...saved, sloganObj]);
    }
  };

  const removeSaved = (index) => {
    const newSaved = [...saved];
    newSaved.splice(index, 1);
    setSaved(newSaved);
  };

  const exportAll = () => {
    const slogansToExport = tab === "generated" ? generated : saved;
    
    if (slogansToExport.length === 0) {
      alert("No slogans to export!");
      return;
    }

    const content = slogansToExport
      .map((slogan, index) => {
        if (typeof slogan === 'object') {
          return `${index + 1}. ${slogan.text} (Match: ${slogan.match}%, Industry: ${slogan.industry}, Style: ${slogan.style})`;
        }
        return `${index + 1}. ${slogan}`;
      })
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slogans_${brand || 'mybrand'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }
      
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clear all button functionality
  const clearAll = () => {
    setGenerated([]);
    setSaved([]);
    setBrand("");
    setDesc("");
    setIndustry("");
    setStyle("");
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-white text-slate-900 px-4 md:px-6 py-6 md:py-8 relative">
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      
      {/* Centered Hero Section - Reduced padding & boosted */}
      <div className="text-center mb-10 relative z-10">
        <span className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-bold shadow-md shadow-blue-500/30 inline-block mb-6">
          ✨ AI-POWERED BRANDING ✨
        </span>

        <div className="mb-6 text-center">
  <h1 className="text-5xl md:text-6xl font-black mt-2 tracking-tight">
    SLOGAN
    <span className="text-cyan-500">GENIE</span>
    <span
      className={`bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent transition-opacity duration-100 ${
        showUnderscore ? "opacity-100" : "opacity-0"
      }`}
    >
      _
    </span>
  </h1>
</div>

        <p className="mt-2 text-gray-700 text-lg font-medium mb-5 max-w-xl mx-auto">
          Create <span className="text-cyan-600 font-bold">brand-perfect</span>, <span className="text-blue-600 font-bold">conversion-focused</span> slogans in seconds with AI.
        </p>

        <p className="mt-3 text-gray-600 font-medium mb-8">
          <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg mr-2 shadow-sm">Enter your brand</span> • 
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg mx-2 shadow-sm">Upload logo</span> • 
          <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg ml-2 shadow-sm">Generate magic</span>
        </p>

        {/* Stats Section - Reduced padding */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-6 mb-4">
          <div className="text-center px-4">
            <div className="text-2xl md:text-3xl font-black text-cyan-600">10.000+</div>
            <div className="text-gray-600 text-xs font-semibold tracking-wider">FOUNDERS</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl md:text-3xl font-black text-blue-600">50+</div>
            <div className="text-gray-600 text-xs font-semibold tracking-wider">STYLES</div>
          </div>
          <div className="text-center px-4">
            <div className="text-2xl md:text-3xl font-black text-purple-600">12</div>
            <div className="text-gray-600 text-xs font-semibold tracking-wider">INDUSTRIES</div>
          </div>
        </div>
      </div>

      {/* Header with Export button - Reduced padding */}
      <div className="relative z-10 mb-6">
        <div className="flex justify-between items-center">
          <div></div> {/* Empty div for spacing */}
          
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition text-sm"
            >
              Clear All
            </button>
            <button
              onClick={exportAll}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto relative z-10">
        
        {/* LEFT PANEL - Reduced padding */}
        <div className="space-y-5">
          
          {/* Brand Details Card */}
          <div className="bg-white border-2 border-cyan-100 rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full"></div>
              <h2 className="text-cyan-700 font-bold text-base">BRAND DETAILS</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name *</label>
                <input
                  className="w-full border-2 border-cyan-100 p-3 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-200 outline-none transition"
                  placeholder="Enter your brand name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Description</label>
                <textarea
                  className="w-full border-2 border-cyan-100 p-3 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-200 outline-none transition h-36"
                  placeholder="Describe your brand, values, and target audience..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo Upload</label>
                <div className="border-2 border-dashed border-cyan-200 rounded-lg p-4 text-center hover:border-cyan-400 transition cursor-pointer bg-cyan-50"
                  onClick={() => fileInputRef.current?.click()}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Logo preview" className="mx-auto max-h-28 rounded" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLogo();
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-cyan-600 font-medium text-sm">Click to upload logo</p>
                      <p className="text-gray-400 text-xs mt-0.5">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Industry Selection */}
          <div className="bg-white border-2 border-blue-100 rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <h2 className="text-blue-700 font-bold text-base">INDUSTRY</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {name: "Technology", icon: "💻"},
                {name: "Finance", icon: "💰"},
                {name: "Healthcare", icon: "🏥"},
                {name: "Education", icon: "🎓"},
                {name: "Retail", icon: "🛍️"},
                {name: "Creative", icon: "🎨"},
                {name: "Real Estate", icon: "🏠"},
                {name: "Fitness", icon: "💪"},
                {name: "E-Commerce", icon: "🛒"}
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => setIndustry(item.name)}
                  className={`border-2 rounded-lg p-2.5 flex flex-col items-center justify-center transition-all duration-200 ${
                    industry === item.name
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm scale-105 border-transparent"
                      : "border-blue-100 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-xl mb-0.5">{item.icon}</span>
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Style Selection */}
          <div className="bg-white border-2 border-yellow-100 rounded-xl p-5 md:p-6 shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <h2 className="text-yellow-700 font-bold text-base">SLOGAN STYLES</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Bold","Minimal","Emotional","Witty","Playful","Professional"].map(styleItem => (
                <button
                  key={styleItem}
                  onClick={() => setStyle(styleItem)}
                  className={`border-2 rounded-lg p-2.5 text-center transition-all duration-200 ${
                    style === styleItem
                      ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-sm scale-105 border-transparent"
                      : "border-yellow-100 hover:border-yellow-300 hover:bg-yellow-50"
                  }`}
                >
                  <span className="text-sm font-medium">{styleItem}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <button
            onClick={generateSlogans}
            disabled={loading || !brand.trim()}
            className={`w-full py-3.5 rounded-lg font-bold text-base shadow-md transition-all duration-200 ${
              loading || !brand.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-white">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm">GENERATE SLOGANS</span>
                </>
              )}
            </div>
          </button>
        </div>
        
        {/* RIGHT PANEL - Reduced padding */}
        <div>
          {/* Tabs */}
          <div className="flex border-2 border-black rounded-lg overflow-hidden mb-5 shadow-md">
            <button
              onClick={() => setTab("generated")}
              className={`flex-1 py-3.5 font-bold transition-all text-sm ${
                tab === "generated" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-inner" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>✨</span>
                <span>GENERATED ({generated.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => setTab("saved")}
              className={`flex-1 py-3.5 font-bold transition-all text-sm ${
                tab === "saved" 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-inner" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>⭐</span>
                <span>SAVED ({saved.length})</span>
              </div>
            </button>
          </div>
          
          {/* Content Area */}
          <div className="min-h-[550px]">
            {tab === "generated" ? (
              <>
                {loading ? (
                  <div className="bg-gradient-to-br from-[#0b1628] to-[#0f1f3a] border-2 border-[#1e335a] rounded-xl h-[550px] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-reverse"></div>
                      </div>
                    </div>
                    <p className="mt-5 text-cyan-300 text-base font-medium">AI is generating slogans...</p>
                    <p className="text-cyan-100/60 text-xs mt-1">Analyzing your brand details</p>
                  </div>
                ) : !generated.length ? (
                  <div className="bg-gradient-to-br from-[#0b1628] to-[#0f1f3a] border-2 border-[#1e335a] rounded-xl h-[550px] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                    <div className="text-6xl mb-5 opacity-40">💡</div>
                    <p className="text-cyan-300 text-base font-medium mb-2">Ready to Generate Magic?</p>
                    <p className="text-cyan-100/60 text-center px-5 opacity-70 max-w-md text-sm">
                      Enter your brand details, select industry and style preferences, then click "Generate Slogans" to create AI-powered slogans tailored to your brand.
                    </p>
                    <div className="mt-5 text-xs text-gray-400">
                      <p className="mb-1">Current selection:</p>
                      <p className="text-cyan-300">
                        {brand ? `Brand: ${brand}` : "No brand name"} • 
                        {industry ? ` Industry: ${industry}` : " No industry"} • 
                        {style ? ` Style: ${style}` : " No style"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
                    {generated.map((slogan) => (
                      <div
                        key={slogan.id}
                        className="bg-white border-2 border-cyan-100 rounded-xl p-4 shadow-md hover:shadow-lg transition group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-base text-gray-800 mb-1.5">{slogan.text}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-gray-600">{slogan.industry}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-xs text-gray-600">{slogan.style}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  slogan.match > 90 ? 'bg-green-500' : 
                                  slogan.match > 80 ? 'bg-yellow-500' : 'bg-orange-500'
                                }`}></div>
                                <span className={`text-xs font-bold ${
                                  slogan.match > 90 ? 'text-green-600' : 
                                  slogan.match > 80 ? 'text-yellow-600' : 'text-orange-600'
                                }`}>
                                  {slogan.match}% match
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1.5 ml-3">
                            <button
                              onClick={() => copyText(slogan.text)}
                              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:shadow transition flex items-center gap-1 text-xs"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </button>
                            
                            <button
                              onClick={() => saveText(slogan)}
                              className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-lg font-medium hover:shadow transition flex items-center gap-1 text-xs"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
                {!saved.length ? (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl h-[550px] flex flex-col items-center justify-center">
                    <div className="text-6xl mb-5 opacity-40">⭐</div>
                    <p className="text-yellow-700 text-base font-medium mb-2">No saved slogans yet</p>
                    <p className="text-yellow-600/60 text-center px-5 opacity-70 max-w-md text-sm">
                      Save slogans you like by clicking the "Save" button on generated slogans. They will appear here for easy access.
                    </p>
                  </div>
                ) : (
                  saved.map((slogan, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 shadow-md hover:shadow-lg transition group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <div className="text-xl mt-0.5">⭐</div>
                            <div>
                              <p className="font-bold text-base text-gray-800 mb-1.5">{typeof slogan === 'object' ? slogan.text : slogan}</p>
                              {typeof slogan === 'object' && (
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-600">{slogan.industry}</span>
                                  <span className="text-xs text-gray-600">•</span>
                                  <span className="text-xs text-gray-600">{slogan.style}</span>
                                  <span className="text-xs text-gray-600">•</span>
                                  <span className="text-xs font-bold text-green-600">{slogan.match}% match</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 ml-3">
                          <button
                            onClick={() => copyText(typeof slogan === 'object' ? slogan.text : slogan)}
                            className="px-2.5 py-1 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition text-xs"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => removeSaved(i)}
                            className="px-2.5 py-1 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Features - Reduced padding */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 max-w-7xl mx-auto relative z-10">
        {[
          { title: "Lightning Fast", desc: "Generate 12+ slogans in under 2 seconds", color: "bg-cyan-100 text-cyan-700", icon: "⚡" },
          { title: "AI-Powered", desc: "Smart analysis based on brand details", color: "bg-blue-100 text-blue-700", icon: "🤖" },
          { title: "Industry-Specific", desc: "Tailored to your business category", color: "bg-green-100 text-green-700", icon: "🎯" },
          { title: "Conversion-Focused", desc: "Designed to drive engagement", color: "bg-orange-100 text-orange-700", icon: "📈" }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-md hover:shadow-lg transition group"
          >
            <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-3 group-hover:scale-105 transition`}>
              <span className="text-xl">{feature.icon}</span>
            </div>
            <p className="font-bold text-gray-800 text-base mb-1">{feature.title}</p>
            <p className="text-gray-600 text-xs">{feature.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Footer - Reduced padding */}
   

      {/* Custom CSS for reverse spin animation */}
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
}