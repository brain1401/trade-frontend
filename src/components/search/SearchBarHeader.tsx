import React, { useState } from "react";
import { Search, Mic, UploadCloud, Filter, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SearchBarHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const ICON_BUTTON_COLOR_CLASSES =
    "text-slate-400 hover:bg-slate-700 hover:text-slate-200";

  return (
    <div className="bg-slate-900">
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
          <div className="relative rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl">
            <div className="flex items-center">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="HS Code, 상품명, 규제 등 무엇이든 물어보세요..."
                className="w-full border-0 bg-transparent p-3 text-base text-slate-200 placeholder-slate-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className={cn(ICON_BUTTON_COLOR_CLASSES, `h-auto w-auto p-2`)}
              >
                <Mic size={20} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(ICON_BUTTON_COLOR_CLASSES, `h-auto w-auto p-2`)}
              >
                <UploadCloud size={20} />
              </Button>
              <Button className="ml-2 h-auto rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700">
                <Search size={20} />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-700 px-1 pt-2">
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    ICON_BUTTON_COLOR_CLASSES,
                    `h-auto w-auto rounded-md p-1.5`,
                  )}
                >
                  <Filter size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    ICON_BUTTON_COLOR_CLASSES,
                    `h-auto w-auto rounded-md p-1.5`,
                  )}
                >
                  <Paperclip size={18} />
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Shift+Enter로 줄바꿈하세요!
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default SearchBarHeader;
