import { createApiClient } from "@lots-go/api-client";

import { getCurrentLocale } from "@/i18n/locale";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const apiClient = createApiClient({ baseUrl, getLocale: () => getCurrentLocale() });
