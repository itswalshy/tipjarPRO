import { PartnerPayout } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

type PartnerCardProps = {
  partner: PartnerPayout;
  hourlyRate: number;
};

// Get a CSS class based on denomination
const getBillClass = (denomination: number): string => {
  switch(denomination) {
    case 20: return "bg-[#d2b0e3] text-[#364949]"; // Purple for $20
    case 10: return "bg-[#dd7895] text-[#364949]"; // Pink for $10
    case 5: return "bg-[#ffd1ba] text-[#364949]";  // Orange for $5
    case 1: return "bg-[#ffeed6] text-[#364949]";  // Yellow for $1
    default: return "bg-[#93ec93] text-[#364949]"; // Green fallback
  }
};

export default function PartnerCard({ partner, hourlyRate }: PartnerCardProps) {  
  return (
    <div className="card animate-fadeUp overflow-hidden shadow-soft gradient-border hover:shadow-glow transition-all duration-300 group">
      <div className="card-header flex flex-row justify-between items-center py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-[#364949] to-[#2a3a3a] rounded-full flex items-center justify-center mr-4 border-2 border-[#93ec93] shadow-md group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#93ec93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-[#f5f5f5] m-0 truncate pr-2 group-hover:text-[#93ec93] transition-colors duration-300">{partner.name}</h3>
            <p className="text-xs text-[#9fd6e9] opacity-75 m-0">Partner</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-[#ffeed6] font-medium mb-1">Total Payout</span>
          <span className="text-2xl font-bold text-[#dd7895] whitespace-nowrap">${partner.rounded}</span>
        </div>
      </div>
      
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-3 bg-[#364949] rounded-md p-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#9fd6e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-[#ffeed6]">Hours:</span>
          </div>
          <span className="bg-[#1E3535] px-3 py-1 rounded-full text-[#f5f5f5] text-sm font-medium">{partner.hours}</span>
        </div>
        
        <div className="bg-[#1E3535] rounded-md p-3 mb-2">
          <div className="text-xs mb-1 text-[#9fd6e9]">Calculation</div>
          <div className="text-sm flex flex-wrap items-center text-[#f5f5f5] break-words">
            <span className="mr-1 font-medium">{partner.hours}</span> 
            <span className="text-[#ffeed6] mx-1">×</span> 
            <span className="mx-1 text-[#9fd6e9] font-medium">${(Math.floor(hourlyRate * 100) / 100).toFixed(2)}</span>
            <span className="text-[#ffeed6] mx-1">=</span>
            <span className="mx-1 text-[#ffeed6] font-medium">${(partner.hours * hourlyRate).toFixed(2)}</span>
            <span className="text-[#ffeed6] mx-1">→</span>
            <span className="ml-1 font-bold text-[#dd7895]">${partner.rounded}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer p-3">
        <div className="w-full">
          <div className="mb-2 text-sm font-medium text-[#ffeed6] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Bill Breakdown:
          </div>
          <div className="flex flex-wrap gap-2">
            {[...partner.billBreakdown]
              .sort((a, b) => b.denomination - a.denomination) // Sort in descending order
              .map((bill, index) => {
                const billClass = getBillClass(bill.denomination);
                return (
                  <div
                    key={index}
                    className={`bill-badge ${billClass}`}
                    title={`${bill.quantity} bills of $${bill.denomination}`}
                  >
                    <span className="font-bold">{bill.quantity}</span>
                    <span className="mx-1">×</span>
                    <span>${bill.denomination}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
