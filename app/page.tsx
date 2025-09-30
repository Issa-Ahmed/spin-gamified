
"use client";
import SpinWheel from './SpinWheel';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffe0f0 0%, #ffd6e9 100%)',
    }}>
      {/* Decorative clouds */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '8%',
        width: 80,
        height: 40,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 40,
        boxShadow: '20px 0 0 0 rgba(255,255,255,0.7), 40px 0 0 0 rgba(255,255,255,0.6)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '18%',
        right: '10%',
        width: 60,
        height: 30,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: 30,
        boxShadow: '15px 0 0 0 rgba(255,255,255,0.7)',
        zIndex: 0,
      }} />
      {/* Confetti swirl */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '20%',
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #ffb6d5 60%, #a64ca6 100%)',
        opacity: 0.3,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '12%',
        right: '18%',
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #ffd6e9 60%, #ffb6d5 100%)',
        opacity: 0.3,
        zIndex: 0,
      }} />
      <SpinWheel />
    </main>
  );
}
