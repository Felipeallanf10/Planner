import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import { ptBR } from 'date-fns/locale'
import { format } from 'date-fns'
import { ActivitiesButton } from '../../components/activities-button'

interface Activity {
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

export function Activities() {
  const { tripId } = useParams()

  const [activities, SetActivities] = useState<Activity[]>([])

  useEffect(() => {
    api
      .get(`/trips/${tripId}/activities`)
      .then(response => SetActivities(response.data.activities))
  }, [tripId])

  return (
    <div className="space-y-8">
      {activities.map(category => {
        return (
          <div key={category.date} className="space-y-2.5">
            <div className="flex gap-2 items-baseline">
              <span className="text-xl text-zinc-300 font-semibold">
                Dia {format(category.date, 'd')}
              </span>
              <span className="text-xs text-zinc-500">
                {format(category.date, 'EEEE', { locale: ptBR })}
              </span>
            </div>
            {category.activities.length > 0 ? (
              <div className="space-y-2.5">
                {category.activities.map(activity => {
                  return (
                    <ActivitiesButton key={activity.id} activity={activity} />
                  )
                })}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">
                Nenhuma atividade nessa data.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
