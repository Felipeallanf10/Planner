import { CheckCircle2, CircleDashed, UserCog } from 'lucide-react'
import { Button } from '../../components/button'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import { CreateGuestsModalPath } from './create-guests-modal-path'
import { CreateGuestsModalPost } from './create-guests-modal-post'

interface Participants {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const { tripId } = useParams()
  const [participants, SetParticipants] = useState<Participants[]>([])
  const [isCreateGuestsModalOpenPath, setIsCreateGuestsModalOpenPath] =
    useState(false)
  const [isCreateGuestsModalOpenPost, setIsCreateGuestsModalOpenPost] =
    useState(false)
  const [participantId, setParticipantId] = useState<string >('')

  useEffect(() => {
    api
      .get(`/trips/${tripId}/participants`)
      .then(response => SetParticipants(response.data.participants))
  }, [tripId])

  function OpenCreateGuestsModalOpenPath() {
    setIsCreateGuestsModalOpenPath(true)
  }
  function CloseCreateGuestsModalOpenPath() {
    setIsCreateGuestsModalOpenPath(false)
  }
  function OpenCreateGuestsModalOpenPost() {
    setIsCreateGuestsModalOpenPost(true)
  }
  function CloseCreateGuestsModalOpenPost() {
    setIsCreateGuestsModalOpenPost(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => {
                if (!participant.is_confirmed) {
                  OpenCreateGuestsModalOpenPath()
                  setParticipantId(participant.id)
                }
              }}
            >
              <div className="space-y-1.5">
                <span className="block font-medium text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                </span>
                <span className="block font-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="size-5 shink-0 text-green-400" />
              ) : (
                <CircleDashed className="size-5 text-zinc-400 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
      <Button
        variant="secondary"
        size="full"
        onClick={OpenCreateGuestsModalOpenPost}
      >
        <UserCog className="size-5 " />
        Gerenciar convidados
      </Button>

      {isCreateGuestsModalOpenPath && (
        <CreateGuestsModalPath
          CloseCreateGuestsModalOpenPath={CloseCreateGuestsModalOpenPath}
          participantId={participantId}
        />
      )}
      {isCreateGuestsModalOpenPost && (
        <CreateGuestsModalPost
          CloseCreateGuestsModalOpenPost={CloseCreateGuestsModalOpenPost}
        />
      )}
    </div>
  )
}
