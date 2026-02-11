/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Accordion block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: accordion
 *
 * Source DOM Structure (Webflow dropdown-based accordion):
 * - .flex-vertical container with 4 .w-dropdown items
 *   - .accordion.w-dropdown
 *     - .w-dropdown-toggle (question text)
 *     - .accordion-content.w-dropdown-list (answer text)
 *
 * Block Structure (from markdown example):
 * | Accordion |  |
 * | --- | --- |
 * | Question text | Answer text |
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find all accordion items (Webflow uses .w-dropdown for accordions)
  const items = element.querySelectorAll('.accordion, .w-dropdown');

  items.forEach(item => {
    // Extract question from toggle
    const toggle = item.querySelector('.w-dropdown-toggle');
    const question = toggle ? toggle.textContent.trim() : '';

    // Extract answer from dropdown list/content
    const content = item.querySelector('.w-dropdown-list, .accordion-content');
    const answer = content ? content.textContent.trim() : '';

    if (question) {
      cells.push([question, answer]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
  element.replaceWith(block);
}
