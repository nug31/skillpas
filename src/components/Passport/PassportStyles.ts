export const PASSPORT_DIMENSIONS = {
    width: 320,
    height: 460,
};

export const PASSPORT_COLORS = {
    cover: 'bg-[#1a472a]', // Dark Green for Indonesia/General passport feel, or maybe allow customization
    gold: 'text-[#C5A059]',
    page: 'bg-[#fdfaf5]', // Slightly off-white paper
    line: 'border-blue-200', // For lined pages
};

export const PAGE_TEXTURE = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' distinct='true'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`;
