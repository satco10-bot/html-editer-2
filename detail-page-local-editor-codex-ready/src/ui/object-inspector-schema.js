export const OBJECT_INSPECTOR_SCHEMA = Object.freeze({
  sections: Object.freeze([
    Object.freeze({
      id: 'transform',
      title: 'Transform',
      fields: Object.freeze([
        Object.freeze({ key: 'x', label: 'X' }),
        Object.freeze({ key: 'y', label: 'Y' }),
        Object.freeze({ key: 'w', label: 'W' }),
        Object.freeze({ key: 'h', label: 'H' }),
      ]),
    }),
    Object.freeze({
      id: 'appearance',
      title: 'Appearance',
      fields: Object.freeze([
        Object.freeze({ key: 'opacity', label: 'Opacity' }),
        Object.freeze({ key: 'display', label: 'Display' }),
        Object.freeze({ key: 'visibility', label: 'Visibility' }),
      ]),
    }),
    Object.freeze({
      id: 'layout',
      title: 'Layout',
      fields: Object.freeze([
        Object.freeze({ key: 'position', label: 'Position' }),
        Object.freeze({ key: 'zIndex', label: 'z-index' }),
      ]),
    }),
  ]),
  plugins: Object.freeze({
    text: Object.freeze({
      title: 'Text Plugin',
      fields: Object.freeze([
        Object.freeze({ key: 'fontSize', label: 'Font size' }),
        Object.freeze({ key: 'lineHeight', label: 'Line height' }),
        Object.freeze({ key: 'letterSpacing', label: 'Letter spacing' }),
        Object.freeze({ key: 'fontWeight', label: 'Weight' }),
        Object.freeze({ key: 'color', label: 'Color' }),
        Object.freeze({ key: 'textAlign', label: 'Align' }),
      ]),
    }),
    image: Object.freeze({
      title: 'Image Plugin',
      fields: Object.freeze([
        Object.freeze({ key: 'fit', label: 'Fit' }),
        Object.freeze({ key: 'position', label: 'Position' }),
      ]),
    }),
    vector: Object.freeze({
      title: 'Vector Plugin',
      fields: Object.freeze([
        Object.freeze({ key: 'borderRadius', label: 'Radius' }),
        Object.freeze({ key: 'background', label: 'Background' }),
        Object.freeze({ key: 'border', label: 'Border' }),
      ]),
    }),
  }),
});
