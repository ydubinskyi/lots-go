import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Locale } from "@lots-go/i18n";
import type {
  AttachAttributeInput,
  CreateAttributeInput,
  CreateCategoryInput,
} from "@lots-go/api-client";

import { apiClient } from "@/lib/api";

export function useCreateCategory(locale: Locale) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => apiClient.createCategory(input, { locale }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories", "tree"] });
      toast.success("Category created");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create category");
    },
  });
}

export function useCreateAttribute(locale: Locale) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAttributeInput) => apiClient.createAttribute(input, { locale }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["attributes", "list"] });
      toast.success("Attribute created");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create attribute");
    },
  });
}

export function useAttachAttribute(categoryId: string, locale: Locale) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      attributeId,
      input,
    }: {
      attributeId: string;
      input: AttachAttributeInput;
    }) => apiClient.attachAttribute(categoryId, attributeId, input, { locale }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories", categoryId, "attributes"] });
      toast.success("Attribute attached");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to attach attribute");
    },
  });
}

export function useDetachAttribute(categoryId: string, locale: Locale) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attributeId: string) =>
      apiClient.detachAttribute(categoryId, attributeId, { locale }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["categories", categoryId, "attributes"] });
      toast.success("Attribute detached");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to detach attribute");
    },
  });
}
