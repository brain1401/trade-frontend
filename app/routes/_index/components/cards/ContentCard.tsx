import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ContentCardProps } from "@/types";

// 기본 클래스 상수화
const CARD_BASE_CLASSES = "mb-4";
const HEADER_CLASSES =
  "flex flex-row items-center justify-between border-b p-4 md:p-4";
const TITLE_CLASSES = "!mt-0 text-lg font-semibold text-gray-800";
const CONTENT_BASE_CLASSES = "p-4 md:p-5";

const ContentCard = ({
  title,
  children,
  className = "",
  titleRightElement = null,
}: ContentCardProps) => (
  <Card className={cn(CARD_BASE_CLASSES, className)}>
    {title && (
      <CardHeader className={HEADER_CLASSES}>
        <CardTitle className={TITLE_CLASSES}>{title}</CardTitle>
        {titleRightElement}
      </CardHeader>
    )}
    <CardContent className={cn(CONTENT_BASE_CLASSES, title && "pt-4")}>
      {children}
    </CardContent>
  </Card>
);

export default ContentCard;
