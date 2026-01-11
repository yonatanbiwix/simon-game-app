/**
 * Entry Page
 * 
 * Modern dark-themed home page with Simon game aesthetics.
 * Name + avatar selection page - first screen players see.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession, joinGame } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { SimonLogo } from '../components/ui/SimonLogo';

export function EntryPage() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [avatarId, setAvatarId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setSession } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const joinCode = searchParams.get('join');
    if (joinCode) {
      setMode('join');
      setGameCode(joinCode.toUpperCase());
    }
  }, [searchParams]);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await createSession(displayName, avatarId);
      setSession(response.session);
      navigate('/waiting');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await joinGame(displayName, avatarId, gameCode);
      setSession(response.session);
      navigate('/waiting');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    } finally {
      setLoading(false);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
          }}
        />
        
        {/* Floating color orbs (decorative) */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[var(--simon-red)] opacity-10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[var(--simon-blue)] opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[var(--simon-yellow)] opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 rounded-full bg-[var(--simon-green)] opacity-10 blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-md w-full">
          {/* Animated Simon Logo */}
          <SimonLogo size="lg" animate={true} />
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-6 mb-2 tracking-tight">
            SIMON
          </h1>
          <p className="text-slate-400 text-center mb-8 text-sm sm:text-base tracking-wide">
            Multiplayer Memory Challenge
          </p>
          
          {/* Buttons */}
          <div className="w-full space-y-4 px-4">
            <button
              onClick={() => setMode('create')}
              className="
                w-full py-4 px-6 rounded-xl font-bold text-lg
                bg-[var(--simon-green)] text-white
                border-2 border-[var(--simon-green)]
                transition-all duration-200
                hover:bg-transparent hover:text-[var(--simon-green)]
                btn-glow-green
                active:scale-[0.98]
                min-h-[60px]
              "
              style={{ touchAction: 'manipulation' }}
            >
              Create Game
            </button>
            
            <button
              onClick={() => setMode('join')}
              className="
                w-full py-4 px-6 rounded-xl font-bold text-lg
                bg-transparent text-[var(--simon-blue)]
                border-2 border-[var(--simon-blue)]
                transition-all duration-200
                hover:bg-[var(--simon-blue)] hover:text-white
                btn-glow-blue
                active:scale-[0.98]
                min-h-[60px]
              "
              style={{ touchAction: 'manipulation' }}
            >
              Join Game
            </button>
          </div>
          
          {/* Footer text */}
          <p className="text-slate-600 text-xs mt-8">
            Challenge your friends • Test your memory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: mode === 'create' 
            ? 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.2) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.2) 0%, transparent 60%)'
        }}
      />
      
      {/* Card */}
      <div className="relative z-10 bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-slate-700/50">
        {/* Back button */}
        <button
          onClick={() => setMode(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <SimonLogo size="sm" animate={false} />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {mode === 'create' ? 'Create Game' : 'Join Game'}
            </h2>
            <p className="text-slate-400 text-sm">
              {mode === 'create' ? 'Start a new game room' : 'Enter a game code'}
            </p>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={mode === 'create' ? handleCreateGame : handleJoinGame} className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              minLength={3}
              maxLength={12}
              required
              className="
                w-full px-4 py-3 
                bg-[var(--bg-dark)] border border-slate-600
                rounded-xl text-white placeholder-slate-500
                focus:ring-2 focus:ring-[var(--simon-blue)] focus:border-transparent
                transition-all
              "
            />
          </div>
          
          {/* Game Code (Join mode only) */}
          {mode === 'join' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Game Code
                {searchParams.get('join') && (
                  <span className="ml-2 text-xs text-[var(--simon-green)] font-normal">
                    ✓ From invite link
                  </span>
                )}
              </label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="ABCDEF"
                maxLength={6}
                required
                className="
                  w-full px-4 py-3 
                  bg-[var(--bg-dark)] border border-slate-600
                  rounded-xl text-white placeholder-slate-500 uppercase
                  focus:ring-2 focus:ring-[var(--simon-blue)] focus:border-transparent
                  transition-all tracking-widest text-center text-xl font-mono
                "
              />
            </div>
          )}
          
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((id) => {
                const emojis = ['😀', '🎮', '🚀', '⚡', '🎨', '🎯', '🏆', '🌟'];
                const isSelected = avatarId === id;
                const colors = ['var(--simon-red)', 'var(--simon-blue)', 'var(--simon-yellow)', 'var(--simon-green)'];
                const borderColor = colors[(parseInt(id) - 1) % 4];
                
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAvatarId(id)}
                    className={`
                      p-3 rounded-xl transition-all duration-150 
                      flex items-center justify-center
                      min-h-[60px]
                      ${isSelected 
                        ? 'bg-slate-700 scale-105' 
                        : 'bg-[var(--bg-dark)] hover:bg-slate-800'}
                    `}
                    style={{ 
                      touchAction: 'manipulation',
                      border: isSelected ? `2px solid ${borderColor}` : '2px solid transparent',
                      boxShadow: isSelected ? `0 0 15px ${borderColor}40` : 'none'
                    }}
                  >
                    <span className="text-2xl sm:text-3xl">{emojis[parseInt(id) - 1]}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-lg
              transition-all duration-200
              min-h-[60px]
              ${mode === 'create'
                ? 'bg-[var(--simon-green)] hover:brightness-110 btn-glow-green'
                : 'bg-[var(--simon-blue)] hover:brightness-110 btn-glow-blue'
              }
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98]
            `}
            style={{ touchAction: 'manipulation' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              mode === 'create' ? 'Create Game' : 'Join Game'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
