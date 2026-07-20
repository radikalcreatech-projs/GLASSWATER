import { CheckCircle2, Building2, Star, ShieldCheck } from 'lucide-react';

export function TrustBar() {
  return (
    <div className="bg-navy text-white py-6 text-center">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around gap-6">
        <div className="flex items-center justify-center gap-2 font-medium">
          <CheckCircle2 className="text-gold w-5 h-5" /> 150+ Projects
        </div>
        <div className="flex items-center justify-center gap-2 font-medium">
          <Building2 className="text-gold w-5 h-5" /> Commercial & Industrial
        </div>
        <div className="flex items-center justify-center gap-2 font-medium">
          <Star className="text-gold w-5 h-5" /> 98% Client Satisfaction
        </div>
        <div className="flex items-center justify-center gap-2 font-medium">
          <ShieldCheck className="text-gold w-5 h-5" /> ISO-Certified Processes
        </div>
      </div>
    </div>
  );
}
