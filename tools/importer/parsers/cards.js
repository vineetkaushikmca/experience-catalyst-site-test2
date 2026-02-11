/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Cards block
 *
 * Source: https://wknd-trendsetters.site
 * Base Block: cards
 *
 * Handles two patterns:
 * 1. Feature cards (no images): .w-layout-grid with div children containing SVG icon + paragraph
 *    - Source: .flex-horizontal.flex-gap-xxs with div (SVG) + p.utility-margin-bottom-0
 * 2. Blog cards (with images): .w-layout-grid with <a> children containing img + metadata + h3 + p + CTA
 *    - Source: a.utility-link-content-block containing grid > img + div with tag/time/h3/p/read
 *
 * Block Structure (from markdown example):
 * | Cards |  |
 * | --- | --- |
 * | image | text content |
 *
 * Generated: 2026-02-11
 */
export default function parse(element, { document }) {
  const cells = [];
  const children = [...element.children];

  children.forEach(child => {
    // Detect blog card pattern: child is an <a> link with image
    const isLinkCard = child.tagName === 'A';
    const img = child.querySelector('img');

    if (isLinkCard && img) {
      // Blog card with image: image | text content
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';

      // Extract text content
      const contentElements = [];

      // Tag and read time
      const tagEl = child.querySelector('.tag-text, [class*="tag"]');
      const readTimeEl = child.querySelector('[class*="read-time"], .small-text');

      // Try to find tag/time from the card's metadata area
      const metaDivs = child.querySelectorAll('[class*="flex-horizontal"] > div');
      if (metaDivs.length >= 2) {
        const metaText = document.createElement('p');
        metaText.textContent = `${metaDivs[0].textContent.trim()} · ${metaDivs[1].textContent.trim()}`;
        contentElements.push(metaText);
      }

      // Heading
      const heading = child.querySelector('h3, h4, [class*="heading"]');
      if (heading) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        contentElements.push(strong);
      }

      // Description paragraph
      const desc = child.querySelector('p:not(.small-text):not([class*="tag"])');
      if (desc) {
        contentElements.push(desc);
      }

      // CTA link
      const ctaText = child.querySelector('[class*="read"], [class*="cta"]');
      if (ctaText) {
        const link = document.createElement('a');
        link.href = child.href || '#';
        link.textContent = ctaText.textContent.trim();
        contentElements.push(link);
      }

      cells.push([[newImg], contentElements]);
    } else {
      // Feature card (no image, text only): single column
      const text = child.querySelector('p, [class*="description"]');
      if (text) {
        cells.push([text.textContent.trim()]);
      } else {
        cells.push([child.textContent.trim()]);
      }
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
  element.replaceWith(block);
}
