"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div>
        <h1 className="text-2xl font-bold text-center text-[#0689E9]">Campus Lost and Found</h1>
        <p className="text-center  text-[#FFB600]">A place to look for your lost belongings</p>
      </div>
      <Card className="bg-[#3DADFF] text-white">
        <CardHeader>
          <CardTitle className="text-center font-bold">Welcome</CardTitle>
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="Username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  required
                  className="bg-white text-black"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  
                </div>
                <Input id="password" type="password" placeholder="Password" required className="bg-white text-black"/>
                <a
                    href="#"
                    className="ml-auto inline-block text-sm text-white underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
              </Field>

              <Field>
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                  Login
                </Button>


              <FieldDescription className="text-center">
                <span className="text-white">Don't have an account?{" "}
                  <a href="/signup" className="underline underline-offset-4 text-[#FFB600] hover:text-gray-200">
                    Sign up
                  </a>
                </span>
              </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
