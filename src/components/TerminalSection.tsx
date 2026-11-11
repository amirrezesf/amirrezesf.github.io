import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Terminal, Code, ArrowRight, Play } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CommandHistory {
  input: string;
  output: React.ReactNode;
}

export default function TerminalSection() {
  const { t, lang, isRtl, theme, toggleTheme } = useApp();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default welcome message when entering terminal
  useEffect(() => {
    setHistory([
      {
        input: "system_init",
        output: (
          <div className="space-y-1 font-mono text-xs text-accent-teal/90">
            <p className="font-bold">Amirrezesf Terminal v1.5.0 [Tehran, UTC+3.5]</p>
            <p>Initializing secure server connection... Success.</p>
            <p>Type <span className="text-accent-blue font-bold">help</span> to explore available profile commands.</p>
          </div>
        ),
      },
    ]);
  }, []);

  // Scroll only the terminal screen buffer internal div, without jumping the outer web page
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    let reply: React.ReactNode = "";

    if (!trimmed) return;

    // Add to history log for arrow key recall
    setCommandLog((prev) => {
      const next = [...prev, cmdStr];
      setHistoryPointer(next.length);
      return next;
    });

    switch (trimmed) {
      case "help":
        reply = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono select-none pt-1">
            <div>
              <span className="text-accent-teal font-semibold">about</span> - Read interactive biography
            </div>
            <div>
              <span className="text-accent-teal font-semibold">skills</span> - Dump core engine tech stacks
            </div>
            <div>
              <span className="text-accent-teal font-semibold">projects</span> - Output list of featured software
            </div>
            <div>
              <span className="text-accent-teal font-semibold">experience</span> - Show historical development career path
            </div>
            <div>
              <span className="text-accent-teal font-semibold">stats</span> - View relative system language metrics
            </div>
            <div>
              <span className="text-accent-teal font-semibold">theme</span> - Toggle between light and dark mode
            </div>
            <div>
              <span className="text-accent-teal font-semibold">neofetch</span> - Render system & portfolio telemetry
            </div>
            <div>
              <span className="text-accent-teal font-semibold">matrix</span> - Launch green screen matrix falling codes
            </div>
            <div>
              <span className="text-accent-teal font-semibold">contact</span> - Retrieve instant mailbox link
            </div>
            <div>
              <span className="text-accent-teal font-semibold">clear</span> - Flush buffer clean
            </div>
          </div>
        );
        break;

      case "about":
        reply = (
          <div className="text-xs font-mono space-y-2 max-w-xl leading-relaxed pt-1 text-text-dim">
            <p className="text-text-main font-semibold flex items-center gap-1.5">
              <span className="text-accent-blue">//</span> Bio Engine:
            </p>
            <p>{t("bio")}</p>
          </div>
        );
        break;

      case "skills":
        reply = (
          <div className="text-xs font-mono space-y-2 pt-1">
            <p className="text-accent-blue font-semibold">// Micro-engine dependencies:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4 pl-2">
              <div>⚙️ Flutter / Dart</div>
              <div>⚡ React / TypeScript</div>
              <div>💚 Vue / Nuxt</div>
              <div>🏗️ Django / Python</div>
              <div>🛠️ Node.js / Express</div>
              <div>🐳 Docker / Linux</div>
            </div>
          </div>
        );
        break;

      case "projects":
        reply = (
          <div className="text-xs font-mono space-y-3 pt-1">
            <p className="text-accent-blue font-semibold">// Querying /var/portfolio/projects:</p>
            <div className="space-y-2 pl-2 border-l border-glass-border">
              <div>
                <span className="text-text-main font-semibold">1. Finance App Design</span> - Flutter sandbox tracker [Category: Fintech]
              </div>
              <div>
                <span className="text-text-main font-semibold">2. CRM Tool Dashboard</span> - Enterprise Nuxt client [Category: SaaS]
              </div>
              <div>
                <span className="text-text-main font-semibold">3. Chat Application</span> - React secure sockets socket [Category: Comms]
              </div>
              <div>
                <span className="text-text-main font-semibold">4. Food Delivery App</span> - Django backend mapping [Category: Retail]
              </div>
            </div>
          </div>
        );
        break;

      case "experience":
        reply = (
          <div className="text-xs font-mono space-y-3 pt-1 text-text-dim">
            <p className="text-accent-blue font-semibold">// Outputting career telemetry since age 15:</p>
            <div className="space-y-3 pl-3 border-l-2 border-accent-teal/50">
              <div>
                <p className="text-text-main font-semibold">2024 - Present: Freelance Full-Stack Specialist</p>
                <p className="text-[11px]">Building highly customized multi-tenant SaaS dashboards, Flutter apps, and 3D web spaces.</p>
              </div>
              <div>
                <p className="text-text-main font-semibold">2022 - 2024: Mobile Widget Architect</p>
                <p className="text-[11px]">Architecting modular Dart and Flutter applications with offline synchronization models.</p>
              </div>
              <div>
                <p className="text-text-main font-semibold">2020 - 2022: Django Systems Engineer</p>
                <p className="text-[11px]">Designing robust Python components, REST APIs, and handling relational database layers.</p>
              </div>
            </div>
          </div>
        );
        break;

      case "stats":
        reply = (
          <div className="text-xs font-mono space-y-2 pt-1 text-text-dim">
            <p className="text-accent-blue font-semibold">// Codebase Language Composition:</p>
            <div className="space-y-1.5">
              <div>
                <span className="text-accent-teal font-semibold">Dart / Flutter:</span>
                <div className="w-full bg-stone-300/40 dark:bg-white/5 h-2 rounded-full overflow-hidden mt-1 max-w-[300px]">
                  <div className="bg-accent-teal h-full rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
              <div>
                <span className="text-accent-blue font-semibold">TypeScript / React:</span>
                <div className="w-full bg-stone-300/40 dark:bg-white/5 h-2 rounded-full overflow-hidden mt-1 max-w-[300px]">
                  <div className="bg-accent-blue h-full rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div>
                <span className="text-yellow-500 font-semibold">Python / Django:</span>
                <div className="w-full bg-stone-300/40 dark:bg-white/5 h-2 rounded-full overflow-hidden mt-1 max-w-[300px]">
                  <div className="bg-yellow-500 h-full rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case "theme":
        toggleTheme();
        reply = (
          <div className="text-xs font-mono text-accent-teal pt-1">
            System theme toggled. Operating under <span className="font-bold underline">{theme === "dark" ? "LIGHT" : "DARK"}</span> mode standard.
          </div>
        );
        break;

      case "neofetch":
        reply = (
          <div className="flex flex-col sm:flex-row gap-6 text-xs font-mono pt-1.5 select-none items-start">
            {/* ASCII Brand Identity */}
            <div className="text-accent-teal font-bold leading-none hidden sm:block whitespace-pre">
{`   _/\_
  / o o \\
 (   "   )
  \\__=__/
  /     \\
 / |   | \\`}
            </div>
            <div className="space-y-1">
              <p className="text-accent-teal font-bold">amir@amirrezesf.sh</p>
              <p className="text-gray-500">-----------------</p>
              <p><span className="text-accent-blue font-semibold">OS:</span> Amirreza Esfandiyari Profile OS x86_64</p>
              <p><span className="text-accent-blue font-semibold">Host:</span> Creative Development Core v19</p>
              <p><span className="text-accent-blue font-semibold">Uptime:</span> since June 2024</p>
              <p><span className="text-accent-blue font-semibold">Shell:</span> zsh 5.9 (macOS/Ubuntu hybrid)</p>
              <p><span className="text-accent-blue font-semibold">IDE:</span> VS Code + Neovim Grid</p>
              <p><span className="text-accent-blue font-semibold">Interests:</span> 3D Graphics, Back-ends, Cryptography</p>
            </div>
          </div>
        );
        break;

      case "matrix":
        reply = (
          <div className="text-[10px] font-mono leading-tight space-y-0.5 pt-1 text-accent-teal overflow-hidden select-none">
            <p>01001101 01000001 01010100 01010010 01001001 01011000</p>
            <p className="opacity-90">K7D9  J8U2  L9A1  H0F3  A8S2  G4H1  W9Q0  L8K3</p>
            <p className="opacity-80">0110  1001  1100  0011  1011  0110  0000  1111</p>
            <p className="opacity-65">SYSTEM SECURE // CODES PARSED // INTRUSION PREVENTED</p>
            <p className="opacity-40">_AMIRREZESF_ ROOT GATE SYSTEM ACTIVATED CHRONOS_METER</p>
          </div>
        );
        break;

      case "contact":
        reply = (
          <div className="text-xs font-mono space-y-2 pt-1">
            <p className="text-accent-teal font-bold">// Direct communications hook initialized:</p>
            <p>Email: <a href="mailto:amir.reza.esf@gmail.com" className="text-accent-blue underline hover:text-accent-teal">amir.reza.esf@gmail.com</a></p>
            <p className="text-gray-500">Opening system mailclient via local redirect protocol...</p>
          </div>
        );
        // Safely redirect in non-blocking popup
        setTimeout(() => {
          window.location.href = "mailto:amir.reza.esf@gmail.com";
        }, 1200);
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default:
        reply = (
          <p className="text-xs font-mono text-red-500 dark:text-red-400">
            command not found: "{trimmed}". Type <span className="font-bold underline text-text-main">help</span> to view available instructions.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { input: cmdStr, output: reply }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Mitigate default page browser alignment layout bugs
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandLog.length > 0) {
        const nextIdx = Math.max(0, historyPointer - 1);
        setHistoryPointer(nextIdx);
        setInput(commandLog[nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer < commandLog.length - 1) {
        const nextIdx = historyPointer + 1;
        setHistoryPointer(nextIdx);
        setInput(commandLog[nextIdx] || "");
      } else {
        setHistoryPointer(commandLog.length);
        setInput("");
      }
    }
  };

  // Pre-configured tag suggestions for quick mobile taps
  const commandTags = ["help", "about", "skills", "experience", "neofetch", "theme", "contact"];

  return (
    <section className="py-16 w-full relative overflow-hidden bg-bg-space/20 border-t border-glass-border">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Module Header */}
        <div className="text-center mb-8 select-none">
          <h3 className="font-display font-medium text-2xl text-text-main tracking-tight flex items-center justify-center gap-2">
            <Terminal size={18} className="text-accent-teal" />
            <span>Interactive Space Terminal</span>
          </h3>
          <p className="font-sans text-xs text-text-dim mt-1.5 font-light">
            {lang === "en" 
              ? "Query profiles and project files directly via our cybernetic shell." 
              : "پیکربندی پرونده‌ها و رزومه را مستقیماً از طریق پایانه تعاملی ما مدیریت کنید."
            }
          </p>
        </div>

        {/* Terminal Glass Container */}
        <div 
          onClick={focusInput}
          className="w-full bg-stone-100/90 dark:bg-[#1b1c1b]/90 border border-glass-border rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden cursor-text transition-all duration-300 hover:border-accent-blue/20"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-stone-200/50 dark:bg-[#131413] border-b border-glass-border select-none">
            {/* Window Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            
            {/* Tab Name Label */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-dim/80">
              <Code size={11} className="text-accent-blue" />
              <span>amirrezesf@bash:~</span>
            </div>

            {/* Layout Filler */}
            <div className="w-12 h-3" />
          </div>

          {/* Core Interactive Screen Buffer */}
          <div 
            ref={scrollContainerRef}
            className="p-5 min-h-[240px] max-h-[380px] overflow-y-auto space-y-4 font-mono text-left scrollbar-thin text-stone-800 dark:text-stone-100"
          >
            
            {/* Command logs */}
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-text-main">
                  <span className="text-accent-blue font-bold">~</span>
                  <span className="text-accent-teal font-semibold">guest@amirrezesf:</span>
                  <span className="text-text-dim">{item.input}</span>
                </div>
                <div className="pl-4 text-text-dim leading-relaxed">{item.output}</div>
              </div>
            ))}

            {/* Active Current Input Prompt Line */}
            <div className="flex items-center gap-1.5 text-xs text-text-main">
              <span className="text-accent-blue font-bold">~</span>
              <span className="text-accent-teal font-semibold">guest@amirrezesf:</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-text-main focus:ring-0 p-0 m-0 font-mono pr-4"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <Play size={10} className="absolute right-0 text-accent-blue/50 pointer-events-none" />
              </div>
            </div>

            <div className="h-2" />
          </div>

          {/* Quick interactive Suggestion Drawer */}
          <div className="px-5 py-3 bg-stone-200/40 dark:bg-[#131413]/55 border-t border-glass-border flex flex-wrap gap-2 items-center select-none">
            <span className="text-[10px] font-mono text-gray-500 mr-2 uppercase tracking-wider">Quick Actions:</span>
            {commandTags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommand(tag);
                }}
                className="text-[10px] font-mono px-2.5 py-1 rounded bg-stone-100 dark:bg-[#1e201e] border border-stone-200 dark:border-glass-border text-accent-blue hover:text-white hover:bg-accent-blue hover:border-accent-blue transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
