// src/store/userStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/client';

const SESSION_PING_PATH = '/user/mypage/posts/me';

const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      csrfToken: null,

      hydrated: false,
      authChecked: false,

      // ========= 네비 처리 =========
      isNavOpen: false,
      openNav: () => set({ isNavOpen: true }),
      closeNav: () => set({ isNavOpen: false }),
      toggleNav: () => set((s) => ({ isNavOpen: !s.isNavOpen })),

      // ========= 로그인 상태 반영 =========
      setLoginState: ({ isLoggedIn = true, user = null, csrfToken = null }) =>
        set((s) => ({
          isLoggedIn,
          user: user ?? s.user,
          csrfToken: csrfToken ?? s.csrfToken,
        })),

      // ========= 🔥 프로필 수정 (최신 버전) =========
      updateProfile: async ({ nickname, avatarUrl }) => {
        try {
          if (nickname) {
            await api.patch('/user/profile/nickname', { nickname });
          }

          if (avatarUrl) {
            await api.patch('/user/profile/image', { fileKey: avatarUrl });
          }

          // 🔥 최신 정보 다시 조회
          const res = await api.get('/user/profile/info');
          const newUser = res?.data?.result;

          set({
            user: newUser,
            isLoggedIn: true,
          });

          return newUser;
        } catch (err) {
          console.error('[updateProfile error]', err);
          throw err;
        }
      },

      // ========= 로그아웃 =========
      logout: async () => {
        try {
          await api.post('/user/auth/logout');
        } catch (_) {}
        set({ isLoggedIn: false, user: null, csrfToken: null });
      },

      // ========= 앱 시작 시 인증 체크 =========
      bootstrapAuth: async () => {
        if (get().authChecked) return;

        try {
          const res = await api.get(SESSION_PING_PATH, {
            params: { page: 1, size: 1 },
          });

          const maybeUser =
            res?.data?.result?.user ||
            res?.data?.user ||
            get().user;

          set({
            isLoggedIn: true,
            user: maybeUser,
            authChecked: true,
          });
        } catch (e) {
          set({
            isLoggedIn: false,
            user: null,
            csrfToken: null,
            authChecked: true,
          });
        }
      },
    }),
    {
      name: 'cs-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        user: s.user,
        csrfToken: s.csrfToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);

export default useUserStore;
