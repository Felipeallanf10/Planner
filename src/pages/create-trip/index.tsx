import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'

export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndDates, setEventStartAndDates] = useState< DateRange | undefined >()

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }
  function closeGuestsInput() {
    setIsGuestsInputOpen(false)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }
  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([...emailsToInvite, email])

    event.currentTarget.reset()
  }

  function removeEmailToInvite(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(email => email != emailToRemove)
    setEmailsToInvite(newEmailList)
  }

  function openConfirmTripModalOpen() {
    setIsConfirmTripModalOpen(true)
  }
  function closeConfirmTripModalOpen() {
    setIsConfirmTripModalOpen(false)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!destination) {
      return
    }

    if (!eventStartAndDates?.from || !eventStartAndDates?.to) {
      return
    }

    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }

    const response = await api.post('/trips', {
      destination,
      emails_to_invite: emailsToInvite,
      ends_at: eventStartAndDates.to,
      owner_email: ownerEmail,
      owner_name: ownerName,
      starts_at: eventStartAndDates.from,
    })
    const { tripId } = response.data
    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            closeGuestsInput={closeGuestsInput}
            setDestination={setDestination}
            setEventStartAndDates={setEventStartAndDates}
            eventStartAndDates={eventStartAndDates}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openGuestsModal={openGuestsModal}
              openConfirmTripModalOpen={openConfirmTripModalOpen}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda{' '}
          <br /> com nossos{' '}
          <a href="#" className="text-zinc-300 underline">
            termos de uso{' '}
          </a>{' '}
          e{' '}
          <a href="#" className="text-zinc-300 underline">
            políticas de privacidade.
          </a>
        </p>
      </div>
      {isGuestModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestsModal={closeGuestsModal}
          removeEmailToInvite={removeEmailToInvite}
        />
      )}
      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModalOpen={closeConfirmTripModalOpen}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          destination={destination}
          eventStartAndDates={eventStartAndDates}
        />
      )}
    </div>
  )
}
