import { formatCurrency, formatDate } from "@/lib/utils";

type ResultsSummaryCardProps = {
  totalHours: number;
  hourlyRate: number;
  totalAmount: number;
};

export default function ResultsSummaryCard({
  totalHours,
  hourlyRate,
  totalAmount
}: ResultsSummaryCardProps) {
  const currentDate = formatDate(new Date());
  
  return (
    <div className="card animate-scaleIn mb-6 shadow-soft hover:shadow-glow transition-all duration-300">
      <div className="card-header p-4 sm:p-5">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#93EC93] to-[#7dd87d] rounded-full flex items-center justify-center mr-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#364949]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            </div>
            <div className="text-xl sm:text-2xl leading-6 font-semibold tracking-[-0.6px] text-[#f5f5f5]">
              Summary
            </div>
          </div>
          
          <div className="flex items-center text-sm sm:text-base">
            <span className="text-[#9fd6e9] mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-[#f5f5f5] bg-[#364949] px-2 py-1 rounded-full text-xs sm:text-sm">
              {currentDate}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-body px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="summary-box gradient-border animate-fadeUp p-3 sm:p-4" style={{animationDelay: "0.1s"}}>
            <p className="summary-label flex items-center text-sm sm:text-base mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-[#ffeed6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Hours
            </p>
            <p className="summary-value text-lg sm:text-xl">{totalHours}</p>
          </div>
          <div className="summary-box gradient-border animate-fadeUp p-3 sm:p-4" style={{animationDelay: "0.2s"}}>
            <p className="summary-label flex items-center text-sm sm:text-base mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-[#9fd6e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hourly Rate
            </p>
            <p className="summary-value-blue animate-pulse text-lg sm:text-xl">
              ${(Math.floor(hourlyRate * 100) / 100).toFixed(2).replace(/\.?0+$/, '')}
            </p>
          </div>
          <div className="summary-box gradient-border animate-fadeUp p-3 sm:p-4" style={{animationDelay: "0.3s"}}>
            <p className="summary-label flex items-center text-sm sm:text-base mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-[#dd7895]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Total Distributed
            </p>
            <p className="summary-value-accent text-lg sm:text-xl">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
