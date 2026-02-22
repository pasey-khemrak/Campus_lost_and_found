"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/src/db/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function OTPCode({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Normally you would verify OTP via your backend
    alert("OTP verified! Redirecting...");
    router.push("/reset_password");
  };

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
          <CardTitle className="text-center font-bold m-0">Verification Code</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="verification-code">Verification Code</FieldLabel>
                <Input
                  id="verification-code"
                  type="text"
                  className="bg-white text-black"
                  placeholder="Verification Code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
                  Continue
                </Button>
              </Field>

              <a href="/login" className="text-center text-white underline">
                Try another way
              </a>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
