export type collections =  "jams" | "assets";

// TODO - Re-work to use zod content schemas
export interface post {
    data: {
        date: String
    }
}