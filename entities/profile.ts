export interface Profile {
    Name: string
    Birthday: Date
    BornPlace: string
    LivePlace: string
    Gender: string
    Occupation: string
    Salary: number
    Bio: string

    Expenses: Expense[]
    Hobbies: string[]
}

export interface Expense {
    Type: string
    Price: number
    Description: string
}
