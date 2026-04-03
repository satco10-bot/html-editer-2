export function restoreSerializedAssetRefs(exportDoc, { keepEditedAssets = true } = {}) {
  for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
    if (keepEditedAssets) {
      if (img.dataset.exportSrc) img.setAttribute('src', img.dataset.exportSrc);
      else if (img.dataset.originalSrc) img.setAttribute('src', img.dataset.originalSrc);
    } else if (img.dataset.originalSrc) {
      img.setAttribute('src', img.dataset.originalSrc);
    }
    if (img.dataset.originalSrcset && !img.dataset.exportSrcset) img.setAttribute('srcset', img.dataset.originalSrcset);
    else if (!img.dataset.originalSrcset && !img.dataset.exportSrcset) img.removeAttribute('srcset');
    if (keepEditedAssets && img.dataset.exportSrcset) img.setAttribute('srcset', img.dataset.exportSrcset);
    img.removeAttribute('sizes');
  }

  for (const source of Array.from(exportDoc.querySelectorAll('source'))) {
    if (keepEditedAssets && source.dataset.exportSrcset) source.setAttribute('srcset', source.dataset.exportSrcset);
    else if (source.dataset.originalSrcset) source.setAttribute('srcset', source.dataset.originalSrcset);
  }

  for (const element of Array.from(exportDoc.querySelectorAll('[style]'))) {
    if (keepEditedAssets && element.dataset.exportStyle) element.setAttribute('style', element.dataset.exportStyle);
    else if (element.dataset.originalStyle) element.setAttribute('style', element.dataset.originalStyle);
  }

  for (const styleBlock of Array.from(exportDoc.querySelectorAll('style'))) {
    if (!styleBlock.dataset.originalCss) continue;
    try { styleBlock.textContent = decodeURIComponent(styleBlock.dataset.originalCss); } catch {}
  }
}
