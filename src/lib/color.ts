/* Copyright (c) 2017 Dmitri Kourennyi */
/* See the file COPYING for copying permission. */
/* exported color */
'use strict';

let constrastRatio = 4.5;

interface Srgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getIntensity(srgb: Srgb): number {
  const rgbNormalized = [srgb.r / 255.0, srgb.g / 255.0, srgb.b / 255.0];
  const rgbLin = rgbNormalized.map((v) => {
    if (v <= 0.03928) {
      return v / 12.92;
    }

    return Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rgbLin[0] + 0.7152 * rgbLin[1] + 0.0722 * rgbLin[2];
}

export function isContrasty(fg: Srgb, bg: Srgb): boolean {
  const lumF = getIntensity(fg);
  const lumB = getIntensity(bg);

  const L1 = Math.max(lumF, lumB);
  const L2 = Math.min(lumF, lumB);

  return (L1 + 0.05) / (L2 + 0.05) > constrastRatio;
}

export function isTransparent(rgb: Srgb): boolean {
  return rgb.a === 0;
}

export function setContrastRatio(x: number): void {
  if (x < 1 || x > 21) {
    constrastRatio = 4.5;
  } else {
    constrastRatio = x;
  }
}

export function toRGB(s: string): Srgb {
  if (s === 'transparent') {
    return {r: 0, g: 0, b: 0, a: 0};
  }

  const parts = s.split(',', 4);

  const rgb: Srgb = {
    r: parseInt(parts[0].substr(parts[0].indexOf('(', 3) + 1), 10),
    g: parseInt(parts[1].trim(), 10),
    b: parseInt(parts[2].trim(), 10),
    a: 1,
  };

  if (parts[3]) {
    rgb.a = parseInt(parts[3].trim(), 10);
  }

  return rgb;
}
