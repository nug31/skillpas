import React from 'react';

interface ProfileAvatarProps {
    name: string;
    avatarUrl?: string;
    photoUrl?: string;
    role?: 'student' | 'teacher';
    level?: string;
    variant?: 'gamified' | 'professional';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    jurusanColor?: string;
    className?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    name,
    avatarUrl,
    photoUrl,
    role = 'student',
    level,
    size = 'md',
    jurusanColor = '#3b82f6',
    className = '',
}) => {
    const isMaster = level?.toLowerCase().includes('master');
    const isAdvanced = level?.toLowerCase().includes('advanced');

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-20 h-20 text-xl',
        xl: 'w-32 h-32 text-3xl',
    };

    const getInitials = (n: string) => {
        return n
            .split(' ')
            .map((p) => p[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Prioritize real photo over generated avatar
    const displayImage = photoUrl || avatarUrl;

    const renderContent = () => {
        if (displayImage) {
            return (
                <img
                    src={displayImage}
                    alt={name}
                    className="w-full h-full object-cover rounded-full"
                />
            );
        }

        return (
            <div
                className="w-full h-full flex items-center justify-center rounded-full text-white font-bold"
                style={{
                    background: `linear-gradient(135deg, ${jurusanColor}, ${jurusanColor}88)`,
                }}
            >
                {getInitials(name)}
            </div>
        );
    };

    return (
        <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
            {/* Level Effects for Students */}
            {role === 'student' && (isMaster || isAdvanced) && (
                <div
                    className={`absolute -inset-1 rounded-full blur-sm opacity-70 animate-pulse ${isMaster ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}
                />
            )}

            {/* Main Avatar Container */}
            <div className={`
        relative w-full h-full rounded-full border-2 overflow-hidden
        ${role === 'teacher' ? 'border-white/30 p-0.5' : 'border-white/20'}
        ${isMaster ? 'border-yellow-400 ring-2 ring-yellow-400/20' : ''}
        ${isAdvanced ? 'border-blue-400 ring-2 ring-blue-400/20' : ''}
        bg-slate-800 shadow-xl transition-all duration-300
      `}>
                {renderContent()}
            </div>

            {/* Badge Overlay */}
            {level && size !== 'sm' && (
                <div className={`
          absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider
          ${isMaster ? 'bg-yellow-400 text-black' :
                        isAdvanced ? 'bg-blue-500 text-white' :
                            'bg-slate-700 text-white'}
          shadow-lg border border-white/20 z-10
        `}>
                    {level.split(' ')[0]}
                </div>
            )}
        </div>
    );
};
