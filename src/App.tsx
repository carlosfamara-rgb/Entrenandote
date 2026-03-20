import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Timer, 
  TrendingUp, 
  Info, 
  ChevronRight, 
  Zap, 
  Target, 
  Trophy,
  Download,
  Droplets
} from 'lucide-react';
import { ZONES, PREDICTIONS } from './types';
import { 
  speedToPaceSeconds, 
  formatPace, 
  formatTotalTime, 
  calculatePaceAtPercent, 
  calculateTotalTime,
  calculateVAMFromTest
} from './utils/calculations';

export default function App() {
  const [vamSpeed, setVamSpeed] = useState<number>(15); // Default 15 km/h
  const [paceVAMSeconds, setPaceVAMSeconds] = useState<number>(240); // Default 4:00 min/km

  // Test Calculator State
  const [testDistance, setTestDistance] = useState<number>(2000);
  const [testMinutes, setTestMinutes] = useState<number>(7);
  const [testSeconds, setTestSeconds] = useState<number>(30);
  const [athleteName, setAthleteName] = useState<string>('');

  const handleDownloadPDF = async () => {
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default;

    // Generate HTML string with elite sports performance design (Refined, Single Page, No Black Backgrounds)
    const pdfHtml = `
      <div style="width: 720px; min-height: 1000px; padding: 30px; background-color: #F8FAFC !important; color: #0F172A !important; font-family: 'Inter', -apple-system, sans-serif !important; box-sizing: border-box !important; position: relative !important;">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Oswald:wght@700&display=swap" rel="stylesheet">
        
        <!-- Header Section -->
        <div style="display: flex !important; justify-content: space-between !important; align-items: flex-start !important; margin-bottom: 30px !important; border-bottom: 4px solid #0047AB !important; padding-bottom: 20px !important;">
          <div style="flex: 1 !important;">
            <h1 style="margin: 0 !important; font-family: 'Oswald', sans-serif !important; font-size: 32px !important; font-weight: 700 !important; font-style: italic !important; text-transform: uppercase !important; color: #0047AB !important; letter-spacing: -1.5px !important; line-height: 1 !important;">ENTRENANDOTE.ES</h1>
            <p style="margin: 4px 0 0 0 !important; font-size: 10px !important; font-weight: 700 !important; color: #64748B !important; text-transform: uppercase !important; letter-spacing: 3px !important;">FISIOLOGÍA DEL ENTRENAMIENTO</p>
          </div>
          <div style="text-align: right !important; flex: 1 !important;">
            <h2 style="margin: 0 !important; font-family: 'Oswald', sans-serif !important; font-size: 16px !important; font-weight: 700 !important; text-transform: uppercase !important; color: #0F172A !important; letter-spacing: 1px !important;">TEST</h2>
            <p style="margin: 4px 0 0 0 !important; font-size: 10px !important; font-weight: 700 !important; color: #0047AB !important; text-transform: uppercase !important; letter-spacing: 1.5px !important;">VELOCIDAD AERÓBICA MÁXIMA</p>
          </div>
        </div>

        <!-- Athlete Info Bar -->
        <div style="display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 25px !important; background-color: #FFFFFF !important; padding: 12px 20px !important; border-radius: 12px !important; border: 1px solid #E2E8F0 !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;">
          <div>
            <span style="font-size: 9px !important; font-weight: 700 !important; color: #94A3B8 !important; text-transform: uppercase !important; letter-spacing: 1px !important; display: block !important; margin-bottom: 2px !important;">ATLETA EVALUADO</span>
            <span style="font-size: 14px !important; font-weight: 900 !important; color: #0F172A !important; text-transform: uppercase !important;">${athleteName || 'PENDIENTE DE REGISTRO'}</span>
          </div>
          <div style="text-align: right !important;">
            <span style="font-size: 9px !important; font-weight: 700 !important; color: #94A3B8 !important; text-transform: uppercase !important; letter-spacing: 1px !important; display: block !important; margin-bottom: 2px !important;">FECHA DE EMISIÓN</span>
            <span style="font-size: 12px !important; font-weight: 700 !important; color: #0F172A !important;">${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</span>
          </div>
        </div>

        <!-- Card 1: VAM Summary (Scoreboard Style) -->
        <div style="margin-bottom: 30px !important;">
          <div style="background-color: #FFFFFF !important; border-radius: 16px !important; border: 1px solid #E2E8F0 !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; overflow: hidden !important; display: flex !important;">
            <div style="background-color: #0047AB !important; padding: 30px !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; min-width: 220px !important;">
              <span style="font-size: 10px !important; font-weight: 700 !important; color: #FFFFFF !important; text-transform: uppercase !important; letter-spacing: 2px !important; margin-bottom: 5px !important; opacity: 0.8 !important;">VELOCIDAD VAM</span>
              <div style="display: flex !important; align-items: baseline !important; gap: 5px !important;">
                <span style="font-size: 64px !important; font-weight: 900 !important; color: #FFFFFF !important; font-style: italic !important; line-height: 1 !important;">${vamSpeed.toFixed(1)}</span>
                <span style="font-size: 18px !important; font-weight: 700 !important; color: #BEF32A !important; text-transform: uppercase !important;">km/h</span>
              </div>
              <div style="margin-top: 15px !important; background-color: transparent !important; color: transparent !important; font-size: 10px !important; font-weight: 900 !important; padding: 4px 12px !important; border-radius: 20px !important; text-transform: uppercase !important; letter-spacing: 1px !important;">&nbsp;</div>
            </div>
            
            <div style="flex: 1 !important; padding: 30px !important; display: grid !important; grid-template-columns: 1fr 1fr 1fr !important; gap: 20px !important; align-content: center !important;">
              <div style="border-right: 1px solid #F1F5F9 !important; padding-right: 10px !important;">
                <p style="margin: 0 !important; font-size: 9px !important; font-weight: 700 !important; color: #94A3B8 !important; text-transform: uppercase !important;">Ritmo Objetivo VAM</p>
                <p style="margin: 2px 0 0 0 !important; font-size: 20px !important; font-weight: 900 !important; font-style: italic !important; color: #0047AB !important;">${formatPace(paceVAMSeconds)} <span style="font-size: 10px !important; font-weight: 600 !important; color: #94A3B8 !important; font-style: normal !important;">min/km</span></p>
              </div>
              <div style="border-right: 1px solid #F1F5F9 !important; padding-right: 10px !important;">
                <p style="margin: 0 !important; font-size: 9px !important; font-weight: 700 !important; color: #94A3B8 !important; text-transform: uppercase !important;">Distancia del Test</p>
                <p style="margin: 2px 0 0 0 !important; font-size: 20px !important; font-weight: 900 !important; font-style: italic !important;">${testDistance} <span style="font-size: 10px !important; font-weight: 600 !important; color: #94A3B8 !important; font-style: normal !important;">metros</span></p>
              </div>
              <div>
                <p style="margin: 0 !important; font-size: 9px !important; font-weight: 700 !important; color: #94A3B8 !important; text-transform: uppercase !important;">Tiempo Total</p>
                <p style="margin: 2px 0 0 0 !important; font-size: 20px !important; font-weight: 900 !important; font-style: italic !important;">${testMinutes}:${testSeconds.toString().padStart(2, '0')} <span style="font-size: 10px !important; font-weight: 600 !important; color: #94A3B8 !important; font-style: normal !important;">min</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Training Zones -->
        <div style="margin-bottom: 30px !important;">
          <h3 style="font-family: 'Oswald', sans-serif !important; font-size: 16px !important; font-weight: 700 !important; text-transform: uppercase !important; color: #0F172A !important; margin-bottom: 15px !important; display: flex !important; align-items: center !important; gap: 10px !important;">
            <span style="width: 4px !important; height: 18px !important; background-color: #0047AB !important; display: inline-block !important;"></span>
            ZONAS DE ENTRENAMIENTO PERSONALIZADAS
          </h3>
          
          <div style="display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 12px !important;">
            ${ZONES.map(zone => {
              const minPace = calculatePaceAtPercent(paceVAMSeconds, zone.maxPercent);
              const maxPace = calculatePaceAtPercent(paceVAMSeconds, zone.minPercent);
              return `
                <div style="background-color: #FFFFFF !important; border-radius: 12px !important; border: 1px solid #E2E8F0 !important; padding: 15px !important; display: flex !important; align-items: center !important; gap: 15px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;">
                  <div style="font-size: 28px !important; font-weight: 900 !important; font-style: italic !important; color: #0047AB !important; line-height: 1 !important; min-width: 40px !important;">${zone.name}</div>
                  <div style="flex: 1 !important;">
                    <h4 style="margin: 0 !important; font-size: 11px !important; font-weight: 800 !important; text-transform: uppercase !important; color: #1E293B !important;">${zone.description}</h4>
                    <p style="margin: 2px 0 0 0 !important; font-size: 16px !important; font-weight: 900 !important; font-style: italic !important; color: #0F172A !important;">${formatPace(minPace)} - ${formatPace(maxPace)}</p>
                    <p style="margin: 1px 0 0 0 !important; font-size: 8px !important; font-weight: 600 !important; color: #64748B !important; text-transform: uppercase !important;">${zone.minPercent}% - ${zone.maxPercent}% VAM</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Card 3: Predictions -->
        <div style="margin-bottom: 30px !important;">
          <h3 style="font-family: 'Oswald', sans-serif !important; font-size: 16px !important; font-weight: 700 !important; text-transform: uppercase !important; color: #0F172A !important; margin-bottom: 15px !important; display: flex !important; align-items: center !important; gap: 10px !important;">
            <span style="width: 4px !important; height: 18px !important; background-color: #0047AB !important; display: inline-block !important;"></span>
            PREDICCIONES DE COMPETICIÓN
          </h3>
          
          <div style="background-color: #FFFFFF !important; border-radius: 16px !important; border: 1px solid #E2E8F0 !important; overflow: hidden !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;">
            <table style="width: 100% !important; border-collapse: collapse !important;">
              <thead>
                <tr style="background-color: #F8FAFC !important; border-bottom: 2px solid #E2E8F0 !important;">
                  <th style="padding: 12px 20px !important; text-align: left !important; font-size: 10px !important; font-weight: 800 !important; text-transform: uppercase !important; color: #64748B !important; letter-spacing: 1px !important;">Distancia</th>
                  <th style="padding: 12px 20px !important; text-align: left !important; font-size: 10px !important; font-weight: 800 !important; text-transform: uppercase !important; color: #64748B !important; letter-spacing: 1px !important;">Intensidad</th>
                  <th style="padding: 12px 20px !important; text-align: left !important; font-size: 10px !important; font-weight: 800 !important; text-transform: uppercase !important; color: #64748B !important; letter-spacing: 1px !important;">Ritmo</th>
                  <th style="padding: 12px 20px !important; text-align: right !important; font-size: 10px !important; font-weight: 800 !important; text-transform: uppercase !important; color: #64748B !important; letter-spacing: 1px !important;">Tiempo Meta</th>
                </tr>
              </thead>
              <tbody>
                ${PREDICTIONS.map((prediction, index) => {
                  const pace = calculatePaceAtPercent(paceVAMSeconds, prediction.percentVAM);
                  const totalTime = calculateTotalTime(prediction.distance, pace);
                  const isMarathon = prediction.name.toLowerCase().includes('maratón') && !prediction.name.toLowerCase().includes('media');
                  return `
                    <tr style="border-bottom: 1px solid #F1F5F9 !important; background-color: ${index % 2 === 0 ? '#FFFFFF' : '#FAFBFC'} !important;">
                      <td style="padding: 12px 20px !important; font-size: 12px !important; font-weight: 800 !important; font-style: italic !important; color: #0F172A !important;">${prediction.name}</td>
                      <td style="padding: 12px 20px !important; font-size: 11px !important; color: #64748B !important; font-weight: 700 !important;">${prediction.percentVAM}% VAM</td>
                      <td style="padding: 12px 20px !important; font-size: 12px !important; font-weight: 700 !important; color: #0F172A !important;">${formatPace(pace)}</td>
                      <td style="padding: 12px 20px !important; font-size: 14px !important; font-weight: 900 !important; font-style: italic !important; text-align: right !important; color: ${isMarathon ? '#0047AB' : '#0F172A'} !important;">${formatTotalTime(totalTime)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    const opt = {
      margin: 10,
      filename: `Reporte_VAM_${athleteName || 'Atleta'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        windowWidth: 700,
        logging: true,
        delay: 1000
      },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(pdfHtml).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      window.print();
    }
  };

  const applyTestResult = () => {
    const calculatedVAM = calculateVAMFromTest(testDistance, testMinutes, testSeconds);
    if (calculatedVAM > 0) {
      setVamSpeed(parseFloat(calculatedVAM.toFixed(2)));
      setPaceVAMSeconds(speedToPaceSeconds(calculatedVAM));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="no-print">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-lime-400/5 blur-[100px] rounded-full" />
        </div>

        {/* Header */}
        <header className="relative border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-lg shadow-lg shadow-indigo-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">
                ENTRENANDOTE<span className="text-indigo-500">.ES</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fisiología del entrenamiento</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="https://tasadesudoracion.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-black uppercase italic tracking-widest text-slate-500 hover:text-indigo-400 transition-colors border-r border-slate-800 pr-8"
            >
              <Droplets className="w-3.5 h-3.5" />
              Tasa de Sudoración
            </a>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ritmo VAM</p>
              <p className="text-xl font-black text-indigo-400">{formatPace(paceVAMSeconds)} <span className="text-xs font-normal text-slate-500 italic">min/km</span></p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto p-6 md:p-12 space-y-16">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-transparent opacity-50" />
          <div className="pl-8 pr-4 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-8xl font-black italic uppercase leading-[0.9] tracking-tight"
            >
              Calcula <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-lime-400">Tus Umbrales</span>
            </motion.h2>
            <p className="text-slate-400 max-w-2xl text-lg font-medium">
              Calcula tu Velocidad Aeróbica Máxima (VAM) y optimiza tus zonas de entrenamiento con precisión científica.
            </p>
          </div>
        </section>

        {/* Test Calculator Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all shadow-2xl group">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-indigo-500/10 transition-colors">
                <Timer className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">Calculadora de Test</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre del Atleta</label>
                <input 
                  type="text" 
                  placeholder="Ej: Carlos"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Distancia</label>
                <select 
                  value={testDistance}
                  onChange={(e) => setTestDistance(parseInt(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                >
                  <option value={1500}>Atleta Iniciado / Jóvenes (1500 M)</option>
                  <option value={2000}>Atleta de Nivel Medio (2000 M)</option>
                  <option value={3000}>Atleta de Alto Rendimiento (3000 M)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Minutos</label>
                <input 
                  type="number" 
                  value={testMinutes}
                  onChange={(e) => setTestMinutes(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Segundos</label>
                <input 
                  type="number" 
                  value={testSeconds}
                  onChange={(e) => setTestSeconds(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <button 
              onClick={applyTestResult}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 text-white py-4 rounded-xl font-black uppercase italic tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              Calcular VAM
            </button>

            <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed">
                <p className="font-bold text-indigo-300 uppercase tracking-wider mb-1">Nota Fisiológica:</p>
                La prueba debe durar <span className="text-slate-200 font-bold">al menos 4 minutos</span> (lo ideal es entre <span className="text-slate-200 font-bold">5 y 6 minutos</span>). Se debe realizar con un <span className="text-slate-200 font-bold italic">esfuerzo máximo sostenido</span>. El factor fisiológico clave no es la distancia en sí, sino la <span className="text-indigo-400 font-bold italic">duración del estímulo</span>.
              </div>
            </div>


          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-lime-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Resultado Actual</span>
              </div>
              <h4 className="text-sm font-bold opacity-70 uppercase tracking-wider">Tu VAM es de</h4>
              <div className="text-6xl font-black italic tracking-tighter mt-2">
                {vamSpeed.toFixed(1)} <span className="text-xl font-normal opacity-60">km/h</span>
              </div>
            </div>

            <div className="relative pt-6 border-t border-white/10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ritmo Base</p>
                  <p className="text-3xl font-black italic tracking-tighter">{formatPace(paceVAMSeconds)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ritmo 80%</p>
                  <p className="text-xl font-bold">{formatPace(calculatePaceAtPercent(paceVAMSeconds, 80))}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownloadPDF}
              className="mt-6 flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.3)] text-xs font-black uppercase tracking-[0.25em] transition-all active:scale-[0.95] cursor-pointer border-2 border-lime-500/20"
            >
              <Download className="w-5 h-5" />
              Descargar Datos en PDF
            </button>
          </div>
        </section>

        {/* Training Zones Table */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <TrendingUp className="w-5 h-5 text-lime-400" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tight">Zonas de Entrenamiento</h3>
            </div>
            <div className="hidden sm:block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Basado en % de VAM
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {ZONES.map((zone, idx) => {
              const minPace = calculatePaceAtPercent(paceVAMSeconds, zone.maxPercent);
              const maxPace = calculatePaceAtPercent(paceVAMSeconds, zone.minPercent);
              
              return (
                <motion.div 
                  key={zone.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="text-5xl font-black italic text-slate-800 group-hover:text-indigo-500/20 transition-colors">
                        {zone.name}
                      </div>
                      <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tight group-hover:text-indigo-400 transition-colors">
                          {zone.description}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                          Intensidad: {zone.minPercent}% - {zone.maxPercent}% VAM {zone.name === 'Z4' ? '(VO2MAX)' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 md:text-right">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rango de Ritmo</p>
                        <p className="text-2xl font-black italic tracking-tighter text-lime-400">
                          {formatPace(minPace)} - {formatPace(maxPace)}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-800 rounded-xl group-hover:bg-indigo-500 transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Race Predictions */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tight">Predicciones de Marca</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PREDICTIONS.map((prediction, idx) => {
              const pace = calculatePaceAtPercent(paceVAMSeconds, prediction.percentVAM);
              const totalTime = calculateTotalTime(prediction.distance, pace);
              const isMarathon = prediction.name === 'Maratón';
              
              return (
                <motion.div 
                  key={prediction.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 rounded-2xl border transition-all group relative overflow-hidden ${
                    isMarathon 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-900 border-indigo-500 shadow-2xl shadow-indigo-500/20' 
                      : 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  {isMarathon && (
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 blur-2xl rounded-full" />
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className={`text-2xl font-black uppercase italic tracking-tighter ${isMarathon ? 'text-white' : 'text-slate-100'}`}>
                        {prediction.name}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isMarathon ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {prediction.percentVAM}% VAM
                      </p>
                    </div>
                    <Target className={`w-6 h-6 ${isMarathon ? 'text-lime-400' : 'text-slate-700 group-hover:text-indigo-500'} transition-colors`} />
                  </div>
                  
                  <div className="space-y-1 mb-6">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isMarathon ? 'text-indigo-200' : 'text-slate-500'}`}>Tiempo Estimado</p>
                    <p className={`text-4xl font-black italic tracking-tighter ${isMarathon ? 'text-white' : 'text-indigo-400'}`}>
                      {formatTotalTime(totalTime)}
                    </p>
                  </div>
                  
                  <div className={`pt-4 border-t flex justify-between items-center ${isMarathon ? 'border-white/10' : 'border-slate-800'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isMarathon ? 'text-indigo-200' : 'text-slate-500'}`}>Ritmo</span>
                    <span className={`text-sm font-black italic ${isMarathon ? 'text-white' : 'text-slate-300'}`}>{formatPace(pace)} <span className="text-[10px] font-normal opacity-60">min/km</span></span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Method Info */}
        <section className="relative p-8 md:p-16 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/5 blur-[100px] -z-10" />
          
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                Metodología
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                El Método <br />
                <span className="text-indigo-500">Científico</span>
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed">
                Un enfoque científico basado en la suma de porcentajes de ritmo para optimizar la preparación de maratón.
              </p>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase italic tracking-tight text-indigo-400">Lógica de Ritmo</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Utiliza una relación directa donde el ritmo se incrementa proporcionalmente a la pérdida de intensidad respecto a la VAM.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase italic tracking-tight text-indigo-400">Umbrales Fisiológicos</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Identifica el LT1 (Umbral Aeróbico) y LT2 (Umbral Anaeróbico) para entrenar en las intensidades metabólicas correctas.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase italic tracking-tight text-indigo-400">Predicción de Marca</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  El 80% de la VAM representa el ritmo objetivo ideal para un maratonista bien preparado, maximizando la eficiencia lipídica.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-black uppercase italic tracking-tight text-indigo-400">Optimización VAM</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Mejorar la VAM eleva todos tus ritmos de entrenamiento, permitiéndote correr más rápido con el mismo esfuerzo relativo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VAM Test Protocol */}
        <section className="relative p-8 md:p-16 rounded-3xl bg-slate-900/40 border border-slate-800/50 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-indigo-500/5 blur-[120px] -z-10" />
          
          <div className="space-y-12">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                Protocolo
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                Protocolo del Test <br />
                <span className="text-indigo-500">de VAM (5-6 min)</span>
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed text-lg">
                Este protocolo está diseñado para obtener tu Velocidad Aeróbica Máxima de forma precisa. El objetivo es realizar un esfuerzo máximo constante que dure entre 5 y 6 minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black italic">1</div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">Consideraciones Previas</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-500">
                    <li className="leading-relaxed"><strong className="text-slate-300">Estado de Descanso:</strong> Es obligatorio llegar descansado. El día anterior debe ser de descanso total o de un rodaje muy suave (20-30 min) con 2-3 rectas de activación.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Terreno:</strong> El lugar ideal es una pista de atletismo (400m). Si no es posible, utiliza un tramo de asfalto totalmente llano.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Condiciones:</strong> Evita días de mucho viento o calor extremo. La temperatura ideal es entre 10°C y 18°C.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Nutrición:</strong> Realiza una comida ligera rica en hidratos de carbono 2-3 horas antes.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black italic">2</div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">El Calentamiento</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-500">
                    <li className="leading-relaxed"><strong className="text-slate-300">Rodaje de Activación:</strong> 15 a 20 minutos de carrera continua muy suave (Z1). Debes poder hablar sin dificultad.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Movilidad Dinámica:</strong> 5 minutos de ejercicios de movilidad. No realices estiramientos estáticos prolongados.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Rectas de Progresión:</strong> Realiza 4 a 5 rectas de 80-100 metros. La primera al 60% y la última al 90% de tu velocidad máxima.</li>
                    <li className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 italic">Nota: No son "series", son activadores. No deben producir fatiga, solo "chispa".</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black italic">3</div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">Ejecución del Test</h4>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-500">
                    <li className="leading-relaxed"><strong className="text-slate-300">La Salida:</strong> No salgas al 100% como si fuera un sprint. Sal al ritmo más alto que creas que puedes mantener durante 5-6 minutos.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Estrategia de Ritmo:</strong> Intenta ser constante durante toda la prueba.</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">El "Sprint" Final:</strong> Si al final sientes que puedes acelerar mucho, saliste demasiado lento. Debes terminar "vaciado".</li>
                    <li className="leading-relaxed"><strong className="text-slate-300">Registro:</strong> Es vital anotar el tiempo exacto (minutos y segundos) y la distancia recorrida.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black italic">4</div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">Post-Test</h4>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    No te detengas en seco. Camina 2 minutos y luego realiza un trote muy suave de 10 minutos para ayudar a la resíntesis del lactato acumulado.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-4">
                  <h4 className="text-sm font-black uppercase italic tracking-tight text-indigo-400">¿Qué distancia elegir?</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
                      <span className="text-xs text-slate-400 uppercase font-bold">Iniciado ({'>'} 5:00 min/km)</span>
                      <span className="text-sm font-black text-indigo-400 italic">1500m</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
                      <span className="text-xs text-slate-400 uppercase font-bold">Medio (3:45 - 4:45 min/km)</span>
                      <span className="text-sm font-black text-indigo-400 italic">2000m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 uppercase font-bold">Élite ({'<'} 3:30 min/km)</span>
                      <span className="text-sm font-black text-indigo-400 italic">3000m</span>
                    </div>
                  </div>
                  <p className="text-center text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest pt-4 border-t border-indigo-500/10">
                    Repite el protocolo para comparar resultados en el tiempo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hydration CTA Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5" />
          <div className="max-w-4xl mx-auto relative">
            <div className="p-8 md:p-12 rounded-3xl border border-indigo-500/20 bg-slate-900/40 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Droplets className="w-12 h-12 text-indigo-400" />
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                  ¿Quieres rendir <span className="text-indigo-400">mejor</span>?
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  Calcula tu <span className="text-slate-200">tasa de sudoración</span> y ajusta tu hidratación de forma científica para evitar la deshidratación y maximizar tu rendimiento deportivo.
                </p>
                <a 
                  href="https://tasadesudoracion.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic tracking-widest text-xs rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 group"
                >
                  Ir a tasadesudoracion.com
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-12 border-t border-slate-900 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            <span>Creado por Carlos Rodríguez</span>
          </div>
          <p className="text-[10px] text-slate-700 font-medium max-w-xs">
            Diseñado para atletas que buscan la excelencia a través de la ciencia del deporte.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-900/50 w-full max-w-xs">
            <a 
              href="https://tasadesudoracion.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-1"
            >
              <Droplets className="w-3 h-3" />
              Calcula tu Tasa de Sudoración
            </a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
