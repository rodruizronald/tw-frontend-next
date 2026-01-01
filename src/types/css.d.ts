/**
 * CSS Module Type Declarations
 *
 * Allows TypeScript to recognize CSS file imports without errors.
 * This is necessary for Next.js projects with strict TypeScript settings.
 */

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.sass' {
  const content: { [className: string]: string }
  export default content
}
