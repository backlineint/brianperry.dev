export type collections = "jams" | "posts" | "assets";

// TODO - Re-work to use zod content schemas
export interface post {
    data: {
        date: String
    }
}