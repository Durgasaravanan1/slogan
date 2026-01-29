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
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-white text-slate-900 px-4 md:px-8 py-8 md:py-12 relative">
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      {/* Centered Hero Section */}
      <div className="text-center mb-14 relative z-10 px-4 md:px-0">
        <span className="px-5 py-2 border-2 border-yellow-400 text-yellow-500 rounded-md text-sm font-semibold shadow-sm">
          AI-POWERED BRANDING
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold mt-8">
          SLOGAN<span className="text-cyan-500">GENIE</span>
          <span className={`text-cyan-500 transition-opacity duration-100 ${showUnderscore ? 'opacity-100' : 'opacity-0'}`}>_</span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg px-4 md:px-0">
          Create brand-perfect, conversion-focused slogans in seconds with AI.
        </p>

        <p className="mt-2 text-cyan-500 font-medium px-4 md:px-0">
          Enter your brand • Upload logo • Generate magic
        </p>
      </div>

      {/* Header with Export button - Moved below hero */}
      <div className="relative z-10 mb-8 px-4 md:px-0">
        <div className="flex justify-between items-center">
          <div></div> {/* Empty div for spacing */}
          
          <div className="flex gap-3">
            <button
              onClick={clearAll}
              className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
            >
              Clear All
            </button>
            <button
              onClick={exportAll}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export All
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto relative z-10 px-4 md:px-6">
        
        {/* LEFT PANEL - Added padding */}
        <div className="space-y-6 pl-2 pr-2 md:pl-0 md:pr-6">
          
          {/* Brand Details Card */}
          <div className="bg-white border-2 border-cyan-100 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition mx-2 md:mx-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <h2 className="text-cyan-700 font-bold text-lg">BRAND DETAILS</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                <input
                  className="w-full border-2 border-cyan-100 p-4 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition"
                  placeholder="Enter your brand name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Description</label>
                <textarea
                  className="w-full border-2 border-cyan-100 p-4 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition h-40"
                  placeholder="Describe your brand, values, and target audience..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                <div className="border-2 border-dashed border-cyan-200 rounded-xl p-6 text-center hover:border-cyan-400 transition cursor-pointer bg-cyan-50"
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
                      <img src={logoPreview} alt="Logo preview" className="mx-auto max-h-32 rounded-lg" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLogo();
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-cyan-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-cyan-600 font-medium">Click to upload logo</p>
                      <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Industry Selection */}
          <div className="bg-white border-2 border-cyan-100 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition mx-2 md:mx-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h2 className="text-blue-700 font-bold text-lg">INDUSTRY</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  className={`border-2 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center transition-all duration-300 ${
                    industry === item.name
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg scale-105 border-transparent"
                      : "border-cyan-100 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-2xl md:text-3xl mb-1 md:mb-2">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Style Selection */}
          <div className="bg-white border-2 border-yellow-100 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition mx-2 md:mx-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h2 className="text-yellow-700 font-bold text-lg">SLOGAN STYLES</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Bold","Minimal","Emotional","Witty","Playful","Professional"].map(styleItem => (
                <button
                  key={styleItem}
                  onClick={() => setStyle(styleItem)}
                  className={`border-2 rounded-xl p-3 md:p-4 text-center transition-all duration-300 ${
                    style === styleItem
                      ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg scale-105 border-transparent"
                      : "border-yellow-100 hover:border-yellow-300 hover:bg-yellow-50"
                  }`}
                >
                  <span className="font-medium">{styleItem}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <button
            onClick={generateSlogans}
            disabled={loading || !brand.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 mx-2 md:mx-0 ${
              loading || !brand.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <div className="flex items-center justify-center gap-3 text-white">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>GENERATE SLOGANS</span>
                </>
              )}
            </div>
          </button>
        </div>
        
        {/* RIGHT PANEL - Added padding */}
        <div className="pl-2 pr-2 md:pl-6 md:pr-0">
          {/* Tabs */}
          <div className="flex border-2 border-black rounded-xl overflow-hidden mb-6 shadow-lg mx-2 md:mx-0">
            <button
              onClick={() => setTab("generated")}
              className={`flex-1 py-4 font-bold transition-all ${
                tab === "generated" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-inner" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">✨</span>
                <span>GENERATED ({generated.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => setTab("saved")}
              className={`flex-1 py-4 font-bold transition-all ${
                tab === "saved" 
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-inner" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">⭐</span>
                <span>SAVED ({saved.length})</span>
              </div>
            </button>
          </div>
          
          {/* Content Area */}
          <div className="min-h-[600px] mx-2 md:mx-0">
            {tab === "generated" ? (
              <>
                {loading ? (
                  <div className="bg-gradient-to-br from-[#0b1628] to-[#0f1f3a] border-2 border-[#1e335a] rounded-2xl h-[600px] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-reverse"></div>
                      </div>
                    </div>
                    <p className="mt-6 text-cyan-300 text-lg font-medium">AI is generating slogans...</p>
                    <p className="text-cyan-100/60 text-sm mt-2">Analyzing your brand details</p>
                  </div>
                ) : !generated.length ? (
                  <div className="bg-gradient-to-br from-[#0b1628] to-[#0f1f3a] border-2 border-[#1e335a] rounded-2xl h-[600px] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                    <div className="text-7xl mb-6 opacity-40">💡</div>
                    <p className="text-cyan-300 text-lg font-medium mb-2">Ready to Generate Magic?</p>
                    <p className="text-cyan-100/60 text-center px-6 opacity-70 max-w-md">
                      Enter your brand details, select industry and style preferences, then click "Generate Slogans" to create AI-powered slogans tailored to your brand.
                    </p>
                    <div className="mt-6 text-sm text-gray-400">
                      <p>Current selection:</p>
                      <p className="text-cyan-300">
                        {brand ? `Brand: ${brand}` : "No brand name"} • 
                        {industry ? ` Industry: ${industry}` : " No industry"} • 
                        {style ? ` Style: ${style}` : " No style"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 pl-1">
                    {generated.map((slogan) => (
                      <div
                        key={slogan.id}
                        className="bg-white border-2 border-cyan-100 rounded-2xl p-5 shadow-lg hover:shadow-xl transition group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-lg text-gray-800 mb-2">{slogan.text}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">{slogan.industry}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-sm text-gray-600">{slogan.style}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  slogan.match > 90 ? 'bg-green-500' : 
                                  slogan.match > 80 ? 'bg-yellow-500' : 'bg-orange-500'
                                }`}></div>
                                <span className={`text-sm font-bold ${
                                  slogan.match > 90 ? 'text-green-600' : 
                                  slogan.match > 80 ? 'text-yellow-600' : 'text-orange-600'
                                }`}>
                                  {slogan.match}% match
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => copyText(slogan.text)}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </button>
                            
                            <button
                              onClick={() => saveText(slogan)}
                              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-xl font-medium hover:shadow-lg transition flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 pl-1">
                {!saved.length ? (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl h-[600px] flex flex-col items-center justify-center">
                    <div className="text-7xl mb-6 opacity-40">⭐</div>
                    <p className="text-yellow-700 text-lg font-medium mb-2">No saved slogans yet</p>
                    <p className="text-yellow-600/60 text-center px-6 opacity-70 max-w-md">
                      Save slogans you like by clicking the "Save" button on generated slogans. They will appear here for easy access.
                    </p>
                  </div>
                ) : (
                  saved.map((slogan, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">⭐</div>
                            <div>
                              <p className="font-bold text-lg text-gray-800 mb-2">{typeof slogan === 'object' ? slogan.text : slogan}</p>
                              {typeof slogan === 'object' && (
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">{slogan.industry}</span>
                                  <span className="text-sm text-gray-600">•</span>
                                  <span className="text-sm text-gray-600">{slogan.style}</span>
                                  <span className="text-sm text-gray-600">•</span>
                                  <span className="text-sm font-bold text-green-600">{slogan.match}% match</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => copyText(typeof slogan === 'object' ? slogan.text : slogan)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => removeSaved(i)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
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
      
      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-7xl mx-auto relative z-10 px-4 md:px-6">
        {[
          { title: "⚡ Lightning Fast", desc: "Generate 12+ slogans in under 2 seconds", color: "from-purple-500 to-pink-500" },
          { title: "🤖 AI-Powered", desc: "Smart analysis based on brand details", color: "from-cyan-500 to-blue-500" },
          { title: "🎯 Industry-Specific", desc: "Tailored to your business category", color: "from-green-500 to-emerald-500" },
          { title: "📈 Conversion-Focused", desc: "Designed to drive engagement", color: "from-orange-500 to-red-500" }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition group hover:scale-[1.02]"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
              <span className="text-2xl">{feature.title.split(" ")[0]}</span>
            </div>
            <p className="font-bold text-gray-800 text-lg">{feature.title.split(" ").slice(1).join(" ")}</p>
            <p className="text-gray-600 mt-2">{feature.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm relative z-10 px-4 md:px-0">
        <p>© 2024 SloganGenie AI • All slogans are AI-generated suggestions • Made with ❤️ for creators</p>
      </div>

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