import React from "react";
import styled, { css } from "styled-components";

/** 참고용 프리셋 텍스트(가로 카드, 클릭 동작 없음) */
export const EMOTIONS = [
  { id: "sad-melody",        label: "[슬픈] 감정을 표현한 멜로디 레퍼런스",     glyph: "🎻" },
  { id: "us-chart-trend",    label: "[미국] 최신 차트의 사운드 트렌드",         glyph: "📈" },
  { id: "iu-style-ref",      label: "[아이유] 스타일의 보컬/가사 레퍼런스",      glyph: "🎤" },
  { id: "dance-bass-unique", label: "['Dance Monkey']처럼 [베이스]가 독특한 곡", glyph: "🎧" },
];

/**
 * 프리셋 안내 카드
 * - 어떤 props를 넘겨도 행동하지 않음(참고용 텍스트 전용)
 * - 가로 스크롤 가능, 사이트 다크 톤에 맞춘 스타일
 */
export default function EmotionPicker({
  emotions = EMOTIONS,
  className,
  ariaLabel = "검색 예시 프리셋",
}) {
  return (
    <Wrap className={className} aria-label={ariaLabel} role="list">
      <Scroller>
        {emotions.map((em) => (
          <Card key={em.id} role="listitem" tabIndex={-1} aria-hidden={false}>
            <Glyph aria-hidden>{em.glyph}</Glyph>
            <Label>{em.label}</Label>
          </Card>
        ))}
      </Scroller>
    </Wrap>
  );
}

/* styles */
const Wrap = styled.div`
  width: 100%;
  background: rgba(30,34,38,0.65);
  border: 1px solid #30353a;
  border-radius: 16px;
  padding: 12px;
  color: #e6e9ec;
`;

const Scroller = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(240px, 1fr);
  gap: 12px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: #3a3f45 transparent;

  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb {
    background: #3a3f45; border-radius: 8px;
  }
`;

const Card = styled.div`
  ${css`
    border: 1px solid #3a3f45;
    background: rgba(37,42,48,0.95);
  `}
  display: grid;
  grid-template-columns: 56px 1fr;
  align-items: center;
  column-gap: 14px;

  min-height: 96px;
  padding: 16px;
  border-radius: 16px;
  color: #f0f3f6;
  user-select: text;     /* 복사 용이 */
  cursor: default;       /* 클릭 유도 방지 */
`;

const Glyph = styled.div`
  width: 56px; height: 56px;
  display: grid; place-items: center;
  font-size: 28px; line-height: 1;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
`;

const Label = styled.div`
  font-size: 14px;
  line-height: 1.45;
  color: #e8edf2;
  word-break: keep-all;
`;

const Hint = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #b9c1c9;
  opacity: .9;
`;
