import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// Adjust these to match your real backend's auth contract.
const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_TOKEN_URL = "/auth/refresh-token";

const isBrowser = typeof window !== "undefined";

const getAccessToken = () => (isBrowser ? localStorage.getItem(ACCESS_TOKEN_KEY) : null);
const getRefreshToken = () => (isBrowser ? localStorage.getItem(REFRESH_TOKEN_KEY) : null);

const setTokens = (accessToken: string, refreshToken: string) => {
  if (!isBrowser) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const clearTokens = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// A bare client for the refresh call itself — it must never go through the
// interceptor below, or a failing refresh would recurse into itself.
const REFRESH_CLIENT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

AXIOS_INSTANCE.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryableRequestConfig = AxiosRequestConfig & { _retry?: boolean };

// While a refresh is in flight, every other request that hits a 401 queues
// here instead of firing its own refresh call; they're all replayed once
// the single refresh resolves (or rejected together if it fails).
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

const notifyUnauthorized = () => {
  clearTokens();
  if (isBrowser) {
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
  }
};

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const isAuthError = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url === REFRESH_TOKEN_URL;

    if (!isAuthError || !originalRequest || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      notifyUnauthorized();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return AXIOS_INSTANCE(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await REFRESH_CLIENT.post<{
        accessToken: string;
        refreshToken: string;
      }>(REFRESH_TOKEN_URL, { refreshToken });

      setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${data.accessToken}`,
      };
      return await AXIOS_INSTANCE(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      notifyUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const customInstance = <T,>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error orval attaches `cancel` to support query cancellation
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
