import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Search,
  Mic,
  UploadCloud,
  Filter,
  Paperclip,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

const TEXT_COLOR_CLASSES = "text-slate-700";
const ICON_BUTTON_COLOR_CLASSES = `${TEXT_COLOR_CLASSES} hover:bg-slate-700 hover:text-slate-200`;

// 검색 폼 스키마 정의
const searchFormSchema = z.object({
  searchTerm: z
    .string()
    .min(1, "검색어를 입력해주세요")
    .max(500, "검색어는 500자 이하로 입력해주세요")
    .trim(),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

function SearchBarHeader() {
  // Alert Dialog 상태 관리
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // React Hook Form 설정 (실시간 validation 비활성화)
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchTerm: "",
    },
    mode: "onSubmit", // 제출 시에만 validation 실행
  });

  // 검색 제출 처리 함수
  const onSubmit = (values: SearchFormValues) => {
    console.log("검색 실행:", values);
    // TODO: 검색 로직 구현
    // 예: searchStore.performSearch(values.searchTerm)
    // 또는 navigate(`/search/results?q=${encodeURIComponent(values.searchTerm)}`)
  };

  // 검색 실행 함수 (버튼 클릭 및 Enter 키)
  const handleSearch = () => {
    const currentValue = form.getValues("searchTerm");

    // 수동으로 validation 체크
    const validation = searchFormSchema.safeParse({ searchTerm: currentValue });

    if (!validation.success) {
      // validation 실패 시 첫 번째 오류 메시지 표시
      const firstError = validation.error.errors[0]?.message;
      if (firstError) {
        setErrorMessage(firstError);
        setErrorDialogOpen(true);
      }
      return;
    }

    // validation 성공 시 검색 실행
    onSubmit(validation.data);
  };

  // 음성 입력 처리 함수
  const handleVoiceInput = () => {
    console.log("음성 입력 시작");
    // TODO: 음성 입력 로직 구현
  };

  // 파일 업로드 처리 함수
  const handleFileUpload = () => {
    console.log("파일 업로드 시작");
    // TODO: 파일 업로드 로직 구현
  };

  // 필터 버튼 처리 함수
  const handleFilter = () => {
    console.log("필터 옵션 열기");
    // TODO: 필터 모달 또는 드롭다운 로직 구현
  };

  // 첨부파일 버튼 처리 함수
  const handleAttachment = () => {
    console.log("첨부파일 추가");
    // TODO: 첨부파일 로직 구현
  };

  // 오류 Dialog 닫기 처리
  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  // Alert Dialog에서 Enter 키 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (errorDialogOpen && event.key === "Enter") {
        event.preventDefault();
        handleErrorDialogClose();
      }
    };

    if (errorDialogOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [errorDialogOpen]);

  return (
    <div className={cn("bg-slate-900", TEXT_COLOR_CLASSES)}>
      <header className="flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-slate-100 md:text-6xl">
              서비스 이름
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              AI 기반 HS Code 분석 및 무역 정보 플랫폼
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div className="relative rounded-xl border border-slate-700 bg-slate-200 p-2 shadow-2xl">
                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name="searchTerm"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="HS Code, 상품명, 규제, 화물추적, 무역통계 등 무엇이든 물어보세요..."
                            className="w-full resize-none border-0 bg-transparent p-3 !text-[1rem] shadow-none placeholder:text-inherit focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            rows={2}
                            onKeyDown={(e) => {
                              // Shift+Enter로 줄바꿈 허용
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSearch();
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={cn(
                      ICON_BUTTON_COLOR_CLASSES,
                      `h-auto w-auto p-2`,
                    )}
                  >
                    <Mic size={20} />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleFileUpload}
                    className={cn(
                      ICON_BUTTON_COLOR_CLASSES,
                      `h-auto w-auto p-2`,
                    )}
                  >
                    <UploadCloud size={20} />
                  </Button>

                  <Button
                    type="submit"
                    className="ml-2 h-auto rounded-lg bg-primary-600 p-3 text-white hover:bg-primary-700"
                  >
                    <Search size={20} />
                  </Button>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-slate-700 px-1 pt-2">
                  <div className="flex space-x-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleFilter}
                      className={cn(
                        ICON_BUTTON_COLOR_CLASSES,
                        `h-auto w-auto rounded-md p-1.5`,
                      )}
                    >
                      <Filter size={18} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleAttachment}
                      className={cn(
                        ICON_BUTTON_COLOR_CLASSES,
                        `h-auto w-auto rounded-md p-1.5`,
                      )}
                    >
                      <Paperclip size={18} />
                    </Button>
                  </div>
                  <p className="text-[.8rem]">Shift+Enter로 줄바꿈하세요!</p>
                </div>
              </div>
            </form>
          </Form>

          {/* Alert Dialog로 오류 메시지 표시 */}
          <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <AlertDialogTitle>검색 오류</AlertDialogTitle>
                </div>
                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleErrorDialogClose}>
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
    </div>
  );
}

export default SearchBarHeader;
