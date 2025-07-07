import type { ServerResponseType } from "@/types/api-type";
import { NextResponse } from "next/server";

export default function serverResponse <T> (
    {success, 
    message = undefined, 
    error = undefined, 
    data = undefined, 
    status = 200}: 
    ServerResponseType<T>): NextResponse<ServerResponseType<T>> {
        const response: ServerResponseType<T> = {success, status};

        if (message) response.message = message
        if (error) response.error = error
        if (data) response.data = data

        return NextResponse.json(response, {status: response.status});
}