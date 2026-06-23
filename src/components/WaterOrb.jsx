import React, { useEffect, useRef } from 'react';
import styles from './WaterOrb.module.css';

export default function WaterOrb({ pct, totalMl, goalMl, formatVol }) {
  const fillRef = useRef(null);
  const pctRef  = useRef(null);
  const clampedPct = Math.min(Math.max(pct, 0), 100);

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.transform = `translateY(calc(100% - ${clampedPct}%))`;
    }
    if (pctRef.current) {
      pctRef.current.textContent = Math.round(clampedPct);
    }
  }, [clampedPct]);

  return (
    <div className={styles.wrap}>
      <div className={styles.glow} />
      <div className={styles.sphere}>
        <div ref={fillRef} className={styles.fill} />
        <div className={styles.content}>
          <span className={styles.label}>Hydration</span>
          <div className={styles.pctRow}>
            <span ref={pctRef} className={styles.pctNum}>{Math.round(clampedPct)}</span>
            <span className={styles.pctSym}>%</span>
          </div>
          <span className={styles.sub}>{formatVol(totalMl)} / {formatVol(goalMl)}</span>
        </div>
      </div>
    </div>
  );
}
