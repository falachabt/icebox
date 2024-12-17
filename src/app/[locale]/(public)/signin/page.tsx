import { FormLogin } from "@/components/form-login"

export default function Login() {
  return (
    <main className="px-4 mx-auto">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md py-32">
          <FormLogin />
        </div>
      </div>
    </main>
  )
}
