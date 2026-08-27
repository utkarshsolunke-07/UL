import React, { useState, useRef } from 'react';
import { LEVELS, CEO_SKINS } from '../utils/gameLogic';
import { soundManager } from '../utils/soundManager';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ScanText } from 'lucide-react';

export default function Exchange({ 
  coins, 
  energy, 
  maxEnergy, 
  onTap, 
  levelIndex, 
  onRedeemCode,
  selectedSkin,
  tapPower
}) {
  const [clicks, setClicks] = useState([]);
  const [hotCodeInput, setHotCodeInput] = useState('');
  const [showHotCodes, setShowHotCodes] = useState(true);
  const coinRef = useRef(null);

  const activeSkin = CEO_SKINS.find(s => s.id === selectedSkin) || CEO_SKINS[0];

  const handleRedeemCode = (e) => {
    e.preventDefault();
    const cleanCode = hotCodeInput.trim();
    if (cleanCode === '8888') {
      soundManager.playWin();
      if (onRedeemCode) {
        onRedeemCode(1000000000);
      }
      setHotCodeInput('');
      alert("🔥 HOT CODE REDEEMED! You claimed 1,000,000,000 Coins! 🚀");
    } else {
      alert("Invalid Hot Code! Please enter a valid code.");
    }
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (energy <= 0) return;

    const rect = coinRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    coinRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.95)`;

    soundManager.playTap();
    onTap(tapPower);
    const newClick = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY, text: `+${tapPower}` };
    setClicks((prev) => [...prev, newClick]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== newClick.id));
    }, 1000);
  };

  const handlePointerUp = () => {
    if (coinRef.current) {
      coinRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  };

  const progressPct = LEVELS[levelIndex + 1] 
    ? (coins / LEVELS[levelIndex + 1].minCoins) * 100
    : 100;

  return (
    <div className="flex flex-col items-center pt-4 pb-32 px-4 select-none touch-pan-y h-full relative overflow-y-auto">
      
      <div className="w-full flex justify-end mb-4">
        <button 
          onClick={() => setShowHotCodes(!showHotCodes)}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border transition-all ${
            showHotCodes 
              ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.6)]' 
              : 'glass-panel text-yellow-400 border-yellow-400/50'
          }`}
        >
          <ScanText className="w-4 h-4" />
          <span>Hot Codes 🔥</span>
        </button>
      </div>

      {showHotCodes && (
        <form onSubmit={handleRedeemCode} className="mb-4 w-full max-w-xs flex gap-2 animate-bounce-short">
          <input
            type="text"
            placeholder="Enter Hot Code"
            value={hotCodeInput}
            onChange={(e) => setHotCodeInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-black/80 border border-yellow-400 text-yellow-400 font-mono text-center font-bold text-sm focus:outline-none shadow-[0_0_10px_rgba(255,215,0,0.3)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-black font-black text-xs uppercase rounded-xl shadow-[0_0_10px_rgba(255,215,0,0.8)] hover:scale-105 transition-transform"
          >
            Redeem
          </button>
        </form>
      )}

      {/* Coin Balance */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-transparent border-2 border-[var(--color-cyber-blue)] flex items-center justify-center text-[var(--color-cyber-blue)] font-bold text-xl shadow-[0_0_15px_rgba(0,240,255,0.5),inset_0_0_10px_rgba(0,240,255,0.3)]">
          ₹
        </div>
        <span className="text-5xl font-black tracking-tight neon-text-blue">
          {coins.toLocaleString()}
        </span>
      </div>

      {/* Level Progress */}
      <div className="w-full flex items-center justify-between px-4 mb-2">
        <span className="text-sm font-semibold neon-text-gold">{LEVELS[levelIndex].name}</span>
        <span className="text-sm font-semibold text-[var(--color-cyber-blue)]">
          Level {levelIndex + 1}/{LEVELS.length}
        </span>
      </div>
      <div className="w-full h-3 bg-gray-900 rounded-full mb-4 border border-gray-800 overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,1)]">
        <div 
          className="h-full bg-[var(--color-cyber-blue)] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.8)]"
          style={{ width: `${Math.min(progressPct, 100)}%` }}
        />
      </div>

      {/* 2026 Market Reality Ticker */}
      <div className="mb-6 flex items-center justify-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded-full">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
        <span className="text-[10px] font-bold text-red-400 tracking-wider">$HMSTR Price: $0.00018</span>
      </div>

      {/* Tapping Coin */}
      <div 
        ref={coinRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-[280px] h-[280px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-75 relative z-10 bg-[var(--color-cyber-dark)] border-4 border-[var(--color-cyber-blue)] shadow-[0_0_50px_rgba(0,240,255,0.5),inset_0_0_30px_rgba(0,240,255,0.3)]"
      >
        <div className="absolute inset-3 rounded-full overflow-hidden flex flex-col items-center justify-center bg-cyan-950/50">
          <div className="w-44 h-44 bg-transparent rounded-full flex items-center justify-center mb-1 overflow-hidden p-2">
            {activeSkin.image ? (
              <img 
                src={activeSkin.image} 
                alt={activeSkin.name} 
                className="w-full h-full object-cover rounded-full drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
              />
            ) : (
              <span className="text-7xl drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">{activeSkin.emoji}</span>
            )}
          </div>
          <span className="text-2xl font-black uppercase tracking-widest neon-text-blue">
            {activeSkin.name}
          </span>
        </div>
      </div>

      {/* Floating tap numbers */}
      <AnimatePresence>
        {clicks.map((click) => (
          <motion.div
            key={click.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-4xl font-black neon-text-gold pointer-events-none z-50"
            style={{ left: click.x - 20, top: click.y - 20 }}
          >
            {click.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Energy Bar */}
      <div className="absolute bottom-24 left-0 w-full px-6">
        <div className="flex justify-between items-center mb-1 text-xs font-semibold">
          <div className="flex items-center gap-1 text-[var(--color-cyber-gold)]">
            <Zap className="w-4 h-4 fill-current" />
            <span>{energy} / {maxEnergy}</span>
          </div>
          <span className="text-[var(--color-cyber-blue)] font-bold">Auto Recharge</span>
        </div>
        <div className="w-full h-2.5 bg-gray-900 rounded-full border border-gray-800 overflow-hidden shadow-[inset_0_0_5px_rgba(0,0,0,1)]">
          <div 
            className="h-full bg-[var(--color-cyber-gold)] rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(255,215,0,0.8)]"
            style={{ width: `${(energy / maxEnergy) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
}
