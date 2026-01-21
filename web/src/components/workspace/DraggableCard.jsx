import { useMemo, useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import "./DraggableCard.css";

/**
 * DraggableCard - HTML5 Drag & Drop wrapper with accessibility
 *
 * @param {Object} item - Optional item object with id/type/label/payload
 * @param {string} id - Unique identifier for the draggable item
 * @param {string} type - Type of draggable (for drop zone filtering)
 * @param {boolean} disabled - Disable dragging
 * @param {string} label - Accessible label for screen readers
 * @param {function} onDragStart - Callback when drag starts
 * @param {function} onDragEnd - Callback when drag ends
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Content to render
 */
export function DraggableCard({
  item,
  id: idProp,
  type: typeProp = "card",
  disabled = false,
  label: labelProp = "Draggable item",
  onDragStart: onDragStartProp,
  onDragEnd: onDragEndProp,
  className = "",
  children,
  ...props
}) {
  const resolvedId = idProp ?? item?.id;
  const resolvedType = typeProp ?? item?.type ?? "card";
  const resolvedLabel = labelProp ?? item?.label ?? item?.name ?? "Draggable item";

  const [isDragging, setIsDragging] = useState(false);
  const [isKeyboardDrag, setIsKeyboardDrag] = useState(false);
  const cardRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: resolvedId || labelProp,
    data: {
      id: resolvedId,
      type: resolvedType,
      label: resolvedLabel,
      payload: item?.data ?? item,
    },
    disabled,
  });

  const attrs = useMemo(() => {
    return {
      "data-draggable": disabled ? "false" : "true",
      "data-dnd-type": resolvedType,
      "data-dnd-id": resolvedId ?? "",
    };
  }, [disabled, resolvedType, resolvedId]);

  const handleDragStart = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    setIsDragging(true);

    // Set drag data with both simple and JSON formats for compatibility
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", resolvedId);
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: resolvedId,
        type: resolvedType,
        label: resolvedLabel,
        timestamp: Date.now(),
      })
    );

    // Visual feedback
    if (event.dataTransfer.setDragImage) {
      const dragImage = document.createElement("div");
      dragImage.style.opacity = "0.8";
      dragImage.textContent = resolvedLabel;
      event.dataTransfer.setDragImage(dragImage, 0, 0);
    }

    // Call parent handler
    onDragStartProp?.({ id: resolvedId, type: resolvedType, label: resolvedLabel });
  };

  const handleDragEnd = (event) => {
    setIsDragging(false);
    event.dataTransfer.dropEffect = "none";
    onDragEndProp?.({ id: resolvedId, type: resolvedType });
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    // Space/Enter to activate drag mode
    if ((event.code === "Space" || event.code === "Enter") && !isKeyboardDrag) {
      event.preventDefault();
      setIsKeyboardDrag(true);
      // Announce to screen readers
      cardRef.current?.setAttribute("aria-grabbed", "true");
    }

    // Escape to cancel
    if (event.code === "Escape" && isKeyboardDrag) {
      event.preventDefault();
      setIsKeyboardDrag(false);
      cardRef.current?.setAttribute("aria-grabbed", "false");
      onDragEndProp?.({ id: resolvedId, type: resolvedType });
    }
  };

  const handleKeyUp = (event) => {
    // Tab away to drop
    if (isKeyboardDrag && event.code === "Tab") {
      setIsKeyboardDrag(false);
      cardRef.current?.setAttribute("aria-grabbed", "false");
      onDragEndProp?.({ id: resolvedId, type: resolvedType });
    }
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        setNodeRef(node);
      }}
      {...attrs}
      className={`draggable-card ${isDragging ? "is-dragging" : ""} ${
        isKeyboardDrag ? "is-keyboard-drag" : ""
      } ${disabled ? "is-disabled" : ""} ${className}`}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-draggable={!disabled}
      aria-grabbed={isKeyboardDrag}
      aria-label={resolvedLabel}
      aria-disabled={disabled}
      style={style}
      {...listeners}
      {...attributes}
      {...props}
    >
      {!disabled && (
        <div className="draggable-card__handle" aria-hidden="true">
          <GripVertical size={16} />
        </div>
      )}
      <div className="draggable-card__content">{children}</div>
    </div>
  );
}
