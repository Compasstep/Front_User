// src/components/WordCloudCompat.jsx
import React from 'react';
import { Wordcloud } from '@visx/wordcloud';
import { scaleLog, scaleOrdinal } from 'd3-scale';

export default function WordCloudCompat({
  words = [],                  // [{ text, value }]
  width = 600,
  height = 600,
  options = {},                // { rotations, rotationAngles, fontFamily, fontSizes:[min,max], padding, spiral, colors }
}) {
  const {
    rotations = 2,
    rotationAngles = [0, 90],
    fontFamily = 'sans-serif',
    fontSizes = [20, 80],
    padding = 1,
    spiral = 'archimedean',
    colors = ['#FACD66', '#FFC107', '#4CAF50', '#2196F3', '#F44336', '#9C27B0', '#FFFFFF', '#EEEEEE'],
  } = options;

  // 값 스케일
  const safeWords = (Array.isArray(words) ? words : []).map(w => ({
    text: String(w?.text ?? ''),
    value: Number(w?.value ?? 1) || 1,
  }));
  const maxVal = Math.max(1, ...safeWords.map(w => w.value));
  const fontScale = scaleLog().domain([1, maxVal]).range(fontSizes);

  // 회전
  const rotate = () => {
    if (rotations <= 1) return 0;
    const step = (rotationAngles[1] - rotationAngles[0]) / Math.max(1, rotations - 1);
    const idx = Math.floor(Math.random() * rotations);
    return rotationAngles[0] + idx * step;
  };

  // 색상
  const colorScale = scaleOrdinal(colors);

  return (
    <svg width={width} height={height} role="img" aria-label="wordcloud">
      <Wordcloud
        words={safeWords}
        width={width}
        height={height}
        font={fontFamily}
        fontSize={(w) => fontScale(w.value)}
        rotate={rotate}
        padding={padding}
        spiral={spiral}
        random={() => Math.random()}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <text
              key={`${w.text}-${i}`}
              textAnchor="middle"
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate || 0})`}
              fontFamily={fontFamily}
              fontSize={w.size}
              fill={colorScale(w.text)}
              style={{ userSelect: 'none' }}
            >
              {w.text}
            </text>
          ))
        }
      </Wordcloud>
    </svg>
  );
}
