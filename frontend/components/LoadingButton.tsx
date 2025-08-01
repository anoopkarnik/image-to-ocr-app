import React from 'react'
import { Button } from './ui/button'
import { Loader2Icon } from 'lucide-react'


const LoadingButton = ({variant,pending, children, onClick}:{
  variant:any, pending:boolean, children: React.ReactNode, onClick?: any}) => {
  return (
    <Button onClick={onClick} variant={variant} disabled={pending} 
    className='w-full border-[1px] border-white/50 cursor-pointer hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2'>
      {pending? (
        <div className='flex items-center justify-center'>
          <Loader2Icon className='size-4 animate-spin text-white/50'/>
        
        </div>
      ):(children)}
    </Button>
  )
}

export default LoadingButton