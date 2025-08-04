"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { imageToGoogleSheetWorkflow } from "@/actions/n8n"
import { toast } from "sonner"
import { useState } from "react"
import { waitFor } from "@/lib/waitFor"
import { Separator } from "@radix-ui/react-select"
import LoadingButton from "./LoadingButton"
import { ImageUploader } from "./ImageUpload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card } from "./ui/card"

const formSchema = z.object({
  image: z.instanceof(File).refine((file) => file.size > 0, {
    message: "Image file is required",
  }),
  currency: z.string().min(3).max(10)
})

interface Props {
    type: string;
}

const currencies = [
  { id: "USD", name: "US Dollar" },
  { id: "EURO", name: "Euro" },
]
export default function OCRForm({ type }: Props) {

  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      currency: "USD"
    },

  })
  const isLoading = form.formState.isSubmitting


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
     console.log("Form values:", values);
      setLoading(true);
      toast("The workflow has started", {
          description: "Please wait for a minute for the sheet to be updated",
        })
      await imageToGoogleSheetWorkflow(type, values.image, values.currency);


      // toast("The workflow has completed", {
      //     description: "Please check your Google Sheet for the results",
      //   })
      // await waitFor(60000);
      setLoading(false);
    };


  return (
     <Card className='h-full p-4 space-y-2 max-w-3xl mx-auto'>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>
                <div className='space-y-2 w-full col-span-2'>
                    <div>
                        <h3 className='text-2xl font-bold'>
                            Bloomberg Terminal Image to Google Sheet with OCR
                        </h3>
                        <p className='text-description text-sm font-light text-muted-foreground'>
                            This form allows you to upload an image from the Bloomberg Terminal and extract data from it using OCR and upload it to a Google Sheet.
                        </p>
                    </div>
                    <Separator className='bg-primary/10' />
                </div>
                <FormField
                    name='currency'
                    control={form.control}
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Currency</FormLabel>
                            <Select 
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue=''
                            >
                                <FormControl>
                                    <SelectTrigger className='bg-background min-w-sm'>
                                        <SelectValue 
                                        defaultValue={field.value} 
                                        placeholder="Select a Currency"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.id} value={currency.id}>
                                                {currency.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Upload Image</FormLabel>
                            <FormControl>
                                <ImageUploader value={field.value } onChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className='w-full flex justify-center'>
                  <LoadingButton
                      variant="primary"
                      pending={loading}
                    >
                      Convert
                  </LoadingButton>
                </div>
            </form>
        </Form>
    </Card>
  )
}