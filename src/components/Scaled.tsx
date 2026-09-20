/** Shows a drawing smaller (or larger) without CSS `zoom`, which older Safari ignores. The outer box has the
 *  scaled size, so layout (columns, rows, alignment) uses it; the drawing keeps its natural `width` x `height`
 *  inside and is painted through `transform: scale()`, which works the same in every browser. Give it the
 *  drawing's natural size in px. */
export function Scaled({
  width,
  height,
  scale,
  className,
  children,
}: {
  width: number;
  height: number;
  scale: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className} style={{ position: "relative", flexShrink: 0, width: width * scale, height: height * scale }}>
      <div style={{ position: "absolute", left: 0, top: 0, width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}
