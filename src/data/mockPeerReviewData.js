//-----------여긴 더미데이터 넣음. 추후 API 넣어서 이 부분 교체 예정-----------
// 미발매곡에 대한 지인 평가 상세 데이터
export const mockPeerReviewDetails = {
  artistName: 'Peter Kim',
  artistImage: '/artist_profile_placeholder.jpg', // public 폴더에 이미지가 있다고 가정
  songTitle: 'Dynamite.zip',
  comments: [
    {
      id: 1,
      nickname: '음악평론가123',
      rating: 5,
      text: '전체적인 사운드 밸런스가 너무 좋네요. 특히 후렴구의 멜로디 라인이 인상적입니다. 대박 예감!',
    },
    {
      id: 2,
      nickname: '리스너',
      rating: 4,
      text: '곡 분위기는 좋은데, 도입부가 살짝 길게 느껴지는 감이 있습니다. 조금 더 타이트하게 편집하면 완벽할 것 같아요.',
    },
  ],
};
//-------------------------------------------------------------------------