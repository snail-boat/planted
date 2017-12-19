// support NodeJS modules without type definitions
declare module '*.css' {
    const styles: Record<string, string>;
    export = styles;
}
