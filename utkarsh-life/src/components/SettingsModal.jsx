import React, { useState } from 'react';
import { X, Volume2, VolumeX, RotateCcw, Info, Check, Download, Upload, Copy, KeyRound } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

export default function SettingsModal({ isOpen, onClose, onResetGame }) {
  const [soundEnabled, setSoundEnabled] = React.useState(soundManager.enabled);
  const [backupCodeText, setBackupCodeText] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const toggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    setSoundEnabled(soundManager.enabled);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all game progress? This cannot be undone!")) {
      onResetGame();
      onClose();
    }
  };

  const handleGenerateCode = () => {
    const saveData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ul_')) {
        saveData[key] = localStorage.getItem(key);
      }
    }
    const jsonStr = JSON.stringify(saveData);
    const b64Str = btoa(unescape(encodeURIComponent(jsonStr)));
    const fullCode = `HKCODE-${b64Str}`;
    setGeneratedCode(fullCode);
    navigator.clipboard.writeText(fullCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleLoadCode = () => {
    if (!backupCodeText.trim()) return;
    try {
      let rawCode = backupCodeText.trim();
      if (rawCode.startsWith('HKCODE-')) {
        rawCode = rawCode.replace('HKCODE-', '');
      }
      const jsonStr = decodeURIComponent(escape(atob(rawCode)));
      const parsedData = JSON.parse(jsonStr);

      // Restore to localStorage
      Object.keys(parsedData).forEach(key => {
        localStorage.setItem(key, parsedData[key]);
      });

      alert("🎉 BACKUP LOADED SUCCESSFUL! Reloading game state...");
      window.location.reload();
    } catch (err) {
      alert("Invalid Backup Code! Please check your code and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-6 relative flex flex-col border-[var(--color-cyber-blue)] shadow-[0_0_40px_rgba(0,240,255,0.3)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Settings</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Audio SFX Toggle */}
          <div className="glass-panel p-4 flex items-center justify-between border-gray-800">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-6 h-6 text-[var(--color-cyber-blue)]" /> : <VolumeX className="w-6 h-6 text-gray-500" />}
              <div>
                <h3 className="font-bold text-sm text-white">Audio Effects (SFX)</h3>
                <p className="text-[10px] text-gray-400">Synthesized Web Audio feedback</p>
              </div>
            </div>
            <button 
              onClick={toggleSound}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                soundEnabled 
                  ? 'bg-[var(--color-cyber-blue)] text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]' 
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Backup Code Generator & Restore Section */}
          <div className="glass-panel p-4 space-y-3 border-yellow-500/50 bg-gradient-to-r from-yellow-950/20 to-black">
            <div className="flex items-center gap-3">
              <KeyRound className="w-6 h-6 text-yellow-400" />
              <div>
                <h3 className="font-bold text-sm text-yellow-400">Save & Load Backup Code</h3>
                <p className="text-[10px] text-gray-400">Generate a unique code to restore progress</p>
              </div>
            </div>

            {/* Generate Code Button */}
            <button
              onClick={handleGenerateCode}
              className="w-full py-2 bg-yellow-500 text-black font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedCode ? 'Copied Code to Clipboard! ✅' : 'Get My Save Code 🔑'}</span>
            </button>

            {/* Generated Code Display */}
            {generatedCode && (
              <div className="p-2 bg-black/80 rounded-xl border border-yellow-500/40 text-[9px] font-mono text-yellow-400 break-all select-all">
                {generatedCode}
              </div>
            )}

            {/* Load Backup Code Input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Paste Backup Code (HKCODE-...)"
                value={backupCodeText}
                onChange={(e) => setBackupCodeText(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-black/80 border border-gray-700 text-xs font-mono text-white focus:outline-none focus:border-yellow-400"
              />
              <button
                onClick={handleLoadCode}
                className="px-3 py-1.5 bg-[var(--color-cyber-blue)] text-black font-black text-xs uppercase rounded-xl shadow-[0_0_10px_rgba(0,240,255,0.5)] flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Load</span>
              </button>
            </div>
          </div>

          {/* About / Info */}
          <div className="glass-panel p-4 flex items-center justify-between border-gray-800">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="font-bold text-sm text-white">App Version</h3>
                <p className="text-[10px] text-gray-400">Hamster Kombat 2026 Season 2 Build v3.5</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">v3.5.0</span>
          </div>

          {/* Reset Game */}
          <div className="glass-panel p-4 flex items-center justify-between border-red-900/50 bg-red-950/20">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-bold text-sm text-red-400">Reset Progress</h3>
                <p className="text-[10px] text-gray-400">Clear localStorage state</p>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-500 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            >
              Reset
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-[var(--color-cyber-blue)] text-black font-black text-xs uppercase tracking-wider rounded-xl"
        >
          Save & Close
        </button>

      </div>
    </div>
  );
}
