import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ContentCardProps } from "../../types";

const ContentCard = ({
  title,
  children,
  className = "",
  titleRightElement = null,
}: ContentCardProps) => (
  <Card className={`mb-4 ${className}`}>
    {title && (
      <CardHeader className="flex flex-row items-center justify-between border-b p-4 md:p-4">
        <CardTitle className="!mt-0 text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        {titleRightElement}
      </CardHeader>
    )}
    <CardContent className={`${title ? "p-4 pt-4 md:p-5" : "p-4 md:p-5"}`}>
      {children}
    </CardContent>
  </Card>
);

export default ContentCard;
