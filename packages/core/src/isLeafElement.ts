/**
 * Check if an element is a "leaf" content element that should be rendered as shimmer
 */
export function isLeafElement(element: Element): boolean {
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
