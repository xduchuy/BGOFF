---
name: ClearCut Design System
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#43474f'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#405f91'
  primary: '#001736'
  on-primary: '#ffffff'
  primary-container: '#002b5b'
  on-primary-container: '#7594ca'
  inverse-primary: '#a9c7ff'
  secondary: '#636037'
  on-secondary: '#ffffff'
  secondary-container: '#e7e1ae'
  on-secondary-container: '#67643b'
  tertiary: '#081922'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d2e37'
  on-tertiary-container: '#8496a0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#264778'
  secondary-fixed: '#eae4b1'
  secondary-fixed-dim: '#cdc897'
  on-secondary-fixed: '#1e1c00'
  on-secondary-fixed-variant: '#4b4822'
  tertiary-fixed: '#d3e5f1'
  tertiary-fixed-dim: '#b7c9d5'
  on-tertiary-fixed: '#0c1e26'
  on-tertiary-fixed-variant: '#384953'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  title-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  safe-area-bottom: 34px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
The design system is built on the philosophy of **Refined Utility**. It balances the precision of a professional creative tool with the approachability of a modern mobile application. The target audience includes content creators, e-commerce entrepreneurs, and digital hobbyists who value speed and "one-tap" perfection.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes generous whitespace to reduce cognitive load while employing translucent layers and subtle background blurs to suggest depth and focus. The aesthetic is "Premium Tooling"—clean, intentional, and highly responsive to touch.

**Key Principles:**
- **Clarity First:** The interface should never compete with the user's imagery.
- **Tactile Precision:** Every interactive element should feel substantial and deliberate.
- **Modern Professionalism:** Avoidance of clutter in favor of high-contrast, structured layouts.

## Colors
The palette is rooted in high-contrast sophistication.
- **Primary (Deep Blue):** Used for primary buttons, active states, and dominant headings to project authority and trust.
- **Accent (Creamy Yellow):** Reserved for highlights, secondary call-to-actions, and subtle attention-grabbing elements. It provides a warm, human contrast to the cold blue.
- **Background (Ivory White):** The canvas of the app. It uses a very subtle linear gradient (from `#FDFCF8` to `#F0F9FF`) to prevent screen fatigue and add a sense of premium finish.
- **Surface:** Translucent white layers (`rgba(255, 255, 255, 0.7)`) with `backdrop-filter: blur(12px)` are used for floating panels and navigation bars to maintain context of the underlying image.

## Typography
This design system uses **Geist** for its technical precision and modern geometric construction. The typeface communicates a "developer-tool" level of accuracy while remaining legible for general consumers.

- **Headlines:** Use Bold and Semi-Bold weights with tight letter spacing for a punchy, editorial feel.
- **Body Text:** Standardizes on a 16px base for optimal readability on mobile devices.
- **Labels:** Small, uppercase labels are used for utility functions and metadata to differentiate from actionable text.
- **Hierarchy:** Deep Blue is the default color for headlines; Body text uses a slightly desaturated version of the primary color to reduce harshness.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for handheld use. 
- **Grid:** A 4-column grid for mobile, scaling to 12-columns for desktop.
- **Margins:** A consistent 20px margin on mobile edges ensures content doesn't feel cramped.
- **Safe Areas:** Strict adherence to iPhone safe-areas (top notch and bottom home indicator) is required for all fixed navigation elements.
- **Rhythm:** An 8px linear scale is used for all internal component spacing (padding, gaps).
- **Tooling Area:** The central workspace (image preview) is treated as a flexible container that prioritizes maximum vertical real estate.

## Elevation & Depth
Depth is created through **Glassmorphic Tonal Layers** rather than heavy shadows.
- **Level 0 (Background):** The Ivory/Pale Blue gradient.
- **Level 1 (Cards/Panels):** Pure white with a 5% opacity Deep Blue border and a very soft, large-radius shadow (`box-shadow: 0 10px 30px rgba(0, 43, 91, 0.05)`).
- **Level 2 (Modals/Overlays):** Translucent white with backdrop blur (`blur: 16px`) and a slightly stronger shadow to indicate temporary priority.
- **Interactions:** Buttons "lift" on press via a subtle increase in shadow spread and a 2% scale increase, providing tactile feedback.

## Shapes
The shape language is defined by large, friendly radii.
- **Standard Elements:** 0.5rem (8px) for small inputs and tags.
- **Cards & Primary Containers:** 1.5rem (24px) to create a soft, premium feel.
- **Action Sheets:** Top-only radius of 2rem (32px).
- **Transparency Grid:** Previews use a custom 8px checkerboard pattern (Light Gray/White) to indicate removed backgrounds, contained within the 24px rounded image container.

## Components
- **Buttons:** Minimum height of 52px for primary actions. Primary buttons use Deep Blue with white text; Secondary buttons use the Creamy Yellow. High-radius corners (24px+).
- **Progress Bars:** Thin, Deep Blue tracks with a "light trail" (a glowing white-to-transparent gradient) that moves across the progress fill to indicate active processing.
- **Chips:** Used for filter selection. 32px height, Soft radius (8px). Active state uses Deep Blue with white text.
- **Input Fields:** Frameless look with a subtle bottom border or a translucent white background. Labels sit above the field in Geist Semi-Bold.
- **Transparency Workspace:** A dedicated component featuring a grid background. It must include a "Before/After" slider with a circular handle (44px diameter) for easy thumb manipulation.
- **Cards:** White or translucent surfaces. Must always have a 24px corner radius and a 1px soft border in `#E0F2FE`.