// src/store/userStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/client';

// 세션 확인에 사용할 가벼운 보호 API (존재하는 보호 엔드포인트로 교체 가능)
const SESSION_PING_PATH = '/user/mypage/posts/me';

const useUserStore = create(
  persist(
    (set, get) => ({
      // ===== 인증 상태 =====
      isLoggedIn: false,
      user: null,
      csrfToken: null,

      // ===== 부트스트랩/하이드레이션 플래그 =====
      hydrated: false,     // 로컬 스토리지에서 복원 완료 여부
      authChecked: false,  // 서버에 세션 핑(1회) 완료 여부

      // ===== 사이드 내비 상태/액션 (기존 유지) =====
      isNavOpen: false,
      openNav:  () => set({ isNavOpen: true }),
      closeNav: () => set({ isNavOpen: false }),
      toggleNav: () => set((s) => ({ isNavOpen: !s.isNavOpen })),

      // ===== 인증 액션 =====
      setLoginState: ({ isLoggedIn = true, user = null, csrfToken = null }) =>
        set((s) => ({
          isLoggedIn,
          user: user ?? s.user,
          csrfToken: csrfToken ?? s.csrfToken,
        })),

      logout: async () => {
        try {
          await api.post('/user/auth/logout');
        } catch (_) {
          // 서버 세션 만료 등은 무시하고 클라이언트 상태만 정리
        } finally {
          set({ isLoggedIn: false, user: null, csrfToken: null });
        }
      },

      // 앱 시작/새로고침 시: 쿠키 세션 유효 여부 확인(1회)
      bootstrapAuth: async () => {
        if (get().authChecked) return; // 이미 확인함
        try {
          const res = await api.get(SESSION_PING_PATH, { params: { page: 1, size: 1 } });
          const maybeUser = res?.data?.user ?? res?.data?.result?.user ?? get().user;
          set({ isLoggedIn: true, user: maybeUser, authChecked: true });
        } catch (e) {
          // 401 포함: 세션 없음
          set({ isLoggedIn: false, user: null, csrfToken: null, authChecked: true });
        }
      },
    }),
    {
      name: 'cs-auth',
      storage: createJSONStorage(() => localStorage),
      // 인증 스냅샷만 저장(쿠키는 브라우저가 관리)
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        user: s.user,
        csrfToken: s.csrfToken,
      }),
      // 스토어 복원 완료 플래그
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export default useUserStore;
