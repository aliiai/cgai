import { Search, Grid3x3, ChevronDown, BookCopy, Navigation, ExternalLink, Bookmark } from 'lucide-react';
import { useState } from 'react';
import chatgpt from '../assets/images/chatgpt-logo.png';
import claude from '../assets/images/cloud-logo.png';
import grok from '../assets/images/grok-logo.png';
const Technologies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedPopularSection, setSelectedPopularSection] = useState<string | null>(null);

  return (
    <div className="technologies-page bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 text-center">
          الدليل الشامل للذكاء الاصطناعي
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 text-center">
          دليلك الشامل في تجميع وتصنيف أدوات الذكاء الاصطناعي
        </p>

        {/* Gradient Line */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div
            className="h-[7px] rounded-[50%]"
            style={{
              background: 'linear-gradient(to right, #FFB200 0%, #FFB200 50%, rgba(253, 177, 3, 0.3) 100%)'
            }}
          ></div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FDB103]" />
            <input
              type="text"
              placeholder="ابحث عن أداة AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-4 rounded-full border border-[#FFB200] bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FDB103]/20 transition-all text-base md:text-lg"
              dir="rtl"
            />
          </div>
        </div>
      </div>


      {/* Filters Section */}
      <div className="max-w-7xl mx-auto pb-12 ">
        <div className="flex flex-col lg:flex-row !gap-16 lg:gap-6 items-start justify-between lg:items-start">
          {/* Left Section: Most Used Technologies */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Grid3x3 className="w-4 h-4 text-gray-700" />
              <h3 className="text-xl font-semibold text-gray-800">الأقسام الاكثر شيوعا</h3>
            </div>
            <div className="flex flex-row-reverse gap-1">
              <button
                onClick={() => setSelectedPopularSection(selectedPopularSection === 'images' ? null : 'images')}
                className={`p-2 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap text-sm ${selectedPopularSection === 'images'
                  ? 'border-[#114C5A] text-gray-900'
                  : 'border-[#A8D5E2] text-gray-700'
                  }`}
              >
                <span className="text-sm">الصور والفيديو</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              </button>
              <button
                onClick={() => setSelectedPopularSection(selectedPopularSection === 'design' ? null : 'design')}
                className={`p-2 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap text-sm ${selectedPopularSection === 'design'
                  ? 'border-[#114C5A] text-gray-900'
                  : 'border-[#A8D5E2] text-gray-700'
                  }`}
              >
                <span className="text-sm">التصميم والإبداع</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              </button>
              <button
                onClick={() => setSelectedPopularSection(selectedPopularSection === 'chat' ? null : 'chat')}
                className={`p-2 rounded-full border transition-all flex items-center gap-1 whitespace-nowrap text-sm ${selectedPopularSection === 'chat'
                  ? 'border-[#114C5A] text-gray-900'
                  : 'border-[#A8D5E2] text-gray-700'
                  }`}
              >
                <span className="text-sm">الدردشة والمساعدين</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Middle Section: General Filters */}
          <div className="flex-1 flex items-center justify-center gap-4 lg:gap-6">
            {/* Paid Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <span className="text-sm text-gray-700">مدفوع</span>
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-6 h-6 rounded border border-[#FFE5B4] accent-[#FFB200] focus:ring-1 focus:ring-[#FFB200]/20 focus:ring-offset-0 cursor-pointer"
                style={{ accentColor: '#FFB200' }}
              />
            </label>

            {/* Section Dropdown */}
            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-4 py-4 pr-50 pl-5 rounded-full border border-[#FFE5B4] bg-white text-gray-400 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFB200]/20
                 focus:border-[#FFB200] text-sm"
                dir="rtl"
              >
                <option value="" disabled>اختر القسم</option>
                <option value="section1">قسم 1</option>
                <option value="section2">قسم 2</option>
                <option value="section3">قسم 3</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Free Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <span className="text-sm text-gray-700">مجاني</span>
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="w-6 h-6 rounded border border-[#FFE5B4] accent-[#FFB200] focus:ring-1 focus:ring-[#FFB200]/20 focus:ring-offset-0 cursor-pointer"
                style={{ accentColor: '#FFB200' }}
              />
            </label>
          </div>

          {/* Right Section: Most Popular Sections */}

          <div className="flex-shrink-0">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Grid3x3 className="w-4 h-4 text-gray-700" />
              <h3 className="text-base font-semibold text-gray-800">التقنيات الأكثر استخداما</h3>
            </div>
            <div className="flex flex-row-reverse gap-2">
              <button
                onClick={() => setSelectedTechnology(selectedTechnology === 'grok' ? null : 'grok')}
                className={`px-3 py-1 rounded-full border transition-all flex items-center gap-2 whitespace-nowrap ${selectedTechnology === 'grok'
                  ? 'border-[#FFB200] text-gray-900'
                  : 'border-[#FFE5B4] text-gray-700'
                  }`}
              >
                <img src={grok} alt="Grok" className="w-6 h-6 object-contain flex-shrink-0" />
                <span className="">Grok</span>
              </button>
              <button
                onClick={() => setSelectedTechnology(selectedTechnology === 'chatgpt' ? null : 'chatgpt')}
                className={`px-3 py-1 rounded-full border transition-all flex items-center gap-2 whitespace-nowrap ${selectedTechnology === 'chatgpt'
                  ? 'border-[#FFB200] text-gray-900'
                  : 'border-[#FFE5B4] text-gray-700'
                  }`}
              >
                <img src={chatgpt} alt="ChatGPT" className="w-6 h-6 object-contain flex-shrink-0" />
                <span className="text-sm">Chatgpt</span>
              </button>
              <button
                onClick={() => setSelectedTechnology(selectedTechnology === 'claude' ? null : 'claude')}
                className={`px-3 py-1 rounded-full border transition-all flex items-center gap-2 whitespace-nowrap ${selectedTechnology === 'claude'
                  ? 'border-[#FFB200] text-gray-900'
                  : 'border-[#FFE5B4] text-gray-700'
                  }`}
              >
                <img src={claude} alt="Claude" className="w-6 h-6 object-contain flex-shrink-0" />
                <span className="text-sm">claude ai</span>
              </button>
            </div>
          </div>

        </div>
      </div>




      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 ">
        <div className="relative rounded-[2.5rem] pb-6 border border-[#1B4D58] bg-white hover:shadow-lg overflow-hidden transition-shadow">
          {/* Header Icons */}
          <div className="absolute top-6 left-6 flex gap-3 z-10">
            <button className="w-10 h-10 rounded-2xl bg-[#ffedd5] flex items-center justify-center hover:bg-[#fed7aa] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.935 1.99146C11.9136 0.635133 13.9028 -0.0430253 14.9728 1.02693C16.0427 2.09689 15.3646 4.08618 14.0083 8.06476L13.0847 10.7741C12.0431 13.8296 11.5222 15.3573 10.6637 15.4838C10.4329 15.5178 10.194 15.4973 9.96558 15.424C9.11625 15.1513 8.66725 13.5405 7.76925 10.3189C7.57008 9.60434 7.4705 9.24701 7.24366 8.97409C7.17783 8.89492 7.10483 8.82193 7.02566 8.75609C6.75275 8.52926 6.39541 8.42967 5.68087 8.23051C2.45926 7.33251 0.848447 6.88351 0.575747 6.03415C0.50243 5.80579 0.481972 5.56687 0.515964 5.33605C0.642397 4.47752 2.17016 3.95671 5.22566 2.91507L7.935 1.99146Z" stroke="#141B34" />
              </svg>

            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#bae6fd] flex items-center justify-center hover:bg-[#a5dbf9] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.984V10.5896C2.5 7.56182 2.5 6.04792 3.41529 5.1073C4.33058 4.16669 5.80372 4.16669 8.75 4.16669C11.6962 4.16669 13.1694 4.16669 14.0847 5.1073C15 6.04792 15 7.56182 15 10.5896V14.984C15 16.9056 15 17.8664 14.3962 18.2103C13.227 18.8762 11.0337 16.6544 9.99217 15.9854C9.38808 15.5974 9.08608 15.4034 8.75 15.4034C8.41392 15.4034 8.11188 15.5974 7.50782 15.9854C6.46625 16.6544 4.27302 18.8762 3.10378 18.2103C2.5 17.8664 2.5 16.9056 2.5 14.984Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 1.66669H9.16667C13.095 1.66669 15.0592 1.66669 16.2796 2.88708C17.5 4.10746 17.5 6.07165 17.5 10V15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo Area */}
          <div className="relative h-64 mb-2 flex items-center justify-center p-4 pt-6">
            <img src={chatgpt} alt="ChatGPT" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          {/* Content Area */}
          <div className="text-right space-y-3 px-6">
            {/* Title */}
            <div className="flex items-center justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Chatgpt</h3>
              <ExternalLink className="w-8 h-8 text-[#1B4D58]" />
            </div>

            {/* Description */}
            <p className="text-[#6B7280] text-[15px] leading-[1.6] font-normal" dir="rtl">
              أداة ذكاء اصطناعي تساعدك على التفكير بوضوح، تطوير أفكارك، وإنجاز مهامك بسرعة وسهولة.
            </p>

            {/* Tag */}
            <div className="flex justify-start pt-3">
              <span className="bg-[#1B4D58] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#153d47] transition-colors cursor-pointer">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] pb-6 border border-[#1B4D58] bg-white hover:shadow-lg overflow-hidden transition-shadow">
          {/* Header Icons */}
          <div className="absolute top-6 left-6 flex gap-3 z-10">
            <button className="w-10 h-10 rounded-2xl bg-[#ffedd5] flex items-center justify-center hover:bg-[#fed7aa] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.935 1.99146C11.9136 0.635133 13.9028 -0.0430253 14.9728 1.02693C16.0427 2.09689 15.3646 4.08618 14.0083 8.06476L13.0847 10.7741C12.0431 13.8296 11.5222 15.3573 10.6637 15.4838C10.4329 15.5178 10.194 15.4973 9.96558 15.424C9.11625 15.1513 8.66725 13.5405 7.76925 10.3189C7.57008 9.60434 7.4705 9.24701 7.24366 8.97409C7.17783 8.89492 7.10483 8.82193 7.02566 8.75609C6.75275 8.52926 6.39541 8.42967 5.68087 8.23051C2.45926 7.33251 0.848447 6.88351 0.575747 6.03415C0.50243 5.80579 0.481972 5.56687 0.515964 5.33605C0.642397 4.47752 2.17016 3.95671 5.22566 2.91507L7.935 1.99146Z" stroke="#141B34" />
              </svg>

            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#bae6fd] flex items-center justify-center hover:bg-[#a5dbf9] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.984V10.5896C2.5 7.56182 2.5 6.04792 3.41529 5.1073C4.33058 4.16669 5.80372 4.16669 8.75 4.16669C11.6962 4.16669 13.1694 4.16669 14.0847 5.1073C15 6.04792 15 7.56182 15 10.5896V14.984C15 16.9056 15 17.8664 14.3962 18.2103C13.227 18.8762 11.0337 16.6544 9.99217 15.9854C9.38808 15.5974 9.08608 15.4034 8.75 15.4034C8.41392 15.4034 8.11188 15.5974 7.50782 15.9854C6.46625 16.6544 4.27302 18.8762 3.10378 18.2103C2.5 17.8664 2.5 16.9056 2.5 14.984Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 1.66669H9.16667C13.095 1.66669 15.0592 1.66669 16.2796 2.88708C17.5 4.10746 17.5 6.07165 17.5 10V15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo Area */}
          <div className="relative h-64 mb-2 flex items-center justify-center p-4 pt-6">
            <img src={chatgpt} alt="ChatGPT" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          {/* Content Area */}
          <div className="text-right space-y-3 px-6">
            {/* Title */}
            <div className="flex items-center justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Chatgpt</h3>
              <ExternalLink className="w-8 h-8 text-[#1B4D58]" />
            </div>

            {/* Description */}
            <p className="text-[#6B7280] text-[15px] leading-[1.6] font-normal" dir="rtl">
              أداة ذكاء اصطناعي تساعدك على التفكير بوضوح، تطوير أفكارك، وإنجاز مهامك بسرعة وسهولة.
            </p>

            {/* Tag */}
            <div className="flex justify-start pt-3">
              <span className="bg-[#1B4D58] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#153d47] transition-colors cursor-pointer">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] pb-6 border border-[#1B4D58] bg-white hover:shadow-lg overflow-hidden transition-shadow">
          {/* Header Icons */}
          <div className="absolute top-6 left-6 flex gap-3 z-10">
            <button className="w-10 h-10 rounded-2xl bg-[#ffedd5] flex items-center justify-center hover:bg-[#fed7aa] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.935 1.99146C11.9136 0.635133 13.9028 -0.0430253 14.9728 1.02693C16.0427 2.09689 15.3646 4.08618 14.0083 8.06476L13.0847 10.7741C12.0431 13.8296 11.5222 15.3573 10.6637 15.4838C10.4329 15.5178 10.194 15.4973 9.96558 15.424C9.11625 15.1513 8.66725 13.5405 7.76925 10.3189C7.57008 9.60434 7.4705 9.24701 7.24366 8.97409C7.17783 8.89492 7.10483 8.82193 7.02566 8.75609C6.75275 8.52926 6.39541 8.42967 5.68087 8.23051C2.45926 7.33251 0.848447 6.88351 0.575747 6.03415C0.50243 5.80579 0.481972 5.56687 0.515964 5.33605C0.642397 4.47752 2.17016 3.95671 5.22566 2.91507L7.935 1.99146Z" stroke="#141B34" />
              </svg>

            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#bae6fd] flex items-center justify-center hover:bg-[#a5dbf9] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.984V10.5896C2.5 7.56182 2.5 6.04792 3.41529 5.1073C4.33058 4.16669 5.80372 4.16669 8.75 4.16669C11.6962 4.16669 13.1694 4.16669 14.0847 5.1073C15 6.04792 15 7.56182 15 10.5896V14.984C15 16.9056 15 17.8664 14.3962 18.2103C13.227 18.8762 11.0337 16.6544 9.99217 15.9854C9.38808 15.5974 9.08608 15.4034 8.75 15.4034C8.41392 15.4034 8.11188 15.5974 7.50782 15.9854C6.46625 16.6544 4.27302 18.8762 3.10378 18.2103C2.5 17.8664 2.5 16.9056 2.5 14.984Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 1.66669H9.16667C13.095 1.66669 15.0592 1.66669 16.2796 2.88708C17.5 4.10746 17.5 6.07165 17.5 10V15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo Area */}
          <div className="relative h-64 mb-2 flex items-center justify-center p-4 pt-6">
            <img src={chatgpt} alt="ChatGPT" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          {/* Content Area */}
          <div className="text-right space-y-3 px-6">
            {/* Title */}
            <div className="flex items-center justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Chatgpt</h3>
              <ExternalLink className="w-8 h-8 text-[#1B4D58]" />
            </div>

            {/* Description */}
            <p className="text-[#6B7280] text-[15px] leading-[1.6] font-normal" dir="rtl">
              أداة ذكاء اصطناعي تساعدك على التفكير بوضوح، تطوير أفكارك، وإنجاز مهامك بسرعة وسهولة.
            </p>

            {/* Tag */}
            <div className="flex justify-start pt-3">
              <span className="bg-[#1B4D58] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#153d47] transition-colors cursor-pointer">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] pb-6 border border-[#1B4D58] bg-white hover:shadow-lg overflow-hidden transition-shadow">
          {/* Header Icons */}
          <div className="absolute top-6 left-6 flex gap-3 z-10">
            <button className="w-10 h-10 rounded-2xl bg-[#ffedd5] flex items-center justify-center hover:bg-[#fed7aa] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.935 1.99146C11.9136 0.635133 13.9028 -0.0430253 14.9728 1.02693C16.0427 2.09689 15.3646 4.08618 14.0083 8.06476L13.0847 10.7741C12.0431 13.8296 11.5222 15.3573 10.6637 15.4838C10.4329 15.5178 10.194 15.4973 9.96558 15.424C9.11625 15.1513 8.66725 13.5405 7.76925 10.3189C7.57008 9.60434 7.4705 9.24701 7.24366 8.97409C7.17783 8.89492 7.10483 8.82193 7.02566 8.75609C6.75275 8.52926 6.39541 8.42967 5.68087 8.23051C2.45926 7.33251 0.848447 6.88351 0.575747 6.03415C0.50243 5.80579 0.481972 5.56687 0.515964 5.33605C0.642397 4.47752 2.17016 3.95671 5.22566 2.91507L7.935 1.99146Z" stroke="#141B34" />
              </svg>

            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#bae6fd] flex items-center justify-center hover:bg-[#a5dbf9] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.984V10.5896C2.5 7.56182 2.5 6.04792 3.41529 5.1073C4.33058 4.16669 5.80372 4.16669 8.75 4.16669C11.6962 4.16669 13.1694 4.16669 14.0847 5.1073C15 6.04792 15 7.56182 15 10.5896V14.984C15 16.9056 15 17.8664 14.3962 18.2103C13.227 18.8762 11.0337 16.6544 9.99217 15.9854C9.38808 15.5974 9.08608 15.4034 8.75 15.4034C8.41392 15.4034 8.11188 15.5974 7.50782 15.9854C6.46625 16.6544 4.27302 18.8762 3.10378 18.2103C2.5 17.8664 2.5 16.9056 2.5 14.984Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 1.66669H9.16667C13.095 1.66669 15.0592 1.66669 16.2796 2.88708C17.5 4.10746 17.5 6.07165 17.5 10V15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo Area */}
          <div className="relative h-64 mb-2 flex items-center justify-center p-4 pt-6">
            <img src={chatgpt} alt="ChatGPT" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          {/* Content Area */}
          <div className="text-right space-y-3 px-6">
            {/* Title */}
            <div className="flex items-center justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Chatgpt</h3>
              <ExternalLink className="w-8 h-8 text-[#1B4D58]" />
            </div>

            {/* Description */}
            <p className="text-[#6B7280] text-[15px] leading-[1.6] font-normal" dir="rtl">
              أداة ذكاء اصطناعي تساعدك على التفكير بوضوح، تطوير أفكارك، وإنجاز مهامك بسرعة وسهولة.
            </p>

            {/* Tag */}
            <div className="flex justify-start pt-3">
              <span className="bg-[#1B4D58] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#153d47] transition-colors cursor-pointer">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] pb-6 border border-[#1B4D58] bg-white hover:shadow-lg overflow-hidden transition-shadow">
          {/* Header Icons */}
          <div className="absolute top-6 left-6 flex gap-3 z-10">
            <button className="w-10 h-10 rounded-2xl bg-[#ffedd5] flex items-center justify-center hover:bg-[#fed7aa] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.935 1.99146C11.9136 0.635133 13.9028 -0.0430253 14.9728 1.02693C16.0427 2.09689 15.3646 4.08618 14.0083 8.06476L13.0847 10.7741C12.0431 13.8296 11.5222 15.3573 10.6637 15.4838C10.4329 15.5178 10.194 15.4973 9.96558 15.424C9.11625 15.1513 8.66725 13.5405 7.76925 10.3189C7.57008 9.60434 7.4705 9.24701 7.24366 8.97409C7.17783 8.89492 7.10483 8.82193 7.02566 8.75609C6.75275 8.52926 6.39541 8.42967 5.68087 8.23051C2.45926 7.33251 0.848447 6.88351 0.575747 6.03415C0.50243 5.80579 0.481972 5.56687 0.515964 5.33605C0.642397 4.47752 2.17016 3.95671 5.22566 2.91507L7.935 1.99146Z" stroke="#141B34" />
              </svg>

            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#bae6fd] flex items-center justify-center hover:bg-[#a5dbf9] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.984V10.5896C2.5 7.56182 2.5 6.04792 3.41529 5.1073C4.33058 4.16669 5.80372 4.16669 8.75 4.16669C11.6962 4.16669 13.1694 4.16669 14.0847 5.1073C15 6.04792 15 7.56182 15 10.5896V14.984C15 16.9056 15 17.8664 14.3962 18.2103C13.227 18.8762 11.0337 16.6544 9.99217 15.9854C9.38808 15.5974 9.08608 15.4034 8.75 15.4034C8.41392 15.4034 8.11188 15.5974 7.50782 15.9854C6.46625 16.6544 4.27302 18.8762 3.10378 18.2103C2.5 17.8664 2.5 16.9056 2.5 14.984Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 1.66669H9.16667C13.095 1.66669 15.0592 1.66669 16.2796 2.88708C17.5 4.10746 17.5 6.07165 17.5 10V15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo Area */}
          <div className="relative h-64 mb-2 flex items-center justify-center p-4 pt-6">
            <img src={chatgpt} alt="ChatGPT" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          {/* Content Area */}
          <div className="text-right space-y-3 px-6">
            {/* Title */}
            <div className="flex items-center justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Chatgpt</h3>
              <ExternalLink className="w-8 h-8 text-[#1B4D58]" />
            </div>

            {/* Description */}
            <p className="text-[#6B7280] text-[15px] leading-[1.6] font-normal" dir="rtl">
              أداة ذكاء اصطناعي تساعدك على التفكير بوضوح، تطوير أفكارك، وإنجاز مهامك بسرعة وسهولة.
            </p>

            {/* Tag */}
            <div className="flex justify-start pt-3">
              <span className="bg-[#1B4D58] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#153d47] transition-colors cursor-pointer">
                AI Assistant
              </span>
            </div>
          </div>
        </div>
        <div className="relative rounded-[2.5rem] pb-6 border border-[#1B4D58] bg-white hover:shadow-lg overflow-hidden transition-shadow">
          {/* Header Icons */}
          <div className="absolute top-6 left-6 flex gap-3 z-10">
            <button className="w-10 h-10 rounded-2xl bg-[#ffedd5] flex items-center justify-center hover:bg-[#fed7aa] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.935 1.99146C11.9136 0.635133 13.9028 -0.0430253 14.9728 1.02693C16.0427 2.09689 15.3646 4.08618 14.0083 8.06476L13.0847 10.7741C12.0431 13.8296 11.5222 15.3573 10.6637 15.4838C10.4329 15.5178 10.194 15.4973 9.96558 15.424C9.11625 15.1513 8.66725 13.5405 7.76925 10.3189C7.57008 9.60434 7.4705 9.24701 7.24366 8.97409C7.17783 8.89492 7.10483 8.82193 7.02566 8.75609C6.75275 8.52926 6.39541 8.42967 5.68087 8.23051C2.45926 7.33251 0.848447 6.88351 0.575747 6.03415C0.50243 5.80579 0.481972 5.56687 0.515964 5.33605C0.642397 4.47752 2.17016 3.95671 5.22566 2.91507L7.935 1.99146Z" stroke="#141B34" />
              </svg>

            </button>
            <button className="w-10 h-10 rounded-2xl bg-[#bae6fd] flex items-center justify-center hover:bg-[#a5dbf9] transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 14.984V10.5896C2.5 7.56182 2.5 6.04792 3.41529 5.1073C4.33058 4.16669 5.80372 4.16669 8.75 4.16669C11.6962 4.16669 13.1694 4.16669 14.0847 5.1073C15 6.04792 15 7.56182 15 10.5896V14.984C15 16.9056 15 17.8664 14.3962 18.2103C13.227 18.8762 11.0337 16.6544 9.99217 15.9854C9.38808 15.5974 9.08608 15.4034 8.75 15.4034C8.41392 15.4034 8.11188 15.5974 7.50782 15.9854C6.46625 16.6544 4.27302 18.8762 3.10378 18.2103C2.5 17.8664 2.5 16.9056 2.5 14.984Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.5 1.66669H9.16667C13.095 1.66669 15.0592 1.66669 16.2796 2.88708C17.5 4.10746 17.5 6.07165 17.5 10V15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          {/* Logo Area */}
          <div className="relative h-64 mb-2 flex items-center justify-center p-4 pt-6">
            <img src={chatgpt} alt="ChatGPT" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          {/* Content Area */}
          <div className="text-right space-y-3 px-6">
            {/* Title */}
            <div className="flex items-center justify-start gap-3 mb-1">
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Chatgpt</h3>
              <ExternalLink className="w-8 h-8 text-[#1B4D58]" />
            </div>

            {/* Description */}
            <p className="text-[#6B7280] text-[15px] leading-[1.6] font-normal" dir="rtl">
              أداة ذكاء اصطناعي تساعدك على التفكير بوضوح، تطوير أفكارك، وإنجاز مهامك بسرعة وسهولة.
            </p>

            {/* Tag */}
            <div className="flex justify-start pt-3">
              <span className="bg-[#1B4D58] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-[#153d47] transition-colors cursor-pointer">
                AI Assistant
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Technologies;

