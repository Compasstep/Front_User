// src/components/ChartBox.jsx
import styled from 'styled-components';

// 차트 제목과 컨테이너를 포함하는 재사용 컴포넌트
function ChartBox({
  title = '차트',
  children = null,
  height = 450,
  padding = 25,
  radius = 16,
  centerTitle = true,
  className,
  style,
}) {
  return (
    <ChartContainer
      className={className}
      style={style}
      $height={height}
      $padding={padding}
      $radius={radius}
    >
      {title && <ChartTitle $center={centerTitle}>{title}</ChartTitle>}
      <ChartContent>{children}</ChartContent>
    </ChartContainer>
  );
}

export default ChartBox;

/* ── styled-components ───────────────────────────────────── */

const ChartContainer = styled.div`
  background-color: #2a2f32;
  padding: ${(p) => p.$padding}px;
  border-radius: ${(p) => p.$radius}px;
  display: flex;
  flex-direction: column;
  height: ${(p) => p.$height}px;

  /* 차트 내부 스크롤/리사이즈 안전 */
  min-height: 0;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  text-align: ${(p) => (p.$center ? 'center' : 'left')};
  font-size: 20px;
  color: #fff;
`;

const ChartContent = styled.div`
  flex-grow: 1;
  position: relative;
  min-height: 0; /* 차트 라이브러리 캔버스가 부모 높이를 넘지 않도록 */
`;
