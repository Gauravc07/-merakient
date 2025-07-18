"use client"

import { useActionState } from "react"
import { login } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="flex items-center justify-center min-h-[calc(100dvh-120px)] py-12">
      <Card className="w-full max-w-md bg-card-overlay shadow-silver border border-black-charcoal">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-platinum-gradient">Login to Bidding</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the live bidding section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="user1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="password1" required />
            </div>
            {state?.error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{state.error}</div>}
            <Button type="submit" className="w-full bg-orange text-primary-foreground hover:bg-orange-dark">
              Login
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            <p>Demo credentials: user1 / password1</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
