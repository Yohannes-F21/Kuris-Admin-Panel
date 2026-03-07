import toast, { ToastOptions } from "react-hot-toast";

type MessageSource = unknown;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getToastMessage = (
  source: MessageSource,
  fallback = "Something went wrong.",
): string => {
  if (!source) return fallback;

  if (typeof source === "string") {
    return source.trim() || fallback;
  }

  if (source instanceof Error) {
    return source.message || fallback;
  }

  if (!isRecord(source)) {
    return fallback;
  }

  const nestedCandidates: unknown[] = [
    source.message,
    source.error,
    isRecord(source.raw) ? source.raw.message : undefined,
    isRecord(source.raw) ? source.raw.error : undefined,
    isRecord(source.payload) ? source.payload.message : undefined,
    isRecord(source.payload) ? source.payload.error : undefined,
    isRecord(source.data) ? source.data.message : undefined,
    isRecord(source.data) ? source.data.error : undefined,
    isRecord(source.response) && isRecord(source.response.data)
      ? source.response.data.message
      : undefined,
  ];

  for (const candidate of nestedCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  return fallback;
};

export const notifySuccess = (
  source: MessageSource,
  fallback: string,
  options?: ToastOptions,
) => toast.success(getToastMessage(source, fallback), options);

export const notifyError = (
  source: MessageSource,
  fallback: string,
  options?: ToastOptions,
) => toast.error(getToastMessage(source, fallback), options);

export const notifyLoading = (message: string, options?: ToastOptions) =>
  toast.loading(message, options);

export default toast;
