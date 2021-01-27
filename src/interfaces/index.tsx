  // interfaces
  export interface EntriesValues {
    id: number,
    title: string,
    day: number,
    dtStart: number,
    dtEnd: number,
    monthly: boolean,
    received: boolean,
    type: string,
  }

  export interface ValuesValues {
    description: string,
    amount: number,
    dtStart: number,
    dtEnd: number,
    entries_id: number,
    day: number,
    type: string,
    received: boolean,
  }

  export  interface Balance {
    month: number,
    year: number,
    amount: number,
  }

  export interface ValuesItem {
    id: number,
    description: string,
    amount: string,
    monthly: boolean,
    repeat: number,
}

export interface ValuesItemUpdate {
  id: number,
  description: string,
  amount: string,
  dtStart: number,
  dtEnd: number,
  entries_id: number,
}

export interface earningValues {
  title: string,
  day: number,
  dtStart: number,
  dtEnd: number,
  monthly: boolean,
  received: boolean,
}