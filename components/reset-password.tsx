"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    router.push("/login");
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
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input id="new-password" placeholder="New Password" type="password" required className="bg-white text-black"/>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="bg-[#3DADFF] text-white">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" placeholder="Confirm Password" required className="bg-white text-black mb-10"/>

                <Button
                  type="submit"
                  className="w-full mt-4 bg-white text-black hover:bg-gray-200"
                >
                  Change Password
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
