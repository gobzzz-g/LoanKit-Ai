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
    // If DOCUMENT_UPLOAD stage is not active, skip it in progress display
    return index;
  };
  const currentIndex = getStageIndex(currentStage);

  const getStageStatus = (index) => {
    // If we're at DECISION stage and have an underwriting result, mark it as complete
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
        return 'text-success-600 bg-success-50 border-success-200';
      case 'active':
        return 'text-primary-600 bg-primary-50 border-primary-200';
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  // Filter out DOCUMENT_UPLOAD stage if documents are not required
  const displayStages = stages.filter(stage => {
    // Always show DOCUMENT_UPLOAD if it's the current stage
    if (stage.id === 'DOCUMENT_UPLOAD' && currentStage === 'DOCUMENT_UPLOAD') {
      return true;
    }
    // Show DOCUMENT_UPLOAD if we passed through it (has documentsUploaded)
    if (stage.id === 'DOCUMENT_UPLOAD' && session.documentsUploaded && session.documentsUploaded.length > 0) {
      return true;
    }
    // Hide DOCUMENT_UPLOAD if we skipped it
    if (stage.id === 'DOCUMENT_UPLOAD') {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between">
          {displayStages.map((stage, displayIndex) => {
            const actualIndex = stages.findIndex(s => s.id === stage.id);
            const status = getStageStatus(actualIndex);
            const Icon = status === 'complete' ? CheckCircle : 
                        status === 'active' ? Loader2 : Clock;
            
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${getStageColor(status)}`}>
                    <Icon className={`w-5 h-5 ${status === 'active' ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold ${
                      status === 'complete' ? 'text-success-600' :
                      status === 'active' ? 'text-primary-600' :
                      'text-gray-400'
                    }`}>
                      {stage.label}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {stage.description}
                    </div>
                  </div>
                </div>
                
                {displayIndex < displayStages.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-6 transition-all duration-300 ${
                    status === 'complete' ? 'bg-success-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Session Info */}
        {session.customer && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Pre-approved Limit:</span>{' '}
                ₹{session.customer.preApprovedLimit?.toLocaleString('en-IN')}
              </div>
              {session.loanRequest?.amount && (
                <div>
                  <span className="font-medium">Requested:</span>{' '}
                  ₹{session.loanRequest.amount.toLocaleString('en-IN')} for {session.loanRequest.tenure} months
                </div>
              )}
              {session.underwritingResult && (
                <div className={`font-semibold ${
                  session.underwritingResult.decision === 'APPROVED' ? 'text-success-600' : 'text-red-600'
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
