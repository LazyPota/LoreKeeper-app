import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const TypewriterText = ({ text, className }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.02 } },
  };
  const child = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -5 },
  };

  return (
    <motion.div className={className} variants={container} initial="hidden" animate="visible">
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>{letter === ' ' ? '\u00A0' : letter}</motion.span>
      ))}
    </motion.div>
  );
};

const LoadingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", repeatType: "reverse" }}
    className="text-arcane-500 flex items-center mt-2"
  >
    <span className="mr-2">{'>'}</span> Neural link decrypting...
  </motion.div>
);

function App() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('terminal'); 
  const [messages, setMessages] = useState([
    { id: 1, sender: 'SYS', text: 'Initialization complete. Welcome, Author. The archives are open.', isMarkdown: false }
  ]);
  
  const [loreEntries, setLoreEntries] = useState([]);
  const [newLoreName, setNewLoreName] = useState('');
  const [newLoreDescription, setNewLoreDescription] = useState('');

  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (activeTab !== 'terminal') {
      fetchLore();
    }
  }, [activeTab]);

  const fetchLore = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/lore/${activeTab}`);
      const data = await response.json();
      setLoreEntries(data);
    } catch (error) {
      console.error("Failed to fetch database entries", error);
    }
  };

  const handleCreateLore = async (e) => {
    e.preventDefault();
    if (!newLoreName.trim() || !newLoreDescription.trim()) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/lore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeTab,
          name: newLoreName,
          description: newLoreDescription
        }),
      });
      
      if (response.ok) {
        setNewLoreName('');
        setNewLoreDescription('');
        fetchLore();
      }
    } catch (error) {
      console.error("Failed to save entry", error);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && inputText.trim() !== '' && !isTyping) {
      const userText = inputText;
      setInputText('');
      
      const newUserMsg = { id: Date.now(), sender: 'AUTHOR', text: userText, isMarkdown: false };
      setMessages((prev) => [...prev, newUserMsg]);
      
      setIsTyping(true);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_message: userText }),
        });

        const data = await response.json();

        setIsTyping(false);
        const botResponse = { 
          id: Date.now() + 1, 
          sender: data.role, 
          text: data.content,
          isMarkdown: true 
        };
        setMessages((prev) => [...prev, botResponse]);

      } catch (error) {
        setIsTyping(false);
        const errorResponse = {
          id: Date.now() + 1,
          sender: 'SYS',
          text: `[CRITICAL ERROR]: Neural link severed. Ensure the Python server is running.`,
          isMarkdown: false
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-arcane-900 p-6 flex items-center justify-center font-mono">
      <div className="w-full max-w-6xl h-[85vh] bg-arcane-800 border border-arcane-500/30 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.15)] flex overflow-hidden">
        
        <div className="w-1/4 border-r border-arcane-500/30 p-4 flex flex-col bg-[#0d0d14]">
          <h2 
            onClick={() => setActiveTab('terminal')}
            className={`font-bold text-xl mb-6 tracking-widest uppercase cursor-pointer transition-colors ${activeTab === 'terminal' ? 'text-arcane-500 text-glow' : 'text-gray-500 hover:text-arcane-400'}`}
          >
            // Lore_Archives
          </h2>
          
          <div className="text-xs text-arcane-500 mb-2 border-b border-arcane-500/30 pb-1">DATABASES</div>
          <ul className="space-y-3 text-sm flex-grow">
            {['characters', 'locations', 'magic_systems'].map((tab) => (
              <li 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer transition-all duration-200 flex items-center ${activeTab === tab ? 'text-arcane-400 ml-2' : 'text-gray-500 hover:text-gray-300 hover:ml-1'}`}
              >
                <span className="mr-2">{activeTab === tab ? '▶' : '>'}</span> {tab}.db
              </li>
            ))}
          </ul>

          <div className="text-xs text-arcane-500/50 mt-auto border-t border-arcane-500/30 pt-2">
            STATUS: {isTyping ? 'PROCESSING...' : 'IDLE'}<br/>
            MODEL: PHI-3_MINI
          </div>
        </div>

        <div className="w-3/4 flex flex-col p-6 relative overflow-hidden">
          
          <div className="border-b border-arcane-500/30 pb-4 mb-4 flex justify-between items-end flex-shrink-0">
            <div>
              <h1 className="text-2xl text-gray-100 font-bold capitalize">
                {activeTab === 'terminal' ? 'Terminal Interface' : `Database: ${activeTab}`}
              </h1>
              <p className="text-xs text-arcane-500">
                {activeTab === 'terminal' ? 'Awaiting input sequence...' : `Viewing records for ${activeTab}...`}
              </p>
            </div>
          </div>

          {activeTab === 'terminal' ? (
            <>
              <div className="flex-grow overflow-y-auto mb-4 space-y-6 pr-4 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    <span className={`text-xs mb-1 font-bold tracking-wider ${msg.sender === 'AUTHOR' ? 'text-arcane-400' : 'text-arcane-500'}`}>
                      [{msg.sender}]
                    </span>
                    
                    <div className="text-gray-300 bg-black/20 p-3 rounded border border-white/5">
                      {msg.isMarkdown ? (
                        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-arcane-500/30 max-w-none">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : msg.sender === 'AUTHOR' ? (
                        <span>{msg.text}</span>
                      ) : (
                        <TypewriterText text={msg.text} className="inline-block" />
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && <LoadingIndicator />}
                
                <div ref={chatEndRef} />
              </div>

              <div className="mt-auto flex items-center bg-[#0d0d14] border border-arcane-500/50 rounded-lg p-3 focus-within:border-arcane-400 focus-within:shadow-[0_0_15px_rgba(74,222,128,0.2)] transition-all flex-shrink-0">
                <span className="text-arcane-400 mr-3 animate-pulse">{">"}</span>
                <input 
                  type="text" 
                  className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-600"
                  placeholder="Query the Lorekeeper... (Press Enter to send)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                />
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-4 mb-4 space-y-4 custom-scrollbar">
                {loreEntries.length === 0 ? (
                  <div className="text-gray-500 italic mt-4">No records found in {activeTab}.db.</div>
                ) : (
                  loreEntries.map((entry) => (
                        <div key={entry.id} className="bg-black/40 border border-arcane-500/30 p-4 rounded">
                      <h3 className="text-arcane-400 font-bold text-lg mb-2">{entry.name}</h3>
                      <p className="text-gray-300 whitespace-pre-wrap">{entry.description}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleCreateLore} className="mt-auto border-t border-arcane-500/30 pt-4 flex-shrink-0">
                <h3 className="text-arcane-500 text-sm mb-3 font-bold">ADD NEW RECORD</h3>
                <input
                  type="text"
                  placeholder="Record Name (e.g., Elara)"
                  value={newLoreName}
                  onChange={(e) => setNewLoreName(e.target.value)}
                  className="w-full bg-[#0d0d14] border border-arcane-500/50 rounded p-2 text-gray-200 mb-3 focus:outline-none focus:border-arcane-400"
                  required
                />
                <textarea
                  placeholder="Detailed Description..."
                  value={newLoreDescription}
                  onChange={(e) => setNewLoreDescription(e.target.value)}
                  className="w-full bg-[#0d0d14] border border-arcane-500/50 rounded p-2 text-gray-200 mb-3 h-24 resize-none focus:outline-none focus:border-arcane-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-arcane-800 border border-arcane-500 text-arcane-400 px-4 py-2 rounded hover:bg-arcane-500/20 transition-colors font-bold tracking-wider w-full"
                >
                  INJECT RECORD
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;