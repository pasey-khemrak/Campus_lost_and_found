"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      router.push("/"); 
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div>
        <h1
          className="text-2xl font-bold text-center text-[#0689E9]"
          style={{ fontFamily: "Times New Roman, Times, serif" }}
        >
          Campus Lost and Found
        </h1>

        <p
          className="text-center text-[#FFB600] mb-10"
          style={{ fontFamily: "Times New Roman, Times, serif" }}
        >
          A place to look for your lost belongings
        </p>
      </div>

      <Card className="bg-[#3DADFF] text-white">
        <CardHeader>
          <CardTitle className="text-center font-bold">
            Welcome
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="bg-white text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="bg-white text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <a
                  href="/forget_password"
                  className="ml-auto inline-block text-sm text-white underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  Login
                </Button>

                <FieldDescription className="text-center">
                  <span className="text-white">
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="underline underline-offset-4 text-[#FFB600] hover:text-gray-200"
                    >
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
  );
}