/**
 * Utility to parse and handle competency criteria with support for sub-items.
 * Convention:
 * - A main item is an entry in the array.
 * - A sub-item is an entry starting with a bullet (-) or number (1.) that follows a main item.
 */

export interface CriteriaGroup {
    main: string;
    subs: string[];
    startIndex: number;
}

/**
 * Detects if a string is a sub-item based on common patterns:
 * - Starts with a bullet: -, *, >
 * - Starts with a list number: 1., 2., 1), 2)
 */
export function isSubItem(text: string): boolean {
    const trimmed = text.trim();
    // If it contains bold markers like ** or *...*, it's a category header, not a sub-item
    // even if it starts with a number (e.g., 1. **Engine**)
    // We check for ** at any position or balanced * at start/end
    if (trimmed.includes('**') || (trimmed.startsWith('*') && trimmed.endsWith('*') && trimmed.length > 2)) {
        return false;
    }
    return /^[->*]\s|\d+[\.\)]\s/.test(trimmed);
}

/**
 * Removes sub-item markers from the start of the string for cleaner rendering.
 */
export function cleanSubItemText(text: string): string {
    // Only remove lead bullets like - or * or >
    // We keep numbers because users often want their specific numbering (e.g. 1. 2.)
    return text.trim().replace(/^[->*]\s*/, '');
}

/**
 * Groups a flat array of criteria strings into a hierarchical structure.
 */
export function groupCriteria(items: string[]): CriteriaGroup[] {
    const groups: CriteriaGroup[] = [];

    items.forEach((item, idx) => {
        if ((idx === 0) || !isSubItem(item) || groups.length === 0) {
            // Treat as main item (header)
            groups.push({ main: item, subs: [], startIndex: idx });
        } else {
            // Treat as sub-item of the last main item
            groups[groups.length - 1].subs.push(item);
        }
    });

    return groups;
}
