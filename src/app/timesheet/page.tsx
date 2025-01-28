'use client'

import { useState } from 'react'
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays } from 'date-fns'
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from "~/trpc/react"

interface Entry {
  id: string
  date: Date
  type: string
  projectCode?: string
  hours: number
}

interface Timesheet {
  id: string
  status: string | null
  entries: Entry[]
}

const ENTRY_TYPE_COLORS = {
  Project: 'bg-blue-50 border-blue-200',
  Sick: 'bg-orange-50 border-orange-200',
  Vacation: 'bg-green-50 border-green-200',
  Holiday: 'bg-purple-50 border-purple-200',
} as const;

export default function TimesheetPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 })

  const { data: timesheet, refetch: refetchTimesheet } = api.timesheet.getTimesheet.useQuery({
    weekStart,
    weekEnd,
  })

  const { mutate: saveTimesheet } = api.timesheet.saveTimesheet.useMutation({
    onSuccess: () => {
      refetchTimesheet()
    },
  })

  const { mutate: addEntry } = api.timesheet.addEntry.useMutation({
    onSuccess: () => {
      refetchTimesheet()
    },
  })

  const handleSaveTimesheet = (submit: boolean = false) => {
    if (!timesheet) return

    saveTimesheet({
      id: timesheet.id,
      status: submit ? 'pending' : null,
      weekStart,
      weekEnd,
    })
  }

  const handleAddEntry = (date: Date, type: string, projectCode: string | undefined, hours: number) => {
    if (!timesheet) return

    addEntry({
      timesheetId: timesheet.id,
      date,
      type,
      projectCode,
      hours,
    })
  }

  const getDayEntries = (date: Date) => {
    return timesheet?.entries.filter(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) || []
  }

  const getDayTotal = (date: Date) => {
    return getDayEntries(date).reduce((sum, entry) => sum + entry.hours, 0)
  }

  const getWeekTotal = () => {
    return timesheet?.entries.reduce((sum, entry) => sum + entry.hours, 0) || 0
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(weekStart, 'MMM d, yyyy')} - {format(weekEnd, 'MMM d, yyyy')}
        </h2>
        <Button
          variant="outline"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = addDays(weekStart, index)
          const entries = getDayEntries(date)
          
          return (
            <Card key={index} className="flex flex-col">
              <CardHeader className="text-center">
                <div className="font-semibold">{format(date, 'EEEE')}</div>
                <div className="text-sm text-gray-500">{format(date, 'MMM d')}</div>
              </CardHeader>
              <CardContent className="flex-1">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className={`mb-2 p-2 rounded border ${ENTRY_TYPE_COLORS[entry.type as keyof typeof ENTRY_TYPE_COLORS]}`}
                  >
                    <div className="font-medium p-1">{entry.type}</div>
                    {entry.projectCode && (
                      <div title={entry.projectCode} className="text-sm text-center truncate text-gray-600 bg-blue-200 rounded p-1">
                        {entry.projectCode}
                      </div>
                    )}
                    <div className="text-sm p-1">{entry.hours} hours</div>
                  </div>
                ))}
                <EntryDialog date={date} onSave={handleAddEntry} />
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm">{getDayTotal(date)} hours</span>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Week Total: {getWeekTotal()} hours
        </div>
        <div className="space-x-4">
          <Button onClick={() => handleSaveTimesheet(false)}>Save</Button>
          <Button onClick={() => handleSaveTimesheet(true)} variant="default">
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

function EntryDialog({ date, onSave }: { date: Date; onSave: (date: Date, type: string, projectCode: string | undefined, hours: number) => void }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<string>('')
  const [projectCode, setProjectCode] = useState<string>('')
  const [hours, setHours] = useState<string>('')

  const handleSave = () => {
    if (type && hours) {
      onSave(date, type, type === 'Project' ? projectCode : undefined, parseFloat(hours))
      setOpen(false)
      setType('')
      setProjectCode('')
      setHours('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Time Entry for {format(date, 'MMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select entry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Vacation">Vacation</SelectItem>
              <SelectItem value="Sick">Sick</SelectItem>
              <SelectItem value="Holiday">Holiday</SelectItem>
            </SelectContent>
          </Select>

          {type === 'Project' && (
            <Input
              placeholder="Project Code"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
            />
          )}

          <Input
            type="number"
            placeholder="Hours"
            min="0"
            max="24"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <Button onClick={handleSave} className="w-full">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
