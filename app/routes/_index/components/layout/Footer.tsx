import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="mt-12 bg-slate-800 py-10 text-slate-300">
    <div className="container mx-auto text-center text-sm">
      <p>
        &copy; {new Date().getFullYear()} 서비스 이름. AI 기반 수출입 전문
        컨설팅 플랫폼.
      </p>
      <p className="mt-2">
        <div className="flex items-center justify-center gap-x-2">
          <Button
            variant="link"
            asChild
            className="h-auto p-0 text-slate-300 hover:text-white hover:underline"
          >
            <a href="#">이용약관</a>
          </Button>
          |
          <Button
            variant="link"
            asChild
            className="mx-2 h-auto p-0 text-slate-300 hover:text-white hover:underline"
          >
            <a href="#">개인정보처리방침</a>
          </Button>
          |
          <Button
            variant="link"
            asChild
            className="h-auto p-0 text-slate-300 hover:text-white hover:underline"
          >
            <a href="#">고객센터</a>
          </Button>
        </div>
      </p>
    </div>
  </footer>
);

export default Footer;
