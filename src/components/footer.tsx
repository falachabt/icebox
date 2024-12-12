import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <div>
      <div className="bg-zinc-100 px-4 py-12 text-center lg:px-6">
        <div className="flex flex-col items-center justify-center space-x-2 space-y-6">
          <Logo  />
          <div className="flex justify-center space-x-4 text-xl text-zinc-500">
             {/* <Image src={"/icam.jpg"} alt={`icam logo`}
          width={24}
          height={24}
          className="h-8 w-20"
          priority />  */}
           
          </div>
          <span className="text-sm text-zinc-500">
            © {new Date().getFullYear()}{" "}
            <Link href="https://ezadrive.com">ezadrive.com</Link> All
            Rights Reserved
          </span>
        </div>
      </div>
    </div>
  )
}
