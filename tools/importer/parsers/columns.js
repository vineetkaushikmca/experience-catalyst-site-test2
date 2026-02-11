/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Columns block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: columns
 *
 * Handles two patterns:
 * 1. Hero section: 2-column image grid (.w-layout-grid with .utility-aspect-1x1 children)
 * 2. CTA section: Text left + buttons right (.w-layout-grid.desktop-4-column)
 *
 * Block Structure (from markdown example):
 * | Columns |  |
 * | --- | --- |
 * | Column 1 content | Column 2 content |
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];
  const children = [...element.children];

  if (children.length >= 2) {
    // Build one row with N columns
    const row = children.map(child => {
      const cellContent = [];

      // Check for images inside the child
      const img = child.querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        cellContent.push(newImg);
      }

      // Check for headings
      const heading = child.querySelector('h1, h2, h3, h4');
      if (heading) {
        cellContent.push(heading);
      }

      // Check for paragraphs
      const paragraphs = child.querySelectorAll('p');
      paragraphs.forEach(p => cellContent.push(p));

      // Check for links/buttons
      const links = child.querySelectorAll('a');
      links.forEach(link => cellContent.push(link));

      // If no specific content found, use the child itself
      if (cellContent.length === 0) {
        cellContent.push(child);
      }

      return cellContent;
    });

    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
