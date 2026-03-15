import React from 'react';
import { Check } from 'lucide-react';

function ProgressSteps({ steps, current }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center flex-1">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white transition-all ${index < current
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg'
                                    : index === current
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg animate-pulse'
                                        : 'bg-gray-300'
                                }`}>
                                {index < current ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${index <= current ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                {step}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-2 mb-6">
                                <div className={`h-full rounded transition-all ${index < current ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
                                    }`} />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default ProgressSteps;
