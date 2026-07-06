# Industrial Barbell Length Calculator - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support / Contact](#support--contact)

## Architecture Overview

### Technology Stack

- **HTML5** - Semantic markup with ARIA-compatible form elements
- **CSS3** - Single stylesheet (`/tools/industrial-barbell-calculator/css/style.css`)
- **Vanilla JavaScript (ES6)** - No frameworks, no dependencies
- **No backend** - All computation occurs client-side

### File Structure

```
/tools/industrial-barbell-calculator/
├── index.html          # Main tool page (standalone)
├── css/
│   └── style.css       # All styling
└── js/
    └── app.js          # Calculation logic and DOM manipulation
```

### Component / Logic Breakdown

The tool consists of three logical layers:

1. **Presentation Layer** (`index.html`) - Form inputs, result container, diagram hint, disclaimer
2. **Styling Layer** (`style.css`) - Responsive card layout, form styling, result display
3. **Application Layer** (`app.js`) - Input validation, calculation engine, result rendering

## Data Schemas

### Constants

#### `ALL_LENGTHS` (Array)
Standard industrial barbell lengths available in production. All values in millimeters.

```javascript
const ALL_LENGTHS = [
  30, 32, 34, 35, 36, 38, 40, 42, 44, 46, 48, 50, 54, 58, 60, 65, 70
];
```

#### `BALL_PROTRUSION` (Object)
Ball diameter to protrusion mapping. Protrusion represents the approximate length of ball that sits outside the piercing hole (half of ball diameter).

```javascript
const BALL_PROTRUSION = {
  '3mm': 3,   // small / fine
  '4mm': 4,   // standard
  '5mm': 5    // large
};
```

### Input Fields

| Field ID | Type | Values | Default | Range |
|----------|------|--------|---------|-------|
| `hole-distance` | number | User input | `""` | 20-80 mm, step 0.5 |
| `ball-size` | select | `"3mm"`, `"4mm"`, `"5mm"` | `"4mm"` | - |
| `healing-stage` | select | `"fresh"`, `"healed"` | `"fresh"` | - |

### Calculation Variables

| Variable | Source | Type | Description |
|----------|--------|------|-------------|
| `dist` | `hole-distance` input | Number | Hole-to-hole distance in mm |
| `ball` | `ball-size` select | String | Ball diameter key (e.g. `"4mm"`) |
| `stage` | `healing-stage` select | String | `"fresh"` or `"healed"` |
| `protrusion` | `BALL_PROTRUSION[ball]` | Number | Ball protrusion per end |
| `clearance` | Derived from `stage` | Number | 4 for fresh, 2 for healed |
| `minRequired` | Calculated | Number | Minimum barbell length needed |
| `bestFit` | Calculated | Number | Closest available length >= minRequired |
| `nextUp` | Calculated | Number or null | Next available size above bestFit |

## Calculation / Logic Algorithms

### Main Function: `calculate()`

Triggered by click event on `#calc-btn`. Executes the following steps:

1. **Input Retrieval**
   - Parse `hole-distance` value as float
   - Read `ball-size` and `healing-stage` select values

2. **Validation**
   - Check if `dist` is a valid number between 20 and 80
   - If invalid, display error message and exit

3. **Protrusion Lookup**
   - Retrieve protrusion from `BALL_PROTRUSION[ball]`
   - Default to 4 if ball size not found

4. **Clearance Assignment**
   - If `stage === 'fresh'`: clearance = 4 mm
   - If `stage === 'healed'`: clearance = 2 mm

5. **Minimum Length Calculation**
   ```
   minRequired = dist + protrusion + clearance
   ```

6. **Best Fit Selection**
   - Find first element in `ALL_LENGTHS` where `l >= minRequired`
   - If no match found, use last element (70 mm)

7. **Next Size Up**
   - Find first element in `ALL_LENGTHS` where `l > bestFit`
   - Set to `null` if no larger size exists

8. **Result Rendering**
   - Call `buildResult()` with all calculated values
   - Insert HTML into `#results` container

### Helper Function: `buildResult(dist, ball, protrusion, stage, clearance, minRequired, bestFit, nextUp)`

Constructs the result HTML string with:

- Recommended barbell size display
- Stage label and ball size context
- Calculation breakdown table showing each component
- Size options (recommended and optional next size up)
- Gauge note (standard 14g recommendation)
- Healing advice based on stage selection

### Helper Function: `escHtml(s)`

Sanitizes user-provided strings for safe HTML insertion:

```javascript
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

## API Reference

### Public Functions

#### `calculate()`
- **Type**: Event handler
- **Trigger**: Click on `#calc-btn`
- **Parameters**: None (reads from DOM elements)
- **Returns**: void (renders to `#results` div)
- **Behavior**: Validates input, computes barbell length, displays result

#### `escHtml(s)`
- **Type**: Utility function
- **Parameters**: `s` (string) - Input to sanitize
- **Returns**: Sanitized string safe for HTML insertion
- **Behavior**: Escapes `&`, `<`, `>`, `"` characters

### Event Listeners

```javascript
calcBtn.addEventListener('click', calculate);
```

### DOM References

| Variable | Element ID | Type |
|----------|------------|------|
| `holeDist` | `hole-distance` | HTMLInputElement |
| `ballSize` | `ball-size` | HTMLSelectElement |
| `stageEl` | `healing-stage` | HTMLSelectElement |
| `calcBtn` | `calc-btn` | HTMLButtonElement |
| `resultDiv` | `results` | HTMLDivElement |

## Integration Guide

### Standalone Embedding

The tool is fully self-contained and can be embedded via iframe:

```html
<iframe
  src="https://poliinternational.com/tools/industrial-barbell-calculator/"
  width="100%"
  height="700"
  frameborder="0"
  title="Industrial Barbell Length Calculator"
></iframe>
```

### Theme Support

When loaded in an iframe, the tool automatically detects cross-origin context and:

1. Sets `data-theme="dark"` by default
2. Listens for `poli-theme` postMessage events:
   ```javascript
   window.addEventListener('message', function(e) {
     if (e.data && e.data.type === 'poli-theme') {
       document.documentElement.setAttribute('data-theme', e.data.light ? 'light' : 'dark');
     }
   });
   ```

### Dependencies

- **Zero external dependencies** - No jQuery, no React, no CDN resources
- **No API calls** - All computation is client-side
- **No cookies or localStorage** - Stateless operation

## Customization

### Available Modifications

1. **Barbell Lengths** - Modify `ALL_LENGTHS` array in `app.js` to add/remove available sizes
2. **Ball Protrusions** - Adjust `BALL_PROTRUSION` object values for different ball geometries
3. **Clearance Values** - Change the 4 mm (fresh) and 2 mm (healed) constants in `calculate()`
4. **Input Range** - Update `min`/`max` attributes on `#hole-distance` input and validation check
5. **Styling** - Override CSS variables in `style.css` for brand customization

### Theming

The tool supports light/dark themes via CSS custom properties. When embedded, theme can be controlled via postMessage. Standalone usage defaults to light theme.

## Performance

- **Bundle size**: Under 5 KB total (HTML + CSS + JS)
- **No network requests**: Zero external resources loaded
- **Computation**: Single synchronous calculation, no async operations
- **DOM manipulation**: One innerHTML update per calculation
- **Memory footprint**: Minimal - only 2 constant arrays/objects, 5 DOM references

## Browser Compatibility

| Feature | Support |
|---------|---------|
| ES6 (arrow functions, const/let, template literals) | Chrome 49+, Firefox 52+, Safari 10+, Edge 14+ |
| `Array.find()` | Chrome 45+, Firefox 25+, Safari 8+, Edge 12+ |
| `postMessage` API | Chrome 1+, Firefox 1+, Safari 4+, IE 8+ |
| CSS Custom Properties | Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+ |

No polyfills required for modern browsers (2016+).

## Security

### Input Handling

- **HTML escaping**: All user-facing strings passed through `escHtml()` before DOM insertion
- **Type validation**: `parseFloat()` with `isNaN()` check prevents non-numeric input
- **Range validation**: Input constrained to 20-80 mm with error message for out-of-range values
- **No eval()**: No dynamic code execution
- **No innerHTML with unsanitized data**: Only controlled string concatenation

### Cross-Origin Considerations

- `noindex, nofollow` meta tag prevents search engine indexing of iframe content
- Cross-origin messaging limited to `poli-theme` type check
- No sensitive data transmission

## Version History

### v1.0.0 (Current)

- Initial release
- Hole-to-hole distance input (20-80 mm range)
- Ball size selection (3mm, 4mm, 5mm)
- Healing stage toggle (fresh/healed)
- Automatic clearance calculation (4mm fresh, 2mm healed)
- Best-fit barbell length from 17 standard sizes
- Next size up recommendation
- Calculation breakdown display
- Healing advice based on stage
- Gauge recommendation note (14g standard)
- Dark/light theme support for iframe embedding
- Input sanitization via HTML escaping

## Support / Contact

For technical issues, feature requests, or integration assistance:

- **Email**: support@poliinternational.com
- **Tool URL**: https://poliinternational.com/tools/industrial-barbell-calculator/
- **Company**: Poli International - Serving tattoo & piercing studios

---

*Documentation generated from source code version 1.0.0*
