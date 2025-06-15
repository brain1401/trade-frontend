import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// HS Code 분석 Form 스키마
const hsCodeAnalysisSchema = z.object({
  productDescription: z
    .string()
    .min(10, "제품 설명은 최소 10자 이상 입력해주세요")
    .max(500, "제품 설명은 500자를 초과할 수 없습니다")
    .refine(
      (desc) => desc.trim().length >= 10,
      "제품 설명에 의미 있는 내용을 입력해주세요",
    ),

  productImage: z
    .string()
    .url("올바른 이미지 URL을 입력해주세요")
    .optional()
    .or(z.literal("")),

  intendedUse: z.enum(["import", "export", "classification"]).optional(),

  targetCountry: z
    .string()
    .min(2, "국가 코드는 2자 이상이어야 합니다")
    .max(3, "국가 코드는 3자를 초과할 수 없습니다")
    .optional(),

  urgency: z.enum(["low", "normal", "high"]),
});

type HsCodeAnalysisInput = z.infer<typeof hsCodeAnalysisSchema>;

type AnalysisFormProps = {
  onSubmit: (data: HsCodeAnalysisInput) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<HsCodeAnalysisInput>;
};

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const form = useForm<HsCodeAnalysisInput>({
    resolver: zodResolver(hsCodeAnalysisSchema),
    defaultValues: {
      productDescription: initialData?.productDescription || "",
      productImage: initialData?.productImage || "",
      intendedUse: initialData?.intendedUse,
      targetCountry: initialData?.targetCountry || "",
      urgency: initialData?.urgency ?? "normal",
    },
  });

  // Watch form values for dynamic behavior
  const urgency = form.watch("urgency");
  const productDescription = form.watch("productDescription");
  const intendedUse = form.watch("intendedUse");

  // Auto-save draft as user types (debounced)
  useEffect(() => {
    const subscription = form.watch((data) => {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("analysis-draft", JSON.stringify(data));
      }, 1000);
      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("analysis-draft");
    if (draft && !initialData) {
      try {
        const parsedDraft = JSON.parse(draft);
        form.reset(parsedDraft);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [form, initialData]);

  const handleSubmit = async (data: HsCodeAnalysisInput) => {
    try {
      await onSubmit(data);
      // Clear draft after successful submission
      localStorage.removeItem("analysis-draft");
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  // Character count for description field
  const descriptionLength = productDescription?.length || 0;
  const maxDescriptionLength = 500;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Product Description Field */}
        <FormField
          control={form.control}
          name="productDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                제품 설명 *
              </FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Textarea
                    {...field}
                    placeholder="제품을 자세히 설명해주세요. 재료, 용도, 제조 방법, 기타 관련 특성을 포함해주세요..."
                    className="min-h-[120px] resize-y"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      정확한 분석을 위해 최대한 구체적으로 작성해주세요
                    </span>
                    <span
                      className={
                        descriptionLength > maxDescriptionLength
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {descriptionLength}/{maxDescriptionLength}
                    </span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                제품 설명이 상세할수록 HS Code 분류의 정확도가 높아집니다. 재료,
                제조 공정, 사용 목적 등을 포함해주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Image Field */}
        <FormField
          control={form.control}
          name="productImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제품 이미지 (선택사항)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://example.com/product-image.jpg"
                    disabled={isLoading}
                  />
                  {field.value && (
                    <div className="rounded-lg border p-4">
                      <img
                        src={field.value}
                        alt="제품 미리보기"
                        className="mx-auto h-auto max-h-48 max-w-full rounded"
                        onError={() => {
                          form.setError("productImage", {
                            message: "이미지를 불러올 수 없습니다",
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                제품 이미지는 복잡한 제품의 분류 정확도를 높이는 데 도움이
                됩니다.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Urgency and Context Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>분석 우선순위</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">낮은 우선순위</SelectItem>
                    <SelectItem value="normal">일반 우선순위</SelectItem>
                    <SelectItem value="high">높은 우선순위</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {urgency === "high" &&
                    "높은 우선순위 요청은 추가 검증 단계를 거칠 수 있습니다."}
                  {urgency === "normal" && "표준 처리 시간이 적용됩니다."}
                  {urgency === "low" && "리소스가 사용 가능할 때 처리됩니다."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intendedUse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사용 목적</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="사용 목적 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="import">한국으로 수입</SelectItem>
                    <SelectItem value="export">한국에서 수출</SelectItem>
                    <SelectItem value="classification">분류만 확인</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  이 정보는 관련 규정과 요구사항 확인에 도움이 됩니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Target Country Field - Conditional */}
        {intendedUse && intendedUse !== "classification" && (
          <FormField
            control={form.control}
            name="targetCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {intendedUse === "import" ? "원산지 국가" : "목적지 국가"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="예: US, CN, JP (ISO 국가코드)"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  ISO 국가코드를 사용하면 특정 무역 규정과 요구사항을 확인할 수
                  있습니다.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Submit Button */}
        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 시작 중...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                HS Code 분석 시작
              </>
            )}
          </Button>

          {/* Form State Info */}
          <div className="text-center text-sm text-muted-foreground">
            {form.formState.isDirty && <span>임시저장됨</span>}
          </div>
        </div>
      </form>
    </Form>
  );
};
