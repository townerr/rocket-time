'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { WeekPicker } from '~/components/week-picker'
import { TimesheetTable } from '~/components/timesheet-table'
import { useToast } from '~/hooks/use-toast'
import { startOfWeek } from 'date-fns'

export default function TimesheetPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const router = useRouter()
  const { toast } = useToast()

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })

  const { data: timesheet, isLoading: timesheetLoading } = api.timesheet.getCurrentTimesheet.useQuery(
    { weekStart },
    {
      refetchOnWindowFocus: false,
    }
  )

  const { data: workTypes, isLoading: workTypesLoading } = api.timesheet.getWorkTypes.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const utils = api.useUtils();
  
  const { mutate: saveEntry } = api.timesheet.saveEntry.useMutation({
    onSuccess: () => {
      toast({
        title: 'Entry saved',
        description: 'Your timesheet entry has been saved successfully.',
      });
      // Invalidate the current timesheet query to refresh data
      utils.timesheet.getCurrentTimesheet.invalidate({ weekStart });
    },
  });

  const { mutate: deleteEntry } = api.timesheet.deleteEntry.useMutation({
    onSuccess: () => {
      toast({
        title: 'Entry deleted',
        description: 'Your timesheet entry has been deleted successfully.',
      });
      // Invalidate the current timesheet query to refresh data
      utils.timesheet.getCurrentTimesheet.invalidate({ weekStart });
    },
  });

  const { mutate: submitTimesheet } = api.timesheet.submitTimesheet.useMutation({
    onSuccess: () => {
      toast({
        title: 'Timesheet submitted',
        description: 'Your timesheet has been submitted for approval.',
      })
      router.push('/profile/history')
    },
  })

  const handleSave = (entry: {
    id?: string
    date: Date
    workTypeId: string
    hours: number
    projectCode?: string | null
  }) => {
    if (!timesheet) return

    saveEntry({
      id: entry.id,
      timesheetId: timesheet.id,
      date: entry.date,
      workTypeId: entry.workTypeId,
      hours: entry.hours,
      projectCode: entry.projectCode,
    })
  }

  const handleDelete = (entryId: string) => {
    deleteEntry({ id: entryId })
  }

  const handleSubmit = () => {
    if (!timesheet) return
    submitTimesheet({ id: timesheet.id })
  }

  const isLoading = timesheetLoading || workTypesLoading

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Timesheet</CardTitle>
          <WeekPicker
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </CardHeader>
        <CardContent>
          <TimesheetTable
            timesheet={timesheet}
            workTypes={workTypes ?? []}
            isLoading={isLoading}
            onSave={handleSave}
            onDelete={handleDelete}
          />
          
          {timesheet && !timesheet.status && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={timesheet.entries.length === 0}
              >
                Submit for Approval
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
