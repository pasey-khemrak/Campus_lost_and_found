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
import { Checkbox } from "radix-ui"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-[#0689E9]">Campus Lost and Found</h1>
      <p className="text-center  text-[#FFB600] mb-10">A place to look for your lost belongings</p>
    <Card className="bg-[#3DADFF] text-white" {...props}>
      <CardHeader>
        <CardTitle className="text-center font-bold">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Firstname</FieldLabel>
              <Input id="f-name" type="text" className="bg-white text-black" placeholder="Firstname" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="name">Lastname</FieldLabel>
              <Input id="l-name" type="text" className="bg-white text-black" placeholder="Lastname" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                className="bg-white text-black"
                placeholder="Email"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" placeholder="Password" type="password" required className="bg-white text-black"/>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="bg-[#3DADFF] text-white">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" placeholder="Confirm Password" required className="bg-white text-black"/>
              <div>
                <input type="checkbox" value="conditions" />  
                <label htmlFor="conditions" className="ml-2 text-sm">
                  I agree to the <a href="#" className="underline text-[#FFB600] hover:text-gray-200">Terms and Conditions</a>
                </label>            
              </div>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">Create Account</Button>
                <FieldDescription className="px-6 text-white text-center">
                  Already have an account? <a href="/login" className="text-[#FFB600] hover:text-gray-200">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
