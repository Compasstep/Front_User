# Front_User (React Client)

**CompassStep 사용자용 프론트엔드 클라이언트입니다.**  
Vite + React 기반으로 구성되어 있으며, Zustand를 이용해 전역 상태를 관리하고 Axios를 통해 서버와 통신합니다.

---

## 환경 세팅 (필수 라이브러리)

### 1. 프로젝트 초기화
```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```
### 2. 주요 라이브러리 설치
```bash
1. 페이지 이동 및 관리
npm install react-router-dom
```
```bash
2. 전역 데이터(상태) 관리 — zustand
npm install zustand
```
```bash
3. 서버 API 통신 — axios
npm install axios
```
```bash
4. 데이터 시각화 차트 — react-chartjs-2
npm install react-chartjs-2 chart.js
```
```bash
5. 컴포넌트 스타일링 — styled-components
npm install styled-components
```
```bash
6. 시각화 차트
npm install react-chartjs-2 chart.js
npm install chartjs-plugin-datalabels
```
### 3. 실행 방법
```bash
npm run dev
```

개발 서버 실행 후 http://localhost:5173
에서 프로젝트를 확인할 수 있습니다.

