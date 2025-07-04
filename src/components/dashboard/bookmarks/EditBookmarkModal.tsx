import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/lib/api/bookmark/types";
import type { UpdateBookmarkRequest } from "@/lib/api/bookmark/api";

const editBookmarkSchema = z.object({
  displayName: z.string().min(1, "북마크 이름은 필수입니다."),
  smsNotificationEnabled: z.boolean(),
  emailNotificationEnabled: z.boolean(),
});

type Props = {
  bookmark: Bookmark | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: UpdateBookmarkRequest) => void;
  isLoading: boolean;
};

export function EditBookmarkModal({
  bookmark,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: Props) {
  const form = useForm<UpdateBookmarkRequest>({
    resolver: zodResolver(editBookmarkSchema),
  });

  useEffect(() => {
    if (bookmark) {
      form.reset({
        displayName: bookmark.displayName,
        smsNotificationEnabled: bookmark.smsNotificationEnabled,
        emailNotificationEnabled: bookmark.emailNotificationEnabled,
      });
    }
  }, [bookmark, form]);

  if (!bookmark) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>북마크 수정</DialogTitle>
          <DialogDescription>
            북마크의 이름과 알림 설정을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>북마크 이름</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smsNotificationEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>SMS 알림</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailNotificationEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>이메일 알림</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
