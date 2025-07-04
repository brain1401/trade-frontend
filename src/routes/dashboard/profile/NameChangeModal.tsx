import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { usersApi } from "@/lib/api/users";
import { useAuthStore } from "@/stores/authStore";
import { ApiError } from "@/lib/api";

const nameChangeSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .max(10, "이름은 10자를 초과할 수 없습니다."),
});

type NameChangeFormValues = z.infer<typeof nameChangeSchema>;

type NameChangeModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentName: string;
};

export function NameChangeModal({
  isOpen,
  onOpenChange,
  currentName,
}: NameChangeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NameChangeFormValues>({
    resolver: zodResolver(nameChangeSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    form.reset({ name: currentName });
  };

  const onSubmit = async (values: NameChangeFormValues) => {
    setIsLoading(true);
    try {
      const updatedUser = await usersApi.updateUserName(values);
      useAuthStore.getState().setUser(updatedUser); // Zustand 스토어 업데이트
      toast.success("이름이 성공적으로 변경되었습니다.");
      handleClose();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "이름 변경 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이름 변경</DialogTitle>
          <DialogDescription>새로운 이름을 입력해주세요.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>새 이름</FormLabel>
                  <FormControl>
                    <Input placeholder="새로운 이름을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                이름 변경
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
