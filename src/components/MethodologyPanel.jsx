import React, { useState } from 'react';
import styles from './MethodologyPanel.module.css';
import { formatVol } from '../utils/waterCalc';

function Arrow() {
  return <div className={styles.arrow}>→</div>;
}

function BraceGroup({ items }) {
  return (
    <div className={styles.braceGroup}>
      <div className={styles.braceSvg}>
        <svg viewBox="0 0 20 100" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18,5 Q4,5 4,20 L4,45 Q4,50 2,50 Q4,50 4,55 L4,80 Q4,95 18,95" />
        </svg>
      </div>
      <div className={styles.braceItems}>
        {items.map((it, i) => (
          <div key={i} className={`${styles.outputBox} ${styles.setVal}`}>{it.label}<span className={styles.val}>{formatVol(it.value)}</span></div>
        ))}
      </div>
    </div>
  );
}

export default function MethodologyPanel({ calc, onClose }) {
  const [activeRow, setActiveRow] = useState(null);

  const rows = [
    {
      id: 'bsa',
      inputs: ['Weight', 'Height'],
      calculation: `BSA = ${calc.bsa} m²`,
      losses: [{ label: 'Skin: evaporation', value: calc.skinEvaporation, color: '#22d3ee' }],
      gains: [],
    },
    {
      id: 'caloric',
      inputs: ['Weight', 'Activity', 'Age', 'Gender'],
      calculation: `Caloric expenditure\n${calc.caloricExpenditure} kcal/day\n(BMR × ${calc.activityFactor})`,
      losses: [{ label: 'Respiratory loss', value: calc.respiratoryLoss, color: '#a78bfa' }],
      gains: [{ label: 'Metabolic water', value: calc.metabolicWater, color: '#34d399' }],
    },
    {
      id: 'sweat',
      inputs: ['Weight', 'Activity', 'Country'],
      calculation: null,
      losses: [{ label: 'Skin: sweat', value: calc.sweatLoss, color: '#fb923c' }],
      gains: [],
    },
    {
      id: 'set',
      inputs: [],
      calculation: 'Set values',
      losses: [],
      gains: [],
      setValues: [
        { label: 'Faecal loss', value: calc.faecalLoss },
        { label: 'Urine',       value: calc.urineLoss  },
      ],
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Methodology</h2>

        <div className={styles.diagram}>
          {/* Column headers */}
          <div className={styles.headers}>
            <div className={styles.colHead} style={{ color: '#22d3ee' }}>Input Data</div>
            <div className={styles.colHead} style={{ color: '#a78bfa' }}>Calculation</div>
            <div className={`${styles.colHead} ${styles.lossHead}`} style={{ color: '#f472b6' }}>
              <span>Sum of losses</span>
              <span style={{ color: '#34d399', marginLeft: '2rem' }}>Sum of gains</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, ri) => (
            <div
              key={row.id}
              className={`${styles.row} ${activeRow === row.id ? styles.rowActive : ''}`}
              onMouseEnter={() => setActiveRow(row.id)}
              onMouseLeave={() => setActiveRow(null)}
            >
              {/* Input */}
              <div className={styles.col}>
                {row.inputs.length > 0 && (
                  <div className={styles.inputBox}>
                    {row.inputs.join(' + ')}
                  </div>
                )}
              </div>

              {/* Arrow + Calculation */}
              <div className={styles.col}>
                {row.inputs.length > 0 && <Arrow />}
                {row.calculation && (
                  <div className={`${styles.calcBox} ${row.id === 'set' ? styles.setLabel : ''}`}>
                    {row.calculation.split('\n').map((line, i) => (
                      <span key={i}>{line}{i < row.calculation.split('\n').length - 1 && <br />}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Losses + Gains */}
              <div className={styles.col}>
                {row.id !== 'set' && <Arrow />}
                <div className={styles.outputArea}>
                  {row.losses.map((l, i) => (
                    <div key={i} className={styles.outputBox} style={{ borderColor: l.color, color: l.color }}>
                      {l.label}
                      <span className={styles.val}>{formatVol(l.value)}</span>
                    </div>
                  ))}
                  {row.setValues && <BraceGroup items={row.setValues} />}
                  {row.gains.map((g, i) => (
                    <div key={i} className={`${styles.outputBox} ${styles.gainBox}`} style={{ borderColor: g.color, color: g.color }}>
                      {g.label}
                      <span className={styles.val}>{formatVol(g.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary totals */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <div className={styles.summaryBox} style={{ borderColor: '#f472b6' }}>
              <div className={styles.summaryLabel}>Total Losses</div>
              <div className={styles.summaryVal} style={{ color: '#f472b6' }}>{formatVol(calc.totalLoss)}</div>
            </div>
            <div className={styles.summaryMinus}>−</div>
            <div className={styles.summaryBox} style={{ borderColor: '#34d399' }}>
              <div className={styles.summaryLabel}>Total Gains</div>
              <div className={styles.summaryVal} style={{ color: '#34d399' }}>{formatVol(calc.totalGain)}</div>
            </div>
            <div className={styles.summaryMinus}>=</div>
            <div className={`${styles.summaryBox} ${styles.deficitBox}`}>
              <div className={styles.summaryLabel}>Your Daily Target</div>
              <div className={styles.summaryVal} style={{ color: '#22d3ee', fontSize: '1.4rem' }}>{formatVol(calc.deficit)}</div>
            </div>
          </div>
          <p className={styles.summaryNote}>
            Estimation of water deficit, which should be compensated by fluid intake.
          </p>
        </div>
      </div>
    </div>
  );
}
