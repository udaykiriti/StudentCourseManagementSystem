import React from 'react';
import { ServerCrash, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

function StatusMessage({ type = 'info', message }) {
    if (!message) return null;

    const config = {
        error: {
            icon: <ServerCrash className="w-5 h-5 flex-shrink-0" />,
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            borderColor: 'border-red-200'
        },
        warning: {
            icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-200'
        },
        info: {
            icon: <Info className="w-5 h-5 flex-shrink-0" />,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
            borderColor: 'border-blue-200'
        },
        success: {
            icon: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            borderColor: 'border-green-200'
        }
    };

    const { icon, bgColor, textColor, borderColor } = config[type];

    return (
        <div className={`flex items-center space-x-3 ${bgColor} ${textColor} p-3 rounded-lg border ${borderColor}`}>
            {icon}
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

export default StatusMessage;
