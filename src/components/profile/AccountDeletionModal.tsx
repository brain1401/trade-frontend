import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usersApi } from "@/lib/api/users";
import { useAuth } from "@/stores/authStore";
import { ApiError } from "@/lib/api";

type AccountDeletionModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const DELETION_CONFIRM_TEXT = "계정 삭제";

export function AccountDeletionModal({
  isOpen,
  onOpenChange,
}: AccountDeletionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { logout } = useAuth();

  const isConfirmationTextMatching = confirmationText === DELETION_CONFIRM_TEXT;

  const handleClose = () => {
    onOpenChange(false);
    setConfirmationText("");
  };

  const handleDeleteAccount = async () => {
    if (!isConfirmationTextMatching) {
      toast.error(`"${DELETION_CONFIRM_TEXT}"를 정확히 입력해주세요.`);
      return;
    }
    setIsLoading(true);
    try {
      await usersApi.leaveAccount();
      toast.success("계정이 성공적으로 삭제되었습니다. 로그아웃합니다.");
      await logout();
      handleClose();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "계정 삭제 중 오류가 발생했습니다.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>계정 삭제</DialogTitle>
          <DialogDescription>
            계정을 삭제하면 모든 데이터가 영구적으로 사라집니다. 이 작업은
            되돌릴 수 없습니다. 계속하려면 아래에 "{DELETION_CONFIRM_TEXT}"를
            입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="confirmation">확인 문구 입력</Label>
          <Input
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={DELETION_CONFIRM_TEXT}
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!isConfirmationTextMatching || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            계정 삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
