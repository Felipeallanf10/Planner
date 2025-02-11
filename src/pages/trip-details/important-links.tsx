import { Link2, Plus } from 'lucide-react'
import { Button } from '../../components/button'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/axios'
import { useEffect, useState } from 'react'

interface ImportantLinksProps {
  OpenCreateLinkModalOpen: () => void
}

interface Links {
  id: string
  title: string
  url: string
}

export function ImportantLinks({
  OpenCreateLinkModalOpen
}: ImportantLinksProps) {
  const { tripId } = useParams()
  const [links, setLinks] = useState<Links[]>()

  useEffect(() => {
    api
      .get(`trips/${tripId}/links`)
      .then(response => setLinks(response.data.links))
  }, [tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>
      <div className="space-y-5">
        {links?.length === 0 ? (
          <div className="space-y-1.5">
            <a
              href="#"
              className="block font-xs text-zinc-400 truncate hover:text-zinc-200 "
            >
              Nenhum link cadastrado. 
            </a>
          </div>
        ) : (
          links?.map(link => {
            return (
              <div
                key={link.id}
                className="flex items-center justify-between gap-4 "
                onClick={(event ) => {
                  event.preventDefault();
                  window.open(link.url)}}
              >
                <div className="space-y-1.5 ">
                  <span className="block font-medium text-zinc-100 ">
                    {link.title}
                  </span>
                  <a
                    href="#"
                    className="block font-xs text-zinc-400 truncate hover:text-zinc-200 "
                  >
                    {link.url}
                  </a>
                </div>
                <Link2 className="size-5 text-zinc-400 shrink-0 cursor-pointer hover:text-zinc-200 " />
              </div>
            )
          })
        )}
      </div>
      <Button variant="secondary" size="full" onClick={OpenCreateLinkModalOpen}>
        <Plus className="size-5 " />
        Cadastrar novo link
      </Button>
    </div>
  )
}
