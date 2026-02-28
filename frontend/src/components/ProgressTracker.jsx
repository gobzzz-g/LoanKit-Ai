import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';

const ProgressTracker = ({ currentStage, session }) => {
  const stages = [
    { id: 'GREETING', label: 'Login', description: 'Customer Entry' },
    { id: 'SALES', label: 'Requirements', description: 'Understanding Needs' },
    { id: 'DOCUMENT_UPLOAD', label: 'Documents', description: 'Verification' },
    { id: 'VERIFICATION', label: 'KYC', description: 'Verification' },
    { id: 'UNDERWRITING', label: 'Credit Check', description: 'Eligibility' },
    { id: 'DECISION', label: 'Decision', description: 'Approval/Rejection' },
  ];

  const getStageIndex = (stage) => {
    const index = stages.findIndex(s => s.id === stage);
    return index;
  };
  const currentIndex = getStageIndex(currentStage);

  const getStageStatus = (index) => {
    if (stages[index].id === 'DECISION' && currentStage === 'DECISION' && session.underwritingResult) {
      return 'complete';
    }
    if (index < currentIndex) return 'complete';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'complete':
        return 'text-green-300 bg-green-500/20 border-green-400/50';
      case 'active':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/50';
      default:
        return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  const displayStages = stages.filter(stage => {
    if (stage.id === 'DOCUMENT_UPLOAD' && currentStage === 'DOCUMENT_UPLOAD') {
      return true;
    }
    if (stage.id === 'DOCUMENT_UPLOAD' && session.documentsUploaded && session.documentsUploaded.length > 0) {
      return true;
    }
    if (stage.id === 'DOCUMENT_UPLOAD') {
      return false;
    }
    return true;
  });

  return (
    <div className="backdrop-blur-lg bg-white/5 border-b border-white/20 py-3 sm:py-4">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        <div className="flex items-center justify-between overflow-x-auto">
          {displayStages.map((stage, displayIndex) => {
            const actualIndex = stages.findIndex(s => s.id === stage.id);
            const status = getStageStatus(actualIndex);
            const Icon = status === 'complete' ? CheckCircle : 
                        status === 'active' ? Loader2 : Clock;
            
            return (
              <div key={stage.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-[60px] sm:min-w-[80px]">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center mb-1 sm:mb-2 transition-all duration-300 backdrop-blur-lg ${getStageColor(status)} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${status === 'active' ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-center px-1">
                    <div className={`text-[10px] sm:text-xs font-semibold ${
                      status === 'complete' ? 'text-green-300' :
                      status === 'active' ? 'text-blue-300' :
                      'text-gray-400'
                    }`}>
                      {stage.label}
                    </div>
                    <div className="hidden sm:block text-[10px] text-blue-200/70 mt-0.5">
                      {stage.description}
                    </div>
                  </div>
                </div>
                
                {displayIndex < displayStages.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 sm:mb-6 transition-all duration-300 min-w-[20px] sm:min-w-[40px] ${
                    status === 'complete' ? 'bg-green-400/50' : 'bg-white/10'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Session Info */}
        {session.customer && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-blue-100">
            <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
              <div>
                <span className="font-medium text-blue-200">Pre-approved Limit:</span>{' '}
                <span className="font-semibold text-white">₹{session.customer.preApprovedLimit?.toLocaleString('en-IN')}</span>
              </div>
              {session.loanRequest?.amount && (
                <div>
                  <span className="font-medium text-blue-200">Requested:</span>{' '}
                  <span className="font-semibold text-white">₹{session.loanRequest.amount.toLocaleString('en-IN')}</span> for {session.loanRequest.tenure} months
                </div>
              )}
              {session.underwritingResult && (
                <div className={`font-semibold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  session.underwritingResult.decision === 'APPROVED' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {session.underwritingResult.decision === 'APPROVED' ? '✅ Approved' : '❌ Not Approved'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
