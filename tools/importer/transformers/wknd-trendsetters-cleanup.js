/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for WKND Trendsetters website cleanup
 * Purpose: Remove non-content elements and fix Webflow-specific DOM issues
 * Applies to: www.wknd-trendsetters.site (all templates)
 * Generated: 2026-02-11
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow
 * - Page structure analysis from page migration
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform'
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove Webflow badge/branding
    // EXTRACTED: Found <a class="w-webflow-badge"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.w-webflow-badge'
    ]);

    // Remove navigation/header (handled separately)
    // EXTRACTED: Found <nav> and navbar elements in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'nav.navigation',
      '.navbar',
      '.w-nav'
    ]);

    // Remove footer (handled separately)
    // EXTRACTED: Found <footer class="section footer-section"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer-section'
    ]);

    // Fix Webflow overflow hidden on hero sections
    // EXTRACTED: Captured DOM showed .utility-overflow-hidden on hero section
    const overflowElements = element.querySelectorAll('.utility-overflow-hidden');
    overflowElements.forEach(el => {
      el.style.overflow = 'visible';
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove Webflow utility scripts and embeds
    WebImporter.DOMUtils.remove(element, [
      'script',
      'noscript',
      'link[rel="preconnect"]',
      'link[rel="modulepreload"]',
      'style'
    ]);

    // Clean up Webflow-specific data attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove Webflow node IDs
      const attrs = [...el.attributes];
      attrs.forEach(attr => {
        if (attr.name.startsWith('w-') || attr.name.startsWith('data-wf-') || attr.name === 'data-w-id') {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
