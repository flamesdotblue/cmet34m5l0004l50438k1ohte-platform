import React, { useEffect, useMemo, useRef, useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [activeTier, setActiveTier] = useState("starter");
  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStartCount(true);
        });
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setSubmitted(true);
  };

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Header onNav={scrollToId} />
      <main>
        <Hero onCta={() => scrollToId("builder")} />
        <TrustBar />
        <Stats start={startCount} innerRef={statsRef} />
        <Showcase />
        <Builder id="builder" />
        <Process />
        <Pricing active={activeTier} onChange={setActiveTier} />
        <CTA submitted={submitted} email={email} setEmail={setEmail} onSubmit={handleSubmit} error={error} />
      </main>
      <Footer onNav={scrollToId} />
    </div>
  );
}

function Header({ onNav }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNav("top")}> 
            <Logo className="h-7 w-7" />
            <span className="font-semibold tracking-tight">Axiom Robotics</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <button onClick={() => onNav("showcase")} className="hover:text-white">Robots</button>
            <button onClick={() => onNav("builder")} className="hover:text-white">Builder</button>
            <button onClick={() => onNav("process")} className="hover:text-white">Process</button>
            <button onClick={() => onNav("pricing")} className="hover:text-white">Pricing</button>
          </nav>
          <button onClick={() => onNav("cta")} className="rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-4 py-2 text-sm shadow-lg shadow-cyan-500/20">Get started</button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onCta }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <BackgroundGrid />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              We build robots that build your business
            </h1>
            <p className="mt-6 text-slate-300 text-lg">
              Custom autonomous systems for manufacturing, logistics, and research. From vision to deployment, our platform designs, simulates, and assembles production‑ready robots.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={onCta} className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 shadow-lg shadow-cyan-500/25">Launch Builder</button>
              <a href="#showcase" onClick={(e)=>{e.preventDefault(); document.getElementById("showcase")?.scrollIntoView({behavior:"smooth"});}} className="px-6 py-3 rounded-xl border border-white/15 hover:border-white/30 text-slate-200">
                See robots
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2"><ShieldIcon /> ISO 10218 safety ready</div>
              <div className="flex items-center gap-2"><SparklesIcon /> Rapid prototyping</div>
            </div>
          </div>
          <div className="relative">
            <RobotIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const logos = ["Aurora","Helios","MacroFab","Vectorix","NovaLab"]; 
  return (
    <div className="border-y border-white/10 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-xs uppercase tracking-widest text-slate-400">Trusted by innovators</div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center text-center">
          {logos.map((l) => (
            <div key={l} className="text-slate-400/80 hover:text-slate-200 transition font-semibold text-sm">{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useCounter(target, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start]);
  return count;
}

function Stats({ start, innerRef }) {
  const a = useCounter(120, start);
  const b = useCounter(48, start);
  const c = useCounter(99, start);
  return (
    <section ref={innerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid sm:grid-cols-3 gap-6">
        <StatCard label="Robots deployed" value={`${a}+`} accent="from-cyan-500 to-blue-500" />
        <StatCard label="Industries served" value={`${b}`} accent="from-fuchsia-500 to-violet-500" />
        <StatCard label="Uptime SLA" value={`${c}.9%`} accent="from-emerald-500 to-lime-500" />
      </div>
    </section>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6`}> 
      <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${accent}`} />
      <div className="relative">
        <div className="text-4xl font-black">{value}</div>
        <div className="text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  );
}

function Showcase() {
  const cards = useMemo(() => [
    {
      title: "Atlas MK-IV",
      subtitle: "Mobile manipulator",
      gradient: "from-cyan-500/30 to-blue-500/30",
      features: ["7-DOF arm","360° LiDAR","Vision grasping"],
    },
    {
      title: "Helix S",
      subtitle: "Swarm drone",
      gradient: "from-emerald-500/30 to-lime-500/30",
      features: ["SLAM","Mesh comms","Auto-dock"],
    },
    {
      title: "Forge X",
      subtitle: "Factory cobot",
      gradient: "from-fuchsia-500/30 to-violet-500/30",
      features: ["Safe torque","Quick teach","40kg payload"],
    },
  ], []);

  return (
    <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold">Featured robots</h2>
      <p className="text-slate-300 mt-2">Modular platforms tailored to your workflow.</p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <ShowcaseCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}

function ShowcaseCard({ title, subtitle, gradient, features }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition`} />
      <div className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
          <div className="h-14 w-14 rounded-xl bg-slate-800/60 flex items-center justify-center border border-white/10">
            <MiniRobotIcon />
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm text-slate-300">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2"><CheckIcon /> {f}</li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between">
          <button className="text-cyan-400 hover:text-cyan-300 text-sm">Specs</button>
          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Configure</button>
        </div>
      </div>
    </div>
  );
}

function Builder({ id }) {
  const [form, setForm] = useState({ base: "mobile", arm: true, vision: true, payload: 20 });
  const price = useMemo(() => {
    let p = 15000;
    if (form.base === "mobile") p += 8000; else if (form.base === "cobot") p += 12000; else p += 6000;
    if (form.arm) p += 9000;
    if (form.vision) p += 4000;
    p += form.payload * 250;
    return p;
  }, [form]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <h3 className="text-2xl font-bold">Rapid robot builder</h3>
          <p className="text-slate-300 mt-2 text-sm">Assemble a concept and estimate in minutes.</p>
          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm text-slate-300">Base</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  {id:"mobile",label:"Mobile"},
                  {id:"cobot",label:"Cobot"},
                  {id:"fixed",label:"Fixed"},
                ].map((b)=> (
                  <button key={b.id} onClick={()=>update("base", b.id)} className={`px-3 py-2 rounded-lg border ${form.base===b.id?"bg-cyan-500 text-slate-900 border-transparent":"border-white/15 bg-white/5 hover:bg-white/10"}`}>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Toggle label="Robot arm" value={form.arm} onChange={(v)=>update("arm", v)} />
              <Toggle label="Vision system" value={form.vision} onChange={(v)=>update("vision", v)} />
            </div>
            <div>
              <label className="text-sm text-slate-300">Payload: <span className="font-semibold text-white">{form.payload} kg</span></label>
              <input type="range" min="5" max="80" step="5" value={form.payload} onChange={(e)=>update("payload", parseInt(e.target.value))} className="w-full accent-cyan-500" />
            </div>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-white/10">
            <div className="text-sm text-slate-300">Estimated budget</div>
            <div className="text-3xl font-black">${(price).toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Includes hardware, integration, and on‑site commissioning.</div>
          </div>
        </div>
        <div className="relative">
          <BuilderPreview form={form} />
        </div>
      </div>
    </section>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button onClick={()=>onChange(!value)} className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border ${value?"bg-emerald-500/20 border-emerald-500/40":"bg-white/5 border-white/15 hover:bg-white/10"}`}>
      <span className="text-sm">{label}</span>
      <span className={`h-6 w-11 rounded-full p-0.5 transition ${value?"bg-emerald-500/80":"bg-slate-600"}`}>
        <span className={`block h-5 w-5 bg-white rounded-full transition transform ${value?"translate-x-5":"translate-x-0"}`} />
      </span>
    </button>
  );
}

function BuilderPreview({ form }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">Preview</div>
          <div className="text-xl font-bold">{form.base === "mobile" ? "Mobile manipulator" : form.base === "cobot" ? "Collaborative arm" : "Fixed cell"}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-slate-800/60 flex items-center justify-center border border-white/10"><SparklesIcon /></div>
      </div>
      <div className="mt-6 aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <BackgroundGrid compact />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <PreviewRobot form={form} />
        </div>
      </div>
      <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
        <li className="flex items-center gap-2"><CheckIcon /> Payload: {form.payload} kg</li>
        <li className="flex items-center gap-2"><CheckIcon /> Vision: {form.vision?"Enabled":"None"}</li>
        <li className="flex items-center gap-2"><CheckIcon /> Arm: {form.arm?"Included":"None"}</li>
        <li className="flex items-center gap-2"><CheckIcon /> Base: {form.base}</li>
      </ul>
    </div>
  );
}

function Process() {
  const steps = [
    { t: "Discover", d: "Define use‑case, safety, and ROI targets.", icon: <CompassIcon /> },
    { t: "Design", d: "CAD, kinematics, and simulation.", icon: <PencilIcon /> },
    { t: "Build", d: "Manufacture, wire, and assemble.", icon: <WrenchIcon /> },
    { t: "Deploy", d: "On‑site commissioning and training.", icon: <RocketIcon /> },
  ];
  return (
    <section id="process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl sm:text-4xl font-extrabold">From idea to automation</h2>
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.t} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">{s.icon}</div>
            <div className="font-semibold">{s.t}</div>
            <div className="text-sm text-slate-300 mt-1">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing({ active, onChange }) {
  const tiers = [
    { id: "starter", name: "Prototype", price: 12000, features: ["Concept design","Simulation report","2 week lead"], accent: "from-cyan-500 to-blue-500" },
    { id: "growth", name: "Pilot", price: 48000, features: ["1 robot build","Safety validation","On‑site deploy"], accent: "from-emerald-500 to-lime-500" },
    { id: "scale", name: "Production", price: 145000, features: ["Multi‑cell system","24/7 support","Spares + training"], accent: "from-fuchsia-500 to-violet-500" },
  ];
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Transparent pricing</h2>
          <p className="text-slate-300 mt-1">Choose a starting track. Everything is customizable.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1">
          {tiers.map((t) => (
            <button key={t.id} onClick={()=>onChange(t.id)} className={`text-sm px-3 py-1.5 rounded-full ${active===t.id?"bg-cyan-500 text-slate-900":"hover:bg-white/10"}`}>{t.name}</button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {tiers.map((t)=> (
          <div key={t.id} className={`rounded-2xl border ${active===t.id?"border-cyan-400/40":"border-white/10"} bg-slate-900/40 overflow-hidden relative`}> 
            <div className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-10`} />
            <div className="relative p-6">
              <div className="text-sm text-slate-300">{t.name}</div>
              <div className="mt-1 text-4xl font-black">${t.price.toLocaleString()}</div>
              <ul className="mt-6 space-y-2 text-sm text-slate-200">
                {t.features.map((f)=> (
                  <li key={f} className="flex items-center gap-2"><CheckIcon /> {f}</li>
                ))}
              </ul>
              <button className="mt-6 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15">Select</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA({ submitted, email, setEmail, onSubmit, error }) {
  return (
    <section id="cta" className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <BackgroundGrid />
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold">Start building your robot today</h2>
        <p className="text-slate-300 mt-2">Get a design sprint and a tailored build plan in your inbox.</p>
        <form onSubmit={onSubmit} className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
          <input type="email" value={email} onChange={(e)=>{ if(error){} setEmail(e.target.value); }} placeholder="Work email" className={`flex-1 rounded-xl px-4 py-3 bg-white/5 border ${error?"border-rose-500/60":"border-white/10"} outline-none focus:border-cyan-400`} />
          <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400">Request plan</button>
        </form>
        {error && <div className="text-rose-400 text-sm mt-2">{error}</div>}
        {submitted && (
          <div className="mt-4 text-emerald-400 text-sm">Thanks! We\'ll reach out shortly.</div>
        )}
      </div>
    </section>
  );
}

function Footer({ onNav }) {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2"><Logo className="h-6 w-6" /><span className="font-semibold">Axiom Robotics</span></div>
            <p className="text-slate-400 mt-3">Design, build, and deploy autonomous systems.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Explore</div>
            <ul className="space-y-1 text-slate-300">
              <li><button onClick={()=>onNav("showcase")} className="hover:text-white">Robots</button></li>
              <li><button onClick={()=>onNav("builder")} className="hover:text-white">Builder</button></li>
              <li><button onClick={()=>onNav("process")} className="hover:text-white">Process</button></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <ul className="space-y-1 text-slate-300">
              <li>hello@axiomrobots.com</li>
              <li>+1 (555) 010-2048</li>
              <li>San Jose, CA</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <ul className="space-y-1 text-slate-300">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} Axiom Robotics. All rights reserved.</div>
      </div>
    </footer>
  );
}

// Decorative components and icons
function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#g)" opacity="0.2" />
      <path d="M7 16l5-8 5 8" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2" fill="#22d3ee" />
    </svg>
  );
}

function BackgroundGrid({ compact }) {
  const rows = compact ? 8 : 16;
  const cols = compact ? 12 : 20;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(`${r}-${c}`);
    }
  }
  return (
    <div className="pointer-events-none select-none">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {cells.map((k) => (
          <div key={k} className="aspect-square border border-white/5" />
        ))}
      </div>
    </div>
  );
}

function RobotIllustration() {
  return (
    <div className="relative h-[380px] sm:h-[460px]">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-white/10" />
      <div className="absolute -inset-10 blur-3xl bg-cyan-500/20 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full max-w-[520px]">
          <defs>
            <linearGradient id="arm" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <g transform="translate(20,20)">
            <rect x="40" y="190" width="220" height="60" rx="14" fill="#0f172a" stroke="#334155" />
            <circle cx="70" cy="245" r="12" fill="#22d3ee" />
            <circle cx="230" cy="245" r="12" fill="#22d3ee" />
            <rect x="90" y="80" width="120" height="40" rx="8" fill="#0f172a" stroke="#334155" />
            <rect x="110" y="40" width="80" height="40" rx="8" fill="#0f172a" stroke="#334155" />
            <rect x="130" y="20" width="40" height="20" rx="6" fill="#22d3ee" />
            <path d="M150 120 L210 160" stroke="url(#arm)" strokeWidth="10" strokeLinecap="round" />
            <path d="M210 160 L240 150" stroke="url(#arm)" strokeWidth="10" strokeLinecap="round" />
            <circle cx="210" cy="160" r="8" fill="#22d3ee" />
            <rect x="138" y="120" width="24" height="24" rx="4" fill="#22d3ee" />
            <rect x="60" y="140" width="60" height="70" rx="10" fill="#0f172a" stroke="#334155" />
            <circle cx="90" cy="175" r="16" fill="#22d3ee" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MiniRobotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="4" width="12" height="8" rx="2" className="text-cyan-400" fill="currentColor" stroke="none" />
      <rect x="5" y="12" width="14" height="6" rx="2" className="text-slate-500" fill="currentColor" stroke="none" />
      <circle cx="9" cy="7.5" r="1" fill="#0f172a" />
      <circle cx="15" cy="7.5" r="1" fill="#0f172a" />
    </svg>
  );
}

function PreviewRobot({ form }) {
  const baseColor = form.base === "mobile" ? "#22d3ee" : form.base === "cobot" ? "#34d399" : "#a78bfa";
  return (
    <svg viewBox="0 0 300 180" className="w-full h-full">
      <g>
        {form.base === "mobile" && (
          <>
            <rect x="60" y="110" width="180" height="30" rx="10" fill="#0f172a" stroke="#334155" />
            <circle cx="90" cy="150" r="10" fill={baseColor} />
            <circle cx="210" cy="150" r="10" fill={baseColor} />
          </>
        )}
        {form.base === "cobot" && (
          <>
            <rect x="130" y="120" width="40" height="30" rx="6" fill="#0f172a" stroke="#334155" />
          </>
        )}
        {form.base === "fixed" && (
          <>
            <rect x="70" y="125" width="160" height="20" rx="6" fill="#0f172a" stroke="#334155" />
          </>
        )}
        {form.arm && (
          <>
            <path d="M150 95 L200 60" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
            <path d="M200 60 L230 70" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="200" cy="60" r="6" fill={baseColor} />
          </>
        )}
        {form.vision && (
          <>
            <rect x="140" y="80" width="20" height="12" rx="3" fill={baseColor} />
            <circle cx="150" cy="86" r="3" fill="#0f172a" />
          </>
        )}
        <rect x="120" y="95" width="60" height="30" rx="8" fill="#0f172a" stroke="#334155" />
      </g>
    </svg>
  );
}

// Icons
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z" />
    </svg>
  );
}
function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
      <path d="M19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-3 6-3-3 6-3z" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-fuchsia-400" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 20l4-1 9-9-3-3-9 9-1 4z" />
      <path d="M14 4l3 3" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 7a4 4 0 10-6 4l-5 5 3 3 5-5a4 4 0 003-7z" />
    </svg>
  );
}
function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 13l-2 6 6-2 8-8-4-4-8 8z" />
      <path d="M12 6l6 6" />
    </svg>
  );
}
