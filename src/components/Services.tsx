import { useI18n } from '../context/I18nContext';
import { useState } from 'react';
import { Settings, Zap, Compass, HardHat, PenTool, ListChecks, Sofa, Hotel, Home, Paintbrush, Grid, DoorOpen, Droplets, ArrowDownSquare, Shield, Waves, Filter, Wrench, Building2, ClipboardList, TrendingUp } from 'lucide-react';

const serviceData = {
  engineering: {
    title: 'Engineering Services',
    cards: [
      { icon: Settings, title: 'Structural Engineering', desc: 'Design and analysis for commercial and industrial buildings.' },
      { icon: Zap, title: 'MEP Engineering', desc: 'Mechanical, electrical, and plumbing systems integration.' },
      { icon: Compass, title: 'Project Management', desc: 'End‑to‑end coordination from concept to commissioning.' }
    ]
  },
  construction: {
    title: 'Construction Services',
    cards: [
      { icon: HardHat, title: 'New Builds', desc: 'Ground‑up construction for commercial, residential and industrial.' },
      { icon: PenTool, title: 'Renovations', desc: 'Upgrade and modernize existing structures with minimal disruption.' },
      { icon: ListChecks, title: 'Project Management', desc: 'Full‑service construction management and site supervision.' }
    ]
  },
  fitout: {
    title: 'Interior Fit‑Out',
    cards: [
      { icon: Sofa, title: 'Office Fit‑Out', desc: 'Productive, ergonomic workspaces tailored to your brand.' },
      { icon: Hotel, title: 'Hospitality Interiors', desc: 'Hotels, restaurants, and leisure spaces with premium finishes.' },
      { icon: Home, title: 'Residential Interiors', desc: 'Luxury homes with attention to detail and comfort.' }
    ]
  },
  finishing: {
    title: 'Finishing Works',
    cards: [
      { icon: Paintbrush, title: 'Painting & Decorating', desc: 'High‑quality interior and exterior finishes.' },
      { icon: Grid, title: 'Flooring & Tiling', desc: 'Durable and aesthetic flooring solutions for every space.' },
      { icon: DoorOpen, title: 'Carpentry & Joinery', desc: 'Custom woodwork, doors, and cabinetry.' }
    ]
  },
  waterproofing: {
    title: 'Waterproofing & Building Protection',
    cards: [
      { icon: Droplets, title: 'Roof Waterproofing', desc: 'Protect against leaks with advanced membrane systems.' },
      { icon: ArrowDownSquare, title: 'Basement Waterproofing', desc: 'Keep underground spaces dry and safe.' },
      { icon: Shield, title: 'Damp‑Proofing', desc: 'Prevent moisture ingress in walls and foundations.' }
    ]
  },
  swimming: {
    title: 'Swimming Pool Engineering',
    cards: [
      { icon: Waves, title: 'Pool Design & Build', desc: 'Custom swimming pools for hotels, resorts and private homes.' },
      { icon: Filter, title: 'Filtration & Circulation', desc: 'State‑of‑the‑art systems for crystal‑clear water.' },
      { icon: Wrench, title: 'Maintenance & Repair', desc: 'Ongoing care to extend pool life and performance.' }
    ]
  },
  fm: {
    title: 'Facilities Management',
    cards: [
      { icon: Building2, title: 'Building Maintenance', desc: 'Scheduled and reactive maintenance for all building systems.' },
      { icon: ClipboardList, title: 'Asset Management', desc: 'Track and optimise your facility assets.' },
      { icon: TrendingUp, title: 'Energy Management', desc: 'Reduce costs with smart energy solutions.' }
    ]
  }
};

type TabKey = keyof typeof serviceData;

export function Services() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabKey>('engineering');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'engineering', label: 'Engineering' },
    { key: 'construction', label: 'Construction' },
    { key: 'fitout', label: 'Interior Fit‑Out' },
    { key: 'finishing', label: 'Finishing Works' },
    { key: 'waterproofing', label: 'Waterproofing' },
    { key: 'swimming', label: 'Swimming Pools' },
    { key: 'fm', label: 'Facilities Management' }
  ];

  const currentData = serviceData[activeTab];

  return (
    <section id="services" className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.services.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.services.sub')}</p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 mb-10 pb-4 md:pb-0 md:flex-wrap md:justify-center no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`snap-center whitespace-nowrap shrink-0 px-5 py-2.5 rounded-full font-semibold transition-colors font-sans text-sm md:text-base ${
                activeTab === tab.key
                  ? 'bg-navy text-white'
                  : 'bg-white/50 text-steel-blue hover:bg-steel-blue hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
          {currentData.cards.map((card, idx) => (
            <div key={idx} className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center bg-white p-8 rounded-lg shadow-sm border-t-4 border-gold hover:-translate-y-1.5 hover:shadow-lg transition-all">
              <card.icon className="w-10 h-10 text-gold mb-4" />
              <h3 className="font-sans font-semibold text-xl text-navy mb-3">{card.title}</h3>
              <p className="text-steel-blue leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
