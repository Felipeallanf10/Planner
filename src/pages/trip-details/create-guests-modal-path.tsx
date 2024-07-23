import { Mail, User, X } from 'lucide-react'
import { Button } from '../../components/button'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import { FormEvent, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CreateGuestsModalProps {
  CloseCreateGuestsModalOpenPath: () => void
  participantId: string
}

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function CreateGuestsModalPath({
  CloseCreateGuestsModalOpenPath,
  participantId
}: CreateGuestsModalProps) {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()

  const navigate = useNavigate()

  const reloadPage = () => {
    navigate(0)
  }

  async function postNameAndEmailValue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const name = data.get('name')?.toString()
    const email = data.get('email')?.toString()
    
    await api.patch(`/participants/${participantId}/confirm`,{
      id: participantId,
      name: name,
      email: email
    })

    reloadPage()
  }

  useEffect(() => {
    api.get(`trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  const displayedDate =
    trip &&
    trip.starts_at &&
    trip.ends_at &&
    new Date(trip.starts_at).getMonth() != new Date(trip.ends_at).getMonth()
      ? format(trip.starts_at, "d ' de ' LLL")
          .concat(' até ')
          .concat(format(trip.ends_at, "d ' de ' LLL", { locale: ptBR }))
      : trip &&
        trip.starts_at &&
        trip.ends_at &&
        new Date(trip.starts_at).getMonth() ===
          new Date(trip.ends_at).getMonth()
      ? format(trip.starts_at, 'd')
          .concat(' até ')
          .concat(format(trip.ends_at, "d ' de ' LLLL", { locale: ptBR }))
      : null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold ">
              Confirmar criação de viagem
            </h2>
            <button type="button" onClick={CloseCreateGuestsModalOpenPath}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className=" text-sm text-zinc-400">
            Você foi convidado(a) para participar de uma viagem para{' '}
            <span className="text-zinc-100 font-semibold">
              {trip?.destination}
            </span>{' '}
            nas datas de{' '}
            <span className="text-zinc-100 font-semibold">{displayedDate}</span>{' '}
            preencha seus dados abaixo:
          </p>
        </div>

        <form
          onSubmit={event => postNameAndEmailValue(event)}
          className="space-y-3"
        >
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <input
              name="name"
              placeholder="Seu nome completo"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={event => console.log(event.target.value)}
            />
          </div>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Mail className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail pessoal"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              onChange={event => console.log(event.target.value)}
            />
          </div>

          <Button type="submit" size="full">
            Confirmar minha presença
          </Button>
        </form>
      </div>
    </div>
  )
}
