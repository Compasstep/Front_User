// src/store/userStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/client';

const SESSION_PING_PATH = '/user/mypage/posts/me';

/* ----------------------------------------------------
   S3 presigned download URL 생성 함수
---------------------------------------------------- */
async function getDownloadUrl(fileKey) {
  if (!fileKey) return '';

  try {
    const res = await api.post('/user/files/download', {
      fileKey,
      originalFileName: fileKey,
    });

    return res?.data?.result?.presignedUrl ?? '';
  } catch (e) {
    console.error('[getDownloadUrl error]', e);
    return '';
  }
}

/* ----------------------------------------------------
   user 객체 표준화 + fileKey → presigned URL 변환
---------------------------------------------------- */
async function normalizeUserAsync(nextUser, prevUser = {}) {
    if (!nextUser && !prevUser) return null;

    const merged = { ...prevUser, ...nextUser };

    // nickname 조정
    const nickname = merged.nickname || merged.name;
    if (nickname) {
        merged.nickname = nickname;
        merged.name = nickname;
    }

    // DB에서 받은 key 우선
    const fileKey =
        merged.profileImageKey ||
        merged.profileImageUrl ||
        merged.avatarUrl ||
        "";

    if (fileKey) {
        const pureKey = fileKey.includes("amazonaws.com")
            ? extractKeyFromPresigned(fileKey)
            : fileKey;

        merged.profileImageKey = pureKey;  // 서버용 key ⭐
        merged.profileImageUrl = await getDownloadUrl(pureKey); // FE보기용 presigned
        merged.avatarUrl = merged.profileImageUrl;
    } else {
        const defaultKey = "image/baseImageLocation.png";
        merged.profileImageKey = defaultKey;
        merged.profileImageUrl = await getDownloadUrl(defaultKey);
        merged.avatarUrl = merged.profileImageUrl;
    }

    return merged;
}

/* ----------------------------------------------------
   ZUSTAND STORE
---------------------------------------------------- */
const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      csrfToken: null,

      hydrated: false,
      authChecked: false,

      /* ========== NAV ========== */
      isNavOpen: false,
      openNav: () => set({ isNavOpen: true }),
      closeNav: () => set({ isNavOpen: false }),
      toggleNav: () => set((s) => ({ isNavOpen: !s.isNavOpen })),

      /* ----------------------------------------------------
         로그인 상태 반영
         (normalizeUserAsync 사용하도록 변경)
      ---------------------------------------------------- */
      setLoginState: async ({
        isLoggedIn = true,
        user = null,
        csrfToken = null,
      }) => {
        // 🔥 추가: 쿠키 세팅을 기다리게 함 (0ms도 충분하지만 안전하게 10ms)
        await new Promise(resolve => setTimeout(resolve, 10));
        const newUser = await normalizeUserAsync(user, get().user);

        set({
          isLoggedIn,
          user: newUser,
          csrfToken: csrfToken ?? get().csrfToken,
        });
      },

      /* ----------------------------------------------------
         프로필 업데이트 (닉네임 + 프로필 이미지(fileKey))
      ---------------------------------------------------- */
      updateProfile: async ({ nickname, avatarUrl }) => {
        try {
          if (nickname) {
            await api.patch('/user/profile/nickname', { nickname });
          }

          if (avatarUrl) {
            await api.patch('/user/profile/image', { fileKey: avatarUrl });
          }

          const res = await api.get('/user/profile/info');
          const newUserRaw = res?.data?.result;

          const newUser = await normalizeUserAsync(
            newUserRaw,
            get().user
          );

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

      /* ----------------------------------------------------
         로그아웃
      ---------------------------------------------------- */
      logout: async () => {
        try {
          await api.post('/user/auth/logout');
        } catch (_) {}

        set({
          isLoggedIn: false,
          user: null,
          csrfToken: null,
        });
      },

      /* ----------------------------------------------------
         앱 시작 시 로그인 상태 체크
      ---------------------------------------------------- */
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

          const newUser = await normalizeUserAsync(
            maybeUser,
            get().user
          );

          set({
            isLoggedIn: !!maybeUser,
            user: newUser,
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
      name: "cs-auth",
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
