import { useEffect, useState } from "react"
import { getData } from "@/api/getData"
import { renameItem } from "@/api/rename"
import { getAppState, updateAppState } from "@/state/state"
import { ErrorRes } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  name: z.string().min(1).max(255),
})

export function RenameDialog(p: {
  id: string
  name: string
  isFolder: boolean
}) {
  let state = getAppState()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: p.name },
  })
  const mutation = useMutation({
    mutationFn: renameItem,
    onError: (e: AxiosError<ErrorRes>) => {
      toast.error(e.response?.data.message)
      return e
    },
  })

  // let router = useRouter()
  // if (mutation.isSuccess) {
  // toast.success(mutation.data.token)
  // Cookies.set("token", mutation.data.token, { secure: true })
  // router.push("/dashboard")
  // }

  const [open, setOpen] = useState<boolean>()

  useEffect(() => {
    if (mutation.isSuccess) {
      updateAppState({ folders: mutation.data.folders })
      updateAppState({ files: mutation.data.files })
      toast.success("Success")
    }
  }, [mutation.isLoading])
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({ name: values.name, id: p.id, isFolder: p.isFolder })

    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="ghost"
          className="flex justify-start gap-4"
        >
          <Pencil />
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <DialogHeader>
              <DialogTitle>Rename {p.name}</DialogTitle>
            </DialogHeader>
            <div className="">
              <div className="">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="destructive">Cancel</Button>
              <Button variant="ghost" type="submit">
                Rename
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
