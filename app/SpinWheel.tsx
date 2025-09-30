
"use client";
import React, { useState, useRef } from 'react';
import styles from './SpinWheel.module.css';

type ModalProps = {
  open: boolean;
  prize: string;
  onSubmit: (data: { name: string; phone: string }) => void;
};

function Modal({ open, prize, onSubmit }: ModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <form style={{
        background: '#fff',
        borderRadius: 24,
        padding: '48px 36px',
        minWidth: 420,
        boxShadow: '0 2px 32px #2226',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        alignItems: 'center',
      }}
        onSubmit={e => {
          e.preventDefault();
          onSubmit({ name, phone });
        }}
      >
        <h2 style={{ color: '#e53935', fontWeight: 'bold', fontSize: '2rem', marginBottom: 8 }}>Congratulations!</h2>
        <div style={{ fontWeight: 'bold', color: '#212121', marginBottom: 12, fontSize: '1.3rem' }}>You won: <span style={{ color: '#e53935' }}>{prize}</span></div>
        <div style={{ color: '#333', fontSize: '1.1rem', marginBottom: 10, textAlign: 'center' }}>
          Please fill in the form below to unlock your reward.
        </div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ padding: '16px', borderRadius: 10, border: '1.5px solid #ccc', width: '100%', fontSize: '1.2rem', marginBottom: 8, color: '#212121' }}
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={{ padding: '16px', borderRadius: 10, border: '1.5px solid #ccc', width: '100%', fontSize: '1.2rem', marginBottom: 8, color: '#212121' }}
        />
        <button type="submit" style={{ background: '#e53935', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: 8, padding: '16px 32px', marginTop: 12, cursor: 'pointer', fontSize: '1.2rem' }}>Submit</button>
      </form>
    </div>
  );
}

const PRIZES = [
  { label: '🎉 30% OFF DEAL', color: '#e53935' },
  { label: '🎁 MYSTERY GIFT', color: '#212121' },
  { label: '🧩 SURPRISE ITEM', color: '#388e3c' },
  { label: '💰 JACKPOT 70% OFF', color: '#f06292' },
  { label: '🍀 LUCKY DIP', color: '#d32f2f' },
  { label: '🎊 BONUS VOUCHER', color: '#1976d2' },
  { label: '🛍️ SHOPPING SPREE', color: '#7b1fa2' },
  { label: '🎈 FREE ITEM', color: '#fbc02d' },
  { label: '🎂 LUCKY TREAT', color: '#0288d1' },
  { label: '🌟 STAR PRIZE', color: '#8bc34a' },
  { label: '🏆 GRAND WINNER', color: '#ffd600' },
  { label: '🎫 SPECIAL COUPON', color: '#ab47bc' },
];

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning || hasSpun) return;
    setSpinning(true);
    setShowConfetti(false);
    setHasSpun(true);
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    setSelected(prizeIndex);
    const degrees = 360 * 5 + (360 / PRIZES.length) * prizeIndex + 360 / (2 * PRIZES.length);
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 3s cubic-bezier(.17,.67,.83,.67)';
      wheelRef.current.style.transform = `rotate(${degrees}deg)`;
    }
    setTimeout(() => {
      setSpinning(false);
      setShowConfetti(true);
      // Show modal after confetti delay (e.g., 1s)
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    }, 3000);
  };

  const handleModalSubmit = (data: { name: string; phone: string }) => {
    // Send winner data to Google Sheets via API
    const prize = selected !== null ? PRIZES[selected].label : '';
    fetch('/api/save-winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prize, name: data.name, phone: data.phone })
    })
      .then(res => res.json())
      .then(result => {
        setShowModal(false);
        if (result.success) {
          alert(`Thank you, ${data.name}! Your prize (${prize}) will be sent to ${data.phone}.`);
          window.location.reload();
        } else {
          alert('Failed to save your data. Please try again.');
        }
      })
      .catch(() => {
        setShowModal(false);
        alert('Failed to save your data. Please try again.');
      });
  };

  return (
    <div
      className={styles.container}
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#ff9800',
        marginBottom: '32px',
        textShadow: '2px 2px 12px #fff176',
        letterSpacing: '2px',
        textAlign: 'center',
      }}>
        Spin and win a prize!🎁
      </h1>
      <div className={styles.wheelWrapper}>
        {/* Pointer */}
        <div className={styles.pointer}></div>
        <div className={styles.wheel} ref={wheelRef}>
          {PRIZES.map((prize, i) => (
            <div
              key={i}
              className={styles.segment}
              style={{
                transform: `rotate(${(360 / PRIZES.length) * i}deg) skewY(-60deg)`,
                background: prize.color,
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '28px',
              }}
            >
              <span className={styles.prize} style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                textShadow: '1px 1px 6px #222',
                letterSpacing: '2px',
                textAlign: 'center',
                display: 'inline-block',
                minWidth: '40px',
              }}>{prize.label}</span>
            </div>
          ))}
        </div>
        <button className={styles.spinButton} onClick={spin} disabled={spinning || hasSpun}>
          <span className={styles.goText}>SPIN</span>
        </button>
      </div>
      {selected !== null && !spinning && (
        <div className={styles.result}>
          <h2 style={{ color: '#e53935', fontWeight: 'bold', fontSize: '1.7rem', margin: 0, letterSpacing: '1px' }}>
            You won: <span style={{ color: '#212121', fontWeight: 'bold', fontSize: '1.7rem' }}>{PRIZES[selected]?.label}</span>
          </h2>
        </div>
      )}
      {showConfetti && <div className={styles.confetti}></div>}
      <Modal open={showModal} prize={selected !== null ? PRIZES[selected].label : ''} onSubmit={handleModalSubmit} />
    </div>
  );
}

