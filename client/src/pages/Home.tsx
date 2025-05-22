import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import FileDropzone from "@/components/FileDropzone";
import ResultsSummaryCard from "@/components/ResultsSummaryCard";
import PartnerPayoutsList from "@/components/PartnerPayoutsList";
import { useTipContext } from "@/context/TipContext";
import { apiRequest } from "@/lib/queryClient";
import { calculateHourlyRate } from "@/lib/utils";

export default function Home() {
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { toast } = useToast();
  const { 
    partnerHours, 
    distributionData, 
    setDistributionData
  } = useTipContext();

  const handleCalculate = async () => {
    if (!partnerHours.length) {
      toast({
        title: "No partner data",
        description: "Please upload a report with partner information",
        variant: "destructive"
      });
      return;
    }

    if (!tipAmount) {
      toast({
        title: "Missing tip amount",
        description: "Please enter the total tip amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const totalHours = partnerHours.reduce((sum, partner) => sum + partner.hours, 0);
      const hourlyRate = calculateHourlyRate(Number(tipAmount), totalHours);
      
      const res = await apiRequest(
        "POST", 
        "/api/distributions/calculate", 
        {
          partnerHours,
          totalAmount: Number(tipAmount),
          totalHours,
          hourlyRate
        }
      );
      
      const calculatedData = await res.json();
      setDistributionData(calculatedData);
      
      toast({
        title: "Distribution calculated",
        description: "Tip distribution calculated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Calculation failed",
        description: "An error occurred while calculating the distribution",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <main className="px-2 sm:px-4 max-w-full overflow-hidden">
      <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Input Section */}
        <div className="md:col-span-1">
          <div className="card animate-fadeIn shadow-soft">
            <div className="card-header">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#93EC93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-lg font-semibold tracking-tight text-[#f5f5f5]">
                  TipJar
                </div>
              </div>
            </div>
            <div className="card-body">
              <FileDropzone />
              
              <div className="mb-4 sm:mb-6 mt-4">
                <label htmlFor="tipAmount" className="input-label flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-[#93EC93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Total Tip Amount
                  <span className="ml-auto text-xs text-[#9fd6e9] opacity-75">Required</span>
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute top-0 bottom-0 left-0 flex items-center pl-4 z-10">
                    <span className="text-[#9fd6e9] font-semibold text-lg">$</span>
                  </div>
                  <input
                    id="tipAmount"
                    type="number"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value ? Number(e.target.value) : '')}
                    className="input-field input-field-dollar focus-ring text-lg font-medium"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    aria-describedby="tipAmount-help"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#93ec93]/10 to-[#9fd6e9]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                </div>
                <p id="tipAmount-help" className="mt-2 text-xs text-[#9fd6e9] opacity-75">
                  Enter the total amount to be distributed among partners
                </p>
              </div>
              
              <button
                onClick={handleCalculate}
                className="btn btn-primary btn-full focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isCalculating || !tipAmount || !partnerHours.length}
                aria-describedby="calculate-help"
              >
                {isCalculating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Calculate Distribution</span>
                  </>
                )}
              </button>
              <p id="calculate-help" className="mt-2 text-xs text-[#9fd6e9] opacity-75 text-center">
                {!partnerHours.length ? "Upload a report first" : !tipAmount ? "Enter tip amount to continue" : "Ready to calculate"}
              </p>
              
              <div className="mt-3 text-center text-[#f5f5f5]">
                <div className="font-medium">Made by William Walsh</div>
                <div className="text-xs text-[#9fd6e9]">Starbucks Store# 69600</div>
              </div>
            </div>
          </div>
          
          {/* Mobile-only results instruction */}
          {distributionData && (
            <div className="block md:hidden mt-4 p-3 rounded-md bg-[#364949] text-[#ffeed6] text-sm text-center animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-1 text-[#93EC93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
              Scroll down to see your distribution results
            </div>
          )}
        </div>
        
        {/* Middle/Right Column - Results Section */}
        <div className="md:col-span-2">
          {distributionData && (
            <div className="results-container">
              <ResultsSummaryCard 
                totalHours={distributionData.totalHours}
                hourlyRate={distributionData.hourlyRate}
                totalAmount={distributionData.totalAmount}
              />
              
              <PartnerPayoutsList distributionData={distributionData} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
