export function DropZone({ children, className = "", ...props }) {
  return (
    <div
      className={`drop-zone ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
