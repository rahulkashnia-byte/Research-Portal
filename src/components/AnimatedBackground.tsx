import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-100">
      {/* Sleek, ambient glowing orbs for abstract tech depth */}
      <style>{`
        @keyframes drift-slow-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.1); }
        }
        @keyframes drift-slow-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 40px) scale(0.95); }
        }
        .animate-drift-1 {
          animation: drift-slow-1 25s ease-in-out infinite;
        }
        .animate-drift-2 {
          animation: drift-slow-2 30s ease-in-out infinite;
        }
      `}</style>

      {/* Abstract sleek decorative elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-100/40 blur-3xl animate-drift-1" />
      <div className="absolute top-[60%] -right-20 w-80 h-80 rounded-full bg-slate-200/50 blur-2xl animate-drift-2" />
      <div className="absolute top-[10%] right-[15%] w-72 h-72 rounded-full bg-orange-50/30 blur-2xl animate-drift-1" style={{ animationDelay: "4s" }} />

      {/* Grid line matrix texture to give premium research/academic depth */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />
    </div>
  );
}
