//-----------여긴 더미데이터 넣음. 추후 API 넣어서 이 부분 교체 예정-----------
// react-chartjs-2 라이브러리에서 사용할 차트 데이터들을 정의함.

// 1. 감성 분석(Sentiment Analysis) 도넛 차트 데이터
export const mockDoughnutData = {
  labels: ['Positive', 'Negative', 'Neutral'],
  datasets: [
    {
      data: [55, 30, 15], // 새로운 설계서 비율에 맞춤.
      backgroundColor: ['#4CAF50', '#F44336', '#E0E0E0'],
      borderColor: ['#3e4448'], // 컨테이너 색상에 맞춤.
      borderWidth: 5,
    },
  ],
};

// 2. 세부 감정 분포(Detailed Emotion) 수평 막대 차트 데이터
export const mockBarData = {
  labels: ['Joy', 'Energy', 'Hope', 'Chill'],
  datasets: [
    {
      label: 'Emotion Distribution',
      data: [95, 33, 55, 49],
      backgroundColor: ['#FF9800', '#2196F3', '#4CAF50', '#607D8B'],
    },
  ],
};

// 3. 탑 키워드(Top Keywords) 워드 클라우드 데이터 (확장 버전)
export const mockWordCloudData = [
  { text: 'BTS', value: 100 },
  { text: 'Dynamite', value: 95 },
  { text: 'dance', value: 80 },
  { text: 'performance', value: 75 },
  { text: 'MV', value: 70 },
  { text: 'energy', value: 85 },
  { text: 'song', value: 90 },
  { text: 'joy', value: 88 },
  { text: 'smile', value: 65 },
  { text: 'happy', value: 68 },
  { text: 'love', value: 78 },
  { text: 'hope', value: 60 },
  { text: 'retro', value: 55 },
  { text: 'legends', value: 58 },
  { text: 'funky', value: 45 },
  { text: 'ARMY', value: 62 },
  { text: 'style', value: 52 },
  { text: 'proud', value: 48 },
  { text: 'gift', value: 40 },
  { text: 'disco', value: 38 },
  { text: 'perfect', value: 66 },
  { text: 'upbeat', value: 53 },
  { text: 'vibe', value: 44 },
  { text: 'kings', value: 51 },
  { text: 'amazing', value: 59 },
  { text: 'pop', value: 35 },
  { text: 'healing', value: 42 },
  { text: 'summer', value: 30 },
  { text: 'light', value: 47 },
  { text: 'star', value: 33 },
  { text: 'chart', value: 25 },
  { text: 'global', value: 50 },
  { text: 'hit', value: 49 },
  { text: 'trend', value: 39 },
  { text: 'colorful', value: 37 },
];
//-------------------------------------------------------------------------