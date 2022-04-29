/**
 * Determine if the content is megamenu
 *
 * @param content
 * @returns {boolean}
 */
export default function detectAmMegaMenuRenderer(content) {
  return /child_categories_content/.test(content);
}
