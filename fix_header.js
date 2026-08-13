const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const replacement = `      {!isAdmin ? (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center space-x-2.5 bg-white text-teal-800 hover:text-[#008B9B] px-5 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer relative"
        >
          <span className="text-sm font-bold tracking-tight">Chat with us</span>
          <div className="w-8 h-8 rounded-full bg-[#E0F7FC] flex items-center justify-center text-[#00A8CC] group-hover:scale-110 transition-transform relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {unreadCount > 0 && !isChatOpen && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </button>
      </div>
      ) : null}

      {isChatOpen && <LiveSupportWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </>
  );
}`;

const regex = /\{\/\* FLOATING "CHAT WITH US" BUTTON \*\/\}\s*\{!isAdmin && \(\s*<div className="fixed bottom-6 right-6 z-40">[\s\S]*?<\/div>\s*\)\}\s*\{\/\* LIVE SUPPORT CHAT POPUP WIDGET \*\/\}\s*\{isChatOpen[\s\S]*?<\/LiveSupportWidget.*?\/>\}\s*<\/>\s*\);\s*\}/g;

const regex2 = /\{\/\* FLOATING "CHAT WITH US" BUTTON \*\/\}[\s\S]*?<\/LiveSupportWidget.*?\/>\}/g;

const regex3 = /\{!\s*isAdmin\s*&&\s*\([\s\S]*?<\/div>\s*\)\}\s*\{\/\* LIVE SUPPORT CHAT POPUP WIDGET \*\/\}\s*\{isChatOpen\s*&&\s*<LiveSupportWidget\s*isOpen=\{isChatOpen\}\s*onClose=\{\(\)\s*=>\s*setIsChatOpen\(false\)\}\s*\/>\}\s*<\/>\s*\);/g;

content = content.replace(regex3, replacement);

fs.writeFileSync('src/components/Header.tsx', content);

