"use client";

import { useState } from "react";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ForgetPassword({ ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset_password`,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password reset email sent! Please check your inbox.");
    }
  };

  return (
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

      <Card className="bg-[#3DADFF] text-white" {...props}>
        <CardHeader>
          <CardTitle className="text-center font-bold m-0">
            Forget Password
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
                  className="bg-white text-black"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  className="w-full mt-4 bg-white text-black hover:bg-gray-200"
                >
                  Send
                </Button>
              </Field>

              <a
                href="/login"
                className="text-center text-white underline block mt-4"
              >
                Try another way
              </a>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}