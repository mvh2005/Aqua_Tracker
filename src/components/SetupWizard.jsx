import React, { useState, useMemo } from 'react';
import styles from './SetupWizard.module.css';
import { ACTIVITY_LEVELS, COUNTRIES, calculateWaterDeficit, formatVol } from '../utils/waterCalc';

const STEPS = ['Profile', 'Body', 'Lifestyle', 'Result'];

const DropIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6c-.5 2-2 4.3-4 6s-3 3.5-3 5.5a7 7 0 0 0 7 7z"/>
  </svg>
);

function StepIndicator({ current }) {
  return (
    <div className={styles.stepIndicator}>
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`${styles.step} ${i < current ? styles.stepDone : ''} ${i === current ? styles.stepActive : ''}`}>
            <div className={styles.stepDot}>{i < current ? '✓' : i + 1}</div>
            <span className={styles.stepLabel}>{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < current ? styles.stepLineDone : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function SetupWizard({ onComplete, existing }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:       existing?.name       || '',
    age:        existing?.age        || '',
    gender:     existing?.gender     || 'Male',
    weight:     existing?.weight     || '',
    weightUnit: existing?.weightUnit || 'kg',
    height:     existing?.height     || '',
    activity:   existing?.activity   || 'moderate',
    country:    existing?.country    || 'temperate',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calc = useMemo(() => {
    if (form.weight && form.height && form.age) {
      try { return calculateWaterDeficit(form); } catch { return null; }
    }
    return null;
  }, [form]);

  const canAdvance = () => {
    if (step === 0) return form.name.trim().length > 0 && form.age > 0;
    if (step === 1) return form.weight > 0 && form.height > 0;
    if (step === 2) return true;
    return false;
  };

  const submit = () => {
    if (!calc) return;
    onComplete({ ...form, dailyGoal: calc.deficit, calcBreakdown: calc });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrap}><DropIcon /></div>
          <h1 className={styles.title}>Aqua Tracker</h1>
          <p className={styles.subtitle}>Scientifically measure your daily hydration capacity</p>
        </div>

        <StepIndicator current={step} />

        {/* ── Step 0: Profile ── */}
        {step === 0 && (
          <div className={styles.fields}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Full Name</label>
              <input className={styles.input} placeholder="Your name" value={form.name}
                onChange={e => set('name', e.target.value)} />
            </div>
            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Age</label>
                <input className={styles.input} type="number" placeholder="25" min="1" max="120"
                  value={form.age} onChange={e => set('age', e.target.value)} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Gender</label>
                <div className={styles.btnToggleGroup}>
                  {['Male','Female','Other'].map(g => (
                    <button key={g} type="button"
                      className={`${styles.btnToggle} ${form.gender === g ? styles.btnToggleActive : ''}`}
                      onClick={() => set('gender', g)}>{g}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Body ── */}
        {step === 1 && (
          <div className={styles.fields}>
            <div className={styles.row2}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Body Weight</label>
                <div className={styles.inputInline}>
                  <input className={styles.input} type="number" placeholder="70" min="1" max="300"
                    value={form.weight} onChange={e => set('weight', e.target.value)} />
                  <select className={styles.select} value={form.weightUnit} onChange={e => set('weightUnit', e.target.value)}>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Height (cm)</label>
                <input className={styles.input} type="number" placeholder="175" min="50" max="250"
                  value={form.height} onChange={e => set('height', e.target.value)} />
              </div>
            </div>

            {form.weight && form.height && (
              <div className={styles.bsaPreview}>
                <span className={styles.bsaLabel}>Body Surface Area</span>
                <span className={styles.bsaVal}>
                  {calc ? `${calc.bsa} m²` : '—'}
                </span>
                <span className={styles.bsaNote}>DuBois formula → used to calculate skin evaporation</span>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Lifestyle ── */}
        {step === 2 && (
          <div className={styles.fields}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Activity Level</label>
              <div className={styles.optionList}>
                {ACTIVITY_LEVELS.map(a => (
                  <button key={a.id} type="button"
                    className={`${styles.optionBtn} ${form.activity === a.id ? styles.optionBtnActive : ''}`}
                    onClick={() => set('activity', a.id)}>
                    <div className={styles.optionBtnMain}>
                      <span className={styles.optionBtnLabel}>{a.label}</span>
                      <span className={styles.optionBtnFactor}>×{a.factor}</span>
                    </div>
                    <span className={styles.optionBtnDesc}>{a.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Climate / Region</label>
              <div className={styles.climateGrid}>
                {COUNTRIES.map(c => (
                  <button key={c.id} type="button"
                    className={`${styles.climateBtn} ${form.country === c.id ? styles.climateBtnActive : ''}`}
                    onClick={() => set('country', c.id)}>
                    {c.label}
                    <span className={styles.climateOffset}>
                      {c.offset > 0 ? `+${c.offset}ml` : c.offset === 0 ? 'baseline' : `${c.offset}ml`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Result ── */}
        {step === 3 && calc && (
          <div className={styles.result}>
            <div className={styles.resultGlow} />
            <div className={styles.resultTarget}>
              <div className={styles.resultLabel}>Your Measured Daily Capacity</div>
              <div className={styles.resultValue}>{formatVol(calc.deficit)}</div>
              <div className={styles.resultSub}>scientifically computed fluid intake</div>
            </div>

            <div className={styles.breakdown}>
              <div className={styles.breakdownTitle}>How it's calculated</div>
              <div className={styles.breakdownGrid}>
                <div className={styles.breakSection}>
                  <div className={styles.breakSectionHead} style={{ color: '#f472b6' }}>Losses</div>
                  <div className={styles.breakRow}>
                    <span>Skin evaporation</span>
                    <span className={styles.breakVal} style={{ color: '#22d3ee' }}>{formatVol(calc.skinEvaporation)}</span>
                  </div>
                  <div className={styles.breakRow}>
                    <span>Respiratory</span>
                    <span className={styles.breakVal} style={{ color: '#a78bfa' }}>{formatVol(calc.respiratoryLoss)}</span>
                  </div>
                  <div className={styles.breakRow}>
                    <span>Sweat</span>
                    <span className={styles.breakVal} style={{ color: '#fb923c' }}>{formatVol(calc.sweatLoss)}</span>
                  </div>
                  <div className={styles.breakRow}>
                    <span>Faecal</span>
                    <span className={styles.breakVal}>{formatVol(calc.faecalLoss)}</span>
                  </div>
                  <div className={styles.breakRow}>
                    <span>Urine</span>
                    <span className={styles.breakVal}>{formatVol(calc.urineLoss)}</span>
                  </div>
                  <div className={`${styles.breakRow} ${styles.breakTotal}`}>
                    <span>Total losses</span>
                    <span className={styles.breakVal} style={{ color: '#f472b6' }}>{formatVol(calc.totalLoss)}</span>
                  </div>
                </div>

                <div className={styles.breakSection}>
                  <div className={styles.breakSectionHead} style={{ color: '#34d399' }}>Gains</div>
                  <div className={styles.breakRow}>
                    <span>Metabolic water</span>
                    <span className={styles.breakVal} style={{ color: '#34d399' }}>{formatVol(calc.metabolicWater)}</span>
                  </div>
                  <div className={`${styles.breakRow} ${styles.breakTotal}`}>
                    <span>Total gains</span>
                    <span className={styles.breakVal} style={{ color: '#34d399' }}>{formatVol(calc.totalGain)}</span>
                  </div>

                  <div className={styles.breakInfo}>
                    <div className={styles.breakInfoRow}>
                      <span>BSA</span><span>{calc.bsa} m²</span>
                    </div>
                    <div className={styles.breakInfoRow}>
                      <span>BMR</span><span>{calc.bmr} kcal</span>
                    </div>
                    <div className={styles.breakInfoRow}>
                      <span>TDEE</span><span>{calc.caloricExpenditure} kcal</span>
                    </div>
                    <div className={styles.breakInfoRow}>
                      <span>Activity</span><span>{calc.activityLabel}</span>
                    </div>
                    <div className={styles.breakInfoRow}>
                      <span>Climate</span><span>{calc.climateLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.nav}>
          {step > 0 && (
            <button className={styles.btnBack} onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button className={styles.btnNext} disabled={!canAdvance()}
              onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          ) : (
            <button className={styles.btnStart} onClick={submit}>
              💧 Start Tracking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
