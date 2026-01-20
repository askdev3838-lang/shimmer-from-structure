import React, { useLayoutEffect, useState, useRef } from 'react';
import { ShimmerProps, ElementInfo } from './types';

/**
 * Check if an element is a "leaf" content element that should be rendered as shimmer
 */
function isLeafElement(element: Element): boolean {
  const tag = element.tagName.toLowerCase();

  // Always include these elements as they're always content
  const alwaysInclude = ['img', 'svg', 'video', 'canvas', 'iframe', 'input', 'textarea', 'button'];
  if (alwaysInclude.includes(tag)) {
    return true;
  }

  // Check if element has no element children (only text nodes or no children)
  const hasElementChildren = Array.from(element.children).length > 0;
  if (!hasElementChildren) {
    // This is a leaf element (contains only text or is empty)
    return true;
  }

  return false;
}

/**
 * Extracts dimension information from content-bearing elements in a DOM tree
 */
function extractElementInfo(element: Element, parentRect: DOMRect): ElementInfo[] {
  const elements: ElementInfo[] = [];
  const rect = element.getBoundingClientRect();

  // Skip elements with no dimensions
  if (rect.width === 0 || rect.height === 0) {
    return elements;
  }

  // If this is a leaf element, capture it
  if (isLeafElement(element)) {
    // Get computed border-radius from the element's styles
    const computedStyle = window.getComputedStyle(element);
    const computedBorderRadius = computedStyle.borderRadius || '0px';

    const info: ElementInfo = {
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
      width: rect.width,
      height: rect.height,
      tag: element.tagName.toLowerCase(),
      borderRadius: computedBorderRadius,
    };
    elements.push(info);
  } else {
    // Otherwise, recursively process children
    Array.from(element.children).forEach((child) => {
      elements.push(...extractElementInfo(child, parentRect));
    });
  }

  return elements;
}

/**
 * Shimmer component that adapts to the actual rendered structure of its children
 */
export const Shimmer: React.FC<ShimmerProps> = ({
  children,
  loading = true,
  shimmerColor = 'rgba(255, 255, 255, 0.15)',
  backgroundColor = 'rgba(255, 255, 255, 0.08)',
  duration = 1.5,
  fallbackBorderRadius = 4,
  templateProps,
}) => {
  const [elements, setElements] = useState<ElementInfo[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Prepare children with injected template props when loading
  const childrenToRender = React.useMemo(() => {
    // Only inject template props if loading and templateProps is provided
    if (!loading || !templateProps) {
      return children;
    }

    // Get the first child
    const childArray = React.Children.toArray(children);
    if (childArray.length === 0) {
      return children;
    }

    const firstChild = childArray[0];

    // Check if it's a valid React element that can receive props
    if (!React.isValidElement(firstChild)) {
      return children;
    }

    // Clone the first child with the template props spread onto it
    const clonedChild = React.cloneElement(firstChild, {
      ...templateProps,
    });

    // Return cloned first child + rest of children unchanged
    return [clonedChild, ...childArray.slice(1)];
  }, [children, loading, templateProps]);

  // Measure the structure using useLayoutEffect (synchronous, before paint)
  useLayoutEffect(() => {
    if (!loading || !measureRef.current) return;

    const container = measureRef.current;
    const containerRect = container.getBoundingClientRect();

    // Extract all element dimensions
    const extractedElements: ElementInfo[] = [];
    Array.from(container.children).forEach((child) => {
      extractedElements.push(...extractElementInfo(child, containerRect));
    });

    setElements(extractedElements);
  }, [loading, childrenToRender]);

  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Hidden version to measure - rendered invisibly in place */}
      <div
        ref={measureRef}
        style={{
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {childrenToRender}
      </div>

      {/* Shimmer overlay based on measured dimensions */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <style>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>

        {elements.map((element, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              backgroundColor,
              borderRadius: element.borderRadius === '0px'
                ? `${fallbackBorderRadius}px`
                : element.borderRadius,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                animation: `shimmer ${duration}s infinite`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
