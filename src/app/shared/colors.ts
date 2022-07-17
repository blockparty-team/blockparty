export function color(cssVariable: string) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(cssVariable)
}