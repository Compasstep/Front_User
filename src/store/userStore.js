// src/store/userStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../api/client';

const SESSION_PING_PATH = '/user/mypage/posts/me';

/* ----------------------------------------
   presigned URL → fileKey 추출 함수
----------------------------------------- */
function extractKeyFromPresigned(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, ""); // "/image/xxx.png" → "image/xxx.png"
  } catch (_) {
    return url;
  }
}

/* ----------------------------------------
   S3 다운로드 presigned URL 생성
----------------------------------------- */
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

/* ----------------------------------------
   핵심: user 표준화 로직
----------------------------------------- */
async function normalizeUserAsync(nextUser, prevUser = {}) {
  console.log("normalize IN:", nextUser);
  if (!nextUser) return prevUser;
  if (!prevUser) prevUser = {};

  const merged = { ...prevUser, ...nextUser };

  /* nick 처리 */
  const nickname = nextUser.nickname || nextUser.name;
  if (nickname) {
    merged.nickname = nickname;
    merged.name = nickname;
  }

  /* -------------------------------
     이미지 관련 필드는 무조건 nextUser 우선
  -------------------------------- */
  let key = null;

  // 서버에서 받은 최신 fileKey
  if (nextUser.profileImageKey) {
    key = nextUser.profileImageKey;

  } else if (nextUser.profileImageUrl && !nextUser.profileImageUrl.startsWith("http")) {
    key = nextUser.profileImageUrl;

  } else if (nextUser.avatarUrl && !nextUser.avatarUrl.startsWith("http")) {
    key = nextUser.avatarUrl;
  }

  // 만약 nextUser가 이미지 필드를 안 보냈다면 prevUser 유지
  if (!key) {
    key = prevUser.profileImageKey || "image/baseImageLocation.png";
  }

  // 최신 key 적용
  merged.profileImageKey = key;

  // 새 presigned URL 생성
  const presigned = await getDownloadUrl(key);
  merged.profileImageUrl = presigned;
  merged.avatarUrl = presigned;

  console.log("normalized OUT:", merged);
  return merged;
}

/* ----------------------------------------
   Zustand store
----------------------------------------- */
const useUserStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      csrfToken: null,

      hydrated: false,
      authChecked: false,

      /* NAV */
      isNavOpen: false,
      openNav: () => set({ isNavOpen: true }),
      closeNav: () => set({ isNavOpen: false }),
      toggleNav: () => set((s) => ({ isNavOpen: !s.isNavOpen })),

      /* 로그인 상태 반영 */
      setLoginState: async ({ isLoggedIn = true, user = null, csrfToken = null }) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        const newUser = await normalizeUserAsync(user, get().user);

        set({
          isLoggedIn,
          user: newUser,
          csrfToken: csrfToken ?? get().csrfToken,
        });
      },

      /* 프로필 업데이트 */
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

          const newUser = await normalizeUserAsync(newUserRaw, get().user);

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

      /* 로그아웃 */
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

      /* 앱 시작 시 로그인 체크 */
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

          const newUser = await normalizeUserAsync(maybeUser, get().user);

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
