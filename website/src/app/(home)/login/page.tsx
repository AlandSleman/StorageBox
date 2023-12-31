import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { LoginForm } from "./LoginForm"

export default function Page() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value
  if(token)redirect("/dashboard")
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="">
        <LoginForm />
      </div>
    </section>
  )
}
