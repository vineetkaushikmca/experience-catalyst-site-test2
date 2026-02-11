/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Tabs block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: tabs
 *
 * Source DOM Structure (Webflow):
 * - .w-tabs container
 *   - .w-tab-menu with .w-tab-link items (tab labels)
 *   - .w-tab-content with .w-tab-pane items (tab content: h3 + img)
 *
 * Block Structure (from markdown example):
 * | Tabs |  |
 * | --- | --- |
 * | Tab Label | Tab Content (heading + image) |
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract tab labels from tab menu
  const tabLinks = element.querySelectorAll('.w-tab-link');
  // Extract tab content panes
  const tabPanes = element.querySelectorAll('.w-tab-pane');

  tabLinks.forEach((tabLink, i) => {
    const label = tabLink.textContent.trim();
    const pane = tabPanes[i];

    const contentElements = [];

    if (pane) {
      // Extract heading from pane
      const heading = pane.querySelector('h3, h2, h4, [class*="heading"]');
      if (heading) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        contentElements.push(strong);
      }

      // Extract image from pane
      const img = pane.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        contentElements.push(newImg);
      }

      // Extract paragraphs from pane
      const paragraphs = pane.querySelectorAll('p');
      paragraphs.forEach(p => contentElements.push(p));
    }

    cells.push([label, contentElements]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });
  element.replaceWith(block);
}
