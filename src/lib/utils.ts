export function cn(
  ...classes: (
    | string
    | boolean
    | undefined
    | null
    | {
        [key: string]: boolean;
      }
  )[]
): string {
  return classes
    .filter(Boolean)
    .map((className) => {
      if (typeof className === "object") {
        return className
          ? Object.entries(className)
              .filter(([_, value]) => value)
              .map(([key]) => key)
              .join(" ")
          : "";
      }
      return className;
    })
    .join(" ");
}
