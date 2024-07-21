import { format } from "date-fns";
import { CircleCheck, CircleDashed } from "lucide-react";
import { useState } from "react";

interface ActivityProps {
  activity: {
    id: string
    title: string
    occurs_at: string
  }
}

export function ActivitiesButton({ activity }: ActivityProps) {
  const [activityIsConcluded, setActivityIsConcluded] = useState<boolean>(false);
  const handleStateActivity = () =>{
    setActivityIsConcluded(!activityIsConcluded);
  }

  if(activityIsConcluded){
    return (
      <div onClick={handleStateActivity} className="space-y-2.5 opacity-50  cursor-pointer">
      <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
        <CircleCheck className="size-5 text-lime-300" />
        <span className="text-zinc-100">{activity.title}</span>
        <span className="text-zinc-400 text-sm ml-auto">
          {format(activity.occurs_at.replace('Z', ''), 'HH:mm')}h
        </span>
      </div>
    </div>
    )
  }else {
    return (
      <div onClick={handleStateActivity} className="space-y-2.5 cursor-pointer">
      <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
        <CircleDashed className="size-5 text-lime-300" />
        <span className="text-zinc-100">{activity.title}</span>
        <span className="text-zinc-400 text-sm ml-auto">
          {format(activity.occurs_at.replace('Z', ''), 'HH:mm')}h
        </span>
      </div>
    </div>
    )
  }
}
