import { create } from 'zustand';

// useUserStore 라는 이름의 저장소를 만듭니다.
const useUserStore = create((set) => ({
  // 초기 상태: 로그아웃 상태
  isLoggedIn: false,
  user: null,

  // 액션(상태를 변경하는 함수)들
  // 1. 로그인 액션
  login: () => {
    console.log('가짜 로그인을 실행합니다!');
    // 1초 후에 로그인 상태로 변경 (서버 통신 흉내)
    setTimeout(() => {
      set({ 
        isLoggedIn: true, 
        user: { name: '김태형', email: 'pm9909@naver.com' } 
      });
    }, 1000);
  },

  // 2. 로그아웃 액션
  logout: () => {
    set({ isLoggedIn: false, user: null });
  },

  // --- 메뉴 상태 추가 ---
  isNavOpen: false, // 메뉴가 닫혀있는 상태가 기본값
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })), // 현재 상태를 반전시키는 함수
}));

export default useUserStore;