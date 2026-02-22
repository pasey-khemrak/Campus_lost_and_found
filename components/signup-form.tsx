"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/app/src/db/lib/supabaseClient"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const formData = new FormData(e.currentTarget)

    const firstName = formData.get("f-name") as string
    const lastName = formData.get("l-name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (password !== confirmPassword) {
      const msg = "Passwords do not match."
      console.log("[Signup]", msg)
      setMessage(msg)
      setLoading(false)
      return
    }


    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: `${firstName} ${lastName}`,
          contact: phone || "",
        },
      },
    })

    if (authError) {
      console.log("[Signup] Auth error:", authError.message)
      setMessage(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      const msg = "Signup failed."
      console.log("[Signup]", msg)
      setMessage(msg)
      setLoading(false)
      return
    }

    if (!authData.session) {
      const msg = "Please check your email to confirm signup."
      console.log("[Signup]", msg)
      setMessage(msg)
      setLoading(false)
      return
    }

    const successMsg = "Account created successfully! Redirecting..."
    console.log("[Signup]", successMsg)
    setMessage(successMsg)

    setTimeout(() => {
      router.push("/profile")
    }, 1500)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-[#0689E9]" style={{ fontFamily: "Times New Roman, Times, serif" }}>
        Campus Lost and Found
      </h1>
      <p className="text-center text-[#FFB600] mb-10" style={{ fontFamily: "Times New Roman, Times, serif" }}>
        A place to look for your lost belongings
      </p>

      <Card className="bg-[#3DADFF] text-white" {...props}>
        <CardHeader>
          <CardTitle className="text-center font-bold">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>

              <Field>
                <FieldLabel>Firstname</FieldLabel>
                <Input name="f-name" type="text" className="bg-white text-black" placeholder="Firstname" required />
              </Field>

              <Field>
                <FieldLabel>Lastname</FieldLabel>
                <Input name="l-name" type="text" className="bg-white text-black" placeholder="Lastname" required />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input name="email" type="email" className="bg-white text-black" placeholder="Email" required />
              </Field>

              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input name="phone" type="tel" className="bg-white text-black" placeholder="Phone number" />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input name="password" type="password" placeholder="Password" required className="bg-white text-black"/>
              </Field>

              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input name="confirm-password" type="password" placeholder="Confirm Password" required className="bg-white text-black"/>

                <div className="mt-2">
                  <input type="checkbox" required />
                  <label className="ml-2 text-sm">
                    I agree to the{" "}
                    <a href="#" className="underline text-[#FFB600] hover:text-gray-200">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>

                {message && (
                  <p className="text-center mt-3 text-sm text-yellow-200">
                    {message}
                  </p>
                )}

                <FieldDescription className="px-6 text-white text-center mt-2">
                  Already have an account?{" "}
                  <a href="/login" className="text-[#FFB600] hover:text-gray-200">
                    Sign in
                  </a>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
