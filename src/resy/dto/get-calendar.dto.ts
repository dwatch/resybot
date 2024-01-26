import { type CalendarDate } from 'src/models/json/calendar-date'

// Used by Resybot (CamelCase)
export class GetCalendarResponse {
  'lastCalendarDay': string
  'scheduled': CalendarDate[]
}

// Used by Resy (snake_case)
export class ResyGetCalendarRequest {
  'venue_id': string
  'num_seats': number
  'start_date': string
  'end_date': string
}

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
