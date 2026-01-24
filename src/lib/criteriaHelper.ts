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
    if (!trimmed) return false;

    // HEURISTIC: If the whole line starts and ends with BOLD markers (**Text**),
    // it's likely a Category Header, not a sub-item, even if it has a number.
    // We allow up to 100 characters for long technical subjects.
    const boldHeaderRegex = /^(\d+[\.\)]\s+)?\*\*.+\*\*$/;
    if (boldHeaderRegex.test(trimmed) && trimmed.length < 100) {
        return false;
    }

    // Explicit check: If it starts with double asterisk, it's NOT a sub-item record.
    // This prevents "**Heading**" from being treated as "* Heading" (a list item).
    if (trimmed.startsWith('**')) return false;

    // Otherwise, if it starts with a marker (number or bullet) FOLLOWED BY A SPACE, it's a sub-item.
    // We require a space after single bullets -, *, > to avoid clashing with formatting.
    return /^([->*]\s|\d+[\.\)])/.test(trimmed);
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
 * Supports strings containing internal newlines by flattening them first.
 */
export function groupCriteria(items: string[]): CriteriaGroup[] {
    if (!items) return [];

    // Flatten any items that might contain newlines (common in some database seeds)
    const flatItems = items.flatMap(item =>
        (typeof item === 'string' ? item.split('\n') : [])
            .map(s => s.trim())
            .filter(s => s !== '')
    );

    const groups: CriteriaGroup[] = [];

    flatItems.forEach((item, idx) => {
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
