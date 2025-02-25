'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { WeekPicker } from '~/components/week-picker'
import { TimesheetTable } from '~/components/timesheet-table'
import { useToast } from '~/hooks/use-toast'
import { startOfWeek, format, addDays, endOfWeek } from 'date-fns'
import { CalendarIcon, ClockIcon, CheckIcon, AlertCircleIcon } from 'lucide-react'

export default function TimesheetPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const router = useRouter()
  const { toast } = useToast()

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  
  // Format dates for display
  const formattedDateRange = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`

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
  
  // Calculate total hours for the week
  const totalHours = timesheet?.entries.reduce((acc, entry) => acc + entry.hours, 0) || 0

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Weekly Timesheet</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {formattedDateRange}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <WeekPicker
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-xl font-semibold">
                  {timesheet?.status ? 'Submitted' : 'Draft'}
                </p>
              </div>
              <div className={`p-2 rounded-full ${
                timesheet?.status ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {timesheet?.status ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <AlertCircleIcon className="h-5 w-5" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hours</p>
                <p className="text-xl font-semibold">{totalHours} hours</p>
              </div>
              <div className="p-2 rounded-full bg-indigo-100 text-indigo-800">
                <ClockIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Entries</p>
                <p className="text-xl font-semibold">{timesheet?.entries.length || 0}</p>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Timesheet Section */}
      <Card className="mb-6">
        <CardHeader className="pb-0">
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>Record your daily work activities</CardDescription>
        </CardHeader>
        <CardContent>
          <TimesheetTable
            timesheet={timesheet}
            workTypes={workTypes ?? []}
            isLoading={isLoading}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </CardContent>
        
        {timesheet && !timesheet.status && (
          <CardFooter className="border-t pt-6 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={timesheet.entries.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit for Approval
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {timesheet && timesheet.status && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center text-amber-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>This timesheet has been submitted for approval and cannot be edited.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
