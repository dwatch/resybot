import { type CalendarDate } from 'src/models/json/calendar-date'

// Used by Resybot (CamelCase)
export class GetCalendarResponse {
  'lastCalendarDay': string
  'scheduled': CalendarDate[]
}

// Used by Resy (snake_case)
export class ResyGetCalendarResponse {
  'last_calendar_day': string
  'scheduled': ResyCalendarDate[]
}

class ResyCalendarDate {
  'date': string
  'inventory': {
    'reservation': string
    'event': string
    'walk_in': string
  }
}
