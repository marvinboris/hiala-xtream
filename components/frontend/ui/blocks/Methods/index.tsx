import { useState, useEffect, ComponentProps } from 'react'
import { RadioGroup } from '@headlessui/react'
import MethodType from '../../../../../app/types/method'

interface MethodsProps {
  methods: MethodType[]
}

export default function Methods({ methods }: MethodsProps) {
  const [selected, setSelected] = useState<MethodType | null>(null)

  useEffect(() => {
    if (methods) setSelected(methods[0])
  }, [methods])
  

  return (
    <div className="w-full">
      <div className="w-full">
        <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className="sr-only">Méthode de paiement</RadioGroup.Label>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {methods && methods.map((method) => (
              <RadioGroup.Option key={method.name} value={method} className={({ active, checked }) => `${active ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-300' : ''} ${checked ? 'bg-primary-600/90 text-white' : 'bg-secondary-50'} relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`}>
                {({ active, checked }) => <>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <RadioGroup.Label as="p" className={`font-medium  ${checked ? 'text-white' : 'text-secondary-900'}`}>
                          {method.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description as="span" className={`inline ${checked ? 'text-primary-100' : 'text-secondary-500'}`}>
                          <span>{method.description}</span>
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked && <div className="shrink-0 text-white">
                      <CheckIcon className="h-6 w-6" />
                    </div>}
                  </div>
                </>}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
