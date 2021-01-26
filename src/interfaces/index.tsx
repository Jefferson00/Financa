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