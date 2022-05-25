export function pascalToKebabCase(pascalString: string): string {
    return pascalString
        .split(/[A-Z][a-z]+/g)
        .map((s) => s.toLocaleLowerCase())
        .join('-');
}

export function kebabToPascalCase(kebabString: string): string {
    return kebabString
        .split('-')
        .map((s) => s[0].toLocaleUpperCase() + s.substring(1))
        .join('');
}
